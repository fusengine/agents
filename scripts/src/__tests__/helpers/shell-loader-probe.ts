/**
 * Helpers for the shell env-loader sandbox tests: seed a temp HOME with a
 * fixture ~/.claude/.env, run a REAL loader from scripts/env-shell/ in a
 * subprocess, and report which keys it exported.
 *
 * The child env is built from scratch rather than spread from process.env:
 * the developer's own BASH_ENV would otherwise make bash source the real
 * ~/.claude/.env and turn a passing filter into a false failure.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const ENV_SHELL_DIR = join(import.meta.dir, "..", "..", "..", "env-shell");

/** Fixture .env: FUSE_* to filter, an API key to keep, and quoting edge cases. */
export const FIXTURE_ENV = `export FUSE_HARNESS_REFS="/some/claude/path"
export FUSE_SOLID_MAX_LINES=100
export CONTEXT7_API_KEY="ctx7-abc123"
QUOTED_HASH="a#b"
TRAIL=value # comment
SINGLE='single quoted'
SPACED="two words"
# pure comment line
`;

/** Keys the probe reports on, in order. */
export const PROBE_KEYS = [
	"FUSE_HARNESS_REFS",
	"FUSE_SOLID_MAX_LINES",
	"CONTEXT7_API_KEY",
	"QUOTED_HASH",
	"TRAIL",
	"SINGLE",
	"SPACED",
] as const;

/** What every loader must produce from FIXTURE_ENV: no FUSE_*, values exact. */
export const EXPECTED: Record<string, string> = {
	FUSE_HARNESS_REFS: "<absent>",
	FUSE_SOLID_MAX_LINES: "<absent>",
	CONTEXT7_API_KEY: "ctx7-abc123",
	QUOTED_HASH: "a#b",
	TRAIL: "value",
	SINGLE: "single quoted",
	SPACED: "two words",
};

/** POSIX snippet printing `KEY=value`, or `KEY=<absent>` when unset. */
export const PROBE = PROBE_KEYS.map(
	(k) =>
		`if [ -n "\${${k}+x}" ]; then printf '%s=%s\\n' ${k} "$${k}"; else printf '%s=<absent>\\n' ${k}; fi`,
).join("\n");

/** Write the fixture .env into <home>/.claude/.env and return its path. */
export function seedSandboxEnv(home: string): string {
	const envPath = join(home, ".claude", ".env");
	mkdirSync(dirname(envPath), { recursive: true });
	writeFileSync(envPath, FIXTURE_ENV);
	return envPath;
}

/**
 * Extract the loader block install-env.sh appends to .bashrc/.zshrc, i.e. the
 * text between the quoted heredoc delimiters — exactly what lands on disk.
 */
export function emittedPosixBlock(): string {
	const script = readFileSync(join(ENV_SHELL_DIR, "install-env.sh"), "utf8");
	const marker = "<< 'POSIX_LOADER'\n";
	const body = script.slice(script.indexOf(marker) + marker.length);
	return body.slice(0, body.indexOf("\nPOSIX_LOADER\n"));
}

/** Run argv with a pristine env (HOME = sandbox) and parse the probe output. */
export async function runProbe(
	argv: string[],
	home: string,
	extraEnv: Record<string, string> = {},
): Promise<Record<string, string>> {
	const proc = Bun.spawn(argv, {
		env: { HOME: home, PATH: process.env.PATH ?? "", ...extraEnv },
		stdout: "pipe",
		stderr: "pipe",
	});
	const [stdout, exitCode] = await Promise.all([
		new Response(proc.stdout).text(),
		proc.exited,
	]);
	if (exitCode !== 0) {
		const stderr = await new Response(proc.stderr).text();
		throw new Error(`probe exited ${exitCode}: ${stderr}`);
	}
	return Object.fromEntries(
		stdout
			.split("\n")
			.filter(Boolean)
			.map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
	);
}
