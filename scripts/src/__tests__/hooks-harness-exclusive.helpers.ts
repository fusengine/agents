/**
 * Pure helpers for the harness-exclusive anti-regression gate.
 * Split out of hooks-harness-exclusive.test.ts to respect the 100-line SOLID limit.
 */
// discoverHooksFiles moved to shared production util; re-exported for the test.
export { discoverHooksFiles } from "../utils/hooks-discovery";

export const HARNESS_MARKER = "node_modules/@fusengine/harness/dist/cli/bin.mjs hook claude-code";

/** True when a command hook delegates to the harness binary (tolerates ` || true`, flags, scope). */
export function isHarnessCommand(command: string): boolean {
	return command.startsWith("bun ") && command.includes(HARNESS_MARKER);
}

/** Plugin name extracted from a `.../plugins/<name>/hooks/hooks.json` path. */
export function pluginNameOf(filePath: string): string {
	return filePath.split("/plugins/")[1]?.split("/")[0] ?? filePath;
}
