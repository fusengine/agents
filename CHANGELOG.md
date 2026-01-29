# Release Notes

## [1.29.4] - 29-01-2026

### Changed

- **gitignore**: Remove scripts/.claude/apex from git tracking

## [1.29.3] - 29-01-2026

### Changed

- **claude-md**: Enhance workflow rules and expand to 99 lines
  - Add mandatory agent workflow before any code action
  - Include full agent names (fuse-ai-pilot:*, fuse-nextjs:*, etc.)
  - Add Gemini Design MCP detailed rules (FORBIDDEN/ALLOWED)
  - Add SOLID rules location per agent
  - Enforce /fuse-commit-pro:commit for all commits

## [1.29.2] - 29-01-2026

### Fixed

- **hooks**: Use hookSpecificOutput format for all 19 hooks
  - PreToolUse: permissionDecision "deny"/"ask" with permissionDecisionReason
  - PostToolUse: additionalContext for feedback to Claude
  - SessionStart/UserPromptSubmit: additionalContext for context injection
  - SubagentStart/SubagentStop: additionalContext for agent context
  - Replace exit 2 + stderr with official Claude Code JSON format

## [1.29.1] - 29-01-2026

### Fixed

- **hooks**: Output JSON format for CLAUDE.md injection (SessionStart + UserPromptSubmit)

## [1.29.0] - 29-01-2026

### Added

- **mcp**: Interactive MCP server installer with 27 servers
  - Add mcp.json catalog with server descriptions in English
  - Add mcp-installer.ts and mcp-setup.ts services (SOLID)
  - Add McpCatalog, McpServerConfig, SetupPaths interfaces
  - Add unit tests for MCP installer functions (95 tests pass)
  - Update documentation with full MCP server reference
  - Update .env.example with all API key variables

### Changed

- **archives**: Remove from git tracking (already in .gitignore)

## [1.28.1] - 29-01-2026

### Fixed

- **hooks**: Use bash 3.x compatible syntax for uppercase conversion
  - Replace `${FRAMEWORK^}` with awk for macOS compatibility

## [1.28.0] - 29-01-2026

### Added

- **hooks**: Add hookSpecificOutput permission dialog support
  - Implement Claude Code standard format for Yes/No dialogs
  - git-guard: ask for commit/push, deny for --force
  - install-guard: ask for npm/brew install
  - security-guard: ask for rm, deny for rm -rf /, allow trash
  - hook-executor: pass hookSpecificOutput to Claude Code

## [1.27.1] - 29-01-2026

### Changed

- **scripts**: Simplify hooks and services with SOLID extraction
  - Reduce code complexity across shell scripts (-117 lines net)
  - Extract SOLID services: api-keys-config, env-file, shell-detection, shell-installers
  - Add skill tracking hooks to expert plugins (design, laravel, nextjs, react, swift, tailwind)
  - Streamline hook-executor and plugin-scanner

## [1.27.0] - 29-01-2026

### Added

- **hooks**: Migrate hooks-loader from bash to Bun with SOLID architecture
  - Replace bash+jq with Bun TypeScript for 3x faster execution
  - Implement parallel hook execution (280ms → 100ms)
  - Add SOLID architecture with interfaces, services, config separation
  - Add 81 unit tests with full coverage (`bun test`)
  - Add cross-platform setup scripts (`setup.sh`, `setup.ps1`)
  - Add interactive API keys configuration with @clack/prompts
  - Support Windows installation natively

### Changed

- **docs**: Update installation guide for Bun-based setup
- **docs**: Add Windows PowerShell instructions

## [1.26.1] - 28-01-2026

### Changed

- **docs**: Add mandatory Gemini Design MCP rules to all frontend agents
  - FORBIDDEN: Creating React components with styling without Gemini
  - ALLOWED: Text changes, JavaScript logic, data wiring
  - Document `generate_vibes` workflow for design systems
- **nextjs-expert**: Add gemini-design tools to agent and .mcp.json

## [1.26.0] - 28-01-2026

### Added

- **mcp**: Add `gemini-design-mcp` for AI-powered frontend generation
  - Tools: `create_frontend`, `modify_frontend`, `snippet_frontend`
  - Integrated in: ai-pilot, design-expert, tailwindcss, react-expert
  - Supports Google API key or platform key
- **websearch**: Prioritize Exa MCP tools over WebSearch fallback
- **env**: Add `GEMINI_DESIGN_API_KEY` to `.env.example`

## [1.25.1] - 28-01-2026

