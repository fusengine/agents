/**
 * Browser binary service
 * Single Responsibility: ensure the managed Chromium binary for fuse-browser is present.
 */
import * as p from "@clack/prompts";

/** True if the Chromium download is disabled via env. */
export function isBrowserDownloadSkipped(): boolean {
	return Boolean(
		process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD ||
			process.env.FUSE_SKIP_BROWSER_DOWNLOAD,
	);
}

/**
 * Install the patchright Chromium build matching the @latest browser-mcp.
 * Non-fatal + idempotent; respects the skip env vars.
 * @returns true if the install ran successfully, false if skipped/failed.
 */
export async function installBrowserBinary(): Promise<boolean> {
	if (isBrowserDownloadSkipped()) {
		p.log.info("fuse-browser: Chromium download skipped (env)");
		return false;
	}
	const s = p.spinner();
	s.start("fuse-browser: installing Chromium (version-matched)...");
	const proc = Bun.spawnSync(
		["npx", "-y", "--package=@fusengine/browser-mcp@latest", "patchright", "install", "chromium"],
		{ stdout: "inherit", stderr: "inherit" },
	);
	if (proc.exitCode === 0) {
		s.stop("fuse-browser: Chromium ready");
		return true;
	}
	s.stop("fuse-browser: Chromium install skipped/failed (non-fatal). Manual: npx patchright install chromium");
	return false;
}
