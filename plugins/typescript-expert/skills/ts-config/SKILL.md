---
name: ts-config
description: "Use when: creating or migrating a tsconfig.json, choosing module/moduleResolution, or fixing TS 6.0 deprecation errors. Covers the two official 2026 config tracks (Bun/bundler vs pure Node.js) and the TS 6.0 → 7.0 deprecation cleanup. Do NOT use for: TypeScript language syntax and idioms (use ts-language-patterns), framework configs shipping their own tsconfig base (Next.js/Astro/Vite plugin skills), or non-TS build tooling."
versions:
  typescript: "6.0"
  node: "24"
  bun: "1.3"
user-invocable: false
references: references/bundler-track.md, references/node-track.md, references/deprecations-6.md, references/templates/tsconfig.bundler.md, references/templates/tsconfig.node.md
related-skills: ts-language-patterns, solid-generic
---

# TypeScript Config (TS 6.0)

## Agent Workflow (MANDATORY)

Before writing any tsconfig, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect runtime (Bun/Node/bundler), existing tsconfig, `package.json` `type`
2. **fuse-ai-pilot:research-expert** - Confirm current flags on typescriptlang.org release notes + runtime docs
3. **mcp__context7__query-docs** - `/microsoft/typescript` for any flag whose behavior is unclear

After writing, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

There are exactly **two supported config trajectories** in 2026. Pick by runtime, never mix.

| Track | Runtime | `module` | `moduleResolution` |
|-------|---------|----------|--------------------|
| **Bundler** | Bun, Vite, esbuild, webpack | `Preserve` | `bundler` |
| **Node** | Pure Node.js (native type stripping) | `nodenext` | `nodenext` |

---

## Critical Rules

1. **Never `moduleResolution: node` / `node10`** - deprecated in 6.0, removed in 7.0. Use `bundler` or `nodenext`.
2. **Always `verbatimModuleSyntax: true`** - both tracks. Forces explicit `import type`, matches Node's type stripping.
3. **`strict` + `noUncheckedIndexedAccess`** - strict is the 6.0 default; add `noUncheckedIndexedAccess` explicitly.
4. **Set `types` explicitly** - 6.0 defaults `types` to `[]`. Add `["node"]`, `["bun"]`, etc. or you lose globals.
5. **Set `rootDir` when sources are nested** - 6.0 defaults `rootDir` to the tsconfig dir, no longer inferred.

---

## Decision: which track?

```
Runs on Bun, or bundled by Vite/esbuild/webpack/Parcel?
  → Bundler track  → references/bundler-track.md

Runs directly on `node file.ts` (type stripping), or emits .js for Node?
  → Node track     → references/node-track.md

Migrating an existing 5.x config / seeing deprecation errors?
  → references/deprecations-6.md  (do this first, then pick a track)
```

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Bundler track** | [bundler-track.md](references/bundler-track.md) | Load when configuring a Bun or bundler (Vite/esbuild/webpack) project |
| **Node track** | [node-track.md](references/node-track.md) | Load when configuring a pure Node.js project with native type stripping |
| **6.0 deprecations** | [deprecations-6.md](references/deprecations-6.md) | Load when migrating from TS 5.x or fixing deprecation errors |

### Templates

| Template | When to Use |
|----------|-------------|
| [tsconfig.bundler.md](references/templates/tsconfig.bundler.md) | Complete Bun/bundler tsconfig |
| [tsconfig.node.md](references/templates/tsconfig.node.md) | Complete pure-Node tsconfig |

---

## Quick Reference

### Bundler / Bun

```jsonc
{
  "compilerOptions": {
    "module": "Preserve",
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Pure Node.js (native type stripping)

```jsonc
{
  "compilerOptions": {
    "module": "nodenext",
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "noEmit": true, // only if you never emit .js
    "strict": true
  }
}
```

---

## Best Practices

### DO
- Add `"ignoreDeprecations": "6.0"` **temporarily** while migrating, then remove it before adopting TS 7.0
- Use subpath imports `"#/*": "./src/*"` in `package.json` `imports` (supported under `nodenext` and `bundler`)
- Fold any `baseUrl` prefix into each `paths` entry (`baseUrl` is deprecated)

### DON'T
- Mix `module: Preserve` with `moduleResolution: nodenext` (or vice-versa)
- Set `esModuleInterop`, `allowSyntheticDefaultImports`, or `alwaysStrict` to `false` (no longer allowed)
- Use `enum`, `namespace` with runtime code, or parameter properties in files run by Node's type stripping
