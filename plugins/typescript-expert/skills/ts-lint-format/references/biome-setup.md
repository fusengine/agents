---
name: biome-setup
description: Configuring Biome 2.x — biome.json, rules, severity, domains, fixes, CI
when-to-use: Load when setting up or tuning Biome as the lint+format tool
keywords: biome, biome.json, lint, format, domains, safe-fixes, migrate, ci
related: tool-choice.md, eslint-typed.md
---

# Biome 2.x Setup

## Overview

Biome is one Rust binary that formats, lints, and organizes imports. It ships
recommended rules on by default and, unlike ESLint, never reports formatting through
lint rules — the formatter owns all formatting.

Source: https://biomejs.dev/linter/ + https://biomejs.dev/guides/getting-started/

## Install & init

```bash
npm i -D -E @biomejs/biome
npx @biomejs/biome init          # creates biome.json
```

A standalone executable (no Node) is also available for CI images.

## Core commands

```bash
npx @biomejs/biome format --write        # format
npx @biomejs/biome lint --write          # lint + apply SAFE fixes
npx @biomejs/biome lint --write --unsafe # also apply unsafe fixes (review!)
npx @biomejs/biome check --write         # format + lint + organize imports
npx @biomejs/biome ci                    # CI-optimized check
```

**Safe fixes** never change semantics (apply on save). **Unsafe fixes** may — review
before applying. Configure per rule with `"fix": "none" | "safe" | "unsafe"`.

## Rule config shape

Rules are grouped (`suspicious`, `style`, `correctness`, `a11y`, …). Severity:
`"off" | "on" | "info" | "warn" | "error"`. `"error"` makes the CLI exit non-zero.

```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "suspicious": { "noDebugger": "error" },
      "style": {
        "useNamingConvention": { "level": "error", "options": { "strictCase": false } }
      },
      "correctness": {
        "noUnusedVariables": { "level": "error", "fix": "none" }
      }
    }
  }
}
```

Control a whole group at once: `"a11y": "off"`. CLI `--only` / `--skip` run or skip a
rule or group ad hoc.

## Domains (auto-enabled by dependencies)

Domains group rules by technology (`react`, `solid`, `test`). Biome auto-enables a
domain's recommended rules when it detects the matching dependency in `package.json`
(e.g. `mocha` → `test` domain). Force via config:

```json
{ "linter": { "domains": { "test": "recommended" } } }
```

## Migrating from ESLint + Prettier

```bash
npx @biomejs/biome migrate eslint      # port eslint config to biome.json
biome lint --suppress --reason "migration"   # suppress new findings, clean up later
```

## CI gate

Run `biome ci` (or `biome check`) with `error` severity so violations fail the build.
For editors, `source.fixAll.biome` applies safe fixes on save.

→ Full `biome.json` in [templates/config-examples.md](templates/config-examples.md)
