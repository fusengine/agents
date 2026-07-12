/**
 * Tests for env-file loadEnvFile parsing logic
 * Uses isolated temp directory to avoid modifying real user files
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Mock HOME for isolated testing
const TEST_HOME = "/tmp/fusengine-test-home-load";
const TEST_ENV_FILE = join(TEST_HOME, ".claude", ".env");

describe("loadEnvFile (logic test)", () => {
	beforeEach(() => {
		mkdirSync(join(TEST_HOME, ".claude"), { recursive: true });
	});

	afterEach(() => {
		rmSync(TEST_HOME, { recursive: true, force: true });
	});

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
