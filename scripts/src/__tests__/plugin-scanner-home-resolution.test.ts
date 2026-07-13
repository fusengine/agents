/**
 * Tests for the $HOME/${HOME} runtime resolution fallback in extractHooks.
 * Split out of plugin-scanner.test.ts (file-size limit) — mirrors the
 * existing hook-executor.test.ts / hook-executor-*.test.ts split convention.
 */
import { describe, expect, test } from "bun:test";
import { extractHooks } from "../services/plugin-scanner";

const TEST_DIR = "/tmp/fusengine-test-plugins-home";
const HOME = process.env.HOME || process.env.USERPROFILE || "";

describe("extractHooks — $HOME runtime resolution", () => {
	test("resolves literal $HOME in commands (re-checkout runtime fallback)", () => {
		const plugins = [
			{
				name: "test-plugin",
				path: TEST_DIR,
				hasHooks: true,
				config: {
					hooks: {
						PreToolUse: [
							{ hooks: [{ type: "command", command: "bun $HOME/.claude/bin.mjs" }] },
						],
					},
				},
			},
		];

		const result = extractHooks(plugins, "PreToolUse", "", "");

		expect(result[0].command).toBe(`bun ${HOME}/.claude/bin.mjs`);
		expect(result[0].command).not.toContain("$HOME");
	});

	test("resolves the ${HOME} brace form in commands", () => {
		const plugins = [
			{
				name: "test-plugin",
				path: TEST_DIR,
				hasHooks: true,
				config: {
					hooks: {
						PreToolUse: [
							{
								hooks: [
									// biome-ignore lint/suspicious/noTemplateCurlyInString: shell env var syntax
									{ type: "command", command: "bun ${HOME}/.claude/bin.mjs" },
								],
							},
						],
					},
				},
			},
		];

		const result = extractHooks(plugins, "PreToolUse", "", "");

		expect(result[0].command).toBe(`bun ${HOME}/.claude/bin.mjs`);
		expect(result[0].command).not.toContain("${HOME}");
	});
});
