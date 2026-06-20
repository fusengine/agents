/**
 * Dependency directory scanner
 * Single Responsibility: recursively locate plugin dirs holding a package.json
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Directory names never descended into during the scan */
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build"]);

/**
 * Recursively find every directory under `pluginsDir` that contains a
 * `package.json`. Excludes node_modules/.git/dist/build (never descends into
 * them). Iterative DFS (explicit stack) avoids stack overflow and prunes
 * excluded dirs before descending. Robust: readdir errors are non-fatal.
 *
 * @param pluginsDir - Root directory to scan
 * @returns Sorted, deduplicated absolute paths of dirs with a package.json
 */
export function findPluginDepDirs(pluginsDir: string): string[] {
	const results = new Set<string>();
	const stack: string[] = [pluginsDir];

	while (stack.length > 0) {
		const dir = stack.pop();
		if (!dir) continue;

		if (existsSync(join(dir, "package.json"))) results.add(dir);

		try {
			for (const entry of readdirSync(dir, { withFileTypes: true })) {
				if (!entry.isDirectory()) continue;
				if (SKIP_DIRS.has(entry.name)) continue;
				stack.push(join(dir, entry.name));
			}
		} catch {
			// permission denied or broken symlink — non-fatal, skip
		}
	}

	return [...results].sort();
}
