/**
 * Environment file read/write service
 * Single Responsibility: Read and write .env file
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const HOME = process.env.HOME || process.env.USERPROFILE || "";
export const ENV_FILE = join(HOME, ".claude", ".env");

/**
 * Read existing variables from .env file
 */
export function loadEnvFile(): Record<string, string> {
	if (!existsSync(ENV_FILE)) return {};

	const content = readFileSync(ENV_FILE, "utf8");
	const env: Record<string, string> = {};

	for (const line of content.split("\n")) {
		const match = line.match(/^export\s+(\w+)=["']?([^"'\n]*)["']?/);
		if (match) {
			env[match[1]] = match[2];
		}
	}

	return env;
}

/**
 * Save variables to .env file
 */
export function saveEnvFile(env: Record<string, string>): void {
	mkdirSync(dirname(ENV_FILE), { recursive: true });
	const lines = Object.entries(env)
		.filter(([_, value]) => value)
		.map(([key, value]) => `export ${key}="${value}"`);

	writeFileSync(ENV_FILE, `${lines.join("\n")}\n`);
}
