/**
 * Shell configuration installers
 * Single Responsibility: Install shell configs for different shells
 */
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { getPowershellProfilePath } from "./shell-detection";

const HOME = process.env.HOME || process.env.USERPROFILE || "";
const SCRIPT_DIR = dirname(dirname(dirname(import.meta.path)));
const ENV_SHELL_DIR = join(SCRIPT_DIR, "env-shell");

/** Install fish configuration */
export function installFishConfig(): void {
	const confDir = join(HOME, ".config", "fish", "conf.d");
	mkdirSync(confDir, { recursive: true });
	copyFileSync(
		join(ENV_SHELL_DIR, "claude-env.fish"),
		join(confDir, "claude-env.fish"),
	);
}

/** Install PowerShell configuration */
export function installPowershellConfig(): void {
	const profileFile = getPowershellProfilePath();
	mkdirSync(dirname(profileFile), { recursive: true });
	const psConfig = readFileSync(join(ENV_SHELL_DIR, "claude-env.ps1"), "utf8");

	if (existsSync(profileFile)) {
		const existing = readFileSync(profileFile, "utf8");
		writeFileSync(
			profileFile,
			`${existing}
${psConfig}`,
		);
	} else {
		writeFileSync(profileFile, psConfig);
	}
}

/** Install bash/zsh configuration */
export function installPosixConfig(shell: "bash" | "zsh"): void {
	const rcFile = join(HOME, shell === "zsh" ? ".zshrc" : ".bashrc");
	const sourceBlock = readFileSync(
		join(ENV_SHELL_DIR, `claude-env.${shell}`),
		"utf8",
	);

	if (existsSync(rcFile)) {
		const existing = readFileSync(rcFile, "utf8");
		writeFileSync(
			rcFile,
			`${existing}
${sourceBlock}`,
		);
	} else {
		writeFileSync(rcFile, sourceBlock);
	}
}
