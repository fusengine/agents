/**
 * Test helper: build ExecutableHook commands that invoke the shell-free .mjs fixture.
 * Shared across the hook-executor test files to keep them DRY.
 */
import type { ExecutableHook } from "../../interfaces/hooks";

/** Absolute path to the deterministic test fixture (resolved from this file's dir). */
export const FIXTURE_PATH = `${import.meta.dir}/../fixtures/hook-fixture.mjs`;

/**
 * Build a hook command that runs the fixture in `mode` (no shell involved).
 *
 * @param mode Fixture behaviour: stdout | ctx | plain | block | fail | stdin | sleep.
 * @param extra Optional single extra token appended (no whitespace inside it).
 * @param isAsync Whether the produced hook is fire-and-forget.
 * @returns An ExecutableHook whose command targets the fixture.
 */
export function fixtureHook(
	mode: string,
	extra = "",
	isAsync = false,
): ExecutableHook {
	const tail = extra ? ` ${extra}` : "";
	return {
		command: `bun ${FIXTURE_PATH} ${mode}${tail}`,
		isAsync,
		pluginName: "test",
		pluginPath: "/test/plugins/test",
	};
}
