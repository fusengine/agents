---
name: modularize
description: Use when converting existing code to modular architecture. Detects Laravel (FuseCore or standard) / Next.js / React and applies correct modular patterns. Triggers: "modularize", "convert to modules", "migrate to modular", "restructure modules".
user-invocable: true
references: references/laravel-fusecore.md, references/nextjs-react-modules.md
related-skills: apex, exploration
---

## Agent Workflow (MANDATORY)

detect framework → explore structure → build migration plan → confirm with user → execute → sniper

## Framework Detection

| Signal | Framework | Delegate To |
|---|---|---|
| `FuseCore/` dir + `artisan` file | Laravel + FuseCore | `fuse-laravel:laravel-expert` |
| `composer.json` + `artisan` (no FuseCore/) | Laravel standard | `fuse-laravel:laravel-expert` |
| `src/modules/` or `app/` + `next.config` | Next.js + modules/ | `fuse-nextjs:nextjs-expert` |
| `src/` + `package.json` (React, no Next) | React | `fuse-react:react-expert` |

## Critical Rules

1. **Analyze first** — always explore full structure before proposing anything
2. **Show migration map** — present file-by-file plan before touching any code
3. **User confirms** — never move or modify files without explicit approval
4. **Cores = central hub** — no module-to-module imports; all shared logic goes through core
5. **Sniper after each file** — run `fuse-ai-pilot:sniper` after every file moved or created

## Workflow Steps

1. Detect framework using signals from the table above
2. Explore codebase: map all files, dependencies, imports, exports
3. Build migration plan: list every file to create, move, or refactor
4. Present plan to user — wait for explicit confirmation before proceeding
5. Execute step by step; stop and report any conflict immediately
6. Run sniper validation after each file change
7. Final report: list all changes made and any remaining manual steps

## Reference Guide

| Stack | Reference File |
|---|---|
| Laravel (FuseCore or standard) | `references/laravel-fusecore.md` |
| Next.js / React | `references/nextjs-react-modules.md` |

## DO / DON'T

**DO:** explore before planning — plan before executing — confirm before touching files — sniper every step

**DON'T:** assume structure — skip confirmation — import between modules directly — batch changes without validation
