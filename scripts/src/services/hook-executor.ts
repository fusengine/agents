/**
 * Hook execution service
 * Single Responsibility: Execute commands and collect results
 */
import type { ExecutableHook, HookResult } from "../interfaces/hooks";
import { parseHookCommand } from "../utils/command-parser";
import { mergeJsonOutput } from "./merge-utils";

/** Build spawn argv from a command, swapping literal "bun" for the running Bun binary. */
function toSpawnArgv(command: string): { argv: string[]; ignoreExit: boolean } {
	const { argv, ignoreExit } = parseHookCommand(command);
	if (argv[0] === "bun") argv[0] = process.execPath;
	return { argv, ignoreExit };
}

/** Execute a hook (shell-free) reproducing the previous `bash -c` semantics */
export async function executeHook(
	hook: ExecutableHook,
	input: string,
): Promise<HookResult> {
	const { argv, ignoreExit } = toSpawnArgv(hook.command);

	if (hook.isAsync) {
		try {
			await Bun.spawn(argv, { stdout: "ignore", stderr: "ignore" }).exited;
		} catch {
			// Fire-and-forget: a spawn failure (ENOENT) is ignored, as before.
		}
		return { success: true, exitCode: 0, stdout: "", stderr: "", blocked: false };
	}

	try {
		const proc = Bun.spawn(argv, {
			stdin: new TextEncoder().encode(input),
			stdout: "pipe",
			stderr: "pipe",
		});
		const rawExit = await proc.exited;
		// `|| true` swallows every non-zero exit (incl. 2) → effective 0, never blocked.
		const exitCode = ignoreExit ? 0 : rawExit;
		const stdout = await new Response(proc.stdout).text();
		const stderr = await new Response(proc.stderr).text();
		return { success: exitCode === 0, exitCode, stdout, stderr, blocked: exitCode === 2 };
	} catch {
		// Spawn threw (ENOENT): bash would return a non-zero exit → non-blocking failure.
		// `bad-cmd || true` still yields success 0 under bash, so honour ignoreExit here too.
		return ignoreExit
			? { success: true, exitCode: 0, stdout: "", stderr: "", blocked: false }
			: { success: false, exitCode: 1, stdout: "", stderr: "", blocked: false };
	}
}

/** Execute a list of hooks in PARALLEL, check for blocks after execution */
export async function executeHooks(
	hooks: ExecutableHook[],
	input: string,
): Promise<{ blocked: boolean; stderr: string; output: string }> {
	if (hooks.length === 0) {
		return { blocked: false, stderr: "", output: "" };
	}

	const results = await Promise.all(
		hooks.map((hook) => executeHook(hook, input)),
	);

	const blockedResult = results.find((r) => r.blocked);
	if (blockedResult) {
		return { blocked: true, stderr: blockedResult.stderr, output: "" };
	}

	let collectedOutput = "";
	const collectedStderr: string[] = [];

	for (const result of results) {
		if (result.stdout.trim()) {
			collectedOutput = mergeJsonOutput(collectedOutput, result.stdout);
		}
		if (result.stderr.trim()) {
			collectedStderr.push(result.stderr);
		}
	}

	return {
		blocked: false,
		stderr: collectedStderr.join(""),
		output: collectedOutput,
	};
}
