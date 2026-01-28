# Fusengine Plugins

## Overview

This repository contains 11 professional Claude Code plugins designed for modern development workflows.

## Available Plugins

| Plugin | Description | Category |
|--------|-------------|----------|
| `fuse-ai-pilot` | AI workflow agents with APEX methodology | development |
| `fuse-commit-pro` | Professional git commits with Conventional Commits | productivity |
| `fuse-laravel` | Expert Laravel 12 + PHP 8.5 development | development |
| `fuse-nextjs` | Expert Next.js 16 + React 19 development | development |
| `fuse-swift-apple-expert` | Expert Swift 6 + SwiftUI for Apple platforms | development |
| `fuse-solid` | SOLID principles enforcement for all languages | productivity |
| `fuse-tailwindcss` | Expert Tailwind CSS v4.1 with CSS-first config | development |
| `fuse-react` | Expert React 19 with TanStack Router, Form, Zustand, shadcn/ui | development |
| `fuse-design` | Expert UI/UX design with shadcn/ui, 21st.dev, Tailwind CSS | development |
| `fuse-prompt-engineer` | Expert Prompt Engineering with Context Engineering, Meta-Prompting, Agent Design | productivity |
| `core-guards` | Security guards, SOLID enforcement, sound notifications, and modular statusline | productivity |

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
/plugin install fuse-design
/plugin install fuse-prompt-engineer
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

## Plugin Structure

Each plugin follows a consistent structure:

```
plugins/plugin-name/
├── agents/      # Specialized AI agents
├── commands/    # User-invocable commands
└── skills/      # Modular knowledge packages
```
