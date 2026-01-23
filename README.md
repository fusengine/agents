# Fusengine Claude Code Plugins

Professional Claude Code plugins with APEX workflow, SOLID principles, and expert development agents.

## Overview

| Category | Count |
|----------|-------|
| Plugins | 10 |
| Agents | 15 |
| Skills | 70 |
| Commands | 24 |

## Quick Start

```bash
# Add marketplace
/plugin marketplace add fusengine/agents

# Install all plugins
/plugin install fuse-ai-pilot fuse-commit-pro fuse-laravel fuse-nextjs fuse-swift-apple-expert fuse-solid fuse-tailwindcss fuse-react fuse-design fuse-prompt-engineer

# Or use interactive menu
/plugin
```

## Plugins

### Development

| Plugin | Stack | Key Features |
|--------|-------|--------------|
| [fuse-ai-pilot](./plugins/ai-pilot) | All | APEX methodology, sniper validation, code quality |
| [fuse-laravel](./plugins/laravel-expert) | Laravel 12 + PHP 8.5 | Eloquent, Livewire, Blade, queues, testing |
| [fuse-nextjs](./plugins/nextjs-expert) | Next.js 16 + React 19 | App Router, Server Components, Prisma 7, Better Auth |
| [fuse-react](./plugins/react-expert) | React 19 | TanStack Router, TanStack Form, Zustand, shadcn/ui |
| [fuse-swift-apple-expert](./plugins/swift-apple-expert) | Swift 6 + SwiftUI | iOS, macOS, watchOS, tvOS, visionOS |
| [fuse-tailwindcss](./plugins/tailwindcss) | Tailwind CSS v4.1 | CSS-first config, Oxide engine, OKLCH colors |
| [fuse-design](./plugins/design-expert) | UI/UX | shadcn/ui, 21st.dev, WCAG 2.2, Framer Motion |

### Productivity

| Plugin | Purpose | Commands |
|--------|---------|----------|
| [fuse-commit-pro](./plugins/commit-pro) | Git commits | `/commit`, `/wip`, `/fix`, `/feat`, `/refactor`, `/undo` |
| [fuse-solid](./plugins/solid) | SOLID enforcement | Auto-detection for all languages |
| [fuse-prompt-engineer](./plugins/prompt-engineer) | Prompt design | `/prompt`, `/prompt-history` |

## APEX Methodology

**A**nalyze → **P**lan → **E**xecute → e**L**icit → e**X**amine

The core workflow for all development tasks with automatic framework detection:

| Detection | Framework |
|-----------|-----------|
| `composer.json` + `artisan` | Laravel 12 |
| `next.config.*` | Next.js 16 |
| `package.json` (react) | React 19 |
| `Package.swift`, `*.xcodeproj` | Swift 6 |

**Commands:** `/apex`, `/apex-quick`, `/epct`

[Full APEX Documentation](./docs/apex-methodology.md)

## Documentation

| Document | Description |
|----------|-------------|
| [APEX Methodology](./docs/apex-methodology.md) | Complete APEX workflow guide |
| [Plugins Guide](./docs/plugins.md) | Plugin installation and usage |
| [Agents Reference](./docs/agents.md) | All 15 agents documentation |
| [Skills Reference](./docs/skills.md) | All 70 skills documentation |
| [Hooks System](./docs/hooks.md) | Automatic enforcement hooks |
| [APEX Tracking](./docs/apex-tracking.md) | Documentation consultation tracking |
| [MCP Setup](./docs/setup-env.md) | API keys and MCP configuration |

## Plugin Management

```bash
# List installed
/plugin list

# Enable/disable
/plugin enable <plugin-name>
/plugin disable <plugin-name>

# Remove marketplace
/plugin marketplace remove fusengine/agents
```

## Architecture

```
fusengine-plugins/
├── .claude-plugin/
│   └── marketplace.json
├── docs/
├── plugins/
│   ├── ai-pilot/
│   ├── commit-pro/
│   ├── design-expert/
│   ├── laravel-expert/
│   ├── nextjs-expert/
│   ├── react-expert/
│   ├── solid/
│   ├── swift-apple-expert/
│   ├── tailwindcss/
│   └── prompt-engineer/
├── LICENSE
└── README.md
```

## License

MIT
