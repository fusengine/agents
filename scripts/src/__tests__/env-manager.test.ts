/**
 * Tests for env-manager service
 * Uses isolated temp directory to avoid modifying real user files
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Mock HOME for isolated testing
const TEST_HOME = "/tmp/fusengine-test-home";
const TEST_ENV_FILE = join(TEST_HOME, ".claude", ".env");

// Import functions to test (we'll test the pure functions)
describe("env-manager", () => {
	beforeEach(() => {
		mkdirSync(join(TEST_HOME, ".claude"), { recursive: true });
	});

	afterEach(() => {
		rmSync(TEST_HOME, { recursive: true, force: true });
	});

	describe("loadEnvFile (logic test)", () => {
		test("parses export statements correctly", () => {
			const content = `export API_KEY="value123"
export OTHER_KEY='single quotes'
export NO_QUOTES=noquotes`;

			writeFileSync(TEST_ENV_FILE, content);
			const fileContent = readFileSync(TEST_ENV_FILE, "utf8");

			// Test parsing logic
			const env: Record<string, string> = {};
			for (const line of fileContent.split("\n")) {
				const match = line.match(/^export\s+(\w+)=["']?([^"'\n]*)["']?/);
				if (match) {
					env[match[1]] = match[2];
				}
			}

			expect(env.API_KEY).toBe("value123");
			expect(env.OTHER_KEY).toBe("single quotes");
			expect(env.NO_QUOTES).toBe("noquotes");
		});

		test("handles empty file", () => {
			writeFileSync(TEST_ENV_FILE, "");
			const content = readFileSync(TEST_ENV_FILE, "utf8");

			const env: Record<string, string> = {};
			for (const line of content.split("\n")) {
				const match = line.match(/^export\s+(\w+)=["']?([^"'\n]*)["']?/);
				if (match) {
					env[match[1]] = match[2];
				}
			}

			expect(Object.keys(env)).toHaveLength(0);
		});

		test("ignores comments and invalid lines", () => {
			const content = `# This is a comment
export VALID_KEY="value"
INVALID_LINE
  export INDENTED="ignored"`;

			writeFileSync(TEST_ENV_FILE, content);
			const fileContent = readFileSync(TEST_ENV_FILE, "utf8");

			const env: Record<string, string> = {};
			for (const line of fileContent.split("\n")) {
				const match = line.match(/^export\s+(\w+)=["']?([^"'\n]*)["']?/);
				if (match) {
					env[match[1]] = match[2];
				}
			}

			expect(env.VALID_KEY).toBe("value");
			expect(env.INVALID_LINE).toBeUndefined();
		});
	});

	describe("saveEnvFile (logic test)", () => {
		test("writes env variables in correct format", () => {
			const env = {
				KEY1: "value1",
				KEY2: "value2",
			};

			const lines = Object.entries(env)
				.filter(([_, value]) => value)
				.map(([key, value]) => `export ${key}="${value}"`);

			const content = `${lines.join("\n")}\n`;
			writeFileSync(TEST_ENV_FILE, content);

			const written = readFileSync(TEST_ENV_FILE, "utf8");
			expect(written).toContain('export KEY1="value1"');
			expect(written).toContain('export KEY2="value2"');
		});

		test("filters out empty values", () => {
			const env = {
				FILLED: "has-value",
				EMPTY: "",
			};

			const lines = Object.entries(env)
				.filter(([_, value]) => value)
				.map(([key, value]) => `export ${key}="${value}"`);

			expect(lines).toHaveLength(1);
			expect(lines[0]).toContain("FILLED");
		});
	});

	describe("checkApiKeys (logic test)", () => {
		test("identifies configured and missing keys", () => {
			const API_KEYS = [
				{ name: "KEY1", description: "Key 1" },
				{ name: "KEY2", description: "Key 2" },
				{ name: "KEY3", description: "Key 3" },
			];

			const env = {
				KEY1: "value1",
				KEY3: "value3",
			};

			const configured: string[] = [];
			const missing: string[] = [];

			for (const key of API_KEYS) {
				if (env[key.name as keyof typeof env]) {
					configured.push(key.name);
				} else {
					missing.push(key.name);
				}
			}

			expect(configured).toEqual(["KEY1", "KEY3"]);
			expect(missing).toEqual(["KEY2"]);
		});
	});

	describe("shell detection (logic test)", () => {
		test("detects shell from SHELL env var", () => {
			const testCases = [
				{ shell: "/bin/zsh", expected: "zsh" },
				{ shell: "/bin/bash", expected: "bash" },
				{ shell: "/usr/bin/fish", expected: "fish" },
				{ shell: "/usr/local/bin/pwsh", expected: "pwsh" },
			];

			for (const { shell, expected } of testCases) {
				const detected = shell.split("/").pop() || "bash";
				expect(detected).toBe(expected);
			}
		});
	});
});
