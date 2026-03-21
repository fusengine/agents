---
name: map-ecosystem
description: "Enrich auto-generated .cartographer/ maps with full descriptions from source files."
context: fork
user-invocable: true
---

# Map Ecosystem — Enrich Descriptions

Enrich the auto-generated `.cartographer/` index.md files with complete descriptions extracted from source file frontmatter.

## When to Use

- After SessionStart has generated the cartography structure
- When descriptions appear truncated in index.md files
- When a new plugin/skill was added and needs full descriptions

## When NOT to Use

- Code generation or debugging
- Direct file editing outside .cartographer/

## Steps

1. **Read** the ecosystem index: `${CLAUDE_PLUGIN_ROOT}/../.cartographer/index.md`
2. **For each plugin** listed, read its `.cartographer/index.md`
3. **For each linked file** (agents/*.md, skills/*/SKILL.md):
   - Read the source file
   - Extract the full `description` from YAML frontmatter
   - Replace the truncated description in the index.md line
4. **Write** the updated index.md with complete descriptions

## Example

Before (auto-generated, truncated at 60 chars):
```
├── [laravel-eloquent](./skills/laravel-eloquent/index.md) — Complete Eloquent ORM - models, relatio
```

After (enriched by agent):
```
├── [laravel-eloquent](./skills/laravel-eloquent/index.md) — Complete Eloquent ORM - models, relationships, queries, casts, observers, factories. Use when working with database models.
```

## Forbidden

- Do not modify source files (only .cartographer/*.md)
- Do not delete or restructure the tree
- Do not assume — always read actual frontmatter
