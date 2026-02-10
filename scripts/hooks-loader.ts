#!/usr/bin/env bun
/**
 * hooks-loader.ts - Hook dispatcher entry point
 * Delegates to services for scanning and execution
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

  // Read input (may be empty for SessionStart, Stop, etc.)
  const rawInput = await Bun.stdin.text();

  // Parse input or use empty object
  let input: HookInput = {};
  if (rawInput.trim()) {
    try {
      input = JSON.parse(rawInput);
    } catch {
      // Continue with empty input
    }
  }

  const toolName = input.tool_name ?? "";
  const notifType = input.type ?? input.notification_type ?? "";
  const agentType = input.agent_type ?? "";

  // Scan plugins
  const plugins = scanPlugins({ pluginsDir: PLUGINS_DIR });

  // Extract matching hooks
  const hooks = extractHooks(plugins, hookType, toolName, notifType, agentType);

  // Execute hooks (pass rawInput or empty JSON)
  const result = await executeHooks(hooks, rawInput || "{}");

  // Handle blocking
  if (result.blocked) {
    console.error(result.stderr);
    process.exit(2);
  }

  // Output collected JSON
  if (result.output) {
    console.log(result.output);
  }
}

main().catch(() => process.exit(0));
