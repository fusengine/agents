#!/usr/bin/env bun
/**
 * install-hooks.ts - Installation du système de hooks
 * Utilise @clack/prompts pour une UI moderne
 */
import { existsSync } from "fs";
import { join, dirname } from "path";
import { $ } from "bun";
import * as p from "@clack/prompts";
import { scanPlugins } from "./src/services/plugin-scanner";
import {
  loadSettings,
  saveSettings,
  backupSettings,
  configureHooks,
  configureDefaults,
  configureStatusLine,
} from "./src/services/settings-manager";
import { copyExecutable, filesAreEqual } from "./src/utils/fs-helpers";
import {
  configureApiKeys,
  configureShell,
  checkApiKeys,
} from "./src/services/env-manager";

const HOME = process.env.HOME || process.env.USERPROFILE || "";
const SCRIPT_DIR = dirname(import.meta.path);
const PROJECT_ROOT = dirname(SCRIPT_DIR);

const PATHS = {
  settings: join(HOME, ".claude/settings.json"),
  marketplace: join(HOME, ".claude/plugins/marketplaces/fusengine-plugins"),
  loaderSrc: join(SCRIPT_DIR, "hooks-loader.ts"),
  claudeMdSrc: join(PROJECT_ROOT, "CLAUDE.md"),
  claudeMdDest: join(HOME, ".claude/CLAUDE.md"),
};

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const skipEnv = args.includes("--skip-env");

  p.intro("🚀 Fusengine Plugins Setup");

  const pluginsDir = join(PATHS.marketplace, "plugins");
  const loaderDest = join(PATHS.marketplace, "scripts/hooks-loader.ts");

  // 1. Copier le loader
  await copyExecutable(PATHS.loaderSrc, loaderDest);

  // 2. Scanner les plugins
  const s = p.spinner();
  s.start("Scanning plugins...");

  const plugins = scanPlugins({ pluginsDir });
  const withHooks = plugins.filter((p) => p.hasHooks);

  s.stop(`${withHooks.length} plugins with hooks detected`);

  // 3. Configurer settings.json
  s.start("Configuring hooks loader...");
  backupSettings(PATHS.settings);

  let settings = await loadSettings(PATHS.settings);
  settings = configureDefaults(settings);
  settings = configureHooks(settings, loaderDest);
  s.stop("Hooks loader configured");

  // 4. Installer CLAUDE.md
  if (existsSync(PATHS.claudeMdSrc)) {
    const same = await filesAreEqual(PATHS.claudeMdSrc, PATHS.claudeMdDest);
    if (!same) {
      await Bun.write(
        PATHS.claudeMdDest,
        await Bun.file(PATHS.claudeMdSrc).text()
      );
      p.log.success("CLAUDE.md installed");
    } else {
      p.log.info("CLAUDE.md already up to date");
    }
  }

  // 5. Installer statusline
  const statuslineDir = join(pluginsDir, "core-guards/statusline");
  if (existsSync(statuslineDir)) {
    s.start("Installing statusline...");
    try {
      await $`cd ${statuslineDir} && bun install --silent`.quiet();
      settings = configureStatusLine(settings, statuslineDir);
      s.stop("Statusline configured");
    } catch {
      s.stop("Statusline installation failed");
    }
  }

  // 6. Sauvegarder settings
  await saveSettings(PATHS.settings, settings);

  // 7. Configurer API keys et shell (sauf si --skip-env)
  if (!skipEnv) {
    const { missing } = checkApiKeys();
    if (missing.length > 0) {
      p.log.warn(`${missing.length} API keys missing`);
      await configureApiKeys();
    } else {
      p.log.success("All API keys configured");
    }

    // Toujours proposer de configurer le shell
    await configureShell();
  }

  p.outro("✅ Setup complete! Restart Claude Code to apply.");
}

main().catch((e) => {
  p.log.error(e.message);
  process.exit(1);
});
