/**
 * Tests for hook-executor service
 */
import { describe, expect, test } from "bun:test";
import type { ExecutableHook } from "../interfaces/hooks";
import { executeHook, executeHooks } from "../services/hook-executor";

describe("hook-executor", () => {
	describe("executeHook", () => {
		test("captures stdout from command", async () => {
			const hook: ExecutableHook = {
				command: "echo 'hello world'",
				isAsync: false,
				pluginName: "test",
			};

			const result = await executeHook(hook, "{}");

			expect(result.success).toBe(true);
			expect(result.stdout).toContain("hello world");
			expect(result.exitCode).toBe(0);
		});

		test("captures stderr and blocked status on exit 2", async () => {
			const hook: ExecutableHook = {
				command: "echo 'error message' >&2 && exit 2",
				isAsync: false,
				pluginName: "test",
			};

			const result = await executeHook(hook, "{}");

			expect(result.blocked).toBe(true);
			expect(result.exitCode).toBe(2);
			expect(result.stderr).toContain("error message");
		});
	});

	describe("executeHooks", () => {
		test("returns empty result for no hooks", async () => {
			const result = await executeHooks([], "{}");

			expect(result.blocked).toBe(false);
			expect(result.output).toBe("");
		});

		test("collects JSON output with additionalContext", async () => {
			const hooks: ExecutableHook[] = [
				{
					command: `echo '{"additionalContext": "extra info"}'`,
					isAsync: false,
					pluginName: "test-plugin",
				},
			];

			const result = await executeHooks(hooks, "{}");

			expect(result.blocked).toBe(false);
			expect(result.output).toContain("additionalContext");
			expect(result.output).toContain("extra info");
		});

		test("ignores non-JSON output", async () => {
			const hooks: ExecutableHook[] = [
				{
					command: "echo 'plain text output'",
					isAsync: false,
					pluginName: "test-plugin",
				},
			];

			const result = await executeHooks(hooks, "{}");

			expect(result.blocked).toBe(false);
			// Plain text is not collected (only additionalContext JSON)
			expect(result.output).toBe("");
		});

		test("detects blocked hook (exit 2)", async () => {
			const hooks: ExecutableHook[] = [
				{
					command: "echo 'blocked reason' >&2 && exit 2",
					isAsync: false,
					pluginName: "test-plugin",
				},
			];

			const result = await executeHooks(hooks, "{}");

			expect(result.blocked).toBe(true);
			expect(result.stderr).toContain("blocked reason");
		});

		test("executes multiple hooks in parallel", async () => {
			const hooks: ExecutableHook[] = [
				{
					command: "sleep 0.05 && echo 'hook1'",
					isAsync: false,
					pluginName: "p1",
				},
				{
					command: "sleep 0.05 && echo 'hook2'",
					isAsync: false,
					pluginName: "p2",
				},
				{
					command: "sleep 0.05 && echo 'hook3'",
					isAsync: false,
					pluginName: "p3",
				},
			];

			const start = Date.now();
			const result = await executeHooks(hooks, "{}");
			const duration = Date.now() - start;

			expect(result.blocked).toBe(false);
			// If sequential: 150ms+, if parallel: ~50ms
			expect(duration).toBeLessThan(120);
		});

		test("first blocked hook stops with blocked result", async () => {
			const hooks: ExecutableHook[] = [
				{ command: "echo 'ok1'", isAsync: false, pluginName: "plugin1" },
				{
					command: "echo 'blocked' >&2 && exit 2",
					isAsync: false,
					pluginName: "plugin2",
				},
				{ command: "echo 'ok3'", isAsync: false, pluginName: "plugin3" },
			];

			const result = await executeHooks(hooks, "{}");

			expect(result.blocked).toBe(true);
		});

		test("handles failing command gracefully", async () => {
			const hooks: ExecutableHook[] = [
				{
					command: "nonexistent-command-xyz 2>/dev/null",
					isAsync: false,
					pluginName: "test-plugin",
				},
			];

			const result = await executeHooks(hooks, "{}");
			// Exit code != 2, so not blocked
			expect(result.blocked).toBe(false);
		});

		test("merges multiple additionalContext outputs", async () => {
			const hooks: ExecutableHook[] = [
				{
					command: `echo '{"additionalContext": "info1"}'`,
					isAsync: false,
					pluginName: "p1",
				},
				{
					command: `echo '{"additionalContext": "info2"}'`,
					isAsync: false,
					pluginName: "p2",
				},
			];

			const result = await executeHooks(hooks, "{}");

			expect(result.output).toContain("info1");
			expect(result.output).toContain("info2");
		});
	});
});
