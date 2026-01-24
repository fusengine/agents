# Release Notes

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
