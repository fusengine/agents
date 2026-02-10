/**
 * project-detect.ts - Detect real project root from transcript file paths.
 * Solves CLAUDE_PROJECT_DIR bug: session CWD != target project.
 */
import { readdirSync } from "node:fs";

/** Definitive root markers (stop walking up immediately) */
const ROOT_MARKERS = [".git", ".hg", "turbo.json", "nx.json", "lerna.json", "pnpm-workspace.yaml"];
/** Package markers (possible root, keep looking up for monorepo root) */
const PKG_MARKERS = [
  "package.json", "composer.json", "Package.swift",
  "Cargo.toml", "go.mod", "pyproject.toml", "Gemfile", "pom.xml",
];

/** Detect project root by walking up from file paths to find root markers. */
export function detectProjectFromPaths(filePaths: string[]): string | null {
  if (filePaths.length === 0) return null;
  const firstPath = filePaths[0];
  if (!firstPath) return null;
  const lastSlash = firstPath.lastIndexOf("/");
  if (lastSlash <= 0) return null;
  let dir = firstPath.substring(0, lastSlash);
  let bestRoot: string | null = null;
  while (dir && dir !== "/" && dir.length > 1) {
    try {
      const entries = readdirSync(dir);
      if (ROOT_MARKERS.some((m) => entries.includes(m))) return dir;
      if (PKG_MARKERS.some((m) => entries.includes(m))) bestRoot = dir;
    } catch { break; }
    const parentSlash = dir.lastIndexOf("/");
    if (parentSlash <= 0) break;
    dir = dir.substring(0, parentSlash);
  }
  return bestRoot;
}

/** Extract all absolute file paths from tool_use entries in a JSONL transcript. */
export async function extractAllFilePaths(transcriptPath: string): Promise<string[]> {
  const text = await Bun.file(transcriptPath).text();
  const paths = new Set<string>();
  for (const line of text.split("\n").filter(Boolean)) {
    try {
      const entry = JSON.parse(line);
      const content = entry?.message?.content;
      if (!Array.isArray(content)) continue;
      for (const block of content) {
        if (block.type !== "tool_use") continue;
        const fp = block.input?.file_path ?? block.input?.path ?? "";
        if (typeof fp === "string" && fp.startsWith("/")) paths.add(fp);
      }
    } catch { /* skip malformed */ }
  }
  return [...paths];
}
