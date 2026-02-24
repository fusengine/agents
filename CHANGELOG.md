# Release Notes

## [1.38.0] - 24-02-2026

### Fixed
- Add missing `Task` tool to sniper-faster agent (ai-pilot 1.2.1)

### Changed
- SOLID split: extract `actions-handler.types.ts`, `reset-handler.ts` from actions-handler (core-guards 1.1.1)
- SOLID split: extract `preview-sections.ts`, `progress-bar.utils.ts` from preview-renderer
- SOLID split: extract `oauth-formatter.ts` from oauth.service

### Added
- MINOR version bump and git tag rules for `feat` commits (commit-pro 1.2.2)
- Version impact section in commit-detection SKILL
- hooks.json for shadcn-expert plugin (shadcn-ui 1.0.2)

## [1.37.0] - 24-02-2026

### Added
- Metadata-aware reference routing for SOLID hooks (Gate 1 TS + Gate 2 Python)
- `ref-router.ts` and `ref_router.py` with scoring algorithm (glob 10pts, path 5pts, keyword 1pt)
- `ref-router.interface.ts` for routing types (RefMeta, ScoredRef, RouteResult)
- Cache system with automatic invalidation (`ref-cache-*.json`)
- New SOLID skills: solid-generic, solid-go, solid-java, solid-ruby, solid-rust
- New SOLID references: solid-php (5 principles), solid-swift (8 references + 5 templates)
- Frontmatter v2 fields (`applies-to`, `trigger-on-edit`, `level`) across 134 references

### Changed
- Hooks now return 2-4 specific references instead of generic "read SKILL.md"
- `enforce-apex-phases.ts` integrates ref-router for targeted deny messages
- `require-solid-read.py` integrates Python ref-router with fallback
- `cleanup-session-states.py` cleans stale ref-cache files

## [1.36.40] - 23-02-2026

### Changed
- Redesign web configurator with professional dark theme and Satoshi font
- Add Fusengine logo in sidebar via `/assets/logo` route
- Remove all emojis from UI (icons, nav, console)
- Wire per-segment `showLabel` toggle to live preview rendering
- Extract `preview-usage.ts` for usage segment rendering (SOLID split)

## [1.36.39] - 23-02-2026

### Changed
- Split `configure.ts` (186 lines) into `src/configure/` (3 SOLID modules)
- Split `configure-web.ts` (768 lines) into `src/configure-web/` (7 SOLID modules)
- Fix ConfigManager to save user overrides in plugin-local `user-config.json`
- Add `user-config.json` to `.gitignore`

## [1.36.38] - 23-02-2026

### Changed
- Port security guard hook from Node.js subprocess to native Python
- Move `security_rules.py` to `_shared/scripts/` for cross-plugin reusability
- Remove obsolete `validate-command.js` and `security-rules.js`

## [1.36.37] - 23-02-2026

### Added
- 82 Python hook scripts replacing all Bash scripts for better cross-platform support and structured JSON output
- `plugins/_shared/` module with common utilities (locking, tracking, framework detection, SOLID validation)
- `pyrightconfig.json` for Python type checking

### Changed
- Archive 76 legacy `.sh` hook scripts to `archives/plugins-sh/`
- Update 12 `hooks.json` files to reference `.py` scripts instead of `.sh`
- Refactor TypeScript installer and services for Python hook execution support
- Fix `shadcn-ui-expert` agent color from unsupported `indigo` to `purple`

## [1.36.36] - 22-02-2026

### Changed
- Disable plugin-scoped `.mcp.json` files (renamed to `mcp.json.bak`) to eliminate ~105 duplicate MCP tool entries and reduce context consumption by ~50%

## [1.36.35] - 22-02-2026

### Added
- `hooks-loader.ts`: inject stderr from hooks as `systemMessage` for user-visible feedback (skill loaded, rules loaded)
- `hook-executor.ts`: collect stderr from successful hooks and forward to loader

### Changed
- `claude-rules/hooks.json`: pass `${CLAUDE_PLUGIN_ROOT}` as argument to inject-rules.sh
- `claude-rules/inject-rules.sh`: read plugin root from `$1` argument instead of env var
- `claude-rules/rules/*`: compress 8 rules files -68% (14,760 → 5,170 chars), remove duplicates with CLAUDE.md, remove frontmatter

