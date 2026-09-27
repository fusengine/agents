/**
 * Hook Interfaces - Type definitions for the hook system
 *
 * @description SRP: Hook interfaces only (types in hook-types.ts)
 */

export type { HookType } from "./hook-types";
export { HOOK_TYPES } from "./hook-types";

/** Configuration of a single hook */
export interface HookCommand {
	type: string;
	command: string;
}

/** Hook entry with a matcher */
export interface HookEntry {
	matcher?: string;
	hooks: HookCommand[];
}

/** Full hooks configuration of a plugin */
export interface HooksConfig {
	hooks: Record<string, HookEntry[]>;
}

/** Command to execute, with metadata */
export interface ExecutableHook {
	command: string;
	isAsync: boolean;
	pluginName: string;
	pluginPath: string;
}

/** Result of parsing a hook command into a shell-free argv */
export interface ParsedHookCommand {
	/** Word-split tokens; argv[0] is the literal program name (e.g. "bun"). */
	argv: string[];
	/** True if the command ended with `|| true` (bash swallows every exit≠0, including 2). */
	ignoreExit: boolean;
}

/** Result of a hook execution */
export interface HookResult {
	success: boolean;
	exitCode: number;
	stdout: string;
	stderr: string;
	blocked: boolean;
}

/** JSON input received from Claude */
export interface HookInput {
	tool_name?: string;
	tool_input?: Record<string, unknown>;
	type?: string;
	notification_type?: string;
	agent_type?: string;
}

/** Plugin scanner configuration */
export interface ScannerConfig {
	pluginsDir: string;
}

/** Information about a scanned plugin */
export interface PluginInfo {
	name: string;
	path: string;
	hasHooks: boolean;
	config?: HooksConfig;
}
