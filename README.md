# Fusengine Claude Code Plugins

![version](https://img.shields.io/badge/version-v1.38.36-blue?style=flat-square) ![plugins](https://img.shields.io/badge/plugins-18-brightgreen?style=flat-square) ![agents](https://img.shields.io/badge/agents-19-blueviolet?style=flat-square) ![skills](https://img.shields.io/badge/skills-125-orange?style=flat-square) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square) ![platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux-lightgrey?style=flat-square) ![Windows](https://img.shields.io/badge/Windows-soon-orange?style=flat-square)

> Professional Claude Code plugins with APEX workflow, SOLID principles, and expert development agents.

![Statusline](docs/img/statusline.png)

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

## Plugins

### Development

| Plugin | Description | Skills |
|--------|-------------|--------|
| [fuse-ai-pilot](docs/plugins/ai-pilot.md) | APEX workflow, sniper validation, DRY detection, cache system | 12 |
| [fuse-nextjs](docs/plugins/nextjs.md) | Next.js 16+ with App Router, Prisma 7, Better Auth | 8 |
| [fuse-laravel](docs/plugins/laravel.md) | Laravel 12+ with Eloquent, Livewire, Blade | 15 |
| [fuse-react](docs/plugins/react.md) | React 19 with TanStack Router, Zustand | 8 |
| [fuse-astro](docs/plugins/astro.md) | Astro 6 with Islands, Content Layer, Starlight | 14 |
| [fuse-swift-apple-expert](docs/plugins/swift.md) | Swift 6.2 + SwiftUI for all Apple platforms | 11 |
| [fuse-tailwindcss](docs/plugins/tailwindcss.md) | Tailwind CSS v4.1 with @theme, @utility | 14 |
| [fuse-design](docs/plugins/design.md) | UI/UX Director with shadcn/ui, Gemini Design | 17 |
| [fuse-shadcn-ui](docs/plugins/shadcn.md) | shadcn/ui with Radix/Base UI detection | 5 |

### Security & Quality

| Plugin | Description | Skills |
|--------|-------------|--------|
| [fuse-security](docs/plugins/security.md) | OWASP Top 10, CVE research, dependency audit | 5 |
| [fuse-solid](docs/plugins/solid.md) | SOLID principles enforcement (multi-language) | 6 |

### Productivity

| Plugin | Description | Skills |
|--------|-------------|--------|
| [fuse-commit-pro](docs/plugins/commit-pro.md) | Smart conventional commits with security check | 2 |
| [fuse-prompt-engineer](docs/plugins/prompt-engineer.md) | Prompt creation, optimization, agent design | 6 |
| [fuse-changelog](docs/plugins/changelog.md) | Claude Code update watcher, breaking changes | 3 |

### Core (auto-installed)

| Plugin | Description |
|--------|-------------|
| core-guards | Security guards, SOLID enforcement, session hooks |
| claude-rules | APEX/SOLID/DRY rules injection at every prompt |

## Features

| Feature | Description |
|---------|-------------|
| **APEX Workflow** | Brainstorm → Analyze → Plan → Execute (TDD) → eLicit → Verify → eXamine |
| **[Agent Teams](docs/workflow/agent-teams.md)** | Parallel delegation with file ownership, max 4 teammates |
| **19 Expert Agents** | Framework-specific agents with MCP tool access |
| **125 Skills** | Knowledge modules with references and templates |
| **SOLID Enforcement** | Auto file size limits, interface separation, quality gates |
| **DRY Detection** | Code duplication analysis via jscpd (150+ languages) |
| **Smart Commits** | Conventional commits with auto-detection and security validation |
| **[4-Level Cache](docs/reference/cache-system.md)** | 60-75% token savings across sessions |
| **28 MCP Servers** | Context7, Exa, Gemini Design, shadcn, Astro docs, and more |
| **82 Hooks** | 12 lifecycle hook types across all plugins |

## Documentation

| Section | Content |
|---------|---------|
| [Getting Started](docs/getting-started/) | Installation, configuration, first steps |
| [Workflow](docs/workflow/) | APEX methodology, agents, skills, commands |
| [Plugins](docs/plugins/) | Per-plugin documentation and skills |
| [Reference](docs/reference/) | Architecture, hooks, MCP servers, cache system |

## License

MIT