## [1.36.34] - 21-02-2026

### Changed
- `commit-pro/commands/commit.md`: CHANGELOG.md always committed last as separate commit, marketplace.json included if version bumped
- `ai-pilot/commands/commit.md`: same rule added

## [1.36.33] - 21-02-2026

### Added
- `core-guards/auto-document-reads.sh`: visual feedback `skill loaded: {name}` on stderr for every SKILL.md read (all 100+ skills)

## [1.36.32] - 21-02-2026

### Fixed
- `shadcn-expert/rules/apex-workflow.md`: add frontmatter (description + next_step)
- `shadcn-expert/rules/shadcn-rules.md`: add frontmatter (description + next_step)
- `shadcn-expert/agents/shadcn-ui-expert.md`: replace unsupported color `violet` with `indigo`

## [1.36.31] - 21-02-2026

### Added
- **claude-rules plugin**: 8 rules (00→07) covering APEX, SOLID, DRY, agent teams, frontend, state management
- **Per-prompt injection**: SessionStart + UserPromptSubmit hooks for persistent context across compression
- **Visual feedback**: `claude memory: CLAUDE.md loaded` + `rules: N rules loaded` on each prompt
- **State management rule**: Zustand stores for shared state, TanStack Query for server state (React/Next.js)

### Changed
- `install-hooks.ts`: CLAUDE.md source moved to `plugins/claude-rules/templates/CLAUDE.md.template`
- `core-guards/read-claude-md.sh`: stderr feedback added on CLAUDE.md injection
- SOLID skills enriched: laravel, nextjs, react, swift
- `CLAUDE.md`: added DRY rule (rule #5) and claude-rules plugin reference

## [1.36.30] - 18-02-2026

### Changed

- **docs**: Add React Effects Audit to README features list

## [1.36.29] - 18-02-2026

### Added

- **sniper**: Integrate `react-effects-audit` skill for automatic useEffect anti-pattern detection on React/Next.js projects
- **sniper**: Add conditional Phase 3.6 to workflow for 9 useEffect anti-patterns
- **sniper-faster**: Add React/Next.js conditional capabilities section

## [1.36.28] - 18-02-2026

### Fixed

- **hooks**: Await async hook processes (afplay) to prevent premature termination on parent exit

## [1.36.27] - 18-02-2026

### Added

- **setup**: Interactive language selection prompt with 10 languages (default: English)
- **setup**: New `setup-plugins.ts` service extracted from setup-runner (SOLID SRP)

### Changed

- **setup**: `configureDefaults` now accepts optional language parameter instead of hardcoded "french"
- **tests**: Split settings-manager tests into load-save and configure suites

## [1.36.26] - 18-02-2026

### Added

- **ai-pilot**: New `react-effects-audit` skill — audit React useEffect anti-patterns (9 detection rules from "You Might Not Need an Effect")
- **ai-pilot**: Cross-references with `solid-nextjs` and `solid-react` SOLID skills for architecture-level validation

### Changed

- **docs**: Update README.md, ai-pilot.md, and skills.md with new skill (71 skills total)
- **marketplace**: Register react-effects-audit in fuse-ai-pilot plugin

## [1.36.25] - 18-02-2026

### Added

- **ai-pilot**: Add Phase 3.5 DRY detection via jscpd to sniper 7-phase workflow
- **ai-pilot**: Add duplication-thresholds.md with per-language jscpd thresholds
- **ai-pilot**: Add jscpd commands to linter-commands.md reference
- **statusline**: Add ExtraUsage segment for overage billing (OAuth API)
- **statusline**: Add ExtraUsageLimits interface and ExtraUsageSegmentConfigSchema

### Changed

- **ai-pilot**: Refactor code-quality SKILL.md into 4 reference files (solid-validation, file-size-rules, validation-report, duplication-thresholds)
- **ai-pilot**: Make code-quality skill user-invocable
- **statusline**: SRP split defaults.ts into defaults.ts + design-defaults.ts
- **deps**: Bump @types/bun to ^1.3.9, @biomejs/biome to ^2.4.2, @clack/prompts to ^1.0.1

### Removed

- **statusline**: Remove stale .claude/apex/ task tracking files

## [1.36.24] - 10-02-2026

### Fixed

- **statusline**: Show remaining time instead of reset date in limits segment (e.g. "1d - 5h" instead of "12.02 - 17h")
- **statusline**: Add days support to formatTimeLeft with dash separator

## [1.36.23] - 10-02-2026

### Changed

- **ai-pilot**: Migrate 18 hook scripts from bash to TypeScript/Bun with shared lib/
- **ai-pilot**: Remove doc-cache-gate from hooks.json to prevent stale documentation
- **installer**: Add ai-pilot/scripts bun install step in setup-runner
- **installer**: Extract installPluginDeps() helper in fs-helpers.ts

## [1.36.22] - 09-02-2026

### Added

- **ai-pilot**: Add 4-level cache system (explore 24h, doc 7d, lessons 30d, tests 48h)
- **ai-pilot**: Add cache-doc-from-transcript.sh with jq-first approach for SubagentStop
- **ai-pilot**: Add cross-project global lessons promotion (promote-global-lessons.sh)
- **ai-pilot**: Add cache analytics tracking (sessions.jsonl + summary.json)
- **ai-pilot**: Add test-cache-inject.sh and cache-test-results.sh for sniper optimization
- **ai-pilot**: Add sniper-check skill for isolated code validation
- **docs**: Add cache-system.md reference documentation

### Changed

- **ai-pilot**: Update hooks.json with SubagentStart/SubagentStop sniper hooks and SessionEnd analytics
- **ai-pilot**: Update agents (explore-codebase, research-expert, sniper) with cache instructions
- **docs**: Update architecture.md, hooks.md, ai-pilot.md with cache system details

## [1.36.21] - 09-02-2026

### Changed

- **hooks-loader**: Update hook-executor with agent type matching
- **hooks-loader**: Update plugin-scanner with SubagentStart/SubagentStop support
- **swift-apple-expert**: Update MCP server configuration
- **marketplace**: Update marketplace.json manifest

## [1.36.20] - 09-02-2026

### Changed

- **statusline**: Rewrite configurator with new menu sections and option toggler
- **statusline**: Redesign config schemas (common, core-segments, design, usage-segments)
- **statusline**: Add agent segment for team monitoring
- **statusline**: Improve progress bar constants and color utilities
- **statusline**: Update renderer and service layer

## [1.36.20] - 07-02-2026

### Fixed

- **fuse-react**: Remove orphan skill references for `react-hooks` and `react-performance` in marketplace.json
- **docs**: Update react.md and skills.md to reflect merged skills (8 instead of 10)

## [1.36.19] - 07-02-2026

### Added

- **security**: Add SECURITY.md with vulnerability reporting policy and scope

## [1.36.18] - 07-02-2026

### Added

- **agent-teams**: Add delegation rules to CLAUDE.md (lead-as-coordinator, file ownership, max 4 teammates)
- **agent-teams**: Create docs/workflow/agent-teams.md with full delegation guide
- **hooks**: Add 3 new lifecycle hooks: PreCompact, SessionEnd, Setup
- **hooks**: Add bash scripts for pre-compact, session-end, and setup hooks
- **installer**: Add Agent Teams prompt in setup-runner (enable/disable)
- **installer**: Add enableAgentTeams/isAgentTeamsEnabled to settings-manager

### Changed

- **apex**: Migrate TodoWrite → TaskCreate/TaskUpdate across 17 APEX references
- **skills**: Replace "launch in parallel" → TeamCreate across 61 skills/agents
- **hooks**: Add PreCompact, SessionEnd, Setup to HookType interface
- **docs**: Update README, docs index, agents doc with Agent Teams links

## [1.36.16] - 04-02-2026

### Changed

- **design-expert**: Restructure to skill-creator pattern with modular rules
  - Move references from root to skills/*/references/
  - Extract APEX workflow, Gemini Design, Framework Integration to rules/
  - Add Playwright browser preview tools (navigate, snapshot, screenshot)
  - Reduce agent file from 216 to 94 lines
  - Split large references (>150 lines) into focused files

## [1.36.15] - 04-02-2026

### Added

- **mcp**: Add 8 missing API keys support (GitHub, Supabase, Slack, Sentry, Brave, Stripe, Notion, Replicate)
- **mcp**: Update mcp.json with verified packages (Playwright logging, Brave, Stripe, Notion)
- **hooks**: Add auto-document-reads hook for tracking documentation reads

### Changed

- **versioning**: Simplify to PATCH-only (+0.0.1) across all commit types

## [1.36.14] - 03-02-2026

### Changed

- **hooks**: Rewrite APEX/SOLID enforcement with session-based 2min TTL
  - Unified state file in ~/.claude/logs/00-apex/
  - Session isolation for multi-project support
  - 2-minute TTL for doc consultation validity
  - Portable file locking (mkdir-based for macOS)
  - Simplified framework detection logic

## [1.36.13] - 02-02-2026

### Fixed

- **laravel-expert**: Add complete frontmatter to solid-php references and templates (when-to-use, keywords, priority, related)

## [1.36.12] - 02-02-2026

### Changed

- **laravel-expert**: Restructure solid-php skill with complete SOLID and FuseCore coverage
  - Add anti-patterns detection guide with code smells and fixes
  - Add decision guide for pattern selection (Service vs Action vs Repository)
  - Add complete FuseCore modular architecture documentation (Laravel + React)
  - Add controller, action, FormRequest, policy templates
  - Add step-by-step refactoring guide for legacy code migration

## [1.36.11] - 02-02-2026

### Fixed

- **laravel-expert**: Remove deprecated laravel-testing reference files (database-testing.md, dusk.md, http-tests.md, mocking.md, pint.md, testing.md)

## [1.36.10] - 02-02-2026

### Changed

- **laravel-expert**: Restructure laravel-testing skill with complete Pest 3 coverage
  - Split monolithic files into 15 modular references (<150 lines each)
  - Add 15 references: pest-basics, pest-datasets, pest-arch, http-requests, http-json, http-auth, http-assertions, database-basics, database-factories, database-assertions, mocking-services, mocking-fakes, mocking-http, console-tests, troubleshooting
  - Add 5 complete templates: FeatureTest, UnitTest, ArchTest, ApiTest, PestConfig
  - Remove out-of-scope files (dusk.md → browser testing, pint.md → code style)
  - Total reduction: 6,098 → 2,657 lines (56% reduction)

## [1.36.9] - 02-02-2026

### Changed

- **laravel-expert**: Restructure laravel-queues skill with complete Jobs & Queues coverage
  - Replace 11 massive files (13K+ lines) with 10 modular references (<150 lines each)
  - Add 10 references: jobs, dispatching, workers, batching, chaining, middleware, failed-jobs, horizon, testing, troubleshooting
  - Add 5 complete templates: QueueableJob, BatchJob, ChainedJobs, JobMiddleware, JobTest
  - Remove out-of-scope topics (notifications, broadcasting, mail, events, cache → separate skills)
  - Focus scope exclusively on Jobs & Queues (-80% lines, +100% clarity)

## [1.36.8] - 02-02-2026

### Changed

- **laravel-expert**: Restructure laravel-migrations skill with complete Laravel 12 coverage
  - Add 9 modular references (schema, columns, indexes, foreign-keys, commands, seeding, testing, production, troubleshooting)
  - Add 5 complete templates (CreateTableMigration, ModifyTableMigration, PivotTableMigration, Seeder, MigrationTest)
  - Remove out-of-scope files (queries.md → laravel-eloquent, database.md, mongodb.md)
  - All references < 150 lines with tables and decision trees (100% skill-creator compliant)

## [1.36.7] - 02-02-2026

### Changed

- **laravel-expert**: Restructure laravel-livewire skill with complete Livewire 3 coverage
  - Add 13 new core references (components, wire-directives, lifecycle, forms-validation, events, alpine-integration, file-uploads, nesting, loading-states, navigation, testing, security, volt)
  - Add 7 complete templates (BasicComponent, FormComponent, VoltComponent, DataTableComponent, FileUploadComponent, NestedComponents, ComponentTest)
  - Restructure folio.md, precognition.md, reverb.md to follow skill-creator pattern (< 150 lines, tables, decision trees)
  - Remove out-of-scope prompts.md (Laravel Prompts CLI, not Livewire)
  - Coverage increased from 4 satellite files to 23 comprehensive references (+475%)

## [1.36.6] - 02-02-2026

### Changed

- **laravel-expert**: Restructure laravel-i18n skill with complete coverage
  - Add 4 new references: middleware (locale detection), formatting (date/number/currency), packages (vendor translations), best-practices (large app organization)
  - Add 2 new templates: LocaleServiceProvider (centralized service with helpers), LocaleRoutes (URL prefix routing with SEO)
  - Update SKILL.md with complete reference guide and decision trees
  - Coverage increased from 5 to 16 topics (+220%)

## [1.36.5] - 02-02-2026

### Changed

- **laravel-expert**: Restructure laravel-eloquent skill with modular references
  - Split monolithic files (13,254 lines) into 21 focused references (<150 lines each)
  - 21 conceptual references: models, relationships (basic, many-to-many, advanced, polymorphic), eager-loading, scopes, casts, accessors-mutators, events-observers, soft-deletes, collections, serialization, factories, performance, resources, transactions, pagination, aggregates, batch-operations, query-debugging
  - 7 complete code templates: ModelBasic.php, ModelRelationships.php, ModelCasts.php, Observer.php, Factory.php, Resource.php, EagerLoadingExamples.php
  - Add 5 new critical references: transactions, pagination, aggregates, batch-operations, query-debugging
  - Remove deprecated eloquent-*.md files in favor of modular structure

## [1.36.4] - 02-02-2026

### Added

- **laravel-expert**: Add laravel-vite skill with complete Vite/Inertia documentation
  - 12 conceptual references (setup, entry-points, preprocessors, assets, environment, dev-server, build-optimization, ssr, inertia, frameworks, security, deployment)
  - 4 complete code templates (ViteConfig.js, ViteConfigAdvanced.js, InertiaSetup, SSRSetup)
  - Full Inertia.js integration with Vue and React
  - SSR configuration with Supervisor/PM2
  - Docker/Sail HMR configuration
  - CSP nonce security
  - Production deployment with CDN support

## [1.36.3] - 02-02-2026

### Changed

- **laravel-expert**: Restructure laravel-blade skill with complete Blade coverage
  - 11 guiding references (components, slots, layouts, directives, security, vite, advanced-directives, custom-directives, advanced-components, forms-validation, fragments)
  - 10 code templates (ClassComponent, AnonymousComponent, LayoutComponent, FormComponent, CardWithSlots, DynamicComponent, AdvancedDirectives, CustomDirectives, AdvancedComponents, Fragments)
  - Add Laravel 12 features: @fragment, @use, @inject, @once, @aware, @hasStack
  - Add forms-validation.md with @error and form attribute helpers
  - Add fragments.md for HTMX/Turbo integration
  - Add custom directives documentation (Blade::if, Blade::directive)
  - Add SSR, Inertia.js, CSP configuration to vite.md
  - Remove obsolete files: blade.md, frontend.md, localization.md, views.md

## [1.36.2] - 02-02-2026

### Added

- **laravel-expert**: Add laravel-stripe-connect skill for marketplaces
  - 8 concept references (account-types, payment-flows, onboarding, fees, payouts, refunds, compliance)
  - 6 code templates (Seller, Onboarding, Payments, Payouts, Webhooks, Routes)
  - Support for Express/Standard/Custom accounts
  - Destination charges with application fees

### Changed

- **laravel-expert**: Restructure laravel-billing with concepts/templates separation
  - 12 concept references (stripe, paddle, subscriptions, webhooks, invoices, checkout, etc.)
  - 11 code templates (UserBillable, Controllers, Routes, Tests)
  - Add advanced SaaS features: metered billing, team billing, dunning, feature flags
  - Remove obsolete billing.md and cashier-paddle.md

## [1.36.1] - 02-02-2026

### Added

- Add statusline screenshot and configuration commands to README
- Cross-platform commands for macOS/Linux and Windows

## [1.36.0] - 02-02-2026

### Added

- **ai-pilot**: Transform skill-creator and agent-creator from commands to skills
  - skill-creator: SKILL.md + 5 references + 3 templates (workflow, architecture, content-rules, registration, adaptation)
  - agent-creator: SKILL.md + 5 references + 2 templates (architecture, frontmatter, required-sections, hooks, registration)
  - Add docs/reference/creating-skills-agents.md guide
  - Update docs/plugins/ai-pilot.md and docs/workflow/skills.md (6 → 8 skills)

## [1.35.1] - 02-02-2026

### Changed

- **laravel-expert**: Restructure skills with skill-creator pattern
  - laravel-auth: Convert 13 references to conceptual docs (<150 lines each)
  - laravel-auth: Add 8 code templates (Sanctum, Passport, Fortify, Socialite, Policies)
  - laravel-auth: Add FuseCore integration section with module-level auth
  - laravel-architecture: Rewrite lifecycle, releases, concurrency as decision guides
  - laravel-architecture: Add 6 templates (Artisan, Envoy, MCP, Pennant, Octane, Sail)
  - fusecore: Add module-level Config/ support documentation
  - fusecore: Update traits.md with loadModuleConfig() examples

## [1.35.0] - 01-02-2026

### Added

- **swift-apple-expert**: Add Swift 6.2, iOS 26 Liquid Glass, and tvOS support
  - Swift 6.2 features: nonisolated(nonsending), @InlineArray, Span, Named Tasks, Task.immediate
  - iOS 26 Liquid Glass: .glassEffect() API, GlassEffectContainer, .buttonStyle(.glass)
  - SwiftData model inheritance for iOS 26
  - Swift Testing framework with @Test and #expect
  - New tvOS skill with focus system, media playback, remote control
  - Plugin version updated to 1.1.0

- **laravel-permission**: Restructure skill with references and templates
  - Add 6 references: api-usage, events, performance, policies, query-scopes, testing
  - Add 12 PHP templates for common permission patterns
  - Add fusecore skill for Laravel Fusengine integration

## [1.34.0] - 31-01-2026

### Added

- **design-expert**: Add 8 new skills and 7 reference guides
  - Skills: glassmorphism-advanced, theming-tokens, component-variants, dark-light-modes, responsive-system, interactive-states, component-composition, layered-backgrounds
  - References: buttons-guide, cards-guide, forms-guide, gradients-guide, grids-layout, icons-guide, photos-images
  - Enrich color-system, typography, and design-rules references

## [1.33.3] - 31-01-2026

### Changed

- **react-testing**: Restructure skill with proper skill-creator conventions
  - Add 10 conceptual references (queries, async, msw, accessibility, etc.)
  - Add 9 templates with complete copy-paste ready code
  - Separate concepts from templates per skill-creator rules
  - Add React 19 hooks testing (useActionState, useOptimistic, use())
  - Add accessibility testing with axe-core and vitest-axe

## [1.33.2] - 31-01-2026

### Changed

- **ai-pilot**: Replace direct git commit with smart commit request in sync-task-tracking.sh
  - Now outputs MANDATORY instruction to run `/fuse-commit-pro:commit`
  - Removes unsafe `--no-verify` flag and blind `git add -A`
  - Enables smart commit type detection (docs/fix/feat/chore)
- **react-tanstack-router**: Set skill as user-invocable

## [1.33.1] - 31-01-2026

### Changed

- **react-tanstack-router**: Restructure skill with 23 English reference files
  - Add 18 concept references + 5 complete code templates
  - Topics: installation, file-based routing, params, loaders, auth, query integration
  - All content converted from French to English
- **ai-pilot**: Add CRITICAL Language Requirement to skill-creator and agent-creator
  - Enforce English-only content for all generated skills and agents
  - Add language validation as first item in validation checklists
  - Improve skill-creator workflow with 4-phase methodology

## [1.33.0] - 31-01-2026

### Added

- **ai-pilot**: Add skill-creator and agent-creator commands
  - skill-creator: Document skill architecture, frontmatter, Agent Workflow, copy & adapt patterns
  - agent-creator: Document agent frontmatter, required sections, hooks, validation checklist
  - Both include registration steps for marketplace.json

## [1.32.6] - 31-01-2026

### Changed

- **react-state**: Restructure skill with 10 Zustand reference files
  - Copy and adapt references from nextjs-zustand pattern
  - Add installation, store-patterns, middleware, typescript docs
  - Add slices, auto-selectors, reset-state, subscribe-api, testing, migration-v5
  - Remove SSR-specific files (hydration, nextjs-integration)

## [1.32.5] - 31-01-2026

### Changed

- **react-shadcn**: Restructure skill with 51 component references
  - Add complete component documentation from nextjs-shadcn pattern
  - Replace Next.js imports with TanStack Router Link
  - Update SKILL.md with versions, references list, and Agent Workflow

## [1.32.4] - 31-01-2026

### Changed

- **react-expert**: Consolidate performance skill into react-19 and standardize agent workflow
  - Merge react-performance into react-19 (virtualization, lazy-loading, profiling)
  - Add 3 conceptual references and 3 code templates for performance patterns
  - Add standardized "Agent Workflow (MANDATORY)" to all SKILL.md files
  - Remove deprecated react-hooks and elicitation from skills list
  - Delete redundant react-performance skill

## [1.32.3] - 31-01-2026

### Added

- **setup**: Auto-make shell scripts executable during installation
  - Add `makeScriptsExecutable()` function in fs-helpers.ts
  - Automatically chmod +x all .sh files in plugins directory
  - Ensures hooks work immediately after installation

## [1.32.2] - 31-01-2026

### Changed

- **react-expert**: Consolidate React hooks documentation into react-19 skill
  - Add 10 explanatory references for classic hooks (useState, useEffect, useRef, etc.)
  - Add 5 code templates (state-patterns, effect-patterns, ref-patterns, custom-hooks, external-store)
  - Remove redundant react-hooks skill (merged into react-19)
  - react-19 now covers all React hooks (classic + new)

### Fixed

- **core-guards**: Add execute permissions to pre-tool-use scripts (enforce-file-size.sh, require-solid-read.sh)

## [1.32.1] - 31-01-2026

### Added

- **react-forms**: Complete TanStack Form v1 documentation with 34 files
  - 16 explanatory references (no code, conceptual)
  - 17 code templates with full TypeScript/JSDoc
  - Core: useForm, useField, form.Field, form.Subscribe
  - Validation: Zod, Yup, Valibot, async, Standard Schema
  - Advanced: listeners, linked fields, reactivity, reset API
  - Integrations: shadcn/ui, SSR/hydration, React Native, Devtools

## [1.32.0] - 31-01-2026

### Added

- **react-19**: Complete React 19 documentation with 23 reference files
  - 11 conceptual references (hooks, APIs, compiler, migration)
  - 12 code templates with practical examples
  - Cover: use(), useActionState, useOptimistic, useFormStatus
  - Cover: useDeferredValue initialValue, useTransition async
  - Cover: Document Metadata, Resource Preloading APIs
  - Cover: Activity component, React Compiler (marked experimental)

- **solid-react**: Restructure SOLID skill with modular architecture
  - 6 explanatory references (SOLID principles + architecture)
  - 10 code templates (component, hook, service, store, etc.)

## [1.31.0] - 31-01-2026

### Added

- **nextjs-shadcn**: Add 50+ component references (button, card, dialog, etc.)
- **nextjs-tanstack-form**: Add 15 references (validation, server-actions, etc.)
- **nextjs-zustand**: Add 12 references (middleware, slices, testing, etc.)
- **prisma-7**: Add 100+ references with complete documentation

### Changed

- **better-auth**: Add frontmatter to all 80+ reference files
- **nextjs-16**: Add frontmatter to all 40+ reference files
- **nextjs-i18n**: Add frontmatter to all 20+ reference files

## [1.30.0] - 31-01-2026

### Added

- **solid-nextjs**: Restructure SOLID skill with modular architecture
  - 7 explanatory references (SOLID principles + architecture)
  - 17 code templates (components, services, queries, stores, i18n, etc.)
  - Add stores/, queries/, i18n/ to modular structure
  - Complete checklists with all file locations

## [1.29.6] - 30-01-2026

### Changed

- **skills**: Standardize SOLID skills format with version, type, category
- **solid-react**: Add references directory with 3 documentation files
- **CLAUDE.md**: Correct Laravel interfaces location to app/Contracts/
- **hooks**: Improve session-start and user-prompt scripts with logging

## [1.29.5] - 29-01-2026

### Changed

- **gitignore**: Broaden .claude exclusion pattern to .claude/*

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