### Fixed

- **statusline**: Correct context calculation using `used_percentage` from Claude Code API
- **statusline**: Display usable space (167K) instead of total (200K) for accurate autocompact threshold
- **statusline**: Fix AUTOCOMPACT_BUFFER from 45K to 33K (16.5%)
- **statusline**: Fix spacing in limits segment (`5h: 20%` instead of `5h:20%`)
- **statusline**: Fix double `$` in cost segment
- **ai-pilot**: Fix MCP tool detection pattern in doc tracking hook

## [1.25.0] - 28-01-2026

### Added

- **config**: Add optimized `CLAUDE.md` with APEX workflow rules
  - Parallel research phase (explore-codebase + research-expert)
  - Sequential code phase with mandatory sniper validation
  - Project detection → auto-launch matching expert agent
  - Git commits trigger `/fuse-commit-pro:commit`

### Changed

- **install-hooks.sh**: Add `language=french` and `attribution` settings
  - Auto-install CLAUDE.md to `~/.claude/`
- **install-env.sh**: Detect and install only for user's default shell
  - No longer installs for all shells (bash + zsh)

## [1.24.1] - 28-01-2026

### Changed

- **env**: Remove `inject-keys.sh` - MCP servers use `${VAR}` interpolation directly
  - Claude Code interpolates env vars from shell environment at startup
  - No script needed, just configure shell to load `~/.claude/.env`
- **docs**: Simplify `setup-env.md` documentation

## [1.24.0] - 28-01-2026

### Added

- **env**: Add `install-env.sh` for cross-platform shell auto-detection
  - Supports bash, zsh, fish on macOS/Linux/WSL
- **env**: Add `install-env.ps1` for Windows PowerShell support
- **docs**: Update `setup-env.md` with setup workflow

## [1.23.2] - 28-01-2026

### Fixed

