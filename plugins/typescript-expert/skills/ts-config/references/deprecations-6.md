---
name: deprecations-6
description: TypeScript 6.0 breaking changes, deprecations, and default changes for 5.x migration
keywords: typescript 6.0, deprecation, ignoreDeprecations, migration, breaking changes, ts 7.0
---

# TypeScript 6.0 Deprecations & Default Changes

Load when migrating a 5.x config or when `tsc` reports deprecation errors.
TS 6.0 is a transition release toward the native TS 7.0 port. Deprecated options
still work if you set `"ignoreDeprecations": "6.0"`, but **TS 7.0 removes them entirely**.
Source of truth: typescriptlang.org release notes for TypeScript 6.0.

## New default values (may break silently)

| Option | New 6.0 default | Action if it breaks you |
|--------|-----------------|-------------------------|
| `strict` | `true` | Set `"strict": false` to restore old behavior (not recommended). |
| `module` | `esnext` | Set explicitly if you relied on another default. |
| `target` | current-year ES (now `es2025`, floating) | Pin `"target"` explicitly for reproducible emit. |
| `rootDir` | the tsconfig directory (no longer inferred) | Set `"rootDir": "./src"` if sources are nested, else output lands in `./dist/src/…`. |
| `types` | `[]` | Add `["node"]`, `["bun"]`, `["jest"]`, … or use `["*"]` to restore old enumeration. |
| `noUncheckedSideEffectImports` | `true` | Catches typo'd side-effect imports. |
| `libReplacement` | `false` | Faster startup; re-enable only if you use lib replacement. |

Symptom map: floods of "Cannot find name 'process'/'fs'" → set `types`.
Output written to `./dist/src/…` instead of `./dist/…` → set `rootDir`.

## Deprecated / removed options

| Removed or deprecated | Replace with |
|-----------------------|--------------|
| `moduleResolution: node` / `node10` | `bundler` (bundler/Bun) or `nodenext` (Node) |
| `moduleResolution: classic` | `bundler` or `nodenext` (already removed) |
| `target: es5` | `es2015`+ (lowest target is now ES2015); use an external compiler if you truly need ES5 |
| `downlevelIteration` | remove — only affected ES5 emit |
| `module: amd` / `umd` / `systemjs` / `none` | an ESM target + a bundler |
| `baseUrl` | fold the prefix into each `paths` entry (add a `"*": ["./src/*"]` catch-all if it was a lookup root) |
| `esModuleInterop: false` | remove — interop is always on now |
| `allowSyntheticDefaultImports: false` | remove — always on now |
| `alwaysStrict: false` | remove — all code is strict-mode now |
| `outFile` | an external bundler (esbuild/Rollup/Vite) — removed in 6.0 |

## Syntax deprecations (now errors)

- `module Foo { … }` namespace syntax → use `namespace Foo { … }` (ambient `declare module "x"` still fine)
- `import x from "./f.json" asserts { type: "json" }` → `with { type: "json" }` (import attributes)
- `/// <reference no-default-lib="true"/>` → use `noLib` / `libReplacement`
- Passing files on the CLI while a `tsconfig.json` exists → error TS5112; use `tsc --ignoreConfig foo.ts` to opt out

## Migration order

1. Add `"ignoreDeprecations": "6.0"` so the project still builds.
2. Fix new defaults first (`types`, `rootDir`).
3. Replace deprecated options one by one.
4. Remove `ignoreDeprecations` — a clean build here means you are TS 7.0-ready.
