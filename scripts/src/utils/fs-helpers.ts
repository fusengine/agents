/**
 * Helpers for file operations
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { $ } from "bun";

/**
 * Copy a file, creating the destination directory
 */
export function copyFile(src: string, dest: string): boolean {
	if (!existsSync(src)) return false;

	mkdirSync(dirname(dest), { recursive: true });
	copyFileSync(src, dest);
	return true;
}

/**
 * Copy a file and make it executable
 */
export async function copyExecutable(
	src: string,
	dest: string,
): Promise<boolean> {
	if (!copyFile(src, dest)) return false;
	await $`chmod +x ${dest}`.quiet();
	return true;
}

/**
 * Make every .sh script in a directory executable
 */
export async function makeScriptsExecutable(dir: string): Promise<number> {
	const result = await $`find ${dir} -name "*.sh" -type f`.quiet();
	const files = result.text().trim().split("\n").filter(Boolean);
	for (const file of files) {
		await $`chmod +x ${file}`.quiet();
	}
	return files.length;
}

/**
 * Install bun dependencies in a plugin directory
 */
export async function installPluginDeps(dir: string): Promise<boolean> {
	if (!existsSync(join(dir, "package.json"))) return false;
	const result = await $`cd ${dir} && bun install --silent`.quiet().nothrow();
	return result.exitCode === 0;
}

/**
 * Compare the contents of two files
 */
export async function filesAreEqual(
	path1: string,
	path2: string,
): Promise<boolean> {
	if (!existsSync(path1) || !existsSync(path2)) return false;

	const content1 = await Bun.file(path1).text();
	const content2 = await Bun.file(path2).text();
	return content1 === content2;
}
