/**
 * Hook command parser
 * Single Responsibility: split a resolved hook command into a shell-free argv,
 * reproducing what `bash -c "<command>"` did for our unquoted hook commands.
 */
import type { ParsedHookCommand } from "../interfaces/hooks";

/** Trailing ` || true` (bash swallows any non-zero exit, exit 2 included). */
const OR_TRUE_SUFFIX = /\s*\|\|\s*true\s*$/;

/**
 * Parse a resolved hook command into argv tokens + an `ignoreExit` flag.
 *
 * Design (argv[0]): kept pure — argv[0] stays the literal token (e.g. "bun") and the
 * executor swaps "bun" -> process.execPath at spawn time. The parser therefore has no
 * process-state dependency and is trivially unit-testable. Splitting is plain whitespace
 * word-splitting, which matches bash for these unquoted commands (a space-containing path
 * splits the same way it already breaks under bash — deliberately left as-is to avoid a
 * behaviour change).
 *
 * @param command Resolved command (absolute paths, `${...}` placeholders already replaced).
 * @returns argv tokens and whether a trailing `|| true` was present.
 */
export function parseHookCommand(command: string): ParsedHookCommand {
	const ignoreExit = OR_TRUE_SUFFIX.test(command);
	const argv = command.replace(OR_TRUE_SUFFIX, "").trim().split(/\s+/);
	return { argv, ignoreExit };
}
