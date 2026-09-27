---
name: shadcn-registries
description: "Use when configuring shadcn/ui registries (namespaced, GitHub, dynamic), components.json, presets, or any shadcn CLI command (init, add, apply, preset, view, search, docs, info, migrate, eject, build, registry)."
versions:
  shadcn-ui: "4.x"
  shadcn-cli: "latest"
user-invocable: true
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__shadcn__search_items_in_registries, mcp__shadcn__view_items_in_registries, mcp__shadcn__get_add_command_for_items
references: references/registry-config.md, references/templates/registry-setup.md
related-skills: shadcn-components, shadcn-detection
---

<objective>
Configures shadcn/ui registries, `components.json`, and the shadcn CLI (4.21.0) — covering the default `@shadcn` registry (Base UI, Radix or React Aria styles, chosen with `init --base`), built-in directory registries such as `@basecn`, custom namespaced registries, GitHub registries (`owner/repo/item#ref`, public and private) and registry authoring (`include`, `registry validate`, dynamic search).

Documents the `components.json` schema (style, Tailwind config paths, aliases) and enforces using the detected package manager's runner (`bunx`/`npx`/`pnpm dlx`/`yarn dlx`) plus the shadcn MCP for CLI commands, never a manual component copy.
</objective>

# shadcn Registries

## Agent Workflow (MANDATORY)

Before registry configuration, spawn agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Find existing components.json
2. **fuse-ai-pilot:research-expert** - Verify latest CLI options via Context7

After: Run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Registry | Primitives | Style |
|----------|-----------|-------|
| `@shadcn` (default) | Base UI (default base since 2026-07-02) | `base-*` (e.g. `base-nova`) |
| `@shadcn` (default) | Radix UI | `radix-*` (e.g. `radix-nova`); legacy `new-york` (`default` deprecated) |
| `@shadcn` (default) | React Aria (since 2026-07-17) | `aria-*` |
| Directory registries (e.g. `@basecn`, Base UI) | Any | Built into the CLI, no config: `add @basecn/<item>` (list: ui.shadcn.com/docs/directory) |
| Custom namespace | Any | `"registries": { "@acme": "https://.../{name}.json" }` or `registry add @acme=<url>` |
| GitHub registry | Any | `add owner/repo/item[#ref]`, root `registry.json`, no server/build |

Styles: `{base}-{style}` with base = `base`, `radix`, `aria` and style = `vega`, `nova`, `maia`, `lyra`, `mira`, `luma`, `sera`, `rhea` (schema: `https://ui.shadcn.com/schema.json`). Style cannot be changed after init; switch design with `apply --preset` instead.

---

## Critical Rules

1. **ALWAYS detect PM** before any CLI command (use {runner})
2. **ALWAYS consult MCP** before adding components
3. **NEVER mix** component bases (Base UI / Radix / React Aria) in same project
4. **KEEP** components.json in sync with actual primitive
5. **USE CLI** for adding components, never manual copy
6. **REVIEW third-party items** before install: `view <item>`, `add <item> --dry-run|--diff|--view`; pin GitHub items to a tag or full SHA

---

## Architecture

```
project/
├── components.json         # shadcn/ui configuration
├── components/ui/          # Generated components (import { cn } from "cn")
└── lib/utils.ts            # export { cn } from "cn"  (since Sept 2026; `migrate cn` for older projects)
```

-> See [registry-setup.md](references/templates/registry-setup.md) for complete setup

---

## CLI Commands

**ALWAYS use detected package manager** (run `shadcn-detection` first).
`{runner}` = `bunx` | `npx` | `pnpm dlx` | `yarn dlx`

```bash
# Initialize (alias: create). Default base = base (Base UI)
{runner} shadcn@latest init
{runner} shadcn@latest init -b radix          # -b base | radix | aria (add -b radix in CI that expects Radix)
{runner} shadcn@latest init -t vite           # -t next | start | vite | react-router | laravel | astro
{runner} shadcn@latest init --preset b2D0vQ7G4 --rtl --pointer --monorepo
{runner} shadcn@latest init --defaults        # = --template=next + "nova" preset on the default base -> style base-nova

# Add components (resolved for the style in components.json)
{runner} shadcn@latest add button dialog select
{runner} shadcn@latest add button --dry-run   # also --diff [path] (replaces deprecated `diff`), --view [path]
{runner} shadcn@latest add @basecn/button     # directory registry, no config needed
{runner} shadcn@latest add acme/toolkit/auth-kit#v1.0.0   # GitHub registry item

# Presets and existing projects
{runner} shadcn@latest apply --preset b2D0vQ7G4 [--only theme,font]   # keeps base + RTL
{runner} shadcn@latest preset decode|resolve|url|open <code>
{runner} shadcn@latest info --json            # framework, base, style, aliases, installed components
{runner} shadcn@latest docs combobox --base aria   # docs/examples/API links per base

# Discovery
{runner} shadcn@latest search @shadcn -q button -t ui --json   # alias: list; no arg = all configured registries
{runner} shadcn@latest view @acme/auth acme/toolkit/item

# Maintenance
{runner} shadcn@latest migrate cn|icons|base-color|radix|rtl [path]   # --list, --from, --to
{runner} shadcn@latest eject                  # inline shadcn/tailwind.css, drop the shadcn dependency (irreversible)
{runner} shadcn@latest mcp init --client claude   # claude | cursor | vscode | codex | opencode

# Registry authoring
{runner} shadcn@latest build [./registry.json] -o ./public/r
{runner} shadcn@latest registry validate [./registry.json | owner/repo#ref]
{runner} shadcn@latest registry add @acme=https://acme.com/r/{name}.json
```

Flags above are from `npx shadcn@4.21.0 <cmd> --help` (2026-09-27). Details and sources: [registry-config.md](references/registry-config.md).

### MCP (MANDATORY)

```
mcp__shadcn__search_items_in_registries -> find component
mcp__shadcn__get_add_command_for_items  -> get exact CLI command
```

---

## components.json Structure

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tailwind": { "config": "", "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true },
  "aliases": { "components": "@/components", "utils": "@/lib/utils" }
}
```

Schema-required keys: `style`, `tailwind` (`config`, `css`, `baseColor`, `cssVariables`), `rsc`, `aliases` (`utils`, `components`). Aliases may also be `package.json#imports` specifiers (`#components`, `#lib/utils`).

-> See [registry-config.md](references/registry-config.md) for full schema

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Registry Config** | [registry-config.md](references/registry-config.md) | Setting up components.json |

### Templates

| Template | When to Use |
|----------|-------------|
| [registry-setup.md](references/templates/registry-setup.md) | Initial project setup |

---

## Best Practices

### DO
- Use MCP to check registry before adding
- Keep components.json in sync with actual primitive
- Use CLI for adding, not manual copy

### DON'T
- Mix component bases in same project (Radix Combobox's `@base-ui/react` dependency is expected, not a mix)
- Edit component internals without checking registry source
- Skip components.json configuration
- Install unpinned third-party GitHub items in published instructions
