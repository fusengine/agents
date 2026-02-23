/**
 * Tests for fs-helpers utilities
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
	existsSync,
	mkdirSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { copyExecutable, copyFile, filesAreEqual } from "../utils/fs-helpers";

const TEST_DIR = "/tmp/fusengine-test-fs";

describe("fs-helpers", () => {
	beforeEach(() => {
		mkdirSync(TEST_DIR, { recursive: true });
	});

	afterEach(() => {
		rmSync(TEST_DIR, { recursive: true, force: true });
	});

	describe("copyFile", () => {
		test("returns false if source does not exist", () => {
			const result = copyFile(
				join(TEST_DIR, "nonexistent.txt"),
				join(TEST_DIR, "dest.txt"),
			);
			expect(result).toBe(false);
		});

		test("copies file to destination", () => {
			const src = join(TEST_DIR, "source.txt");
			const dest = join(TEST_DIR, "dest.txt");
			writeFileSync(src, "hello world");

			const result = copyFile(src, dest);

			expect(result).toBe(true);
			expect(existsSync(dest)).toBe(true);
		});

		test("creates destination directory if not exists", () => {
			const src = join(TEST_DIR, "source.txt");
			const dest = join(TEST_DIR, "nested/deep/dest.txt");
			writeFileSync(src, "content");

			const result = copyFile(src, dest);

			expect(result).toBe(true);
			expect(existsSync(dest)).toBe(true);
		});

		test("preserves file content", () => {
			const src = join(TEST_DIR, "source.txt");
			const dest = join(TEST_DIR, "dest.txt");
			const content = "important content\nwith newlines";
			writeFileSync(src, content);

			copyFile(src, dest);

			const copied = require("node:fs").readFileSync(dest, "utf8");
			expect(copied).toBe(content);
		});

		test("overwrites existing destination", () => {
			const src = join(TEST_DIR, "source.txt");
			const dest = join(TEST_DIR, "dest.txt");
			writeFileSync(src, "new content");
			writeFileSync(dest, "old content");

			copyFile(src, dest);

			const copied = require("node:fs").readFileSync(dest, "utf8");
			expect(copied).toBe("new content");
		});
	});

	describe("copyExecutable", () => {
		test("returns false if source does not exist", async () => {
			const result = await copyExecutable(
				join(TEST_DIR, "nonexistent.sh"),
				join(TEST_DIR, "dest.sh"),
			);
			expect(result).toBe(false);
		});

		test("copies file and makes it executable", async () => {
			const src = join(TEST_DIR, "script.sh");
			const dest = join(TEST_DIR, "dest.sh");
			writeFileSync(src, "#!/bin/bash\necho hello");

			const result = await copyExecutable(src, dest);

			expect(result).toBe(true);
			expect(existsSync(dest)).toBe(true);

			// Check executable bit (on Unix)
			if (process.platform !== "win32") {
				const stats = statSync(dest);
				const isExecutable = (stats.mode & 0o111) !== 0;
				expect(isExecutable).toBe(true);
			}
		});

		test("creates destination directory", async () => {
			const src = join(TEST_DIR, "script.sh");
			const dest = join(TEST_DIR, "bin/nested/script.sh");
			writeFileSync(src, "#!/bin/bash");

			const result = await copyExecutable(src, dest);

			expect(result).toBe(true);
			expect(existsSync(dest)).toBe(true);
		});
	});

	describe("filesAreEqual", () => {
		test("returns false if first file does not exist", async () => {
			const existing = join(TEST_DIR, "existing.txt");
			writeFileSync(existing, "content");

			const result = await filesAreEqual(
				join(TEST_DIR, "nonexistent.txt"),
				existing,
			);

			expect(result).toBe(false);
		});

		test("returns false if second file does not exist", async () => {
			const existing = join(TEST_DIR, "existing.txt");
			writeFileSync(existing, "content");

			const result = await filesAreEqual(
				existing,
				join(TEST_DIR, "nonexistent.txt"),
			);

			expect(result).toBe(false);
		});

		test("returns true for identical files", async () => {
			const file1 = join(TEST_DIR, "file1.txt");
			const file2 = join(TEST_DIR, "file2.txt");
			const content = "identical content\nwith multiple lines";
			writeFileSync(file1, content);
			writeFileSync(file2, content);

			const result = await filesAreEqual(file1, file2);

			expect(result).toBe(true);
		});

		test("returns false for different files", async () => {
			const file1 = join(TEST_DIR, "file1.txt");
			const file2 = join(TEST_DIR, "file2.txt");
			writeFileSync(file1, "content A");
			writeFileSync(file2, "content B");

			const result = await filesAreEqual(file1, file2);

			expect(result).toBe(false);
		});

		test("returns false for files with different whitespace", async () => {
			const file1 = join(TEST_DIR, "file1.txt");
			const file2 = join(TEST_DIR, "file2.txt");
			writeFileSync(file1, "content");
			writeFileSync(file2, "content ");

			const result = await filesAreEqual(file1, file2);

			expect(result).toBe(false);
		});

		test("handles empty files", async () => {
			const file1 = join(TEST_DIR, "empty1.txt");
			const file2 = join(TEST_DIR, "empty2.txt");
			writeFileSync(file1, "");
			writeFileSync(file2, "");

			const result = await filesAreEqual(file1, file2);

			expect(result).toBe(true);
		});

		test("handles large files", async () => {
			const file1 = join(TEST_DIR, "large1.txt");
			const file2 = join(TEST_DIR, "large2.txt");
			const largeContent = "x".repeat(100000);
			writeFileSync(file1, largeContent);
			writeFileSync(file2, largeContent);

			const result = await filesAreEqual(file1, file2);

			expect(result).toBe(true);
		});
	});
});
