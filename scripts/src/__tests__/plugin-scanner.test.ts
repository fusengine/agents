/**
 * Tests for plugin-scanner service
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { extractHooks, scanPlugins } from "../services/plugin-scanner";

const TEST_DIR = "/tmp/fusengine-test-plugins";

describe("plugin-scanner", () => {
	beforeEach(() => {
		mkdirSync(TEST_DIR, { recursive: true });
	});

	afterEach(() => {
		rmSync(TEST_DIR, { recursive: true, force: true });
	});

	describe("scanPlugins", () => {
		test("returns empty array when no plugins exist", () => {
			const result = scanPlugins({ pluginsDir: TEST_DIR });
			expect(result).toEqual([]);
		});

		test("detects plugin with hooks.json", () => {
			const pluginDir = join(TEST_DIR, "my-plugin", "hooks");
			mkdirSync(pluginDir, { recursive: true });
			writeFileSync(
				join(pluginDir, "hooks.json"),
				JSON.stringify({ hooks: { PreToolUse: [] } }),
			);

			const result = scanPlugins({ pluginsDir: TEST_DIR });

			expect(result).toHaveLength(1);
			expect(result[0].name).toBe("my-plugin");
			expect(result[0].hasHooks).toBe(true);
			expect(result[0].config).toBeDefined();
		});

		test("marks plugin without hooks.json as hasHooks=false", () => {
			const pluginDir = join(TEST_DIR, "no-hooks-plugin");
			mkdirSync(pluginDir, { recursive: true });
			writeFileSync(join(pluginDir, "README.md"), "# Plugin");

			const result = scanPlugins({ pluginsDir: TEST_DIR });

			// Plugin is still detected, but hasHooks is false
			expect(result).toHaveLength(1);
			expect(result[0].hasHooks).toBe(false);
			expect(result[0].config).toBeUndefined();
		});

		test("scans multiple plugins", () => {
			// Plugin 1 with hooks
			const plugin1 = join(TEST_DIR, "plugin-a", "hooks");
			mkdirSync(plugin1, { recursive: true });
			writeFileSync(join(plugin1, "hooks.json"), JSON.stringify({ hooks: {} }));

			// Plugin 2 with hooks
			const plugin2 = join(TEST_DIR, "plugin-b", "hooks");
			mkdirSync(plugin2, { recursive: true });
			writeFileSync(join(plugin2, "hooks.json"), JSON.stringify({ hooks: {} }));

			const result = scanPlugins({ pluginsDir: TEST_DIR });

			expect(result).toHaveLength(2);
			expect(result.filter((p) => p.hasHooks)).toHaveLength(2);
		});

		test("handles invalid JSON gracefully", () => {
			const pluginDir = join(TEST_DIR, "bad-json", "hooks");
			mkdirSync(pluginDir, { recursive: true });
			writeFileSync(join(pluginDir, "hooks.json"), "{ invalid json }");

			const result = scanPlugins({ pluginsDir: TEST_DIR });

			expect(result).toHaveLength(1);
			expect(result[0].hasHooks).toBe(true);
			expect(result[0].config).toBeUndefined(); // Parsing failed
		});

		test("returns empty when pluginsDir does not exist", () => {
			const result = scanPlugins({ pluginsDir: "/nonexistent/path" });
			expect(result).toEqual([]);
		});
	});

	describe("extractHooks", () => {
		test("extracts hooks for matching hook type", () => {
			const plugins = [
				{
					name: "test-plugin",
					path: join(TEST_DIR, "test-plugin"),
					hasHooks: true,
					config: {
						hooks: {
							PreToolUse: [
								{
									matcher: "Write",
									hooks: [{ type: "command", command: "echo test" }],
								},
							],
						},
					},
				},
			];

			const result = extractHooks(plugins, "PreToolUse", "Write", "");

			expect(result).toHaveLength(1);
			expect(result[0].command).toContain("echo test");
			expect(result[0].pluginName).toBe("test-plugin");
		});

		test("returns empty array for non-matching hook type", () => {
			const plugins = [
				{
					name: "test-plugin",
					path: TEST_DIR,
					hasHooks: true,
					config: {
						hooks: {
							PreToolUse: [{ hooks: [{ type: "command", command: "echo" }] }],
						},
					},
				},
			];

			const result = extractHooks(plugins, "PostToolUse", "", "");

			expect(result).toEqual([]);
		});

		test("filters by tool name matcher", () => {
			const plugins = [
				{
					name: "test-plugin",
					path: TEST_DIR,
					hasHooks: true,
					config: {
						hooks: {
							PreToolUse: [
								{
									matcher: "Write|Edit",
									hooks: [{ type: "command", command: "echo write-edit" }],
								},
								{
									matcher: "Bash",
									hooks: [{ type: "command", command: "echo bash" }],
								},
							],
						},
					},
				},
			];

			const writeHooks = extractHooks(plugins, "PreToolUse", "Write", "");
			const editHooks = extractHooks(plugins, "PreToolUse", "Edit", "");
			const bashHooks = extractHooks(plugins, "PreToolUse", "Bash", "");
			const readHooks = extractHooks(plugins, "PreToolUse", "Read", "");

			expect(writeHooks).toHaveLength(1);
			expect(editHooks).toHaveLength(1);
			expect(bashHooks).toHaveLength(1);
			expect(readHooks).toHaveLength(0);
		});

		test("matches all when no matcher specified", () => {
			const plugins = [
				{
					name: "test-plugin",
					path: TEST_DIR,
					hasHooks: true,
					config: {
						hooks: {
							PreToolUse: [
								{
									// No matcher = match all
									hooks: [{ type: "command", command: "echo all" }],
								},
							],
						},
					},
				},
			];

			const anyHooks = extractHooks(plugins, "PreToolUse", "AnyTool", "");

			expect(anyHooks).toHaveLength(1);
		});

		test("replaces CLAUDE_PLUGIN_ROOT in commands", () => {
			const plugins = [
				{
					name: "test-plugin",
					path: "/path/to/plugin",
					hasHooks: true,
					config: {
						hooks: {
							PreToolUse: [
								{
									hooks: [
										{
											type: "command",
											// biome-ignore lint/suspicious/noTemplateCurlyInString: shell env var syntax
											command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/test.sh",
										},
									],
								},
							],
						},
					},
				},
			];

			const result = extractHooks(plugins, "PreToolUse", "", "");

			expect(result[0].command).toBe("bash /path/to/plugin/scripts/test.sh");
		});

		test("marks afplay commands as async", () => {
			const plugins = [
				{
					name: "test-plugin",
					path: TEST_DIR,
					hasHooks: true,
					config: {
						hooks: {
							Stop: [
								{
									hooks: [{ type: "command", command: "afplay /sound.wav" }],
								},
							],
						},
					},
				},
			];

			const result = extractHooks(plugins, "Stop", "", "");

			expect(result[0].isAsync).toBe(true);
		});

		test("skips plugins without config", () => {
			const plugins = [
				{
					name: "empty-plugin",
					path: TEST_DIR,
					hasHooks: false,
					// No config
				},
			];

			const result = extractHooks(plugins, "PreToolUse", "", "");

			expect(result).toEqual([]);
		});
	});
});
