/**
 * Anti-regression gate for the "harness exclusif" migration.
 *
 * Every `type: "command"` hook in every `plugins/<name>/hooks/hooks.json`
 * MUST delegate to the @fusengine/harness binary. No plugin may reintroduce
 * a raw command (afplay, a local script, …) — this test is the permanent
 * lock. Native `type: "prompt"` hooks are allowed and left untouched.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PLUGINS_DIR = join(__dirname, "../../../plugins");
const HARNESS_MARKER = "node_modules/@fusengine/harness/dist/cli/bin.mjs hook claude-code";

/** Dynamically lists every `plugins/<name>/hooks/hooks.json` — no hardcoded plugin names. */
function discoverHooksFiles(pluginsDir: string): string[] {
	return readdirSync(pluginsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => join(pluginsDir, entry.name, "hooks", "hooks.json"))
		.filter((path) => existsSync(path));
}

/** True when a command hook delegates to the harness binary (tolerates ` || true`, flags, scope). */
function isHarnessCommand(command: string): boolean {
	return command.startsWith("bun ") && command.includes(HARNESS_MARKER);
}

/** Plugin name extracted from a `.../plugins/<name>/hooks/hooks.json` path. */
function pluginNameOf(filePath: string): string {
	return filePath.split("/plugins/")[1]?.split("/")[0] ?? filePath;
}

const hooksFiles = discoverHooksFiles(PLUGINS_DIR);

describe("hooks-harness-exclusive (anti-regression gate)", () => {
	test("discovers at least one plugins/*/hooks/hooks.json", () => {
		expect(hooksFiles.length).toBeGreaterThan(0);
	});

	for (const filePath of hooksFiles) {
		const pluginName = pluginNameOf(filePath);

		describe(pluginName, () => {
			// Guarded parse: an invalid hooks.json must fail the dedicated test below,
			// not crash bun:test collection (a throw in a describe body drops later tests).
			let config: { hooks?: Record<string, unknown> } | undefined;
			let parseError: unknown;
			try {
				config = JSON.parse(readFileSync(filePath, "utf-8"));
			} catch (error) {
				parseError = error;
			}

			test("hooks.json is valid JSON", () => {
				if (parseError) throw parseError;
				expect(config).toBeDefined();
			});

			const events = config?.hooks ?? {};

			for (const [eventName, blocks] of Object.entries(events)) {
				for (const [blockIdx, block] of (blocks as Array<Record<string, unknown>>).entries()) {
					const hooks = (block.hooks as Array<Record<string, unknown>>) ?? [];

					for (const [hookIdx, hook] of hooks.entries()) {
						const label = `${eventName}[${blockIdx}].hooks[${hookIdx}]`;

						if (hook.type === "prompt") continue; // native LLM hook, allowed as-is

						test(`${label}: type is "command"`, () => {
							if (hook.type !== "command") {
								throw new Error(
									`${pluginName} / ${label}: unexpected hook type "${hook.type}" — only "command" and "prompt" are allowed`,
								);
							}
							expect(hook.type).toBe("command");
						});

						test(`${label}: command delegates to @fusengine/harness`, () => {
							const command = String(hook.command);
							if (!isHarnessCommand(command)) {
								throw new Error(
									`${pluginName} / ${label}: command is not harness-delegated: "${command}"`,
								);
							}
							if (!command.includes("${CLAUDE_PLUGIN_ROOT}")) {
								throw new Error(
									`${pluginName} / ${label}: harness command is missing \${CLAUDE_PLUGIN_ROOT}: "${command}"`,
								);
							}
							expect(isHarnessCommand(command)).toBe(true);
						});
					}
				}
			}
		});
	}
});
