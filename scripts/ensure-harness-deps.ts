#!/usr/bin/env bun
/**
 * ensure-harness-deps.ts - standalone self-heal entry point.
 *
 * Reinstalls node_modules for scripts/, plugins/ (shared harness), and
 * plugins/core-guards/statusline when the marketplace git clone was
 * re-checked-out and wiped their gitignored node_modules. Runnable alone
 * (manual repair, or wiring as a hook / from /update-harness):
 *
 *   bun scripts/ensure-harness-deps.ts
 *
 * Import chain is relative-source-only (no third-party package), so it boots
 * even when every node_modules under the marketplace clone is gone — this is
 * the same constraint `hooks-loader.ts` observes when it calls `ensureDeps`
 * in-process instead of spawning this file (zero per-hook spawn overhead).
 */
import { join } from "node:path";
import { getManagedDepsTargets } from "./src/services/deps-targets";
import { ensureDeps } from "./src/services/ensure-deps";

const HOME = process.env.HOME || process.env.USERPROFILE || "";
const PLUGINS_DIR = join(HOME, ".claude/plugins/marketplaces/fusengine-plugins/plugins");

await ensureDeps(getManagedDepsTargets(import.meta.dir, PLUGINS_DIR));
