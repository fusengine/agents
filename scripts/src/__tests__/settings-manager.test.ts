/**
 * Tests for settings-manager service
 */
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "fs";
import { join } from "path";
import {
  loadSettings,
  saveSettings,
  backupSettings,
  configureHooks,
  configureDefaults,
  configureStatusLine,
} from "../services/settings-manager";
import { HOOK_TYPES } from "../interfaces/hooks";

const TEST_DIR = "/tmp/fusengine-test-settings";
const TEST_SETTINGS = join(TEST_DIR, "settings.json");

describe("settings-manager", () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  describe("loadSettings", () => {
    test("returns empty object when file does not exist", async () => {
      const result = await loadSettings(join(TEST_DIR, "nonexistent.json"));
      expect(result).toEqual({});
    });

    test("loads existing settings file", async () => {
      const settings = { language: "french", custom: "value" };
      writeFileSync(TEST_SETTINGS, JSON.stringify(settings));

      const result = await loadSettings(TEST_SETTINGS);

      expect(result.language).toBe("french");
      expect(result.custom).toBe("value");
    });

    test("parses complex settings structure", async () => {
      const settings = {
        hooks: { PreToolUse: [{ matcher: "Write" }] },
        statusLine: { type: "command", command: "test" },
      };
      writeFileSync(TEST_SETTINGS, JSON.stringify(settings));

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

    test("saves settings as formatted JSON", async () => {
      const settings = { language: "french", value: 42 };

      await saveSettings(TEST_SETTINGS, settings);

      const content = readFileSync(TEST_SETTINGS, "utf8");
      expect(content).toContain('"language": "french"');
      expect(content).toContain('"value": 42');
      // Should be formatted (contains newlines)
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
      // Should not throw
      backupSettings(join(TEST_DIR, "nonexistent.json"));
    });

    test("creates backup with timestamp", () => {
      writeFileSync(TEST_SETTINGS, JSON.stringify({ test: true }));

      backupSettings(TEST_SETTINGS);

      // Find backup file
      const files = require("fs").readdirSync(TEST_DIR);
      const backupFile = files.find((f: string) =>
        f.startsWith("settings.json.backup.")
      );

      expect(backupFile).toBeDefined();
    });

    test("backup contains original content", () => {
      const original = { important: "data", value: 123 };
      writeFileSync(TEST_SETTINGS, JSON.stringify(original));

      backupSettings(TEST_SETTINGS);

      const files = require("fs").readdirSync(TEST_DIR);
      const backupFile = files.find((f: string) =>
        f.startsWith("settings.json.backup.")
      );
      const backupContent = JSON.parse(
        readFileSync(join(TEST_DIR, backupFile), "utf8")
      );

      expect(backupContent.important).toBe("data");
      expect(backupContent.value).toBe(123);
    });
  });

  describe("configureHooks", () => {
    test("configures all hook types", () => {
      const settings = {};

      const result = configureHooks(settings, "/path/to/loader.ts");

      expect(result.hooks).toBeDefined();
      for (const hookType of HOOK_TYPES) {
        expect(result.hooks![hookType]).toBeDefined();
      }
    });

    test("sets correct command format", () => {
      const loaderPath = "/test/hooks-loader.ts";
      const settings = {};

      const result = configureHooks(settings, loaderPath);

      const preToolUse = result.hooks!["PreToolUse"] as any[];
      expect(preToolUse[0].hooks[0].command).toBe(
        `bun ${loaderPath} PreToolUse`
      );
    });

    test("replaces existing hooks configuration", () => {
      const settings = {
        hooks: { CustomHook: [{ old: "config" }] },
      };

      const result = configureHooks(settings, "/loader.ts");

      expect(result.hooks!["CustomHook"]).toBeUndefined();
      expect(result.hooks!["PreToolUse"]).toBeDefined();
    });
  });

  describe("configureDefaults", () => {
    test("sets language to french", () => {
      const result = configureDefaults({});
      expect(result.language).toBe("french");
    });

    test("sets empty attribution", () => {
      const result = configureDefaults({});

      expect(result.attribution).toEqual({ commit: "", pr: "" });
    });

    test("preserves existing settings", () => {
      const settings = { custom: "value", hooks: {} };

      const result = configureDefaults(settings);

      expect(result.custom).toBe("value");
      expect(result.hooks).toEqual({});
    });
  });

  describe("configureStatusLine", () => {
    test("adds statusLine if not present", () => {
      const settings = {};
      const statuslineDir = "/path/to/statusline";

      const result = configureStatusLine(settings, statuslineDir);

      expect(result.statusLine).toBeDefined();
      expect(result.statusLine!.type).toBe("command");
      expect(result.statusLine!.command).toContain(statuslineDir);
      expect(result.statusLine!.padding).toBe(0);
    });

    test("does not override existing statusLine", () => {
      const settings = {
        statusLine: {
          type: "custom",
          command: "custom-command",
          padding: 5,
        },
      };

      const result = configureStatusLine(settings, "/new/path");

      expect(result.statusLine!.type).toBe("custom");
      expect(result.statusLine!.command).toBe("custom-command");
      expect(result.statusLine!.padding).toBe(5);
    });
  });
});
