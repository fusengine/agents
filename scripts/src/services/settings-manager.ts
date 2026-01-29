/**
 * Service de gestion des settings
 * Single Responsibility: Lire/écrire ~/.claude/settings.json
 */
import { existsSync, copyFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { HOOK_TYPES } from "../interfaces/hooks";

export interface Settings {
  language?: string;
  attribution?: { commit: string; pr: string };
  hooks?: Record<string, unknown[]>;
  statusLine?: {
    type: string;
    command: string;
    padding: number;
  };
  [key: string]: unknown;
}

export interface SettingsManagerConfig {
  settingsPath: string;
  loaderPath: string;
}

/**
 * Charge les settings existants
 */
export async function loadSettings(path: string): Promise<Settings> {
  if (!existsSync(path)) return {};
  return await Bun.file(path).json();
}

/**
 * Sauvegarde les settings
 */
export async function saveSettings(
  path: string,
  settings: Settings
): Promise<void> {
  mkdirSync(dirname(path), { recursive: true });
  await Bun.write(path, JSON.stringify(settings, null, 2) + "\n");
}

/**
 * Crée un backup des settings
 */
export function backupSettings(path: string): void {
  if (!existsSync(path)) return;

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);
  copyFileSync(path, `${path}.backup.${timestamp}`);
}

/**
 * Configure les hooks dans les settings
 */
export function configureHooks(
  settings: Settings,
  loaderPath: string
): Settings {
  settings.hooks = {};

  for (const hookType of HOOK_TYPES) {
    settings.hooks[hookType] = [
      {
        matcher: "",
        hooks: [
          {
            type: "command",
            command: `bun ${loaderPath} ${hookType}`,
          },
        ],
      },
    ];
  }

  return settings;
}

/**
 * Configure les paramètres de base
 */
export function configureDefaults(settings: Settings): Settings {
  settings.language = "french";
  settings.attribution = { commit: "", pr: "" };
  return settings;
}

/**
 * Configure la statusline
 */
export function configureStatusLine(
  settings: Settings,
  statuslineDir: string
): Settings {
  if (!settings.statusLine) {
    settings.statusLine = {
      type: "command",
      command: `bun ${statuslineDir}/src/index.ts`,
      padding: 0,
    };
  }
  return settings;
}
