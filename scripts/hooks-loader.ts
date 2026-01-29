#!/usr/bin/env bun
/**
 * hooks-loader.ts - Point d'entrée du dispatcher de hooks
 * Délègue aux services pour le scan et l'exécution
 */
import { join } from "path";
import { scanPlugins, extractHooks } from "./src/services/plugin-scanner";
import { executeHooks } from "./src/services/hook-executor";
import type { HookInput } from "./src/interfaces/hooks";

const PLUGINS_DIR = join(
  process.env.HOME!,
  ".claude/plugins/marketplaces/fusengine-plugins/plugins"
);

async function main(): Promise<void> {
  const hookType = process.argv[2];
  if (!hookType) process.exit(0);

  // Lire et parser l'input
  const rawInput = await Bun.stdin.text();
  if (!rawInput.trim()) process.exit(0);

  let input: HookInput;
  try {
    input = JSON.parse(rawInput);
  } catch {
    process.exit(0);
  }

  const toolName = input.tool_name ?? "";
  const notifType = input.type ?? input.notification_type ?? "";

  // Scanner les plugins
  const plugins = scanPlugins({ pluginsDir: PLUGINS_DIR });

  // Extraire les hooks correspondants
  const hooks = extractHooks(plugins, hookType, toolName, notifType);

  // Exécuter les hooks
  const result = await executeHooks(hooks, rawInput);

  // Gérer le blocage
  if (result.blocked) {
    console.error(result.stderr);
    process.exit(2);
  }

  // Output JSON collecté
  if (result.output) {
    console.log(result.output);
  }
}

main().catch(() => process.exit(0));
