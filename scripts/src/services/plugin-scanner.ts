/**
 * Service de scan des plugins
 * Single Responsibility: Scanner et charger les configurations des plugins
 */
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import type {
  HooksConfig,
  HookEntry,
  ExecutableHook,
  ScannerConfig,
  PluginInfo,
} from "../interfaces/hooks";

/**
 * Scanne les plugins et retourne leurs configurations
 */
export function scanPlugins(config: ScannerConfig): PluginInfo[] {
  const { pluginsDir } = config;
  const plugins: PluginInfo[] = [];

  if (!existsSync(pluginsDir)) return plugins;

  for (const name of readdirSync(pluginsDir)) {
    const pluginPath = join(pluginsDir, name);
    const hooksFile = join(pluginPath, "hooks/hooks.json");

    const info: PluginInfo = {
      name,
      path: pluginPath,
      hasHooks: existsSync(hooksFile),
    };

    if (info.hasHooks) {
      try {
        info.config = JSON.parse(readFileSync(hooksFile, "utf8"));
      } catch {
        // Ignore parsing errors
      }
    }

    plugins.push(info);
  }

  return plugins;
}

/**
 * Extrait les hooks exécutables pour un type donné
 */
export function extractHooks(
  plugins: PluginInfo[],
  hookType: string,
  toolName: string,
  notifType: string
): ExecutableHook[] {
  const hooks: ExecutableHook[] = [];

  for (const plugin of plugins) {
    if (!plugin.config) continue;

    const entries: HookEntry[] = plugin.config.hooks?.[hookType] ?? [];

    for (const entry of entries) {
      if (!matchesFilter(entry.matcher, hookType, toolName, notifType)) {
        continue;
      }

      for (const hook of entry.hooks) {
        const command = hook.command.replace(
          /\$\{CLAUDE_PLUGIN_ROOT\}/g,
          plugin.path
        );

        hooks.push({
          command,
          isAsync: command.startsWith("afplay"),
          pluginName: plugin.name,
        });
      }
    }
  }

  return hooks;
}

/**
 * Vérifie si un matcher correspond
 */
function matchesFilter(
  matcher: string | undefined,
  hookType: string,
  toolName: string,
  notifType: string
): boolean {
  if (!matcher) return true;

  const testValue = hookType === "Notification" ? notifType : toolName;
  try {
    return new RegExp(matcher).test(testValue);
  } catch {
    return false;
  }
}
