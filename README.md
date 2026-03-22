# Fusengine Claude Code Plugins

![version](https://img.shields.io/badge/version-v1.38.66-blue?style=flat-square) ![plugins](https://img.shields.io/badge/plugins-18-brightgreen?style=flat-square) ![agents](https://img.shields.io/badge/agents-19-blueviolet?style=flat-square) ![skills](https://img.shields.io/badge/skills-125-orange?style=flat-square) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square) ![platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux-lightgrey?style=flat-square) ![Windows](https://img.shields.io/badge/Windows-soon-orange?style=flat-square)

> A plugin ecosystem that turns Claude Code into a supervised, multi-agent development environment. Expert agents write code, hooks enforce quality in real-time, skills inject framework-specific knowledge, and **intelligent cartography auto-maps plugins and projects** — so Claude never guesses, never duplicates, and always follows your architecture.

![Statusline](docs/img/statusline.png)

## What It Does

**Without plugins:** Claude Code writes code based on its training data. It can hallucinate APIs, duplicate existing code, ignore your project structure, and produce inconsistent quality.

**With Fusengine plugins:**

- **Expert agents** detect your project type (Next.js, Laravel, React, Astro, Swift...) and load framework-specific documentation via MCP servers before writing a single line
- **82 hooks** intercept every Write/Edit/Bash call in real-time to enforce file size limits (<100 lines), block code duplication (DRY), require SOLID references, and validate security
- **125 skills** inject copy-paste-ready templates, architecture patterns, and best practices directly into agent context — no hallucination needed
- **APEX workflow** structures every task through Analyze → Plan → Execute (TDD) → Review → Validate — preventing the "just write code and hope" approach
- **Sniper validation** runs a 7-phase quality check after every modification: explore → research → grep usages → lint → fix → zero errors

## Quick Install

```bash
# Add marketplace
/plugin marketplace add fusengine/agents

# Install all plugins
/plugin install fuse-ai-pilot fuse-commit-pro fuse-laravel fuse-nextjs fuse-react fuse-astro fuse-swift-apple-expert fuse-solid fuse-tailwindcss fuse-design fuse-prompt-engineer fuse-shadcn-ui fuse-security fuse-changelog

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
            → Hook checks file size → Sniper validates quality
            → Hook blocks secrets → Commit with version bump
```

Every step is intercepted. Claude cannot skip research, cannot duplicate code, cannot exceed file size limits, and cannot commit without security validation.

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

### Quality & Security — Automated Enforcement

| Plugin | What it enforces |
|--------|-----------------|
| [fuse-ai-pilot](docs/plugins/ai-pilot.md) | APEX workflow orchestration, 7-phase sniper validation, DRY detection via jscpd, 4-level cache (60-75% token savings) |
| [fuse-security](docs/plugins/security.md) | OWASP Top 10 scanning, CVE research via NVD/OSV.dev, dependency audit, secrets detection, auth patterns audit |
| [fuse-solid](docs/plugins/solid.md) | Files < 100 lines, interface separation, JSDoc mandatory — auto-detected for TypeScript, PHP, Swift, Go, Java, Ruby, Rust |

### Productivity — Automation

| Plugin | What it automates |
|--------|-------------------|
| [fuse-commit-pro](docs/plugins/commit-pro.md) | Conventional commits with security check, auto version bump, CHANGELOG, git tag — blocks secrets from commits |
| [fuse-prompt-engineer](docs/plugins/prompt-engineer.md) | Prompt creation with CoT/Few-Shot/Meta-Prompting, A/B testing, 50+ template library, agent design |
| [fuse-cartographer](docs/plugins/cartographer.md) | Intelligent cartography: auto-generates navigable maps of plugins and projects at SessionStart with merge-preserving enrichment — agents navigate via linked index trees, `/map --enrich` completes descriptions from source frontmatter |
| [fuse-changelog](docs/plugins/changelog.md) | Monitors Claude Code updates, detects breaking changes in plugins, gathers community feedback via Exa |

### Core (auto-installed, always active)

| Plugin | What it guards |
|--------|----------------|
| core-guards | Blocks `git push --force`, `rm -rf`, `npm install` without lock, enforces SOLID file limits, tracks session state, DRY duplication blocking |
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
| **28 MCP Servers** | Context7, Exa, Astro docs, Gemini Design, shadcn, Playwright, and more |
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
