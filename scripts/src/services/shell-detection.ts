/**
 * Shell detection utilities
 * Single Responsibility: Detect and check shell configuration
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const HOME = process.env.HOME || process.env.USERPROFILE || "";
const IS_WINDOWS = process.platform === "win32";

/** Detect user's shell */
export function detectShell(): "bash" | "zsh" | "fish" | "pwsh" {
	if (IS_WINDOWS) return "pwsh";

	const shell = process.env.SHELL?.split("/").pop() || "bash";
	if (shell === "fish") return "fish";
	if (shell === "zsh") return "zsh";
	if (shell === "pwsh" || shell === "powershell") return "pwsh";
	return "bash";
}

/** Return PowerShell profile path based on OS */
export function getPowershellProfilePath(): string {
	if (IS_WINDOWS) {
		return join(
			HOME,
			"Documents",
			"PowerShell",
			"Microsoft.PowerShell_profile.ps1",
		);
	}
	return join(
		HOME,
		".config",
		"powershell",
		"Microsoft.PowerShell_profile.ps1",
	);
}

/** Check if shell is already configured */
export function isShellConfigured(shell: string): boolean {
	switch (shell) {
		case "fish": {
			const fishConf = join(
				HOME,
				".config",
				"fish",
				"conf.d",
				"claude-env.fish",
			);
			return existsSync(fishConf);
		}
		case "pwsh": {
			const psProfile = getPowershellProfilePath();
			if (!existsSync(psProfile)) return false;
			return readFileSync(psProfile, "utf8").includes("claude");
		}
		default: {
			const rcFile = join(HOME, shell === "zsh" ? ".zshrc" : ".bashrc");
			if (!existsSync(rcFile)) return false;
			return readFileSync(rcFile, "utf8").includes("claude");
		}
	}
}
