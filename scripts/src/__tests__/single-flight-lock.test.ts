/**
 * Tests for the single-flight file lock primitive.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { tryAcquireLock } from "../utils/single-flight-lock";

const LOCK_DIR = join(tmpdir(), "fusengine-ensure-deps");
const KEY = "/tmp/fusengine-test-lock-target";

describe("tryAcquireLock", () => {
	beforeEach(() => {
		mkdirSync(LOCK_DIR, { recursive: true });
	});

	afterEach(() => {
		rmSync(LOCK_DIR, { recursive: true, force: true });
	});

	test("acquires a free lock and returns a release function", () => {
		const release = tryAcquireLock(KEY);

		expect(typeof release).toBe("function");
		release?.();
	});

	test("a second acquire on the same key fails while the first holds it", () => {
		const release = tryAcquireLock(KEY);
		expect(release).not.toBeNull();

		const second = tryAcquireLock(KEY);
		expect(second).toBeNull();

		release?.();
	});

	test("acquiring again after release succeeds", () => {
		const release = tryAcquireLock(KEY);
		release?.();

		const reacquired = tryAcquireLock(KEY);
		expect(reacquired).not.toBeNull();
		reacquired?.();
	});

	test("reclaims a stale lock (older than staleMs) exactly once", () => {
		const slug = KEY.replace(/[^a-zA-Z0-9]+/g, "_");
		const lockPath = join(LOCK_DIR, `${slug}.lock`);
		writeFileSync(lockPath, JSON.stringify({ pid: 999999, ts: Date.now() - 1000 }));

		const release = tryAcquireLock(KEY, 500); // staleMs=500, lock is 1000ms old

		expect(release).not.toBeNull();
		release?.();
	});

	test("does not reclaim a fresh lock", () => {
		const release = tryAcquireLock(KEY, 120_000);
		expect(release).not.toBeNull();

		const second = tryAcquireLock(KEY, 120_000);
		expect(second).toBeNull();

		release?.();
	});
});
