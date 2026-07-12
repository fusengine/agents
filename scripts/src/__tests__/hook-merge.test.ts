/**
 * Tests for hook-merge.mergeHookType and its use by configureHooks:
 * conservative, idempotent merge that preserves user-authored hook entries.
 */
import { describe, expect, test } from "bun:test";
import { mergeHookType } from "../services/hook-merge";
import { configureHooks } from "../services/settings-manager";

const LOADER = "/x/hooks-loader.ts";
const loaderCmd = (t: string) => `bun ${LOADER} ${t}`;

describe("mergeHookType", () => {
	test("adds the loader entry to an empty (undefined) list", () => {
		const result = mergeHookType(undefined, LOADER, "PreToolUse");
		expect(result).toEqual([
			{ matcher: "", hooks: [{ type: "command", command: loaderCmd("PreToolUse") }] },
		]);
	});

	test("keeps a foreign entry and appends the loader entry", () => {
		const foreign = { matcher: "", hooks: [{ command: "my-tool" }] };
		const result = mergeHookType([foreign], LOADER, "PostToolUse");
		expect(result[0]).toEqual(foreign);
		expect(result).toHaveLength(2);
	});

	test("replaces a stale loader entry instead of duplicating it", () => {
		const stale = mergeHookType(undefined, "/old/hooks-loader.ts", "Stop");
		const result = mergeHookType(stale, LOADER, "Stop");
		expect(result).toHaveLength(1);
		expect((result[0] as { hooks: { command: string }[] }).hooks[0].command).toBe(
			loaderCmd("Stop"),
		);
	});
});

describe("configureHooks / merge", () => {
	test("preserves a foreign entry inside a managed hook type", () => {
		const foreign = { matcher: "", hooks: [{ type: "command", command: "my-tool" }] };
		const result = configureHooks({ hooks: { PreToolUse: [foreign] } }, LOADER);
		const entries = result.hooks?.PreToolUse as unknown[];
		expect(entries).toContainEqual(foreign);
		expect(entries.at(-1)).toEqual({
			matcher: "",
			hooks: [{ type: "command", command: loaderCmd("PreToolUse") }],
		});
	});

	test("is idempotent across re-runs", () => {
		const first = configureHooks({}, LOADER);
		const second = configureHooks(structuredClone(first), LOADER);
		expect(second.hooks).toEqual(first.hooks);
	});

	test("is byte-identical on re-run when a user entry is present", () => {
		const foreign = { matcher: "", hooks: [{ type: "command", command: "my-tool" }] };
		const first = configureHooks({ hooks: { PreToolUse: [foreign] } }, LOADER);
		const second = configureHooks(structuredClone(first), LOADER);
		// No duplication, no reordering: the foreign entry stays first, loader last.
		expect(JSON.stringify(second.hooks)).toBe(JSON.stringify(first.hooks));
		expect((second.hooks?.PreToolUse as unknown[])[0]).toEqual(foreign);
		expect((second.hooks?.PreToolUse as unknown[]).length).toBe(2);
	});

	test("does not clobber a user command that merely mentions hooks-loader", () => {
		const userHook = {
			matcher: "",
			hooks: [{ type: "command", command: "bun my-hooks-loader-wrapper.sh" }],
		};
		const result = configureHooks({ hooks: { Stop: [userHook] } }, LOADER);
		const entries = result.hooks?.Stop as unknown[];
		expect(entries[0]).toEqual(userHook);
		expect(entries.length).toBe(2);
	});
});
