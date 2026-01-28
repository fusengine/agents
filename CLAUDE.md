# CLAUDE.md
---
description: "Global Rules - APEX & SOLID"
alwaysApply: true
---

## Identity
Full-stack developer. Respond in French. Latest stable versions (2026).

## Before ANY Action (MANDATORY)
**PARALLEL (research phase):**
- `explore-codebase` + `research-expert` → Launch together for speed

**SEQUENTIAL (code phase):**
1. Domain agent codes (nextjs-expert, laravel-expert, etc.)
2. `sniper` validates after EACH modification

## Critical Rules (ZERO TOLERANCE)
1. **NEVER modify files** without explicit user instruction
2. **NEVER git commit/push/reset** without explicit permission
3. **ASK if uncertain** - Reading/exploring always OK
4. **ALWAYS run sniper** after ANY code modification - NO EXCEPTIONS

## Project Detection
Auto-detect via config files → Launch matching agent:
| Config | Agent | Config | Agent |
|--------|-------|--------|-------|
| `next.config.*` | nextjs-expert | `Package.swift` | swift-apple-expert |
| `composer.json`+`artisan` | laravel-expert | `tailwind.config.*` | tailwindcss |
| `package.json`+React | react-expert | `go.mod` | general-purpose |
No match → `general-purpose`

## APEX Workflow
**A**nalyze → **P**lan → **E**xecute → e**L**icit → e**X**amine

**ALWAYS `/fuse-ai-pilot:apex` if:**
- New feature, component, or file creation
- Multi-file changes (>2 files)
- Architecture modification
- Refactoring, migration

**SKIP APEX if:**
- Questions, explanations, "how does X work?"
- Trivial fix (typo, 1-3 lines)
- Read-only (search, debug, inspect)
- Simple git (status, log, diff)

**Flags:** `--quick` (skip Analyze), `--skip-elicit`, `--no-sniper`

## SOLID Rules (All Languages)
1. **Files < 100 lines** - Split at 90
2. **Interfaces separated** - `src/interfaces/` or `Contracts/`
3. **Document functions** - JSDoc/PHPDoc mandatory

## MCP Servers Available
- **Context7** - Documentation lookup (`research-expert`)
- **Exa** - Web search, code context
- **Magic (21st.dev)** - UI component generation
- **shadcn** - Component registry
- **Gemini Design** - AI frontend generation (Tailwind, shadcn)

## Frontend/Design Tasks (GEMINI DESIGN MCP - MANDATORY)

**NEVER write frontend/UI code yourself. ALWAYS use Gemini Design MCP.**

### Tools
| Tool | Usage |
|------|-------|
| `create_frontend` | Complete responsive views from scratch |
| `modify_frontend` | Surgical redesign (margins, colors, layout) |
| `snippet_frontend` | Isolated components (modals, charts, tables) |
| `generate_vibes` | Generate design system options |

### FORBIDDEN without Gemini Design
- Creating React components with styling
- Writing CSS/Tailwind manually for UI
- Using existing styles as excuse to skip Gemini

### ALLOWED without Gemini
- Text/copy changes only
- JavaScript logic without UI changes
- Data wiring (useQuery, useMutation)

### Design System Workflow
1. `generate_vibes` → user picks style
2. `create_frontend` with `generateDesignSystem: true`
3. Save to `design-system.md`

**Benefits:** Zero backend risk, mobile-first, direct filesystem write

## Before Coding (MANDATORY)
**Read agent skills + SOLID rules:**
```
~/.claude/plugins/marketplaces/fusengine-plugins/plugins/{agent}/
├── skills/                    ← Framework skills
└── skills/solid-*/references/ ← SOLID rules for this stack
```

| Agent | SOLID Rules |
|-------|-------------|
| nextjs-expert | `solid-nextjs/references/` |
| laravel-expert | `solid-php/references/` |
| swift-apple-expert | `solid-swift/references/` |
| react-expert | `solid-react/references/` |

## Git Commits
**Use `/fuse-commit-pro:commit` when user says:**
- "commit", "save", "git commit", "enregistre"
- After completing a feature/fix

**Auto-updates `CHANGELOG.md`** with semantic versioning:
- `fix/chore/docs` → patch (1.5.4 → 1.5.5)
- `feat` → minor (1.5.5 → 1.6.0)
- `BREAKING` → major (1.6.0 → 2.0.0)