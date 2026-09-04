/**
 * E2E sandbox test for the ~/.zshenv shim. Claude Code spawns NON-interactive
 * zsh (`zsh -c`), which reads ~/.zshenv only: the loader block in ~/.zshrc is
 * invisible to it, so without the shim API keys never reach it — and a raw
 * `. ~/.claude/.env` there would leak the per-harness FUSE_* keys instead.
 *
 * Both installers (install-env.sh and the TS installZshEnvShim) must append
 * ONE line pointing at the FUSE_*-filtered shim, idempotently, without
 * touching pre-existing user content. Real HOME is never touched: each case
 * runs in a mkdtemp() sandbox that zsh reaches through HOME and ZDOTDIR.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ZSHENV_LOADER_LINE } from "../services/shell-installers";
import { ENV_SHELL_DIR } from "./helpers/shell-loader-probe";

const INSTALL_SH = join(ENV_SHELL_DIR, "install-env.sh");
const INSTALLERS_TS = join(import.meta.dir, "..", "services", "shell-installers.ts");
const USER_CONTENT = "# user stuff\nexport MY_USER_VAR=keep\n";

let tmpHome: string;
let tmpZdotdir: string;

beforeEach(() => {
	tmpHome = mkdtempSync(join(tmpdir(), "fusengine-zshenv-shim-sandbox-"));
	mkdirSync(join(tmpHome, ".claude"), { recursive: true });
	writeFileSync(join(tmpHome, ".claude", ".env"), 'export FOO_KEY="abc"\nexport FUSE_PRD="1"\n');
	tmpZdotdir = mkdtempSync(join(tmpdir(), "fusengine-zshenv-shim-zdotdir-"));
});

afterEach(() => {
	rmSync(tmpHome, { recursive: true, force: true });
	rmSync(tmpZdotdir, { recursive: true, force: true });
});

/** Spawn argv with HOME pointed at the sandbox; throws on non-zero exit. */
async function runInSandbox(argv: string[], extraEnv: Record<string, string> = {}): Promise<string> {
	const proc = Bun.spawn(argv, {
		env: { HOME: tmpHome, USERPROFILE: tmpHome, PATH: process.env.PATH ?? "", USER: process.env.USER ?? "", ...extraEnv },
		stdout: "pipe",
		stderr: "pipe",
	});
	const [stdout, exitCode] = await Promise.all([new Response(proc.stdout).text(), proc.exited]);
	if (exitCode !== 0) {
		throw new Error(`${argv[0]} exited ${exitCode}: ${await new Response(proc.stderr).text()}`);
	}
	return stdout;
}

/** What Claude Code's non-interactive `zsh -c` sees, given ZDOTDIR (defaults to HOME, zsh's own fallback). */
const zshSees = (zdotdir: string = tmpHome) =>
	runInSandbox(["zsh", "-c", 'printf "FOO=%s PRD=%s" "$FOO_KEY" "$FUSE_PRD"'], { ZDOTDIR: zdotdir });

const INSTALLERS: [string, (extraEnv?: Record<string, string>) => Promise<string>][] = [
	["install-env.sh", (extraEnv) => runInSandbox(["bash", INSTALL_SH], extraEnv)],
	[
		"installZshEnvShim (TS)",
		(extraEnv) =>
			runInSandbox(
				[process.execPath, "-e", `const m = await import(${JSON.stringify(INSTALLERS_TS)}); m.installZshEnvShim();`],
				extraEnv,
			),
	],
];

describe.skipIf(!Bun.which("zsh"))("~/.zshenv shim: non-interactive zsh gets API keys, never FUSE_*", () => {
	test("negative control: without the shim line, zsh -c sees nothing from ~/.claude/.env", async () => {
		expect(await zshSees()).toBe("FOO= PRD=");
	});

	test("both installers write the same loader line", () => {
		const script = readFileSync(INSTALL_SH, "utf8");
		expect(script).toContain(`ZSHENV_LOADER_LINE='${ZSHENV_LOADER_LINE}'`);
	});

	test.each(INSTALLERS)("%s: two runs append the loader line exactly once, shim copied", async (_n, install) => {
		await install();
		await install();
		const zshenv = readFileSync(join(tmpHome, ".zshenv"), "utf8");
		expect(zshenv.split(ZSHENV_LOADER_LINE).length - 1).toBe(1);
		const shim = join(tmpHome, ".claude", "bash-env-loader.sh");
		expect(existsSync(shim)).toBe(true);
		expect(readFileSync(shim, "utf8")).toBe(readFileSync(join(ENV_SHELL_DIR, "bash-env-loader.sh"), "utf8"));
	});

	test.each(INSTALLERS)("%s: zsh -c then sees FOO_KEY=abc and no FUSE_PRD", async (_n, install) => {
		await install();
		expect(await zshSees()).toBe("FOO=abc PRD=");
	});

	test.each(INSTALLERS)("%s: pre-existing ~/.zshenv user content is preserved (append, never overwrite)", async (_n, install) => {
		writeFileSync(join(tmpHome, ".zshenv"), USER_CONTENT);
		await install();
		const zshenv = readFileSync(join(tmpHome, ".zshenv"), "utf8");
		expect(zshenv.startsWith(USER_CONTENT)).toBe(true);
		expect(zshenv).toContain(ZSHENV_LOADER_LINE);
	});

	// zimfw/prezto/chezmoi relocate zsh dotfiles via $ZDOTDIR — zsh then reads
	// $ZDOTDIR/.zshenv INSTEAD OF $HOME/.zshenv (zsh manual, STARTUP/SHUTDOWN
	// FILES). $ZDOTDIR here is a real directory distinct from $HOME, unlike
	// the other tests above where zsh's own ZDOTDIR-unset fallback (= HOME)
	// makes the distinction moot.
	test.each(INSTALLERS)("%s: with $ZDOTDIR set, writes $ZDOTDIR/.zshenv, not $HOME/.zshenv", async (_n, install) => {
		await install({ ZDOTDIR: tmpZdotdir });
		const zdotdirZshenv = join(tmpZdotdir, ".zshenv");
		expect(existsSync(zdotdirZshenv)).toBe(true);
		expect(readFileSync(zdotdirZshenv, "utf8")).toContain(ZSHENV_LOADER_LINE);
		expect(existsSync(join(tmpHome, ".zshenv"))).toBe(false);
		expect(await zshSees(tmpZdotdir)).toBe("FOO=abc PRD=");
	});
});
