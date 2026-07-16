/**
 * Non-regression proof: for representative hook commands, the new shell-free spawn
 * must produce the SAME effective exitCode + stdout + stderr as the old `bash -c` path.
 * Skips cleanly when bash is absent (e.g. Windows CI) so it never breaks that platform.
 */
import { describe, expect, test } from "bun:test";
import { executeHook } from "../services/hook-executor";
import { FIXTURE_PATH } from "./helpers/hook-fixture";

const bash = Bun.which("bash");

/** Old behaviour: run the command exactly as before, via `bash -c`. */
async function runViaBash(
	command: string,
	input: string,
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
	const proc = Bun.spawn(["bash", "-c", command], {
		stdin: new TextEncoder().encode(input),
		stdout: "pipe",
		stderr: "pipe",
	});
	const exitCode = await proc.exited;
	const stdout = await new Response(proc.stdout).text();
	const stderr = await new Response(proc.stderr).text();
	return { exitCode, stdout, stderr };
}

/** Representative commands: exit 0/2, `|| true`, and a `--sound`-style multi-arg. */
const CASES: Array<{ name: string; cmd: string; input?: string }> = [
	{ name: "exit 0 (stdout)", cmd: `bun ${FIXTURE_PATH} stdout` },
	{ name: "exit 2 (blocked)", cmd: `bun ${FIXTURE_PATH} block` },
	{ name: "fail with `|| true`", cmd: `bun ${FIXTURE_PATH} fail || true` },
	{ name: "extra --sound arg", cmd: `bun ${FIXTURE_PATH} stdout --sound ping` },
	{ name: "stdin passthrough", cmd: `bun ${FIXTURE_PATH} stdin`, input: "EQUIV-INPUT" },
];

describe.skipIf(!bash)("hook-executor equivalence (bash vs shell-free)", () => {
	for (const c of CASES) {
		test(`identical result: ${c.name}`, async () => {
			const input = c.input ?? "{}";
			const old = await runViaBash(c.cmd, input);
			const next = await executeHook(
				{ command: c.cmd, isAsync: false, pluginName: "eq", pluginPath: "/test/plugins/eq" },
				input,
			);
			expect(next.exitCode).toBe(old.exitCode);
			expect(next.stdout).toBe(old.stdout);
			expect(next.stderr).toBe(old.stderr);
		});
	}
});
