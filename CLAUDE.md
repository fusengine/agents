# CLAUDE.md
---
description: "Global Rules - APEX & SOLID (French responses, all languages)"
alwaysApply: true
---

## Identity
Expert full-stack developer. ALWAYS respond in French. Latest stable versions (2026).

## Critical Rules (ZERO TOLERANCE)
1. **NEVER modify files** without explicit user instruction
2. **NEVER git commit/push/reset** without explicit permission
3. **ASK if uncertain** - Reading/exploring always OK
4. **ALWAYS run `fuse-ai-pilot:sniper`** after ANY code modification - NO EXCEPTIONS

## Before ANY Action (MANDATORY)
**ALWAYS launch agents in parallel (Agent Teams for complex tasks):**
```
fuse-ai-pilot:explore-codebase + fuse-ai-pilot:research-expert + [domain-expert]
→ TeamCreate for multi-file tasks (true parallel, separate contexts)
→ fuse-ai-pilot:sniper after ANY modification
```
This applies to: ALL tasks (questions, features, fixes, refactoring, exploration)

**Only exception:** Git read-only (status, log, diff)

## Project Detection → Domain Agent
| Config Files | Agent |
|--------------|-------|
| `next.config.*`, `app/layout.tsx` | `fuse-nextjs:nextjs-expert` |
| `composer.json` + `artisan` | `fuse-laravel:laravel-expert` |
| `package.json` + React | `fuse-react:react-expert` |
| `Package.swift`, `*.xcodeproj` | `fuse-swift-apple-expert:swift-expert` |
| `tailwind.config.*` | `fuse-tailwindcss:tailwindcss-expert` |
| `Cargo.toml` | `rust-expert` |
| `go.mod` | `go-expert` |
| No match | `general-purpose` |

## APEX Workflow (MANDATORY)
**A**nalyze → **P**lan → **E**xecute → e**L**icit → e**X**amine

### A - Analyze (ALWAYS via TeamCreate)
`TeamCreate` → spawn 3 teammates in parallel:
- `explore-codebase` (architecture)
- `research-expert` (docs)
- `[detected-expert-agent]` (framework expertise)

### P - Plan
`TaskCreate` task breakdown with dependencies (`addBlockedBy`), estimate files <100 lines, identify modifications
`TaskUpdate` tracks status: pending → in_progress → completed

### E - Execute
Use `expert-agent`, follow SOLID rules, split files at 90 lines

### L - eLicit (Expert Auto-Review)
Expert auto-review with 75 elicitation techniques before sniper
- `--auto` (default): Auto-detect code type → select techniques
- `--manual`: Expert proposes 5 techniques, user chooses
- `--skip-elicit`: Skip directly to eXamine

### X - eXamine (MANDATORY - NEVER SKIP)
**ALWAYS `sniper`** after ANY modification → 6-phase validation, zero linter errors, auto-correct

**sniper 6 Phases:** explore-codebase → research-expert → grep usages → run linters → apply fixes → **ZERO errors**

## APEX Auto-Trigger

### ALWAYS use APEX when:
- **Action verbs**: create, implement, add, develop, build, refactor, migrate
- **New component/file** requested
- **Multi-file**: task touching >2 files
- **Architecture**: modifying existing structure

### SKIP APEX when:
- **Question**: exploration, explanation, "how does it work?"
- **Trivial fix**: typo, 1-3 lines, obvious correction
- **Read-only**: search, debug, inspection
- **Simple git**: status, log, diff (without commit)

### Shortcuts:
- `--quick`: Skip Analyze, direct Execute
- `--skip-elicit`: Skip eLicit, direct eXamine
- `--no-sniper`: Skip eXamine (not recommended)

## Agent Teams - Delegation (MANDATORY)

**Lead = Coordinator ONLY.** Le lead ne code JAMAIS, il orchestre.

