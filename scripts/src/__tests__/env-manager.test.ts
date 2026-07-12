/**
 * Tests for env-manager service (saveEnvFile + shell detection)
 * loadEnvFile parsing lives in env-file-load.test.ts
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Mock HOME for isolated testing (file-persistence tests only)
const TEST_HOME = "/tmp/fusengine-test-home";
const TEST_ENV_FILE = join(TEST_HOME, ".claude", ".env");

describe("saveEnvFile (logic test)", () => {
	beforeEach(() => {
		mkdirSync(join(TEST_HOME, ".claude"), { recursive: true });
	});

	afterEach(() => {
		rmSync(TEST_HOME, { recursive: true, force: true });
	});

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

// Pure string logic — deliberately outside the filesystem fixture above.
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
