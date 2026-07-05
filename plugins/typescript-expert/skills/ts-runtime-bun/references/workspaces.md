---
name: workspaces
description: Bun workspaces monorepo — layout, workspace protocol, --filter, catalogs
when-to-use: Load when structuring a Bun monorepo with multiple packages
keywords: workspaces, monorepo, workspace-protocol, filter, catalog, hoisting
related: build-compile.md
---

# Bun Workspaces

## Overview

Bun supports npm-style `workspaces` in the root `package.json` for developing several
independent packages in one monorepo. Bun installs local packages into `node_modules`
instead of downloading them, hoists shared dependencies to the root, and installs
fast even on large monorepos.

Source: https://bun.sh/docs/install/workspaces

## Layout

```
root/
├── package.json      # "workspaces": ["packages/*"]
├── bun.lock
├── tsconfig.json
└── packages/
    ├── core/  (package.json)
    └── cli/   (package.json)
```

## Root `package.json`

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "workspaces": ["packages/*"]
}
```

Full glob syntax is supported, including negation:

```json
{ "workspaces": ["packages/**", "!packages/**/test/**", "!packages/**/template/**"] }
```

## The `workspace:` protocol

Reference a sibling package by protocol (or a semver range):

```json
{
  "name": "cli",
  "dependencies": { "core": "workspace:*" }
}
```

On publish, Bun rewrites the protocol to the real version:

| In repo | Published as |
|---------|--------------|
| `workspace:*` | `1.0.1` (exact current) |
| `workspace:^` | `^1.0.1` |
| `workspace:~` | `~1.0.1` |
| `workspace:1.0.2` | `1.0.2` (explicit wins) |

## Installing and running with `--filter`

```bash
bun install                                   # all workspaces, de-duplicated
bun install --filter "core"                   # one workspace + its deps
bun install --filter "pkg-*" --filter "!pkg-c" # globs, with negation
bun run --filter "*" build                     # run a script across matches
```

## Catalogs (shared versions)

When many packages need the same dependency version, define it once in a root catalog
and reference it with the `catalog:` protocol; updating the catalog updates every
consumer. See https://bun.sh/docs/install/catalogs .

→ Monorepo template in [templates/bun-project-setup.md](templates/bun-project-setup.md)
