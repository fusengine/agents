# Fusengine Plugins

## Overview

This repository contains 6 professional Claude Code plugins designed for modern development workflows.

## Available Plugins

| Plugin | Description | Category |
|--------|-------------|----------|
| `fuse:ai-pilot` | AI workflow agents with APEX methodology | development |
| `fuse:commit-pro` | Professional git commits with Conventional Commits | productivity |
| `fuse:laravel` | Expert Laravel 12 + PHP 8.5 development | development |
| `fuse:nextjs` | Expert Next.js 16 + React 19 development | development |
| `fuse:swift-apple-expert` | Expert Swift 6 + SwiftUI for Apple platforms | development |
| `fuse:solid` | SOLID principles enforcement for all languages | productivity |

## Installation

Each plugin can be installed individually using the Claude Code CLI:

```bash
claude plugins install fuse:ai-pilot
claude plugins install fuse:commit-pro
claude plugins install fuse:laravel
claude plugins install fuse:nextjs
claude plugins install fuse:swift-apple-expert
claude plugins install fuse:solid
```

## Plugin Structure

Each plugin follows a consistent structure:

```
plugins/plugin-name/
├── agents/      # Specialized AI agents
├── commands/    # User-invocable commands
└── skills/      # Modular knowledge packages
```
