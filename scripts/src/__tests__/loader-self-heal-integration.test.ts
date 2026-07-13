/**
 * Integration test: proves hooks-loader.ts's exact self-heal composition
 * (`ensureDeps(getManagedDepsTargets(scriptsDir, pluginsDir))`, the same call
 * `main()` makes as its very first statement) boots and repairs a fully
 * wiped scripts/node_modules — without touching the real dev machine's
 * marketplace clone or invoking a real network `bun install`.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { DepsTarget } from "../interfaces/ensure-deps";
import { getManagedDepsTargets } from "../services/deps-targets";
import { ensureDeps } from "../services/ensure-deps";

const FAKE_MARKETPLACE = "/tmp/fusengine-test-loader-self-heal";
const FAKE_SCRIPTS_DIR = join(FAKE_MARKETPLACE, "scripts");
const FAKE_PLUGINS_DIR = join(FAKE_MARKETPLACE, "plugins");
const LOCK_DIR = join(tmpdir(), "fusengine-ensure-deps");

/** Create a target's marker (directory marker for statusline, file marker otherwise). */
function createMarker(target: DepsTarget): void {
	if (target.marker.endsWith("node_modules")) {
		mkdirSync(target.marker, { recursive: true });
	} else {
		mkdirSync(dirname(target.marker), { recursive: true });
		writeFileSync(target.marker, "installed");
	}
}

beforeEach(() => {
	rmSync(FAKE_MARKETPLACE, { recursive: true, force: true });
	rmSync(LOCK_DIR, { recursive: true, force: true });
	mkdirSync(FAKE_SCRIPTS_DIR, { recursive: true });
	mkdirSync(FAKE_PLUGINS_DIR, { recursive: true });
	mkdirSync(join(FAKE_PLUGINS_DIR, "core-guards/statusline"), { recursive: true });
	// Simulate a wipe: package.json present, node_modules entirely absent.
	writeFileSync(join(FAKE_SCRIPTS_DIR, "package.json"), "{}");
	writeFileSync(join(FAKE_PLUGINS_DIR, "package.json"), "{}");
	writeFileSync(join(FAKE_PLUGINS_DIR, "core-guards/statusline/package.json"), "{}");
});

afterEach(() => {
	rmSync(FAKE_MARKETPLACE, { recursive: true, force: true });
	rmSync(LOCK_DIR, { recursive: true, force: true });
});

describe("hooks-loader self-heal (wipe simulation)", () => {
	test("boots without throwing and attempts repair for every wiped target", async () => {
		const targets = getManagedDepsTargets(FAKE_SCRIPTS_DIR, FAKE_PLUGINS_DIR);
		expect(targets).toHaveLength(3);
		for (const target of targets) expect(existsSync(target.marker)).toBe(false);

		const repaired: string[] = [];
		await ensureDeps(targets, async (dir) => {
			repaired.push(dir);
			const target = targets.find((t) => t.dir === dir);
			if (target) createMarker(target);
		});

		expect(repaired.sort()).toEqual(
			[FAKE_SCRIPTS_DIR, FAKE_PLUGINS_DIR, join(FAKE_PLUGINS_DIR, "core-guards/statusline")].sort(),
		);
		for (const target of targets) expect(existsSync(target.marker)).toBe(true);
	});

	test("re-running after repair is a pure no-op (all markers now present)", async () => {
		const targets = getManagedDepsTargets(FAKE_SCRIPTS_DIR, FAKE_PLUGINS_DIR);
		for (const target of targets) createMarker(target);

		let calls = 0;
		await ensureDeps(targets, async () => {
			calls++;
		});

		expect(calls).toBe(0);
	});
});