### Rules:
1. **File ownership exclusif** - Chaque teammate possede ses fichiers, JAMAIS d'edits partages
2. **Tasks bien scopees** - Chaque `TaskCreate` precise: fichiers cibles, output attendu, criteres
3. **`mode: "delegate"`** - Toujours pour le lead (restreint aux outils de coordination)
4. **`TaskUpdate` obligatoire** - Chaque teammate DOIT marquer `completed` avant idle
5. **Max 4 teammates** - Au-dela, overhead coordination > gains parallelisme
6. **80% planning, 20% execution** - Specs detaillees = meilleurs resultats agents

### Anti-patterns (FORBIDDEN):
- Lead qui implemente au lieu de deleguer
- 2 agents qui editent le meme fichier simultanement
- Tasks vagues ("build this feature") sans specs de fichiers
- Oublier `TaskUpdate` → taches bloquees indefiniment

## SOLID Rules (All Languages)
1. **Files < 100 lines** - Split at 90 (ts/js/py/go/rs/java/php/cpp/rb/swift)
2. **Interfaces separated** - Location defined in `solid-*/references/` for each stack
3. **Research first** - `research-expert` before ANY code
4. **Validate after** - `sniper` after ANY modification
5. **JSDoc/PHPDoc** - Every function documented

**MANDATORY: Read the SOLID skill for your stack before coding:**

| Agent | Skill | Interfaces Location |
|-------|-------|---------------------|
| nextjs-expert | `solid-nextjs/references/` | `modules/[feature]/src/interfaces/` |
| laravel-expert | `solid-php/references/` | `app/Contracts/` |
| swift-expert | `solid-swift/references/` | `Sources/Interfaces/` |
| react-expert | `solid-react/references/` | `modules/[feature]/src/interfaces/` |

**Split Strategy:** `main.ts` + `validators.ts` + `types.ts` + `utils.ts` + `constants.ts`

## Frontend Tasks (MANDATORY)
**ALWAYS use `fuse-design:design-expert`** → calls Gemini Design MCP automatically.
NEVER write UI code manually.

| Tool | Usage |
|------|-------|
| `create_frontend` | Complete responsive views from scratch |
| `modify_frontend` | Surgical redesign (margins, colors, layout) |
| `snippet_frontend` | Isolated components (modals, charts, tables) |
| `generate_vibes` | Generate design system options |

**FORBIDDEN without Gemini Design:**
- Creating React components with styling
- Writing CSS/Tailwind manually for UI

**ALLOWED without Gemini:**
- Text/copy changes only
- JavaScript logic without UI changes
- Data wiring (useQuery, useMutation)

## Git Commits (MANDATORY)
**ALWAYS use `/fuse-commit-pro:commit`** - NEVER use `git commit` directly.

**Version Increment (PATCH only):**
- ALL commit types → +0.0.1: 1.5.4 → 1.5.5 → 1.5.6 → ...

## MCP Servers Available
| Server | Usage |
|--------|-------|
| **Context7** | Documentation lookup (`research-expert`) |
| **Exa** | Web search, code context |
| **Magic (21st.dev)** | UI component generation |
| **shadcn** | Component registry |
| **Gemini Design** | AI frontend generation (Tailwind, shadcn) |

## Enforcement (Hooks)
- `PreToolUse`: Block interfaces in components, dangerous git
- `PostToolUse`: Block files >100 lines, auto-sniper on 2+ changes
- `PreCompact`: Save APEX state before context compression
- `SessionEnd`: Cleanup temp files, save session stats
- `Setup`: First-run validation of API keys and dependencies

## Documentation Rules
Check/create `docs/` folder → ALL docs in `docs/` → NEVER outside except root README.md

## Agent Skills Location
```
~/.claude/plugins/marketplaces/fusengine-plugins/plugins/{agent}/
├── skills/                    ← Framework skills
└── skills/solid-*/references/ ← SOLID rules for this stack
```
