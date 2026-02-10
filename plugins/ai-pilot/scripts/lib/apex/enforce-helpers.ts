/**
 * Helpers for enforce-apex-phases: framework detection and skill source mapping.
 * Extracted to keep the main hook file under 100 lines.
 */

const HOME = process.env.HOME ?? "";
const PLUGINS_DIR = `${HOME}/.claude/plugins/marketplaces/fusengine-plugins/plugins`;

/**
 * Detect framework from file path extension and content patterns.
 * @param filePath - Absolute path to the file being written/edited
 * @param content - File content or new_string being written
 */
export function detectFramework(filePath: string, content: string): string {
  if (/\.(tsx|jsx)$/.test(filePath) || /from ['"]react|useState|className=/.test(content)) {
    if (/(page|layout|loading|error|route)\.(ts|tsx)$/.test(filePath) || /use client|use server/.test(content)) {
      return "nextjs";
    }
    return "react";
  }
  if (/\.swift$/.test(filePath)) return "swift";
  if (/\.php$/.test(filePath)) return "laravel";
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
  };
  return map[framework] ?? "mcp__context7__query-docs";
}
