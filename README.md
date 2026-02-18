# Fusengine Claude Code Plugins

Professional Claude Code plugins with APEX workflow, SOLID principles, and expert agents.

![Statusline](docs/img/statusline.png)

## Quick Install

### Statusline Configuration (Optional)

**macOS / Linux:**
```bash
bun --cwd ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/core-guards/statusline run config       # Web
bun --cwd ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/core-guards/statusline run config:term  # Terminal
```

**Windows (PowerShell):**
```powershell
bun --cwd $env:USERPROFILE\.claude\plugins\marketplaces\fusengine-plugins\plugins\core-guards\statusline run config       # Web
bun --cwd $env:USERPROFILE\.claude\plugins\marketplaces\fusengine-plugins\plugins\core-guards\statusline run config:term  # Terminal
```

### macOS / Linux
```bash
# Add marketplace
/plugin marketplace add fusengine/agents

# Install all plugins
/plugin install fuse-ai-pilot fuse-commit-pro fuse-laravel fuse-nextjs fuse-react fuse-swift-apple-expert fuse-solid fuse-tailwindcss fuse-design fuse-prompt-engineer

# Setup (hooks + API keys + CLAUDE.md)
~/.claude/plugins/marketplaces/fusengine-plugins/setup.sh
```

### Windows (PowerShell)
```powershell
# Add marketplace
/plugin marketplace add fusengine/agents

# Install all plugins
/plugin install fuse-ai-pilot fuse-commit-pro fuse-laravel fuse-nextjs fuse-react fuse-swift-apple-expert fuse-solid fuse-tailwindcss fuse-design fuse-prompt-engineer

# Setup (hooks + API keys + CLAUDE.md)
~\.claude\plugins\marketplaces\fusengine-plugins\setup.ps1
```

## Features

- **APEX Workflow** - Systematic Analyze → Plan → Execute → eLicit → eXamine methodology
- **[Agent Teams](docs/workflow/agent-teams.md) (beta)** - Parallel delegation with file ownership, max 4 teammates, lead-as-coordinator
- **15 Expert Agents** - Next.js, Laravel, React, Swift, Tailwind, Design, and more
- **70 Skills** - Framework-specific knowledge modules
- **SOLID Enforcement** - Automatic file size limits, interface separation, quality gates
- **DRY Detection** - Code duplication analysis via jscpd (150+ languages) with per-language thresholds
- **12 Lifecycle Hooks** - All Claude Code hook types covered across 9 plugins
- **Smart Commits** - Conventional commits with auto-detection
- **[4-Level Cache System](docs/reference/cache-system.md)** - Explore, Documentation, Lessons, and Tests caches with analytics for 60-75% token savings

## Stats

| Category | Count |
|----------|-------|
| Plugins | 11 |
| Agents | 15 |
| Skills | 70 |
| Commands | 24 |
| Hook Types | 12 |
| Cache Scripts | 10 |

## Documentation

| Section | Description |
|---------|-------------|
| [Getting Started](docs/getting-started/) | Installation, configuration, first steps |
| [Workflow](docs/workflow/) | APEX methodology, agents, skills, commands |
| [Plugins](docs/plugins/) | Detailed documentation per plugin |
| [Reference](docs/reference/) | Architecture, hooks, MCP servers, cache system |

## Plugins Overview

### Development
| Plugin | Description |
|--------|-------------|
| fuse-ai-pilot | APEX workflow orchestrator, 7-phase sniper validation, DRY detection, 4-level cache |
| fuse-nextjs | Next.js 16+ expert with App Router, Prisma 7 |
| fuse-laravel | Laravel 12+ expert with Livewire, Eloquent |
| fuse-react | React 19 expert with hooks, TanStack |
| fuse-swift-apple-expert | Swift/SwiftUI for all Apple platforms |
| fuse-tailwindcss | Tailwind CSS v4.1 expert |
| fuse-design | UI/UX with shadcn/ui, 21st.dev |

### Productivity
| Plugin | Description |
|--------|-------------|
| fuse-commit-pro | Smart conventional commits |
| fuse-solid | SOLID principles enforcement |
| fuse-prompt-engineer | AI prompt creation & optimization |

## License

MIT
