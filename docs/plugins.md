# Fusengine Plugins

## Overview

This repository contains 8 professional Claude Code plugins designed for modern development workflows.

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

## Plugin Structure

Each plugin follows a consistent structure:

```
plugins/plugin-name/
├── agents/      # Specialized AI agents
├── commands/    # User-invocable commands
└── skills/      # Modular knowledge packages
```