- **mcp**: Correct MCP server configurations
  - Remove non-existent `laravel-docs` server (uvx package doesn't exist)
  - Fix `sequential-thinking` package in prompt-engineer (`@anthropic/` → `@modelcontextprotocol/`)
  - Move `sequential-thinking` inside `mcpServers` in design-expert

## [1.23.1] - 28-01-2026

### Fixed

- **statusline**: Load config.json from plugin directory instead of hardcoded path
  - ConfigManager now loads config from plugin install path first
  - User config in ~/.claude/scripts/statusline/ can override plugin config
  - Fix install-hooks.sh cp error when source and destination are identical

## [1.23.0] - 28-01-2026

### Added

- **statusline**: Improve default configuration for installation
  - Enable time, weekly, dailySpend segments by default
  - Change separator from `|` to `·` (middle dot)
  - Set progress bars to 4 characters with "blocks" style
  - Enable showDecimals for token display

## [1.22.0] - 28-01-2026

### Added

- **hooks**: Add PermissionRequest hook for permission sound alerts
  - Play `permission-need.mp3` on ALL permission dialogs (system + hooks)
  - Works for git-guard, install-guard, and system permissions
  - Update install-hooks.sh to include PermissionRequest in loader

## [1.21.4] - 28-01-2026

### Fixed

- **scripts**: Fix statusline detection and use marketplace paths
  - Fix jq condition that captured "false\nno" instead of "no"
  - Copy hooks-loader.sh to marketplace for portability
  - Use $HOME-based paths resolved at install time

## [1.21.3] - 28-01-2026

### Fixed

- **scripts**: Fix statusline detection in install-hooks
  - Replace `!= null` with `type == "object"` to avoid bash `!` interpretation issues

## [1.21.2] - 28-01-2026

### Changed

- **scripts**: Simplify install-hooks and improve loader
  - `install-hooks.sh` now generates loader-only `settings.json`
  - `hooks-loader.sh` handles Notification matcher on type field
  - `afplay` commands run in background without stdin

## [1.21.1] - 28-01-2026

### Fixed

- **scripts**: Resolve shared scripts path from marketplace instead of relative
  - Fix 28 hook scripts that used relative path `../../_shared/scripts`
  - Scripts now check marketplace path first, fallback to relative
  - Add automatic sound hooks (Stop, Notification) to `install-hooks.sh`
  - Add `permission-need.mp3` sound for permission prompts

## [1.21.0] - 28-01-2026

### Added

- **core-guards**: Modular SOLID statusline with auto-install
  - 9 segments: claude, directory, model, context, cost, limits, dailySpend, node, edits
  - Auto-install via `install-hooks.sh` (detects bun, installs deps, configures settings.json)
  - Web and terminal configurators (`bun run config`, `bun run config:term`)
  - Progress bar styles: filled, braille, dots, line, blocks, vertical

### Fixed

- **statusline**: Add "vertical" to ProgressBarStyle union type

## [1.20.0] - 28-01-2026

### Added

- **core-guards**: Sound notifications for Stop and Notification hooks
  - `finish.mp3`: Task completion sound (Stop hook)
  - `permission-need.mp3`: Permission request sound (permission_prompt)
  - `need-human.mp3`: User input waiting sound (idle_prompt, elicitation_dialog)
  - Configurable matchers for different notification types

## [1.19.0] - 28-01-2026

### Added

- **core-guards plugin** - Security guards and SOLID enforcement hooks
  - `git-guard.sh`: Blocks destructive git commands (push --force, reset --hard), asks confirmation for others
  - `install-guard.sh`: Asks confirmation before package installations (npm, pip, brew, etc.)
  - `security-guard.sh`: Validates dangerous bash commands via security rules
  - `pre-commit-guard.sh`: Runs linters (ESLint, TypeScript, Prettier, Ruff) before git commit
  - `enforce-interfaces.sh`: Blocks interfaces/types in component files
  - `enforce-file-size.sh`: Blocks files > 100 lines
  - `track-session-changes.sh`: Tracks cumulative code changes for sniper trigger
  - `inject-claude-md.sh`, `load-dev-context.sh`, `cleanup-session-states.sh`: SessionStart hooks
  - `read-claude-md.sh`: UserPromptSubmit hook with APEX auto-trigger
  - `track-agent-memory.sh`: SubagentStop hook for context persistence
  - Ralph Mode support for autonomous development (auto-approve safe commands)

### Changed

- Updated README.md (11 plugins)
- Updated docs/plugins.md with core-guards
- Updated docs/hooks.md with all core-guards scripts and hook types

## [1.18.5] - 26-01-2026

### Fixed

- **design-expert**: Enforce project structure conventions
  - Edit existing files instead of creating `*Redesigned.tsx`
  - Follow project conventions (`modules/` vs `src/`)
  - Step 01 must identify project structure before coding

## [1.18.4] - 26-01-2026

### Fixed

- **design-expert**: Forbid .md documentation file creation (code only)

## [1.18.3] - 26-01-2026

### Changed

- **design-expert**: Major reorganization
  - Moved references from skills/ to agent-level references/
  - Added `ux-principles.md` (Nielsen heuristics, Laws of UX, WCAG 2.2, forms)
  - Added `ui-visual-design.md` (visual hierarchy, spacing, 2026 trends)
  - Removed delegation workflow (subagents cannot spawn subagents)
  - Added explicit skill loading step (00-load-skills) in APEX workflow
  - Mandatory sniper validation after code

## [1.18.2] - 26-01-2026

### Fixed

- **validate-*-solid.sh**: Moved from PostToolUse to PreToolUse for actual blocking
  - PostToolUse cannot undo writes (file already written)
  - PreToolUse blocks BEFORE write/edit happens
  - Now analyzes `tool_input.content` instead of file on disk
- **check-*-skill.sh**: Added session-based tracking (works without APEX)
  - Uses `/tmp/claude-skill-tracking/{framework}-{SESSION_ID}`
  - Agents must read skills BEFORE writing code in ANY context
  - APEX task.json tracking kept as bonus when available
- **All blocking hooks**: Use official Claude Code JSON format
  - Changed from `exit 2` to `permissionDecision: "deny"` with `exit 0`
  - Follows official documentation best practices

### Changed

- **Agents config**: Moved `validate-*-solid.sh` hook declaration to PreToolUse
- **15 files updated**: react, nextjs, laravel, swift, tailwindcss, design experts

## [1.18.1] - 25-01-2026

### Fixed

- **sync-task-tracking.sh**: Added file locking to prevent concurrent write corruption
  - Uses `mkdir` for atomic cross-platform locking
  - 10s timeout with automatic stale lock cleanup
  - `trap EXIT` ensures lock is always released

## [1.18.0] - 25-01-2026

### Added

- **hooks-loader.sh**: Added `SubagentStart` to supported hook types
- **install-hooks.sh**: Added `TaskCreate|TaskUpdate` matcher for PostToolUse
- **install-hooks.sh**: Added `SubagentStart` hook configuration
- **~/.claude/settings.json**: Updated with new matchers (manual step documented)

### Changed

- Translated install-hooks.sh output messages to English

## [1.17.0] - 25-01-2026

### Added

- **SubagentStart hook** (`inject-subagent-context.sh`):
  - Injects APEX rules directly into sub-agent prompts via `additionalContext`
  - Provides last 3 completed tasks for context continuity
  - Lists pending tasks
  - Includes SOLID rules and research-before-code instructions

### Fixed

- **sync-task-tracking.sh**: Changed `tool_result` → `tool_response` (correct hook format per Claude Code docs)

### Changed

- **hooks.json**: Replaced ineffective `PreToolUse/Task` with `SubagentStart` hook
- **i18n**: Translated French text to English in 6 files (agents, skills)

## [1.16.0] - 25-01-2026

### Added

- **TaskCreate sync**: Hook now syncs `TaskCreate` to task.json (not just TaskUpdate)
- **Enhanced AGENTS.md**:
  - Sub-agents read their skills and SOLID principles first
  - Read last 3 completed tasks and their research notes
  - Research tools reference (Context7, Exa, skills paths)
  - Validation section with sniper
  - Notes format: `task-{ID}-{subject}.md`

### Changed

- **inject-apex-context.sh**: Simplified output with clear workflow steps
- **hooks.json**: Matcher updated to `TaskCreate|TaskUpdate`

## [1.15.1] - 25-01-2026

### Fixed

- **APEX init DRY refactor**: `detect-and-inject-apex.sh` now calls `init-apex-tracking.sh` instead of duplicating code. Ensures AGENTS.md is always created.

## [1.15.0] - 25-01-2026

### Added

- **Task sync with auto-commit** (`sync-task-tracking.sh`):
  - Syncs Claude's TaskUpdate with `.claude/apex/task.json`
  - Auto-commits on task completion: `feat(task-X): subject`
  - Blocks completion if no code changes exist
  - Updates `current_task` when task starts

- **Agent context injection** (`inject-apex-context.sh`):
  - Injects AGENTS.md content to agents on Task launch
  - Provides current task state (phase, docs consulted)
  - Recommends expert agent based on project type

- **AGENTS.md generation** (in `init-apex-tracking.sh`):
  - Creates `.claude/apex/AGENTS.md` with APEX workflow rules
  - Documents blocking rules, auto-commit behavior
  - Tells agents not to commit manually

### Changed

- **Block messages improved**: Now show 3 options (skill, Context7, Exa) and docs path
- **task.json structure**: Added `subject`, `description`, `phase`, `files_modified`

## [1.14.0] - 25-01-2026

### Added

- **Agent frontmatter hooks**: Hooks now work in Task subagents (hooks.json doesn't inherit)
  - Added hooks directly in agent YAML frontmatter for all 6 experts
  - PreToolUse: `check-*-skill.sh` blocks Write/Edit without doc consultation
  - PostToolUse: tracking and validation scripts

- **Skill read tracking** (`track-skill-read.sh`):
  - Tracks when agents read skill documentation files
  - Dynamic framework detection from skill path
  - Updates `task.json` with `doc_consulted` status

- **MCP research tracking** (`track-mcp-research.sh`):
  - Tracks Context7 and Exa documentation calls
  - Counts as valid documentation consultation for APEX

- **shadcn installation enforcement** (`check-shadcn-install.sh`):
  - Blocks manual writing of shadcn components in `components/ui/`
  - Forces usage of `npx shadcn@latest add` CLI
  - Applied to: design-expert, nextjs-expert, react-expert, laravel-expert

### Changed

- **Blocking mechanism**: All `check-*-skill.sh` scripts now use `decision: block` instead of `continue`
- **APEX mode check**: Scripts only block if `task.json` exists (APEX mode active)

## [1.13.2] - 24-01-2026

### Fixed

- **Remove expert bypass mechanism**: `/tmp/.claude-expert-active` was never cleaned up
  - Removed bypass check from `enforce-apex-phases.sh`
  - Removed `touch /tmp/.claude-expert-active` from all 6 expert hooks
  - APEX blocking now works correctly at all times

## [1.13.1] - 24-01-2026

### Fixed

- **APEX tracking creation**: Create tracking BEFORE dev keywords check
  - Fixes: tracking not created when prompt lacks keywords (e.g., "refaire design")
  - Now `/apex` always creates tracking regardless of prompt content

## [1.13.0] - 24-01-2026

### Added

- **APEX tracking on /apex command**: Create `.claude/apex/task.json` only when `/apex` or `/fuse-ai-pilot:apex` is explicitly called
  - Hook detects `/apex` pattern in prompt
  - Creates tracking in PWD immediately
  - Dev keywords still trigger APEX instructions but not tracking creation

## [1.12.8] - 24-01-2026

### Changed

- **UserPromptSubmit hook**: Remove tracking init (no FILE_PATH, only PWD)
  - Delegates tracking creation to PreToolUse/PostToolUse hooks
  - Fixes cross-project tracking (working on project A from project B)

## [1.12.7] - 24-01-2026

### Fixed

- **Project root detection**: Detect project from file path instead of PWD
  - Add `find_project_root()` to walk up directory tree
  - Detect by package.json, composer.json, .git, Cargo.toml, go.mod, Package.swift
  - Tracking now created in correct project when working cross-project

## [1.12.6] - 24-01-2026

### Fixed

- **APEX tracking auto-init**: Always create `.claude/apex/docs/` directory
- **Tracking status display**: Show doc_consulted status in APEX instruction
- **Skill paths**: Use absolute paths (`$HOME/.claude/plugins/...`) for skill references
- **JSON escaping**: Use `jq` for proper JSON output in hook responses
- **Expert hooks**: Simplified messages with full plugin paths

## [1.12.5] - 24-01-2026

### Changed

- **Expert hooks**: Change from `block` to `continue` (inform without blocking)
  - design-expert, react-expert, swift-apple-expert, laravel-expert, nextjs-expert, tailwindcss
  - APEX now handles blocking if documentation not consulted
- **APEX detection**: Add 15+ language/framework detection
  - Added: go, rust, python, django, java, scala, ruby, rails, vue, nuxt, angular, svelte, elixir
- **APEX auto-init**: Automatically initialize tracking on dev task detection
- **APEX agent injection**: Inject correct expert agent based on project type

## [1.12.4] - 24-01-2026

### Changed

- Rename `RELEASE.md` to `CHANGELOG.md` (Keep a Changelog standard)
- Update all references in commit commands and CLAUDE.md

## [1.12.3] - 24-01-2026

### Changed

- **Skills alignment with official Claude Code spec** (96 files, 10 plugins)
  - Add `user-invocable` field to 70+ skills across all plugins
  - Add `${CLAUDE_SESSION_ID}` tracking to exploration, research, pr-summary
  - Add scoped hooks to apex for auto-sniper validation after each Edit/Write
  - Fix `tools` → `allowed-tools` in commit-detection (invalid field)
  - Add `context: fork` and `agent` fields to research/exploration skills
  - Split large skills into `references/` (code-quality, solid-php, solid-nextjs, guardrails, react-forms, solid-swift)

### Added

- **pr-summary skill** with dynamic context injection (`!`command``)
  - Uses `gh pr diff`, `gh pr view --comments` for live PR data
  - Runs in forked context with explore-codebase agent

## [1.12.2] - 23-01-2026

### Changed

- Reorganize README.md with compact tables (203 → 117 lines)
- Add Quick Start section with one-liner install
- Group plugins by category (Development/Productivity)
- Centralize documentation links in single table

## [1.12.1] - 23-01-2026

### Changed

- Translate `docs/apex-tracking.md` from French to English for consistency
- Fix README.md broken link (`./doc/` → `./docs/`)

## [1.12.0] - 23-01-2026

### Added

- **APEX documentation tracking** - Track skill/doc consultations before code writing
  - `init-apex-tracking.sh` - Initialize tracking state (.claude/apex/task.json)
  - `track-doc-consultation.sh` - PostToolUse hook records Read operations on skills/docs
  - Enhanced `enforce-apex-phases.sh` with framework detection and tracking check
  - `docs/apex-tracking.md` - Complete documentation of the tracking system
  - Prevents infinite hook loops with smart detection

## [1.11.0] - 23-01-2026

### Added

- **Expert delegation enforcement** - ai-pilot blocks direct Write/Edit on code files
  - Main agent must delegate to expert agents via Task tool
  - Expert context marker system (`/tmp/.claude-expert-active`)
  - Suggests appropriate expert agent based on file type

### Changed

- **Expert hooks** - All expert agents now mark their context
  - design-expert, laravel-expert, nextjs-expert, react-expert, swift-expert, tailwindcss-expert
  - Allows expert agents to write code while main agent is blocked
  - Streamlined skill suggestions in block messages

## [1.10.3] - 23-01-2026

### Changed

- **Hooks skill detection** - Smarter pattern detection with enriched messages
  - Add smart code pattern detection for each framework (React, Next.js, Laravel, Swift, Tailwind, Design)
  - Skip non-code directories (node_modules, dist, build, vendor, .next, DerivedData)
  - Enrich block messages with all available skills and MCP tools
  - Simplify SOLID validation to reduce noise (validate-react-solid.sh)

## [1.10.2] - 23-01-2026

### Fixed

- **install-hooks.sh** - Merge hooks instead of overwriting `settings.json`
  - Preserves user's custom hooks (SessionStart, Stop, Notification, SubagentStop, etc.)
  - Creates timestamped backups before modification
  - Skips installation if loader already present

## [1.10.1] - 23-01-2026

### Fixed

- **Hooks loader path** - Scan only marketplace `~/.claude/plugins/marketplaces/fusengine-plugins/plugins` (removed local plugins scanning)

## [1.10.0] - 23-01-2026

### Added

- **Hooks Enforcement System** - Automatic skill and SOLID compliance enforcement
  - `scripts/hooks-loader.sh`: Dynamic hook detector for all plugins
  - `scripts/install-hooks.sh`: One-click installation to `~/.claude/settings.json`
  - `docs/hooks.md`: Comprehensive hooks documentation

- **Plugin Hooks** (7 plugins, 18 scripts)
  - **ai-pilot**: Project detection, APEX injection, SOLID compliance
  - **react-expert**: Skill enforcement, React SOLID validation
  - **nextjs-expert**: Skill enforcement, Next.js SOLID validation (150 lines for pages)
  - **laravel-expert**: Skill enforcement, Laravel SOLID validation (Contracts/)
  - **swift-apple-expert**: Skill enforcement, Swift SOLID validation (Protocols/, @MainActor)
  - **tailwindcss**: Skill enforcement, v4 best practices (no deprecated @tailwind)
  - **design-expert**: Skill enforcement, accessibility validation

- **Hook Types**
  - `UserPromptSubmit`: Auto-detect project type, inject APEX methodology
  - `PreToolUse`: Block Write/Edit if skill not consulted first
  - `PostToolUse`: Validate SOLID (file size, interface location, JSDoc)

### Changed

- Fix README.md link (`doc/` → `docs/`)

## [1.9.0] - 22-01-2026

### Added

- **APEX Design References** (10 files in `references/design/`)
  - 00-init-branch: Create design/ branch
  - 01-analyze-design: Design tokens exploration
  - 02-search-inspiration: 21st.dev + shadcn search
  - 03-plan-component: TodoWrite + file planning
  - 04-code-component: Delegate to react/nextjs-expert
  - 05-add-motion: Framer Motion patterns
  - 06-validate-a11y: WCAG 2.2 AA checklist
  - 07-review-design: Elicitation self-review
  - 08-sniper-check: Sniper validation
  - 09-create-pr: PR with screenshots

## [1.8.2] - 22-01-2026

### Changed

- Translate all plugin documentation to English (24 files across 7 plugins)
  - design-expert: restore APEX workflow table, translate all skills
  - tailwindcss: translate core references (theme, directives, config)
  - ai-pilot: translate README and cleanup-context command
  - react-expert, nextjs-expert: fix remaining French text
  - prompt-engineer: full translation
- Replace "Inter Variable" with "Satoshi Variable" (anti-AI slop compliance)

## [1.8.1] - 22-01-2026

### Changed

- Add frontmatter (name/description) to 50 reference files for consistency
  - Tailwind CSS references (28 files)
  - Design-expert references (11 files)
  - SEO references (11+ files)
- Move `apex-methodology.md` from `doc/` to `docs/`

## [1.8.0] - 22-01-2026

### Added

- **APEX Elicitation Phase** (Phase 3.5 eLICIT)
  - Expert self-review before sniper validation
  - 75 elicitation techniques in 12 categories
  - 3 modes: auto (default), manual, skip
  - Auto-detection matrix for technique selection
  - Framework-specific 03.5-elicit.md for Next.js, React, Laravel, Swift

- **Elicitation Skill** (`plugins/ai-pilot/skills/elicitation/`)
  - SKILL.md with 3-mode configuration
  - 6-step workflow (init → analyze → select → apply → correct → report)
  - Complete techniques catalog (75 techniques)

- **Quick Flow Command** (`/apex-quick`)
  - Single-pass workflow for simple fixes
  - 4 phases: Locate → Fix → Review → Verify

- **Documentation**
  - `docs/apex-methodology.md` (English documentation)
  - Navigation frontmatter (prev_step/next_step) on all 55 reference files

### Changed

- Updated APEX SKILL.md with Phase 3.5 integration
- Updated apex.md command with eLICIT phase
- Updated 6 expert agents with elicitation skill

## [1.7.0] - 22-01-2026

### Added

- **fuse-prompt-engineer plugin** - Expert Prompt Engineering
  - prompt-engineer agent (Opus) with Context7, Exa, Sequential-Thinking MCP
  - 6 specialized skills: prompt-creation, prompt-optimization, agent-design, guardrails, prompt-library, prompt-testing
  - `/prompt` command (create, optimize, agent, review actions)
  - `/prompt-history` command for prompt versioning
  - 50+ template library (agents, tasks, specialized)
  - A/B testing methodology with metrics

### Changed

- Updated README.md (10 plugins, 15 agents, 70 skills, 24 commands)
- Updated docs/plugins.md with prompt-engineer documentation

## [1.6.2] - 21-01-2026

### Changed

- Smart type detection for `/commit` command (HIGH/MEDIUM/LOW confidence)
- Restored semantic versioning rules in commit workflow

## [1.6.1] - 21-01-2026

### Added

- Laravel Docs MCP server (`laravel-docs`) for laravel-expert plugin

## [1.6.0] - 21-01-2026

### Added

- **MCP Server Configurations** (9 .mcp.json files)
  - context7, exa, sequential-thinking for all expert plugins
  - shadcn for react-expert, nextjs-expert
  - XcodeBuildMCP, apple-docs for swift-apple-expert
  - magic for design-expert

- **Shell Environment Scripts** (4 files)
  - `scripts/env-shell/claude-env.bash` - Bash support
  - `scripts/env-shell/claude-env.zsh` - Zsh support (macOS)
  - `scripts/env-shell/claude-env.fish` - Fish support
  - `scripts/env-shell/claude-env.ps1` - PowerShell support (Windows)

- **API Keys Documentation**
  - `docs/setup-env.md` - Complete setup guide
  - `.env.example` - Template with required keys
  - `~/.claude/.env` - Global keys location

### Changed

- Updated agents with additional MCP tools (sequential-thinking, exa)
- Updated README.md with MCP documentation link
- Updated .gitignore to exclude .env files

## [1.5.5] - 20-01-2026

### Added

- **APEX Methodology Skill** with framework auto-detection
  - `skills/apex/SKILL.md`: Main skill with YAML frontmatter, auto-detection logic
  - 10 generic reference phases (00-09): init-branch through create-pr
  - Language-agnostic with multi-language tables (TypeScript, PHP, Swift, Go, Python)

- **Framework-Specific References** (40 files)
  - `references/laravel/`: Laravel 12 + PHP 8.5 (Larastan, Pint, PHPUnit, Pest)
  - `references/nextjs/`: Next.js 16 + React 19 (ESLint, Vitest, App Router)
  - `references/react/`: React 19 + TanStack (ESLint, Vitest, Testing Library)
  - `references/swift/`: Swift 6 + SwiftUI (SwiftLint, XCTest, @Observable)

- **Auto-Detection System**
  - `composer.json` + `artisan` → Laravel references
  - `next.config.*` → Next.js references
  - `package.json` (react) → React references
  - `Package.swift`, `*.xcodeproj` → Swift references

### Changed

- Updated marketplace.json with apex skill
- Updated README.md with auto-detection documentation
- Updated plugins/ai-pilot/README.md with APEX phases (00-09)

## [1.5.4] - 18-01-2026

### Added

- **Complete SEO/GEO 2026 Documentation** (40 files)
  - `01-seo-foundations/`: Current date awareness, research workflow, SEO vs GEO paradigm
  - `02-onpage-seo/`: Meta tags, Open Graph (Facebook/LinkedIn), Twitter Cards, H1-H6, alt text
  - `03-schema-org/`: 9 schema types (Article, FAQ, Product, LocalBusiness, Organization, Person, Breadcrumb, HowTo, Review)
  - `04-geo-2026/`: AI platforms (ChatGPT, Gemini, Claude, Perplexity, Copilot), citation strategies (Princeton 10 tactics), zero-click optimization
  - `05-technical-seo/`: Core Web Vitals (LCP, INP, CLS), mobile-first, crawlability
  - `06-content-strategy/`: E-E-A-T 2026, anti-cannibalization, AI content guidelines
  - `07-sea-google-ads/`: Quality Score, landing pages, ad extensions
  - `08-measurement/`: GEO tracking tools (OmniSEO, Otterly.ai, Rankscale), Share of Model
  - `09-checklists/`: Pre-publication, technical audit, GEO compliance

- **Swift MCP Tools Integration** (3 files)
  - `mcp-tools/xcode-build-mcp.md`: XcodeBuildMCP documentation (build, clean, create projects)
  - `mcp-tools/apple-docs-mcp.md`: Apple Docs MCP with WWDC 2014-2025 offline access
  - `mcp-tools/SKILL.md`: MCP tools index and workflow integration

### Changed

- **seo-expert agent**: Updated to 2026 standards with GEO integration, Open Graph, Twitter Cards, complete schema coverage
- **swift-expert agent**: Added MCP tools (`mcp__XcodeBuildMCP__*`, `mcp__apple-docs__*`), research priority (Apple Docs MCP > Context7)
- **solid-swift skill**: Updated workflow with Apple Docs MCP as PRIMARY source, XcodeBuildMCP build validation
- **Model corrections**: Fixed model from opus to sonnet in design-expert, laravel-expert, nextjs-expert, react-expert agents

## [1.5.3] - 18-01-2026

### Added

- **Anti-AI Slop System** for design-expert
  - `references/typography.md` - Fonts FORBIDDEN/APPROVED list
  - `references/color-system.md` - CSS variables, IDE-inspired palettes
  - `references/motion-patterns.md` - Orchestrated animations, hover states
  - `references/theme-presets.md` - Brutalist, Solarpunk, Editorial, Cyberpunk, Luxury
- **4-Pillar Framework** in design-expert agent (Typography, Colors, Motion, Backgrounds)
- **Theme Presets** with implementation examples
- **Step 0** in generating-components workflow (MANDATORY read anti-AI slop refs)
- Border-left colored indicators prohibition in all design agents

### Changed

- Optimized design-expert.md from 305 lines to 131 lines (following Anthropic best practices)
- Moved detailed examples to reference files
- Updated generating-components SKILL.md with 7-step workflow
- Added anti-AI slop rules to react-expert and tailwindcss-expert agents
- Updated marketplace.json to v1.5.3

## [1.5.2] - 18-01-2026

### Changed
- **Major refactor of design-expert agent** - No more generic AI aesthetics
- Added MANDATORY WORKFLOW (search 21st.dev BEFORE coding)
- Added DESIGN THINKING section (purpose, tone, differentiation)
- Added FORBIDDEN patterns (Generic AI Slop, empty heroes, flat cards)
- Integrated frontend-design skill principles (bold aesthetics, distinctive fonts)
- Refactored generating-components skill (strict workflow, forbidden patterns)
- Refactored adding-animations skill (MANDATORY Framer Motion)

## [1.5.1] - 18-01-2026

### Added
- Color pink to design-expert agent
- Emoji icons prohibition (use Lucide React / Blade Icons only)
- Semantic versioning rules in commit commands

### Changed
- Updated marketplace.json to v1.5.1

## [1.5.0] - 18-01-2026

### Added
- Mandatory skills usage enforcement for nextjs-expert, react-expert, laravel-expert
- Task-to-skill mapping tables in agent definitions
- 4-step workflow: identify domain → load skill → follow docs → code

### Changed
- Updated marketplace.json to v1.5.0

## [1.4.0] - 17-01-2026

### Added
- fuse-design plugin (Expert UI/UX design for React/Next.js)
- design-expert agent with shadcn/ui, 21st.dev, Tailwind CSS
- generating-components skill (component generation with 21st.dev)
- designing-systems skill (design tokens, color palettes, typography)
- validating-accessibility skill (WCAG 2.2 Level AA)
- adding-animations skill (Framer Motion micro-interactions)
- /design command (5-phase workflow: Discover → Design → Build → Animate → Validate)

### Changed
- Updated marketplace.json to v1.4.0 (9 plugins, 14 agents, 64 skills)
- Updated README.md and docs with fuse-design documentation

## [1.3.0] - 17-01-2026

### Added
- laravel-i18n skill (localization with SOLID architecture)
- laravel-permission skill (Spatie Laravel Permission for RBAC)
- nextjs-i18n skill (Next.js 16 with proxy.ts, SOLID architecture)
- react-i18n skill (react-i18next with SOLID architecture)

### Changed
- Updated marketplace.json to v1.3.0
- Updated README.md (60 skills)
- Updated agents with new i18n skills
