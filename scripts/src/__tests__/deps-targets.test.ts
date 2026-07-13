/**
 * Tests for getManagedDepsTargets — the 3 self-heal targets.
 */
import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { getManagedDepsTargets } from "../services/deps-targets";

const SCRIPTS_DIR = "/fake/marketplace/scripts";
const PLUGINS_DIR = "/fake/marketplace/plugins";

describe("getManagedDepsTargets", () => {
	test("returns exactly 3 targets", () => {
		const targets = getManagedDepsTargets(SCRIPTS_DIR, PLUGINS_DIR);
		expect(targets).toHaveLength(3);
	});

	test("scripts target points at @clack/prompts marker", () => {
		const [scripts] = getManagedDepsTargets(SCRIPTS_DIR, PLUGINS_DIR);
		expect(scripts.dir).toBe(SCRIPTS_DIR);
		expect(scripts.marker).toBe(
			join(SCRIPTS_DIR, "node_modules/@clack/prompts/package.json"),
		);
	});

	test("plugins target points at the shared harness bin.mjs marker", () => {
		const [, plugins] = getManagedDepsTargets(SCRIPTS_DIR, PLUGINS_DIR);
		expect(plugins.dir).toBe(PLUGINS_DIR);
		expect(plugins.marker).toBe(
			join(PLUGINS_DIR, "node_modules/@fusengine/harness/dist/cli/bin.mjs"),
		);
	});

	test("statusline target points at core-guards/statusline/node_modules", () => {
		const [, , statusline] = getManagedDepsTargets(SCRIPTS_DIR, PLUGINS_DIR);
		const statuslineDir = join(PLUGINS_DIR, "core-guards/statusline");
		expect(statusline.dir).toBe(statuslineDir);
		expect(statusline.marker).toBe(join(statuslineDir, "node_modules"));
	});
});
