/**
 * Shared helpers for lesson cache scripts.
 * Provides stack detection, edit extraction, and categorization.
 * Aggregation/merge logic is in cache/lesson-aggregator.ts.
 */
import { readdirSync } from "node:fs";
import type { EditEntry } from "../interfaces/cache.interface";
export { aggregateLocalLessons, loadGlobalLessons, mergeLessons } from "./lesson-aggregator";

/** Detect the project stack from config files in the project root. */
export function detectStack(projectPath: string): string {
  try {
    const entries = readdirSync(projectPath);
    if (entries.some((f) => f.startsWith("next.config"))) return "nextjs";
    if (entries.includes("composer.json")) return "laravel";
    if (entries.some((f) => f.endsWith(".xcodeproj")) || entries.includes("Package.swift")) return "swift";
    if (entries.some((f) => f.startsWith("tailwind.config"))) return "tailwindcss";
  } catch { /* fallback */ }
  return "universal";
}

/** Extract Edit tool_use entries from a JSONL transcript file. */
export async function extractEdits(transcriptPath: string): Promise<EditEntry[]> {
  const text = await Bun.file(transcriptPath).text();
  const edits: EditEntry[] = [];
  for (const line of text.split("\n").filter(Boolean)) {
    try {
      const entry = JSON.parse(line);
      const content = entry?.message?.content;
      if (!Array.isArray(content)) continue;
      for (const block of content) {
        if (block.type === "tool_use" && block.name === "Edit" && block.input?.file_path) {
          edits.push({ file: block.input.file_path, oldStr: block.input.old_string ?? "", newStr: block.input.new_string ?? "" });
        }
      }
    } catch { /* skip malformed */ }
  }
  const seen = new Map<string, EditEntry>();
  for (const e of edits) seen.set(e.file.split("/").pop() ?? e.file, e);
  return [...seen.values()];
}

/** Categorize an edit entry by analyzing the new code content. */
export function categorizeEdit(edit: EditEntry): string {
  const n = edit.newStr.toLowerCase();
  if (n.includes("use client")) return "missing_directive";
  if (n.includes("displayname")) return "missing_display_name";
  if (/onkeydown|tabindex|role=/.test(n)) return "missing_a11y";
  if (/try|catch/.test(n)) return "missing_error_handling";
  if (/\?\?|if.*null/.test(n)) return "null_safety";
  return "code_fix";
}

/** Extract the last assistant text report from a JSONL transcript. */
export async function extractReport(transcriptPath: string): Promise<string> {
  const text = await Bun.file(transcriptPath).text();
  let lastReport = "";
  for (const line of text.split("\n").filter(Boolean)) {
    try {
      const entry = JSON.parse(line);
      if (entry?.message?.role !== "assistant") continue;
      for (const block of entry.message.content ?? []) {
        if (block.type === "text" && block.text) lastReport = block.text;
      }
    } catch { /* skip */ }
  }
  return lastReport.split("\n").slice(0, 500).join("\n");
}
