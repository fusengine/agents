#!/usr/bin/env bun
/**
 * install-hooks.ts - Hook system installation entry point
 * Uses @clack/prompts for modern UI
 */
import { dirname, join } from "node:path";
import * as p from "@clack/prompts";
import { runSetup } from "./src/services/setup-runner";

const HOME = process.env.HOME || process.env.USERPROFILE || "";
const SCRIPT_DIR = dirname(import.meta.path);
const PROJECT_ROOT = dirname(SCRIPT_DIR);

const PATHS = {
	settings: join(HOME, ".claude/settings.json"),
	marketplace: join(HOME, ".claude/plugins/marketplaces/fusengine-plugins"),
	loaderSrc: join(SCRIPT_DIR, "hooks-loader.ts"),
	claudeMdSrc: join(
		PROJECT_ROOT,
		"plugins/claude-rules/templates/CLAUDE.md.template",
	),
	claudeMdDest: join(HOME, ".claude/CLAUDE.md"),
};

async function main(): Promise<void> {
	const skipEnv = process.argv.includes("--skip-env");
	await runSetup(PATHS, skipEnv);
}

main().catch((e) => {
	p.log.error(e.message);
	process.exit(1);
});
