# Architecture

## Repository Structure

```
fusengine-plugins/
├── .claude-plugin/
│   └── marketplace.json      # Central plugin registry
├── docs/
│   ├── plugins.md
│   ├── agents.md
│   ├── skills.md
│   ├── usage.md
│   └── architecture.md
├── plugins/
│   ├── ai-pilot/
│   │   ├── agents/
│   │   ├── commands/
│   │   └── skills/
│   ├── commit-pro/
│   │   ├── agents/
│   │   ├── commands/
│   │   └── skills/
│   ├── laravel-expert/
│   │   ├── agents/
│   │   └── skills/
│   ├── nextjs-expert/
│   │   ├── agents/
│   │   └── skills/
│   ├── swift-apple-expert/
│   │   ├── agents/
│   │   └── skills/
│   └── solid/
│       ├── agents/
│       └── skills/
├── .gitignore
├── LICENSE
└── README.md
```

## Design Principles

### 1. Granular Plugin Architecture

Each plugin is isolated with its own agents, commands, and skills. Users load only what they need.

### 2. Centralized Registry

All plugin metadata is defined in `.claude-plugin/marketplace.json`. No per-plugin configuration files.

### 3. fuse: Namespace

All plugins use the `fuse:` prefix for consistent branding and easy identification.

### 4. SOLID Compliance

All plugins follow SOLID principles and include built-in validation.

## Component Types

### Commands

User-invocable actions triggered with `/command-name`. Defined in markdown files under `commands/`.

### Agents

Specialized AI assistants with specific tools. Defined in markdown files under `agents/`.

### Skills

Modular knowledge packages with documentation. Defined under `skills/` with a `SKILL.md` entry point.
