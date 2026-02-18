/**
 * Setup runner service
 * Single Responsibility: Orchestrate plugin setup steps
 */
import { join } from "path";
import * as p from "@clack/prompts";
import {
  loadSettings, saveSettings, backupSettings, configureHooks,
  configureDefaults, enableAgentTeams, isAgentTeamsEnabled,
  SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE,
} from "./settings-manager";
import { copyExecutable } from "../utils/fs-helpers";
import { configureApiKeys, configureShell, checkApiKeys } from "./env-manager";
import { configureMcpServers } from "./mcp-setup";
import { scanAndPrepare, installClaudeMd, installDeps, setupStatusline } from "./setup-plugins";
import type { SetupPaths } from "../interfaces/setup";

/** Prompt user for response language */
async function promptLanguage(): Promise<string> {
  const choice = await p.select({
    message: "Select response language for Claude Code:",
    options: SUPPORTED_LANGUAGES.map((lang) => ({ value: lang.value, label: lang.label })),
    initialValue: DEFAULT_LANGUAGE,
  });
  return p.isCancel(choice) ? DEFAULT_LANGUAGE : (choice as string);
}

/** Run the complete setup process */
export async function runSetup(paths: SetupPaths, skipEnv: boolean): Promise<void> {
  p.intro("Fusengine Plugins Setup");

  const pluginsDir = join(paths.marketplace, "plugins");
  const loaderDest = join(paths.marketplace, "scripts/hooks-loader.ts");
  await copyExecutable(paths.loaderSrc, loaderDest);

  await scanAndPrepare(pluginsDir);

  const selectedLanguage = await promptLanguage();

  const s = p.spinner();
  s.start("Configuring hooks loader...");
  backupSettings(paths.settings);
  let settings = await loadSettings(paths.settings);
  settings = configureDefaults(settings, selectedLanguage);
  settings = configureHooks(settings, loaderDest);
  s.stop("Hooks loader configured");

  await installClaudeMd(paths.claudeMdSrc, paths.claudeMdDest);
  await installDeps(pluginsDir);
  settings = await setupStatusline(pluginsDir, settings);

  if (!isAgentTeamsEnabled(settings)) {
    const enable = await p.confirm({ message: "Enable Agent Teams? (beta)", initialValue: true });
    if (enable && !p.isCancel(enable)) {
      settings = enableAgentTeams(settings);
      p.log.success("Agent Teams enabled");
    }
  } else {
    p.log.info("Agent Teams already enabled");
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
    await configureMcpServers();
  }

  p.outro("Setup complete! Restart Claude Code to apply.");
}
