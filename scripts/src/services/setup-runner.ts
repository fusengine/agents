/**
 * Setup runner service
 * Single Responsibility: Execute plugin setup steps
 */
import { existsSync } from "fs";
import { join } from "path";
import { $ } from "bun";
import * as p from "@clack/prompts";
import { scanPlugins } from "./plugin-scanner";
import {
  loadSettings,
  saveSettings,
  backupSettings,
  configureHooks,
  configureDefaults,
  configureStatusLine,
} from "./settings-manager";
import { copyExecutable, filesAreEqual } from "../utils/fs-helpers";
import { configureApiKeys, configureShell, checkApiKeys } from "./env-manager";

interface SetupPaths {
  settings: string;
  marketplace: string;
  loaderSrc: string;
  claudeMdSrc: string;
  claudeMdDest: string;
}

/** Run the complete setup process */
export async function runSetup(paths: SetupPaths, skipEnv: boolean): Promise<void> {
  p.intro("🚀 Fusengine Plugins Setup");

  const pluginsDir = join(paths.marketplace, "plugins");
  const loaderDest = join(paths.marketplace, "scripts/hooks-loader.ts");

  await copyExecutable(paths.loaderSrc, loaderDest);

  const s = p.spinner();
  s.start("Scanning plugins...");
  const plugins = scanPlugins({ pluginsDir });
  const withHooks = plugins.filter((pl) => pl.hasHooks);
  s.stop(`${withHooks.length} plugins with hooks detected`);

  s.start("Configuring hooks loader...");
  backupSettings(paths.settings);
  let settings = await loadSettings(paths.settings);
  settings = configureDefaults(settings);
  settings = configureHooks(settings, loaderDest);
  s.stop("Hooks loader configured");

  if (existsSync(paths.claudeMdSrc)) {
    const same = await filesAreEqual(paths.claudeMdSrc, paths.claudeMdDest);
    if (!same) {
      await Bun.write(paths.claudeMdDest, await Bun.file(paths.claudeMdSrc).text());
      p.log.success("CLAUDE.md installed");
    } else {
      p.log.info("CLAUDE.md already up to date");
    }
  }

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

  await saveSettings(paths.settings, settings);

  if (!skipEnv) {
    const { missing } = checkApiKeys();
    if (missing.length > 0) {
      p.log.warn(`${missing.length} API keys missing`);
      await configureApiKeys();
    } else {
      p.log.success("All API keys configured");
    }
    await configureShell();
  }

  p.outro("✅ Setup complete! Restart Claude Code to apply.");
}
