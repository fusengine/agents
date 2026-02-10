/**
 * Project type detection helpers for APEX methodology.
 * Detects framework from file system indicators in the working directory.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Supported project types detected from file system */
export type ProjectType =
  | "nextjs" | "nuxt" | "angular" | "svelte" | "vue" | "react" | "tailwind"
  | "laravel" | "rails" | "django" | "python" | "go" | "rust" | "swift"
  | "java" | "scala" | "elixir" | "ruby" | "generic";

/** Mapping from project type to expert agent identifier */
const AGENT_MAP: Record<ProjectType, string> = {
  nextjs: "fuse-nextjs:nextjs-expert",
  react: "fuse-react:react-expert",
  laravel: "fuse-laravel:laravel-expert",
  swift: "fuse-swift-apple-expert:swift-expert",
  tailwind: "fuse-tailwindcss:tailwindcss-expert",
  vue: "frontend-mobile-development:frontend-developer",
  nuxt: "frontend-mobile-development:frontend-developer",
  angular: "frontend-mobile-development:frontend-developer",
  svelte: "frontend-mobile-development:frontend-developer",
  go: "general-purpose", rust: "general-purpose",
  python: "general-purpose", django: "general-purpose",
  java: "general-purpose", scala: "general-purpose",
  ruby: "general-purpose", rails: "general-purpose",
  elixir: "general-purpose", generic: "general-purpose",
};

/** Keywords that trigger APEX methodology injection */
export const DEV_KEYWORDS =
  /\b(implement|create|build|fix|add|refactor|develop|feature|bug|update|modify|change|write|code)\b/i;

/** Check if prompt contains the /apex command */
export function isApexCommand(prompt: string): boolean {
  return /(?:^|\s)\/apex|\/fuse-ai-pilot:apex/i.test(prompt);
}

/**
 * Detect project type by scanning config files in the given directory.
 * @param dir - Absolute path to the project root
 */
export function detectProjectType(dir: string): ProjectType {
  const has = (f: string) => existsSync(join(dir, f));
  if (has("next.config.js") || has("next.config.ts") || has("next.config.mjs")) return "nextjs";
  if (has("nuxt.config.ts") || has("nuxt.config.js")) return "nuxt";
  if (has("angular.json")) return "angular";
  if (has("svelte.config.js") || has("svelte.config.ts")) return "svelte";
  if (has("vite.config.ts") && has("src/App.vue")) return "vue";
  if (has("vite.config.ts") || has("vite.config.js")) return "react";
  if (has("tailwind.config.js") || has("tailwind.config.ts")) return "tailwind";
  if (has("composer.json") && has("artisan")) return "laravel";
  if (has("Gemfile") && has("config/routes.rb")) return "rails";
  if (has("requirements.txt") || has("pyproject.toml") || has("setup.py")) {
    return has("manage.py") ? "django" : "python";
  }
  if (has("go.mod")) return "go";
  if (has("Cargo.toml")) return "rust";
  if (has("Package.swift")) return "swift";
  if (has("pom.xml") || has("build.gradle") || has("build.gradle.kts")) return "java";
  if (has("build.sbt")) return "scala";
  if (has("mix.exs")) return "elixir";
  if (has("Gemfile")) return "ruby";
  return "generic";
}

/**
 * Get the expert agent name for a given project type.
 * @param type - Detected project type
 */
export function getExpertAgent(type: ProjectType): string {
  return AGENT_MAP[type];
}
