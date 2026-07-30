/**
 * Sandbox CLI fixture: runs the REAL installFishConfig() so the test can check
 * that it installs both the fish conf.d snippet AND the BASH_ENV shim.
 *
 * Spawned as a subprocess with HOME pointed at a temp dir: the HOME const in
 * shell-installers.ts is resolved once at import time, so it must be set
 * before the process starts, not after. The real ~/.config and ~/.claude are
 * therefore never touched.
 *
 * Invoked as: bun fish-install-cli.ts
 */
import { installFishConfig } from "../../services/shell-installers";

installFishConfig();
