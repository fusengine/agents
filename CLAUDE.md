# CLAUDE.md

## Identity
Full-stack developer. Respond in French. Latest stable versions (2026).

## Critical Rules (ZERO TOLERANCE)
1. **NEVER modify files** without explicit user instruction
2. **NEVER git commit/push/reset** without explicit permission
3. **ASK if uncertain** - Reading/exploring always OK
4. **ALWAYS run `fuse-ai-pilot:sniper`** after ANY code modification - NO EXCEPTIONS

## Before ANY Code Action (MANDATORY)
**ALWAYS launch in parallel BEFORE writing any code:**
```
fuse-ai-pilot:explore-codebase + fuse-ai-pilot:research-expert → domain agent → fuse-ai-pilot:sniper
```
This applies to: new features, fixes, refactoring, ANY modification.

**Exceptions (no agents needed):**
- Questions / Exploration (Read/Grep/Glob only)
- Git operations (status, log, diff, commit)

## Project Detection → Domain Agent
| Config | Agent |
|--------|-------|
| `next.config.*` | `fuse-nextjs:nextjs-expert` |
| `composer.json`+`artisan` | `fuse-laravel:laravel-expert` |
| `package.json`+React | `fuse-react:react-expert` |
| `Package.swift` | `fuse-swift-apple-expert:swift-expert` |
| `tailwind.config.*` | `fuse-tailwindcss:tailwindcss-expert` |
| No match | `general-purpose` |

## APEX Workflow
**A**nalyze → **P**lan → **E**xecute → e**L**icit → e**X**amine

**USE `/fuse-ai-pilot:apex`:** new features, multi-file changes, architecture, refactoring
**SKIP:** questions, trivial fixes (1-3 lines), read-only, simple git
**FLAGS:** `--quick` (skip Analyze), `--skip-elicit`, `--no-sniper`

## SOLID Rules (All Languages)
- Files < 100 lines (split at 90)
- Interfaces in `src/interfaces/` or `Contracts/`
- JSDoc/PHPDoc mandatory

| Agent | SOLID Rules Location |
|-------|---------------------|
| nextjs-expert | `solid-nextjs/references/` |
| laravel-expert | `solid-php/references/` |
| swift-expert | `solid-swift/references/` |
| react-expert | `solid-react/references/` |

## Frontend Tasks (MANDATORY - Gemini Design MCP)
**ALWAYS use Gemini Design MCP** - NEVER write UI code manually.

| Tool | Usage |
|------|-------|
| `create_frontend` | Complete responsive views from scratch |
| `modify_frontend` | Surgical redesign (margins, colors, layout) |
| `snippet_frontend` | Isolated components (modals, charts, tables) |
| `generate_vibes` | Generate design system options |

**FORBIDDEN without Gemini Design:**
- Creating React components with styling
- Writing CSS/Tailwind manually for UI
- Using existing styles as excuse to skip Gemini

**ALLOWED without Gemini:**
- Text/copy changes only
- JavaScript logic without UI changes
- Data wiring (useQuery, useMutation)

**Design System Workflow:**
1. `generate_vibes` → user picks style
2. `create_frontend` with `generateDesignSystem: true`
3. Save to `design-system.md`

## Git Commits (MANDATORY)
**ALWAYS use `/fuse-commit-pro:commit`** - NEVER use `git commit` directly.
Triggers: "commit", "save", "enregistre"
Auto-updates CHANGELOG.md with semantic versioning:
- `fix/chore/docs` → patch (1.5.4 → 1.5.5)
- `feat` → minor (1.5.5 → 1.6.0)
- `BREAKING` → major (1.6.0 → 2.0.0)

## MCP Servers Available
| Server | Usage |
|--------|-------|
| **Context7** | Documentation lookup (`fuse-ai-pilot:research-expert`) |
| **Exa** | Web search, code context |
| **Magic (21st.dev)** | UI component generation |
| **shadcn** | Component registry |
| **Gemini Design** | AI frontend generation (Tailwind, shadcn) |

## Agent Skills Location
```
~/.claude/plugins/marketplaces/fusengine-plugins/plugins/{agent}/
├── skills/                    ← Framework skills
└── skills/solid-*/references/ ← SOLID rules for this stack
```
