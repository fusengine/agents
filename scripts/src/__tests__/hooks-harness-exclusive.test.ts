/**
 * Anti-regression gate for the "harness exclusif" migration.
 *
 * Every `type: "command"` hook in every `plugins/<name>/hooks/hooks.json`
 * must delegate to @fusengine/harness, resolved from the marketplace's own
 * shared install under plugins/marketplaces/fusengine-plugins/plugins/
 * node_modules (installDeps' node_modules — reused as-is, no separate
 * per-user $HOME/.claude/node_modules bootstrap anymore).
 * Native `type: "prompt"` hooks are allowed and left untouched.
 * Pure helpers live in ./hooks-harness-exclusive.helpers (kept separate to
 * respect the 100-line SOLID limit on this file).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
	discoverHooksFiles,
	isHarnessCommand,
	pluginNameOf,
} from "./hooks-harness-exclusive.helpers";

/** Absolute prefix every harness command must resolve through post-migration. */
const MARKETPLACE_HARNESS_PATH =
	"$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins/node_modules/@fusengine/harness";

const PLUGINS_DIR = join(__dirname, "../../../plugins");
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

						test(`${label}: command delegates to harness on the marketplace shared path`, () => {
							const command = String(hook.command);
							const harness = isHarnessCommand(command);

							// No more per-user bootstrap: every command must resolve the
							// harness binary straight from the marketplace's node_modules.
							if (!harness) {
								throw new Error(
									`${pluginName} / ${label}: command does not delegate to harness: "${command}"`,
								);
							}
							if (!command.includes(MARKETPLACE_HARNESS_PATH)) {
								throw new Error(
									`${pluginName} / ${label}: harness command not on marketplace shared path: "${command}"`,
								);
							}
							expect(harness).toBe(true);
						});
					}
				}
			}
		});
	}
});
