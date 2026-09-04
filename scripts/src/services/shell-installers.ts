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

/** Line appended to ~/.zshenv — must match install-env.sh's ZSHENV_LOADER_LINE. */
export const ZSHENV_LOADER_LINE =
	'[ -f "$HOME/.claude/bash-env-loader.sh" ] && . "$HOME/.claude/bash-env-loader.sh"';

/**
 * Copy the FUSE_*-filtered loader shim to ~/.claude/bash-env-loader.sh.
 * Sourced by non-interactive bash (BASH_ENV, fish) and zsh (~/.zshenv) so they
 * never source the raw .env, which would re-export the per-harness FUSE_* keys.
 */
export function installEnvShim(): void {
	const claudeDir = join(HOME, ".claude");
	mkdirSync(claudeDir, { recursive: true });
	copyFileSync(
		join(ENV_SHELL_DIR, "bash-env-loader.sh"),
		join(claudeDir, "bash-env-loader.sh"),
	);
}

/**
 * Point $ZDOTDIR/.zshenv (or ~/.zshenv when $ZDOTDIR is unset) at the shim:
 * non-interactive zsh (`zsh -c`, what Claude Code spawns on macOS whatever
 * the login shell) reads only that file, never ~/.zshrc. $ZDOTDIR/.zshenv is
 * read INSTEAD OF ~/.zshenv when $ZDOTDIR is set (zsh manual, STARTUP/
 * SHUTDOWN FILES) — a live convention (zimfw, prezto, chezmoi), not a
 * theoretical edge case. Append-only, exactly once; no-op when zsh is not
 * installed.
 */
export function installZshEnvShim(): void {
	if (!Bun.which("zsh")) return;
	installEnvShim();

	const zshenv = join(process.env.ZDOTDIR || HOME, ".zshenv");
	const existing = existsSync(zshenv) ? readFileSync(zshenv, "utf8") : "";
	if (existing.includes(ZSHENV_LOADER_LINE)) return;

	writeFileSync(
		zshenv,
		`${existing}
# Claude Code - non-interactive zsh: load ~/.claude/.env (FUSE_* excluded: per-harness)
${ZSHENV_LOADER_LINE}
`,
	);
}

/**
 * Install fish configuration, plus the BASH_ENV shim it points at.
 * The shim is required: claude-env.fish sets BASH_ENV to it so non-interactive
 * bash loads the FUSE_*-filtered loader instead of the raw ~/.claude/.env.
 */
export function installFishConfig(): void {
	const confDir = join(HOME, ".config", "fish", "conf.d");
	mkdirSync(confDir, { recursive: true });
	copyFileSync(
		join(ENV_SHELL_DIR, "claude-env.fish"),
		join(confDir, "claude-env.fish"),
	);

	installEnvShim(); // unconditional: BASH_ENV needs it even where zsh is absent
	installZshEnvShim();
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

/** Install bash/zsh configuration, plus the ~/.zshenv shim for `zsh -c`. */
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

	installZshEnvShim();
}
