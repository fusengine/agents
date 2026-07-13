/**
 * Test for the standalone entry point `scripts/ensure-harness-deps.ts` —
 * proves it is directly executable via `bun scripts/ensure-harness-deps.ts`
 * (not only reachable through the loader). Runs against this dev machine's
 * real HOME/marketplace, where node_modules is already present (nominal
 * path), so this is a fast, deterministic, network-free smoke test.
 */
import { describe, expect, test } from "bun:test";
import { join } from "node:path";

const ENTRY_POINT = join(import.meta.dir, "../../ensure-harness-deps.ts");

describe("ensure-harness-deps.ts standalone entry point", () => {
	test(
		"runs directly via `bun <entry>` and exits 0 without crashing",
		async () => {
			const proc = Bun.spawn([process.execPath, ENTRY_POINT], {
				stdout: "ignore",
				stderr: "pipe",
			});
			const exitCode = await proc.exited;
			const stderr = await new Response(proc.stderr).text();

			expect(exitCode).toBe(0);
			expect(stderr).toBe("");
		},
		15_000,
	);
});
