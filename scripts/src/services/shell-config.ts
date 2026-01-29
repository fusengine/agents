/**
 * Shell configuration service
 * Single Responsibility: Configure shell to auto-load .env
 */
import * as p from "@clack/prompts";
import { detectShell, isShellConfigured } from "./shell-detection";
import { installFishConfig, installPowershellConfig, installPosixConfig } from "./shell-installers";

/**
 * Configure shell to automatically load .env
 */
export async function configureShell(): Promise<void> {
  const shell = detectShell();

  if (isShellConfigured(shell)) {
    p.log.info(`${shell} already configured`);
    return;
  }

  const shouldConfigure = await p.confirm({
    message: `Configure ${shell} to automatically load API keys?`,
  });

  if (p.isCancel(shouldConfigure) || !shouldConfigure) return;

  switch (shell) {
    case "fish": installFishConfig(); break;
    case "pwsh": installPowershellConfig(); break;
    default: installPosixConfig(shell);
  }

  p.log.success(`${shell} configured`);
}
