/**
 * Metadata-aware reference router for SOLID skill references.
 * Parses frontmatter, caches ref index, scores references against file context.
 */
import { readTextFile, readJsonFile, writeJsonFile, hashText } from "../core";
import { acquireLock, ensureStateDir } from "./state";
import type { RefMeta, ScoredRef, RouteResult } from "../interfaces/ref-router.interface";

const SOLID_NAMES = new Set(["single-responsibility", "open-closed", "liskov-substitution", "interface-segregation", "dependency-inversion", "solid-principles"]);

/** Extract frontmatter key-value pairs from markdown content */
export function parseFrontmatter(content: string): Record<string, string> {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const result: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  }
  return result;
}

/** Load and cache reference index for a skill directory */
export async function loadRefIndex(skillDir: string): Promise<RefMeta[]> {
  const stateDir = await ensureStateDir();
  const hash = hashText(skillDir);
  const cachePath = `${stateDir}/ref-cache-${hash}.json`;
  const skillMd = `${skillDir}/SKILL.md`;
  const skillFile = Bun.file(skillMd);
  if (!(await skillFile.exists())) return [];
  const mtime = (await skillFile.stat()).mtime.toISOString();
  const cached = await readJsonFile<{ mtime: string; refs: RefMeta[] }>(cachePath);
  if (cached?.mtime === mtime) return cached.refs;

  const glob = new Bun.Glob("references/**/*.md");
  const refs: RefMeta[] = [];
  for await (const path of glob.scan({ cwd: skillDir })) {
    const full = `${skillDir}/${path}`;
    const fm = parseFrontmatter(await readTextFile(full));
    const basename = path.replace(/.*\//, "").replace(/\.md$/, "");
    const level = fm.level ?? (path.includes("templates/") ? "template" : SOLID_NAMES.has(basename) ? "principle" : "architecture");
    refs.push({ name: fm.name ?? basename, description: fm.description ?? "", keywords: fm.keywords ?? "", priority: fm.priority ?? "normal", related: fm.related ?? "", appliesTo: fm["applies-to"] ?? "", triggerOnEdit: fm["trigger-on-edit"] ?? "", level, filePath: full });
  }
  await writeJsonFile(cachePath, { mtime, refs }, true);
  return refs;
}

/** Convert a simple glob pattern to a RegExp */
function globToRe(g: string): RegExp {
  const escaped = g.trim().replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/\0/g, ".*");
  return new RegExp(`^${escaped}$`);
}

/** Score and route references for a given file edit */
export async function routeReferences(filePath: string, content: string, skillDir: string): Promise<RouteResult | null> {
  const refs = await loadRefIndex(skillDir);
  if (!refs.length) return null;
  const scored: ScoredRef[] = [];
  for (const meta of refs) {
    let score = 0;
    if (meta.appliesTo) for (const g of meta.appliesTo.split(", ")) { if (globToRe(g).test(filePath)) score += 10; }
    if (meta.triggerOnEdit) for (const frag of meta.triggerOnEdit.split(", ")) { if (filePath.includes(frag.trim())) score += 5; }
    if (meta.keywords) for (const kw of meta.keywords.split(", ")) { const k = kw.trim(); if (k && (filePath.includes(k) || content.includes(k))) score += 1; }
    if (score > 0) scored.push({ meta, score });
  }
  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);
  const hasPrinciple = scored.slice(0, 4).some(r => r.meta.level === "principle");
  const hasTemplate = scored.slice(0, 4).some(r => r.meta.level === "template");
  if (!hasPrinciple) { const p = scored.find(r => r.meta.level === "principle"); if (p) scored.splice(scored.indexOf(p), 1), scored.splice(3, 0, p); }
  if (!hasTemplate) { const t = scored.find(r => r.meta.level === "template"); if (t) scored.splice(scored.indexOf(t), 1), scored.splice(3, 0, t); }
  return { required: scored.slice(0, 2), optional: scored.slice(2, 4), skillPath: `${skillDir}/SKILL.md` };
}
