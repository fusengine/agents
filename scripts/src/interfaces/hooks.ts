/**
 * Interfaces pour le système de hooks
 */

/** Configuration d'un hook individuel */
export interface HookCommand {
  type: string;
  command: string;
}

/** Entrée de hook avec matcher */
export interface HookEntry {
  matcher?: string;
  hooks: HookCommand[];
}

/** Configuration complète des hooks d'un plugin */
export interface HooksConfig {
  hooks: Record<string, HookEntry[]>;
}

/** Commande à exécuter avec métadonnées */
export interface ExecutableHook {
  command: string;
  isAsync: boolean;
  pluginName: string;
}

/** Résultat d'exécution d'un hook */
export interface HookResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  blocked: boolean;
}

/** Input JSON reçu de Claude */
export interface HookInput {
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  type?: string;
  notification_type?: string;
}

/** Types de hooks supportés */
export type HookType =
  | "UserPromptSubmit"
  | "PreToolUse"
  | "PostToolUse"
  | "PermissionRequest"
  | "SubagentStart"
  | "SubagentStop"
  | "SessionStart"
  | "Stop"
  | "Notification"
  | "PreCompact"
  | "SessionEnd"
  | "Setup";

export const HOOK_TYPES: HookType[] = [
  "UserPromptSubmit",
  "PreToolUse",
  "PostToolUse",
  "PermissionRequest",
  "SubagentStart",
  "SubagentStop",
  "SessionStart",
  "Stop",
  "Notification",
  "PreCompact",
  "SessionEnd",
  "Setup",
];

/** Configuration du scanner de plugins */
export interface ScannerConfig {
  pluginsDir: string;
}

/** Informations sur un plugin scanné */
export interface PluginInfo {
  name: string;
  path: string;
  hasHooks: boolean;
  config?: HooksConfig;
}
