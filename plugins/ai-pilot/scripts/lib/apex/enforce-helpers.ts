/**
 * Helpers for enforce-apex-phases: framework detection and skill source mapping.
 * Extracted to keep the main hook file under 100 lines.
 */
import type { RouteResult } from "../interfaces/ref-router.interface";

const HOME = process.env.HOME ?? "";
const PLUGINS_DIR = `${HOME}/.claude/plugins/marketplaces/fusengine-plugins/plugins`;

/**
 * Detect framework from file path extension and content patterns.
 * Aligned with core-guards/require-solid-read.py detection.
 * @param filePath - Absolute path to the file being written/edited
 * @param content - File content or new_string being written
 */
export function detectFramework(filePath: string, content: string): string {
  if (/\.(tsx?|jsx?|vue|svelte)$/.test(filePath) || /from ['"]react|useState|className=/.test(content)) {
    if (/(page|layout|loading|error|route)\.(ts|tsx)$/.test(filePath) || /use client|use server/.test(content)) {
      return "nextjs";
    }
    return "react";
  }
  if (/\.swift$/.test(filePath)) return "swift";
  if (/\.php$/.test(filePath)) return "laravel";
  if (/\.java$/.test(filePath)) return "java";
  if (/\.go$/.test(filePath)) return "go";
  if (/\.rb$/.test(filePath)) return "ruby";
  if (/\.rs$/.test(filePath)) return "rust";
  if (/\.css$/.test(filePath) || /@tailwind|@apply/.test(content)) return "tailwind";
  return "generic";
}

/**
 * Map framework to its SKILL.md documentation source path.
 * @param framework - Detected framework identifier
 */
export function getSkillSource(framework: string): string {
  const map: Record<string, string> = {
    react: `${PLUGINS_DIR}/react-expert/skills/react-19/SKILL.md`,
    nextjs: `${PLUGINS_DIR}/nextjs-expert/skills/nextjs-16/SKILL.md`,
    swift: `${PLUGINS_DIR}/swift-apple-expert/skills/swiftui-components/SKILL.md`,
    laravel: `${PLUGINS_DIR}/laravel-expert/skills/laravel-eloquent/SKILL.md`,
    tailwind: `${PLUGINS_DIR}/tailwindcss/skills/tailwindcss-v4/SKILL.md`,
    generic: `${PLUGINS_DIR}/solid/skills/solid-generic/SKILL.md`,
    java: `${PLUGINS_DIR}/solid/skills/solid-java/SKILL.md`,
    go: `${PLUGINS_DIR}/solid/skills/solid-go/SKILL.md`,
    ruby: `${PLUGINS_DIR}/solid/skills/solid-ruby/SKILL.md`,
    rust: `${PLUGINS_DIR}/solid/skills/solid-rust/SKILL.md`,
  };
  return map[framework] ?? "mcp__context7__query-docs";
}

/**
 * Map framework to its SOLID skill directory path.
 * @param framework - Detected framework identifier
 */
export function getSkillDir(framework: string): string {
  const map: Record<string, string> = {
    react: `${PLUGINS_DIR}/react-expert/skills/solid-react`,
    nextjs: `${PLUGINS_DIR}/nextjs-expert/skills/solid-nextjs`,
    swift: `${PLUGINS_DIR}/swift-apple-expert/skills/solid-swift`,
    laravel: `${PLUGINS_DIR}/laravel-expert/skills/solid-php`,
    generic: `${PLUGINS_DIR}/solid/skills/solid-generic`,
    java: `${PLUGINS_DIR}/solid/skills/solid-java`,
    go: `${PLUGINS_DIR}/solid/skills/solid-go`,
    ruby: `${PLUGINS_DIR}/solid/skills/solid-ruby`,
    rust: `${PLUGINS_DIR}/solid/skills/solid-rust`,
  };
  return map[framework] ?? `${PLUGINS_DIR}/solid/skills/solid-generic`;
}

/**
 * Format deny message with specific routed references.
 * @param framework - Detected framework
 * @param filePath - File being edited
 * @param result - Routing result with scored references
 */
export function formatRoutedDeny(framework: string, filePath: string, result: RouteResult): string {
  const lines: string[] = [`APEX: Read specific SOLID references (expires every 2min) for ${framework}.`, `Editing: ${filePath}`, "Required:"];
  for (const [i, r] of result.required.entries()) lines.push(`  ${i + 1}. ${r.meta.filePath}`);
  if (result.optional.length) {
    lines.push("Optional:");
    for (const [i, r] of result.optional.entries()) lines.push(`  ${result.required.length + i + 1}. ${r.meta.filePath}`);
  }
  lines.push(`Full skill: ${result.skillPath}`);
  return lines.join("\n");
}
