/**
 * Tests for executeHooks (parallel run + output collection, shell-free).
 */
import { describe, expect, test } from "bun:test";
import { executeHooks } from "../services/hook-executor";
import { fixtureHook } from "./helpers/hook-fixture";

describe("executeHooks", () => {
	test("returns empty result for no hooks", async () => {
		const result = await executeHooks([], "{}");
		expect(result.blocked).toBe(false);
		expect(result.output).toBe("");
	});

	test("collects JSON output with additionalContext", async () => {
		const result = await executeHooks([fixtureHook("ctx", "extra-info")], "{}");
		expect(result.blocked).toBe(false);
		expect(result.output).toContain("additionalContext");
		expect(result.output).toContain("extra-info");
	});

	test("ignores non-JSON output", async () => {
		const result = await executeHooks([fixtureHook("plain")], "{}");
		expect(result.blocked).toBe(false);
		expect(result.output).toBe("");
	});

	test("detects blocked hook (exit 2)", async () => {
		const result = await executeHooks([fixtureHook("block")], "{}");
		expect(result.blocked).toBe(true);
		expect(result.stderr).toContain("blocked reason");
	});

	test("executes multiple hooks in parallel", async () => {
		const hooks = [fixtureHook("sleep"), fixtureHook("sleep"), fixtureHook("sleep")];
		const start = Date.now();
		const result = await executeHooks(hooks, "{}");
		const duration = Date.now() - start;
		expect(result.blocked).toBe(false);
		// Sequential would be 150ms+; parallel ~50ms (generous CI margin).
		expect(duration).toBeLessThan(140);
	});

	test("first blocked hook stops with blocked result", async () => {
		const hooks = [fixtureHook("stdout"), fixtureHook("block"), fixtureHook("stdout")];
		const result = await executeHooks(hooks, "{}");
		expect(result.blocked).toBe(true);
	});

	test("handles failing command gracefully (exit != 2 not blocked)", async () => {
		const result = await executeHooks([fixtureHook("fail")], "{}");
		expect(result.blocked).toBe(false);
	});

	test("merges multiple additionalContext outputs", async () => {
		const hooks = [fixtureHook("ctx", "info1"), fixtureHook("ctx", "info2")];
		const result = await executeHooks(hooks, "{}");
		expect(result.output).toContain("info1");
		expect(result.output).toContain("info2");
	});
});
