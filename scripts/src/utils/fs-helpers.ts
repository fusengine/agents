/**
 * Helpers pour les opérations fichiers
 */
import { existsSync, copyFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { $ } from "bun";

/**
 * Copie un fichier avec création du dossier destination
 */
export function copyFile(src: string, dest: string): boolean {
  if (!existsSync(src)) return false;

  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  return true;
}

/**
 * Copie un fichier et le rend exécutable
 */
export async function copyExecutable(
  src: string,
  dest: string
): Promise<boolean> {
  if (!copyFile(src, dest)) return false;
  await $`chmod +x ${dest}`.quiet();
  return true;
}

/**
 * Rend tous les scripts .sh exécutables dans un répertoire
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
 * Compare le contenu de deux fichiers
 */
export async function filesAreEqual(
  path1: string,
  path2: string
): Promise<boolean> {
  if (!existsSync(path1) || !existsSync(path2)) return false;

  const content1 = await Bun.file(path1).text();
  const content2 = await Bun.file(path2).text();
  return content1 === content2;
}
