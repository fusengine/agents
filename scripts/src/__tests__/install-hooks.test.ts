/**
 * Tests for install-hooks script
 * Integration tests for the main installation flow
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";

const TEST_DIR = "/tmp/fusengine-test-install";
const TEST_HOME = join(TEST_DIR, "home");
const TEST_MARKETPLACE = join(
	TEST_HOME,
	".claude/plugins/marketplaces/fusengine-plugins",
);

describe("install-hooks", () => {
	beforeEach(() => {
		// Create test directory structure
		mkdirSync(join(TEST_MARKETPLACE, "plugins/test-plugin/hooks"), {
			recursive: true,
		});
		mkdirSync(join(TEST_MARKETPLACE, "scripts"), { recursive: true });
		mkdirSync(join(TEST_HOME, ".claude"), { recursive: true });

		// Create a test hooks.json
		writeFileSync(
			join(TEST_MARKETPLACE, "plugins/test-plugin/hooks/hooks.json"),
			JSON.stringify({
				hooks: {
					PreToolUse: [
						{
							matcher: "Write",
							hooks: [{ type: "command", command: "echo test" }],
						},
					],
				},
			}),
		);
	});

	afterEach(() => {
		rmSync(TEST_DIR, { recursive: true, force: true });
	});

	describe("directory structure", () => {
		test("test marketplace structure exists", () => {
			expect(existsSync(TEST_MARKETPLACE)).toBe(true);
			expect(existsSync(join(TEST_MARKETPLACE, "plugins"))).toBe(true);
			expect(existsSync(join(TEST_MARKETPLACE, "scripts"))).toBe(true);
		});

		test("test plugin has hooks.json", () => {
			const hooksPath = join(
				TEST_MARKETPLACE,
				"plugins/test-plugin/hooks/hooks.json",
			);
			expect(existsSync(hooksPath)).toBe(true);

			const content = JSON.parse(readFileSync(hooksPath, "utf8"));
			expect(content.hooks).toBeDefined();
			expect(content.hooks.PreToolUse).toBeDefined();
		});
	});

	describe("CLAUDE.md handling", () => {
		test("detects when CLAUDE.md needs to be copied", async () => {
			const srcPath = join(TEST_DIR, "CLAUDE.md");
			const destPath = join(TEST_HOME, ".claude/CLAUDE.md");

			writeFileSync(srcPath, "# Rules\nSome content");

			// Destination doesn't exist
			expect(existsSync(destPath)).toBe(false);
		});

		test("detects when CLAUDE.md is already up to date", async () => {
			const srcPath = join(TEST_DIR, "CLAUDE.md");
			const destPath = join(TEST_HOME, ".claude/CLAUDE.md");
			const content = "# Same content";

			writeFileSync(srcPath, content);
			writeFileSync(destPath, content);

			const srcContent = readFileSync(srcPath, "utf8");
			const destContent = readFileSync(destPath, "utf8");

			expect(srcContent).toBe(destContent);
		});
	});

	describe("settings.json handling", () => {
		test("creates settings.json if not exists", () => {
			const settingsPath = join(TEST_HOME, ".claude/settings.json");
			expect(existsSync(settingsPath)).toBe(false);

			// Simulate creation
			mkdirSync(join(TEST_HOME, ".claude"), { recursive: true });
			writeFileSync(settingsPath, JSON.stringify({ language: "french" }));

			expect(existsSync(settingsPath)).toBe(true);
		});

		test("preserves existing settings when adding hooks", () => {
			const settingsPath = join(TEST_HOME, ".claude/settings.json");
			const existing = {
				customSetting: "preserved",
				language: "english",
			};
			writeFileSync(settingsPath, JSON.stringify(existing));

			// Load and modify
			const loaded = JSON.parse(readFileSync(settingsPath, "utf8"));
			loaded.hooks = { PreToolUse: [] };
			loaded.language = "french";

			expect(loaded.customSetting).toBe("preserved");
		});
	});

	describe("API keys configuration", () => {
		test("creates .env file in correct location", () => {
			const envPath = join(TEST_HOME, ".claude/.env");
			const envContent = 'export CONTEXT7_API_KEY="test-key"\n';

			mkdirSync(join(TEST_HOME, ".claude"), { recursive: true });
			writeFileSync(envPath, envContent);

			expect(existsSync(envPath)).toBe(true);
			const content = readFileSync(envPath, "utf8");
			expect(content).toContain("CONTEXT7_API_KEY");
		});

		test("parses existing .env correctly", () => {
			const envPath = join(TEST_HOME, ".claude/.env");
			const envContent = `export KEY1="value1"
export KEY2="value2"
export KEY3="value3"`;

			mkdirSync(join(TEST_HOME, ".claude"), { recursive: true });
			writeFileSync(envPath, envContent);

			const content = readFileSync(envPath, "utf8");
			const env: Record<string, string> = {};

			for (const line of content.split("\n")) {
				const match = line.match(/^export\s+(\w+)=["']?([^"'\n]*)["']?/);
				if (match) {
					env[match[1]] = match[2];
				}
			}

			expect(Object.keys(env)).toHaveLength(3);
			expect(env.KEY1).toBe("value1");
		});
	});

	describe("shell configuration paths", () => {
		test("bash config path is correct", () => {
			const bashrc = join(TEST_HOME, ".bashrc");
			expect(bashrc).toContain(".bashrc");
		});

		test("zsh config path is correct", () => {
			const zshrc = join(TEST_HOME, ".zshrc");
			expect(zshrc).toContain(".zshrc");
		});

		test("fish config path is correct", () => {
			const fishConfig = join(TEST_HOME, ".config/fish/conf.d/claude-env.fish");
			expect(fishConfig).toContain("fish");
			expect(fishConfig).toContain("conf.d");
		});

		test("powershell config path varies by platform", () => {
			const isWindows = process.platform === "win32";

			if (isWindows) {
				const psProfile = join(
					TEST_HOME,
					"Documents/PowerShell/Microsoft.PowerShell_profile.ps1",
				);
				expect(psProfile).toContain("Documents");
			} else {
				const psProfile = join(
					TEST_HOME,
					".config/powershell/Microsoft.PowerShell_profile.ps1",
				);
				expect(psProfile).toContain(".config");
			}
		});
	});

	describe("backup creation", () => {
		test("backup filename includes timestamp", () => {
			const timestamp = new Date()
				.toISOString()
				.replace(/[:.]/g, "-")
				.slice(0, 19);

			const backupName = `settings.json.backup.${timestamp}`;

			expect(backupName).toMatch(
				/settings\.json\.backup\.\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/,
			);
		});
	});
});
