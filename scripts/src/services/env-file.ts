/**
 * Environment file read/write service
 * Single Responsibility: Read and write .env file
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const HOME = process.env.HOME || process.env.USERPROFILE || "";
export const ENV_FILE = join(HOME, ".claude", ".env");

/** Matches a single `export KEY=value` line, as written by saveEnvFile. */
const KV_LINE = /^export\s+(\w+)=["']?([^"'\n]*)["']?/;

/**
 * Read existing variables from .env file
 */
export function loadEnvFile(): Record<string, string> {
	if (!existsSync(ENV_FILE)) return {};

	const content = readFileSync(ENV_FILE, "utf8");
	const env: Record<string, string> = {};

	for (const line of content.split("\n")) {
		const match = line.match(KV_LINE);
		if (match) {
			env[match[1]] = match[2];
		}
	}

	return env;
}

/** Save variables to .env file, preserving comments/blank/non-export lines verbatim. */
export function saveEnvFile(env: Record<string, string>): void {
	mkdirSync(dirname(ENV_FILE), { recursive: true });

	if (!existsSync(ENV_FILE)) {
		const lines = Object.entries(env)
			.filter(([_, value]) => value)
			.map(([key, value]) => `export ${key}="${value}"`);
		writeFileSync(ENV_FILE, `${lines.join("\n")}\n`);
		return;
	}

	const content = readFileSync(ENV_FILE, "utf8");
	const matchedKeys = new Set<string>();
	const lines: string[] = [];
	// Strip a trailing-newline artifact: the write below always re-appends `\n`.
	const stripped = content.endsWith("\n") ? content.slice(0, -1) : content;
	const sourceLines = stripped === "" ? [] : stripped.split("\n");

	for (const line of sourceLines) {
		const match = line.match(KV_LINE);
		if (!match) {
			lines.push(line);
			continue;
		}
		const key = match[1];
		matchedKeys.add(key);
		// Object.hasOwn guards against inherited/prototype keys (e.g. "__proto__"),
		// matching the previous writer's Object.entries()-only semantics.
		if (Object.hasOwn(env, key) && env[key]) {
			lines.push(`export ${key}="${env[key]}"`);
		}
	}

	for (const [key, value] of Object.entries(env)) {
		if (value && !matchedKeys.has(key)) {
			lines.push(`export ${key}="${value}"`);
		}
	}

	writeFileSync(ENV_FILE, `${lines.join("\n")}\n`);
}

/**
 * Idempotently write/update a single variable in .env file.
 * Replaces the existing value if the key is already present, else appends it.
 * @param name - Variable name (e.g. "FUSE_HARNESS_REFS")
 * @param value - Variable value to persist
 */
export function upsertEnvVar(name: string, value: string): void {
	const env = loadEnvFile();
	env[name] = value;
	saveEnvFile(env);
}

/**
 * Remove a single variable from .env file, if present.
 * @param name - Variable name to remove (e.g. "FUSE_ENFORCE_GEMINI_MCP")
 */
export function removeEnvVar(name: string): void {
	const env = loadEnvFile();
	delete env[name];
	saveEnvFile(env);
}
