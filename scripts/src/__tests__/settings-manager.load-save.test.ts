/**
 * Tests for settings-manager: loadSettings, saveSettings, backupSettings
 */
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { loadSettings, saveSettings, backupSettings } from "../services/settings-manager";

const TEST_DIR = "/tmp/fusengine-test-settings-io";
const TEST_SETTINGS = join(TEST_DIR, "settings.json");

describe("settings-manager / IO", () => {
  beforeEach(() => mkdirSync(TEST_DIR, { recursive: true }));
  afterEach(() => rmSync(TEST_DIR, { recursive: true, force: true }));

  describe("loadSettings", () => {
    test("returns empty object when file does not exist", async () => {
      expect(await loadSettings(join(TEST_DIR, "nonexistent.json"))).toEqual({});
    });

    test("loads existing settings file", async () => {
      writeFileSync(TEST_SETTINGS, JSON.stringify({ language: "french", custom: "value" }));
      const result = await loadSettings(TEST_SETTINGS);
      expect(result.language).toBe("french");
      expect(result.custom).toBe("value");
    });

    test("parses complex settings structure", async () => {
      writeFileSync(TEST_SETTINGS, JSON.stringify({
        hooks: { PreToolUse: [{ matcher: "Write" }] },
        statusLine: { type: "command", command: "test" },
      }));
      const result = await loadSettings(TEST_SETTINGS);
      expect(result.hooks).toBeDefined();
      expect(result.statusLine).toBeDefined();
    });
  });

  describe("saveSettings", () => {
    test("creates directory if not exists", async () => {
      const nestedPath = join(TEST_DIR, "nested/deep/settings.json");
      await saveSettings(nestedPath, { test: true });
      expect(existsSync(nestedPath)).toBe(true);
    });

    test("saves settings as formatted JSON with newlines", async () => {
      await saveSettings(TEST_SETTINGS, { language: "french", value: 42 });
      const content = readFileSync(TEST_SETTINGS, "utf8");
      expect(content).toContain('"language": "french"');
      expect(content).toContain("\n");
    });

    test("overwrites existing settings", async () => {
      writeFileSync(TEST_SETTINGS, JSON.stringify({ old: "value" }));
      await saveSettings(TEST_SETTINGS, { new: "value" });
      const content = readFileSync(TEST_SETTINGS, "utf8");
      expect(content).not.toContain("old");
      expect(content).toContain("new");
    });
  });

  describe("backupSettings", () => {
    test("does nothing if file does not exist", () => {
      backupSettings(join(TEST_DIR, "nonexistent.json"));
    });

    test("creates backup with timestamp prefix", () => {
      writeFileSync(TEST_SETTINGS, JSON.stringify({ test: true }));
      backupSettings(TEST_SETTINGS);
      const files = require("fs").readdirSync(TEST_DIR) as string[];
      expect(files.find((f) => f.startsWith("settings.json.backup."))).toBeDefined();
    });

    test("backup contains original content", () => {
      writeFileSync(TEST_SETTINGS, JSON.stringify({ important: "data", value: 123 }));
      backupSettings(TEST_SETTINGS);
      const files = require("fs").readdirSync(TEST_DIR) as string[];
      const backupFile = files.find((f) => f.startsWith("settings.json.backup."))!;
      const content = JSON.parse(readFileSync(join(TEST_DIR, backupFile), "utf8"));
      expect(content.important).toBe("data");
    });
  });
});
