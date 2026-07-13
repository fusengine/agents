/**
 * Tests for ensureDeps: wipe repair, nominal no-op, concurrency single-flight,
 * and fail-open on a throwing installer. The real `bun install` is never
 * invoked — every test injects a fake installer (DI), per ensureDeps' design.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DepsTarget } from "../interfaces/ensure-deps";
import { ensureDeps } from "../services/ensure-deps";

const TEST_DIR = "/tmp/fusengine-test-ensure-deps";
const LOCK_DIR = join(tmpdir(), "fusengine-ensure-deps");

function makeTarget(name: string): DepsTarget {
	const dir = join(TEST_DIR, name);
	return { dir, marker: join(dir, "node_modules/marker.txt"), label: name };
}

beforeEach(() => {
	rmSync(TEST_DIR, { recursive: true, force: true });
	rmSync(LOCK_DIR, { recursive: true, force: true });
});

afterEach(() => {
	rmSync(TEST_DIR, { recursive: true, force: true });
	rmSync(LOCK_DIR, { recursive: true, force: true });
});

describe("ensureDeps", () => {
	test("nominal: marker already present → zero installs", async () => {
		const target = makeTarget("nominal");
		mkdirSync(join(target.dir, "node_modules"), { recursive: true });
		writeFileSync(target.marker, "ok");
		writeFileSync(join(target.dir, "package.json"), "{}");

		let calls = 0;
		await ensureDeps([target], async () => {
			calls++;
		});

		expect(calls).toBe(0);
	});

	test("wipe: marker missing → installer called once with the right cwd, marker repaired", async () => {
		const target = makeTarget("wiped");
		mkdirSync(target.dir, { recursive: true });
		writeFileSync(join(target.dir, "package.json"), "{}");

		const calls: string[] = [];
		await ensureDeps([target], async (dir) => {
			calls.push(dir);
			mkdirSync(join(target.dir, "node_modules"), { recursive: true });
			writeFileSync(target.marker, "installed");
		});

		expect(calls).toEqual([target.dir]);
	});

	test("no package.json → skipped, installer never called", async () => {
		const target = makeTarget("empty");
		mkdirSync(target.dir, { recursive: true });

		let calls = 0;
		await ensureDeps([target], async () => {
			calls++;
		});

		expect(calls).toBe(0);
	});

	test("concurrency: two racing ensureDeps calls install only once (single-flight)", async () => {
		const target = makeTarget("race");
		mkdirSync(target.dir, { recursive: true });
		writeFileSync(join(target.dir, "package.json"), "{}");

		let calls = 0;
		const slowInstall = async (dir: string) => {
			calls++;
			await new Promise((r) => setTimeout(r, 50));
			mkdirSync(join(dir, "node_modules"), { recursive: true });
			writeFileSync(target.marker, "installed");
		};

		await Promise.all([
			ensureDeps([target], slowInstall),
			ensureDeps([target], slowInstall),
		]);

		expect(calls).toBe(1);
	});

	test("fail-open: a throwing installer does not propagate", async () => {
		const target = makeTarget("throws");
		mkdirSync(target.dir, { recursive: true });
		writeFileSync(join(target.dir, "package.json"), "{}");

		await expect(
			ensureDeps([target], async () => {
				throw new Error("network down");
			}),
		).resolves.toBeUndefined();
	});
});
