/**
 * Tests for settings-manager: configureHooks, configureDefaults, configureStatusLine
 */
import { describe, test, expect } from "bun:test";
import {
  configureHooks,
  configureDefaults,
  configureStatusLine,
} from "../services/settings-manager";
import { HOOK_TYPES } from "../interfaces/hooks";

describe("settings-manager / configure", () => {
  describe("configureHooks", () => {
    test("configures all hook types", () => {
      const result = configureHooks({}, "/path/to/loader.ts");
      expect(result.hooks).toBeDefined();
      for (const hookType of HOOK_TYPES) {
        expect(result.hooks![hookType]).toBeDefined();
      }
    });

    test("sets correct command format", () => {
      const loaderPath = "/test/hooks-loader.ts";
      const result = configureHooks({}, loaderPath);
      const preToolUse = result.hooks!["PreToolUse"] as Array<{ hooks: Array<{ command: string }> }>;
      expect(preToolUse[0].hooks[0].command).toBe(`bun ${loaderPath} PreToolUse`);
    });

    test("replaces existing hooks configuration", () => {
      const settings = { hooks: { CustomHook: [{ old: "config" }] } };
      const result = configureHooks(settings, "/loader.ts");
      expect(result.hooks!["CustomHook"]).toBeUndefined();
      expect(result.hooks!["PreToolUse"]).toBeDefined();
    });
  });

  describe("configureDefaults", () => {
    test("sets language to english by default", () => {
      const result = configureDefaults({});
      expect(result.language).toBe("english");
    });

    test("uses provided language when specified", () => {
      const result = configureDefaults({}, "french");
      expect(result.language).toBe("french");
    });

    test("preserves existing language when none provided", () => {
      const result = configureDefaults({ language: "german" });
      expect(result.language).toBe("german");
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
      const result = configureStatusLine({}, "/path/to/statusline");
      expect(result.statusLine).toBeDefined();
      expect(result.statusLine!.type).toBe("command");
      expect(result.statusLine!.command).toContain("/path/to/statusline");
      expect(result.statusLine!.padding).toBe(0);
    });

    test("does not override existing statusLine", () => {
      const settings = { statusLine: { type: "custom", command: "custom-command", padding: 5 } };
      const result = configureStatusLine(settings, "/new/path");
      expect(result.statusLine!.type).toBe("custom");
      expect(result.statusLine!.command).toBe("custom-command");
      expect(result.statusLine!.padding).toBe(5);
    });
  });
});
