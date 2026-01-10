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

### Add Marketplace

```bash
/plugin marketplace add fusengine/agents
```

### Install Plugins

```bash
/plugin install ai-pilot
/plugin install commit-pro
/plugin install laravel-expert
/plugin install nextjs-expert
/plugin install swift-apple-expert
/plugin install solid
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
