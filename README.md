# Fusengine Claude Code Plugins

Professional Claude Code plugins with APEX workflow, SOLID principles, and expert development agents.

## Overview

- **8 plugins** - Focused, single-purpose plugins
- **13 agents** - Specialized AI assistants
- **60 skills** - Modular knowledge packages
- **21 commands** - User-invocable workflows

## Installation

### Add Marketplace

```bash
/plugin marketplace add fusengine/agents
```

### Install Plugins

```bash
/plugin install fuse-ai-pilot
/plugin install fuse-commit-pro
/plugin install fuse-laravel
/plugin install fuse-nextjs
/plugin install fuse-swift-apple-expert
/plugin install fuse-solid
/plugin install fuse-tailwindcss
/plugin install fuse-react
```

### Interactive Menu

```bash
/plugin
```

### List Installed Plugins

```bash
/plugin list
```

### Enable/Disable Plugin

```bash
/plugin enable <plugin-name>
/plugin disable <plugin-name>
```

### Remove Marketplace

```bash
/plugin marketplace remove fusengine/agents
```

## Available Plugins

| Plugin | Description | Category |
|--------|-------------|----------|
| [fuse-ai-pilot](./plugins/ai-pilot) | AI workflow agents with APEX methodology | development |
| [fuse-commit-pro](./plugins/commit-pro) | Professional git commits with Conventional Commits | productivity |
| [fuse-laravel](./plugins/laravel-expert) | Expert Laravel 12 + PHP 8.5 development | development |
| [fuse-nextjs](./plugins/nextjs-expert) | Expert Next.js 16 + React 19 development | development |
| [fuse-swift-apple-expert](./plugins/swift-apple-expert) | Expert Swift 6 + SwiftUI for Apple platforms | development |
| [fuse-solid](./plugins/solid) | SOLID principles enforcement for all languages | productivity |
| [fuse-tailwindcss](./plugins/tailwindcss) | Expert Tailwind CSS v4.1 with CSS-first config | development |
| [fuse-react](./plugins/react-expert) | Expert React 19 with TanStack Router, TanStack Form, Zustand, shadcn/ui | development |

## Documentation

- [Plugins Guide](./docs/plugins.md)
- [Agents Reference](./docs/agents.md)
- [Skills Reference](./docs/skills.md)
- [Architecture](./docs/architecture.md)
- [Usage Guide](./docs/usage.md)

## Plugin Details

### fuse-ai-pilot

AI-powered workflow agents for intelligent development.

**Commands:** `/apex`, `/epct`, `/commit`, `/watch-ci`, `/fix-pr-comments`, `/create-pull-request`

**Agents:** sniper, sniper-faster, explore-codebase, research-expert, websearch, seo-expert

### fuse-commit-pro

Professional git commits with smart detection.

**Commands:** `/commit`, `/wip`, `/fix`, `/feat`, `/refactor`, `/chore`, `/docs`, `/test`, `/undo`, `/amend`

### fuse-laravel

Expert Laravel 12 + PHP 8.5 with comprehensive documentation.

**Skills:** laravel-architecture, laravel-eloquent, laravel-api, laravel-auth, laravel-permission, laravel-testing, laravel-queues, laravel-livewire, laravel-blade, laravel-migrations, laravel-billing, laravel-i18n, solid-php

### fuse-nextjs

Expert Next.js 16 with App Router, Server Components, Prisma 7, Better Auth, TanStack Form, Zustand, shadcn/ui.

**Skills:** nextjs-16, prisma-7, better-auth, solid-nextjs, nextjs-tanstack-form, nextjs-zustand, nextjs-shadcn, nextjs-i18n

### fuse-swift-apple-expert

Expert Swift 6 + SwiftUI for all Apple platforms.

**Skills:** swiftui-components, swift-architecture, swift-concurrency, swiftui-navigation, swiftui-data, apple-platforms, swiftui-testing, swift-performance, swift-i18n, swift-app-icons, swift-build, solid-swift

### fuse-solid

SOLID principles enforcement with automatic project detection.

**Agent:** solid-orchestrator

**Skills:** solid-detection

### fuse-tailwindcss

Expert Tailwind CSS v4.1 with CSS-first configuration, Oxide engine, and OKLCH colors.

**Agent:** tailwindcss-expert

**Skills:** tailwindcss-v4, tailwindcss-core, tailwindcss-utilities, tailwindcss-responsive, tailwindcss-custom-styles, tailwindcss-layout, tailwindcss-spacing, tailwindcss-sizing, tailwindcss-typography, tailwindcss-backgrounds, tailwindcss-borders, tailwindcss-effects, tailwindcss-transforms, tailwindcss-interactivity

### fuse-react

Expert React 19 with TanStack Router, TanStack Form, Zustand, Testing Library, shadcn/ui.

**Agent:** react-expert

**Skills:** solid-react, react-19, react-hooks, react-tanstack-router, react-state, react-forms, react-testing, react-performance, react-shadcn, react-i18n

## Architecture

```
fusengine-plugins/
├── .claude-plugin/
│   └── marketplace.json
├── docs/
├── plugins/
│   ├── ai-pilot/
│   ├── commit-pro/
│   ├── laravel-expert/
│   ├── nextjs-expert/
│   ├── react-expert/
│   ├── solid/
│   ├── swift-apple-expert/
│   └── tailwindcss/
├── LICENSE
└── README.md
```

## License

MIT
