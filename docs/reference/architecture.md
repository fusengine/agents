# Architecture

## Repository Structure

```
fusengine-plugins/
├── .claude-plugin/
│   └── marketplace.json         # Central plugin registry
├── docs/
│   ├── getting-started/
│   ├── workflow/
│   ├── plugins/
│   └── reference/
├── scripts/                     # Hooks loader (Bun + SOLID)
│   ├── hooks-loader.ts          # Entry point
│   ├── install-hooks.ts         # Installation + API keys
│   ├── src/
│   │   ├── interfaces/
│   │   ├── config/
│   │   └── services/
│   └── env-shell/               # Shell config (bash/zsh/fish/ps1)
├── plugins/
│   ├── ai-pilot/
│   │   ├── agents/              # sniper, explore-codebase, research-expert, etc.
│   │   ├── commands/
│   │   ├── hooks/hooks.json     # 15 hook entries (5 types)
│   │   ├── scripts/             # 17 bash scripts (cache, APEX, SOLID)
│   │   └── skills/
│   ├── core-guards/
│   │   ├── hooks/hooks.json     # Security, SOLID, sounds, lifecycle
│   │   ├── scripts/             # Organized by hook type
│   │   ├── statusline/          # Real-time status bar (Bun)
│   │   └── song/                # Sound notifications
│   ├── commit-pro/
│   │   ├── agents/
│   │   ├── commands/
│   │   └── skills/
│   ├── design-expert/
│   │   ├── agents/
│   │   ├── hooks/hooks.json
│   │   └── skills/
│   ├── laravel-expert/
│   │   ├── agents/
│   │   ├── hooks/hooks.json
│   │   └── skills/
│   ├── nextjs-expert/
│   │   ├── agents/
│   │   ├── hooks/hooks.json
│   │   └── skills/
│   ├── react-expert/
│   │   ├── agents/
│   │   ├── hooks/hooks.json
│   │   └── skills/
│   ├── swift-apple-expert/
│   │   ├── agents/
│   │   ├── hooks/hooks.json
│   │   └── skills/
│   ├── solid/
│   │   ├── agents/
│   │   ├── hooks/hooks.json
│   │   └── skills/
│   ├── tailwindcss/
│   │   ├── agents/
│   │   ├── hooks/hooks.json
│   │   └── skills/
│   └── prompt-engineer/
│       ├── agents/
│       └── skills/
├── .gitignore
├── LICENSE
└── README.md
```

## Runtime Cache Structure

```
~/.claude/fusengine-cache/
├── explore/{project-hash}/        # Architecture snapshots (TTL: 4h)
│   ├── metadata.json              # Hash, timestamp, file count
│   └── snapshot.md                # Full architecture report
├── doc/{project-hash}/            # Documentation cache (TTL: 7d)
│   ├── index.json                 # Manifest of cached docs
│   └── docs/{doc-hash}.md         # Cached Context7/Exa content
└── lessons/{project-hash}/        # Sniper lessons (TTL: 30d)
    ├── 2026-02-09T01-14-44.json   # Per-run correction files
    └── 2026-02-09T02-30-12.json
```

## Design Principles

### 1. Granular Plugin Architecture

Each plugin is isolated with its own agents, commands, skills, hooks, and scripts. Users load only what they need.

### 2. Centralized Registry

All plugin metadata is defined in `.claude-plugin/marketplace.json`. No per-plugin configuration files.

### 3. fuse- Namespace

All plugins use the `fuse-` prefix for consistent branding and easy identification.

### 4. SOLID Compliance

All plugins follow SOLID principles and include built-in validation.

### 5. 3-Level Cache System

Persistent caches across sessions eliminate redundant operations:
- **Explore cache**: Architecture snapshots avoid re-scanning projects
- **Doc cache**: Context7/Exa results avoid re-downloading documentation
- **Lessons cache**: Sniper corrections avoid repeating the same errors

Token savings: 60-75% on subsequent runs. See [Cache System](cache-system.md).

## Component Types

### Commands

User-invocable actions triggered with `/command-name`. Defined in markdown files under `commands/`.

### Agents

Specialized AI assistants with specific tools. Defined in markdown files under `agents/`.

### Skills

Modular knowledge packages with documentation. Defined under `skills/` with a `SKILL.md` entry point.

### Scripts

Bash scripts executed by hooks for automation. Located in `scripts/` per plugin. Key categories:
- **Cache scripts**: Capture and inject cached data (explore, doc, lessons)
- **APEX scripts**: Enforce workflow phases and context injection
- **SOLID scripts**: Validate compliance on file modifications
- **Tracking scripts**: Monitor documentation reads and task state
