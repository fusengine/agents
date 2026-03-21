# fuse-cartographer

Auto-generates navigable multi-level maps of the plugin ecosystem and project files at SessionStart.

## How It Works

At every session start, the cartographer runs two scripts:

1. **`generate_map.py`** — Scans all installed plugins, generates:
   - Global plugin map: `~/.claude/plugins/.../. cartographer/index.md`
   - Per-plugin map: `plugins/{name}/.cartographer/index.md`

2. **`generate_project_map.py`** — Scans the current project (if detected), generates:
   - Project map: `.cartographer/project/index.md`

## Navigation (Git-style)

Maps use a tree structure with branches and leaves:

- **Branch** = `index.md` with indented tree linking to deeper levels
- **Leaf** = link to the real source file (no copy, no duplication)

```
index.md → fuse-nextjs/index.md → skills/prisma-7/index.md → references/index.md → [transactions.md](real/path)
```

The agent navigates from branch to branch, following links until it finds the right file.

## Example Output

### Plugin Map (index.md)
```
# Ecosystem Map (17 plugins)

- [fuse-nextjs](./fuse-nextjs/index.md) (v1.1.9) → nextjs-expert
- [fuse-laravel](./fuse-laravel/index.md) (v1.1.8) → laravel-expert
- [fuse-design](./fuse-design/index.md) (v2.1.17) → design-expert
```

### Per-Plugin Map (fuse-nextjs/index.md)
```
├── agents/
│   └── [nextjs-expert](./agents/nextjs-expert.md) — Expert Next.js 16+
├── skills/
│   ├── [prisma-7](./skills/prisma-7/index.md) — ORM, TypedSQL
│   └── [better-auth](./skills/better-auth/index.md) — Auth 40+ providers
└── hooks: PostToolUse, PreToolUse
```

### Project Map (.cartographer/project/index.md)
```
├── [app/](./app/index.md) — 24 files
├── [modules/](./modules/index.md) — 156 files
└── [package.json](/absolute/path/package.json)
```

## Descriptions

Files get automatic descriptions extracted from:
- `.md` files: YAML frontmatter `description:` or first `# heading`
- `.ts/.js/.py/.swift` files: first comment line
- Directories: recursive file count

## Project Detection

Project cartography only runs when a real project is detected (has `package.json`, `composer.json`, `.git`, etc.). Skips home directory and root.

## Agent Integration

All 21 agents have a `## Cartography` section instructing them to read their maps before acting:
- **Your skills**: `${CLAUDE_PLUGIN_ROOT}/.cartographer/index.md`
- **All plugins**: `${CLAUDE_PLUGIN_ROOT}/../.cartographer/index.md`
- **Project files**: `.cartographer/project/index.md`

## Scripts

| Script | Lines | Purpose |
|--------|-------|---------|
| `generate_map.py` | 86 | Plugin ecosystem mapper |
| `generate_project_map.py` | 59 | Project file mapper |
| `lib/write_recursive.py` | 65 | Recursive tree generator |
| `lib/write_plugin_map.py` | 31 | Plugin index writer |
| `lib/build_tree.py` | 68 | Unicode tree builder |
| `lib/scan_plugins.py` | 84 | Plugin scanner |
| `lib/parse_frontmatter.py` | 39 | YAML frontmatter parser |
| `lib/describe.py` | 66 | File description extractor |

## Commands

| Command | Description |
|---------|-------------|
| `/map` | Regenerate and display the ecosystem map |
