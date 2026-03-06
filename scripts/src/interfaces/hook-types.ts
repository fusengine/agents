/**
 * Hook Types - Supported Claude Code hook event types
 *
 * @description SRP: Hook type definitions and registry only
 * @see https://code.claude.com/docs/en/hooks
 */

/** Types de hooks supportés (Claude Code v2.1.70 + custom Setup) */
export type HookType =
	| "UserPromptSubmit"
	| "PreToolUse"
	| "PostToolUse"
	| "PostToolUseFailure"
	| "PermissionRequest"
	| "SubagentStart"
	| "SubagentStop"
	| "SessionStart"
	| "Stop"
	| "Notification"
	| "PreCompact"
	| "SessionEnd"
	| "InstructionsLoaded"
	| "ConfigChange"
	| "TeammateIdle"
	| "TaskCompleted"
	| "WorktreeCreate"
	| "WorktreeRemove"
	| "Setup";

/** Registry of all hook types for settings generation */
export const HOOK_TYPES: HookType[] = [
	"UserPromptSubmit",
	"PreToolUse",
	"PostToolUse",
	"PostToolUseFailure",
	"PermissionRequest",
	"SubagentStart",
	"SubagentStop",
	"SessionStart",
	"Stop",
	"Notification",
	"PreCompact",
	"SessionEnd",
	"InstructionsLoaded",
	"ConfigChange",
	"TeammateIdle",
	"TaskCompleted",
	"WorktreeCreate",
	"WorktreeRemove",
	"Setup",
];
