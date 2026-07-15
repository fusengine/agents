# Fusengine Claude Code Plugins

![version](https://img.shields.io/badge/version-v1.39.4-blue?style=flat-square) ![plugins](https://img.shields.io/badge/plugins-24-brightgreen?style=flat-square) ![agents](https://img.shields.io/badge/agents-36-blueviolet?style=flat-square) ![skills](https://img.shields.io/badge/skills-196-orange?style=flat-square) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square) ![platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux-lightgrey?style=flat-square) ![Windows](https://img.shields.io/badge/Windows-soon-orange?style=flat-square)

> A plugin ecosystem that turns Claude Code into a supervised, multi-agent development environment. Expert agents write code, hooks enforce quality in real-time, skills inject framework-specific knowledge, and **intelligent cartography auto-maps plugins and projects** — so Claude never guesses, never duplicates, and always follows your architecture.

![Statusline](docs/img/statusline.png)

![Demo: the hook → agent → sniper cycle](docs/img/demo.gif)

> Scripted demo — a faithful reconstruction of the real hook → agent → sniper cycle. Regenerate with `vhs docs/demo/hook-sniper.tape`.

## What It Does

**Without plugins:** Claude Code writes code based on its training data. It can hallucinate APIs, duplicate existing code, ignore your project structure, and produce inconsistent quality.

**With Fusengine plugins:**

- **Expert agents** detect your project type (Next.js, Laravel, React, Astro, Swift...) and load framework-specific documentation via MCP servers before writing a single line
- **60+ hook checks** intercept Write/Edit/Bash **and** agent/session lifecycle events to enforce file-size limits (<100 lines), block code duplication (DRY), require SOLID reference reads, gate documentation lookup, and block destructive shell commands
- **196 skills** inject copy-paste-ready templates, architecture patterns, and best practices directly into agent context — no hallucination needed
- **APEX workflow** structures every task through Analyze → Plan → Execute (TDD) → Review → Validate — preventing the "just write code and hope" approach
- **Sniper agent** — a 7-phase post-edit quality check (explore → research → grep usages → lint → fix → zero errors) the APEX workflow invokes after every modification

## Quick Install

```bash
# Add marketplace
/plugin marketplace add fusengine/agents

# Install all plugins
/plugin install fuse-ai-pilot fuse-commit-pro fuse-laravel fuse-nextjs fuse-react fuse-astro fuse-swift-apple-expert fuse-solid fuse-tailwindcss fuse-design fuse-prompt-engineer fuse-shadcn-ui fuse-security fuse-changelog fuse-lessons fuse-tanstack-start fuse-typescript fuse-php fuse-rust fuse-go

# Setup (hooks + API keys + MCP servers)
~/.claude/plugins/marketplaces/fusengine-plugins/setup.sh        # macOS / Linux
~\.claude\plugins\marketplaces\fusengine-plugins\setup.ps1       # Windows
```

**Statusline (optional):**
```bash
bun --cwd ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/core-guards/statusline run config
```

## How It Works

```
User prompt → Hook detects project type → Expert agent activated
            → Hook loads SOLID references → Agent reads docs via MCP
            → Hook blocks if DRY violation → Agent writes code
            → Hook checks file size → Agent runs Sniper validation
            → Commit gate blocks on lint/type errors → Commit with version bump
```

Every step is intercepted. Claude cannot skip research, cannot duplicate code, cannot exceed file size limits, and cannot commit with lint or type errors.

## Plugins

### Development — Framework Expert Agents

Each plugin provides an **expert agent** that auto-activates when it detects the framework in your project. The agent has access to official documentation via MCP servers and follows SOLID principles enforced by hooks.

| Plugin | Detects | What the agent does |
|--------|---------|---------------------|
| [fuse-nextjs](docs/plugins/nextjs.md) | `next.config.*` | App Router, RSC, Prisma 7, Better Auth, proxy.ts patterns |
| [fuse-laravel](docs/plugins/laravel.md) | `composer.json` + `artisan` | Eloquent, Livewire, Blade, queues, Sanctum, Stripe Connect |
| [fuse-react](docs/plugins/react.md) | `package.json` + React | React 19 hooks, TanStack Router/Form, Zustand stores |
| [fuse-astro](docs/plugins/astro.md) | `astro.config.*` | Islands, Content Layer, Actions, SEO, Starlight, i18n |
| [fuse-swift-apple-expert](docs/plugins/swift.md) | `Package.swift` | SwiftUI, concurrency, all Apple platforms (iOS → visionOS) |
| [fuse-tailwindcss](docs/plugins/tailwindcss.md) | `tailwind.config.*` | v4.1 CSS-first config, @theme, @utility, OKLCH colors |
| [fuse-design](docs/plugins/design.md) | Any UI task | Gemini Design MCP + shadcn/ui + WCAG 2.2 accessibility |
| [fuse-shadcn-ui](docs/plugins/shadcn.md) | `components.json` | Radix/Base UI detection, registry, theming, migration |
| [fuse-tanstack-start](docs/plugins/tanstack-start.md) | `@tanstack/react-start` | Server functions, selective SSR, middleware, server routes, Nitro deploy |
| [fuse-typescript](docs/plugins/typescript.md) | `tsconfig.json` (no framework) | Pure TS 6.0, Node 24 LTS / Bun 1.3, strict typing, ESM packaging |
| [fuse-php](docs/plugins/php.md) | `composer.json` (no `artisan`) | PHP 8.5, PER-CS 3.0, PHPStan, PSR, Slim / Symfony components |
| [fuse-rust](docs/plugins/rust.md) | `Cargo.toml` | Rust 1.96+, 2024 edition, ownership, tokio / axum, clippy-clean |
| [fuse-go](docs/plugins/go.md) | `go.mod` | Go 1.26+, concurrency, backend services, golangci-lint v2 |

### Quality & Security — Automated Enforcement

| Plugin | What it enforces |
|--------|-----------------|
| [fuse-ai-pilot](docs/plugins/ai-pilot.md) | APEX workflow orchestration, 7-phase sniper validation, DRY detection via jscpd, 4-level cache (60-75% token savings) |
| [fuse-security](docs/plugins/security.md) | OWASP Top 10 scanning, CVE research via NVD/OSV.dev, dependency audit, secrets detection, auth patterns audit |
| [fuse-solid](docs/plugins/solid.md) | Files < 100 lines, interface separation, JSDoc mandatory — auto-detected for TypeScript, PHP, Swift, Go, Java, Ruby, Rust |

### Productivity — Automation

| Plugin | What it automates |
|--------|-------------------|
| [fuse-commit-pro](docs/plugins/commit-pro.md) | Conventional commits with security check, auto version bump, CHANGELOG, git tag — with a pre-commit secret-pattern scan |
| [fuse-prompt-engineer](docs/plugins/prompt-engineer.md) | Prompt creation with CoT/Few-Shot/Meta-Prompting, A/B testing, 50+ template library, agent design |
| [fuse-cartographer](docs/plugins/cartographer.md) | Intelligent cartography: auto-generates navigable maps of plugins and projects at SessionStart with merge-preserving enrichment — agents navigate via linked index trees, `/map --enrich` completes descriptions from source frontmatter |
| [fuse-changelog](docs/plugins/changelog.md) | Monitors Claude Code updates, detects breaking changes in plugins, gathers community feedback via Exa |
| [fuse-lessons](docs/plugins/lessons.md) | Per-project "never reproduce" memory — writes compact timestamped lessons to `MEMORY/LESSON.md` after code edits and force-reads them at session/subagent start so mistakes don't recur across sessions |

### Core (auto-installed, always active)

| Plugin | What it guards |
|--------|----------------|
| core-guards | Blocks `git push --force`, `rm -rf`, `npm install` without lock, enforces SOLID file limits, tracks session state, DRY duplication blocking — also bundles token-optimization hooks (MCP verbosity caps, MCP + WebFetch disk cache, SessionStart cleanup) |
| claude-rules | Injects APEX/SOLID/DRY rules into every prompt so Claude never forgets the methodology |

## Key Features

| Feature | How it prevents mistakes |
|---------|-------------------------|
| **APEX Workflow** | Forces Analyze before coding — no more "let me just write this real quick" |
| **[Agent Teams](docs/workflow/agent-teams.md)** | Parallel agents with exclusive file ownership — no merge conflicts |
| **DRY Detection** | Blocks Write/Edit if function/class name already exists — forces import or shared extraction |
| **SOLID Hooks** | Denies file save if >100 lines or missing SOLID reference read |
| **Sniper Validation** | 7-phase post-edit check: explore → research → grep → lint → fix → zero errors |
| **[4-Level Cache](docs/reference/cache-system.md)** | Caches exploration, docs, lessons, tests — 60-75% token savings |
| **Token-efficient by default** | Caps MCP verbosity (Context7/Exa `numResults≤3`, `tokens≤2000`), disk cache for MCP results + WebFetch with TTL (48h / 24h) and ripgrep lookup, auto-cleanup at SessionStart — typically saves ~150-200 KB per research-heavy session |
| **23 MCP Servers** | Context7, Exa, Astro docs, Gemini Design, shadcn, fuse-browser, and more |
| **Smart Commits** | Security scan before commit, auto version bump, CHANGELOG, shields.io badge sync |

## Documentation

| Section | Content |
|---------|---------|
| [Getting Started](docs/getting-started/) | Installation, configuration, first steps |
| [Workflow](docs/workflow/) | APEX methodology, agents, skills, commands |
| [Plugins](docs/plugins/) | Per-plugin documentation and skills |
| [Reference](docs/reference/) | Architecture, hooks, MCP servers, cache system |

## License

MIT
