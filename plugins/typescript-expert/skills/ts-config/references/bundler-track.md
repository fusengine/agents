---
name: bundler-track
description: Bundler/Bun tsconfig track for TypeScript 6.0
keywords: bundler, bun, vite, esbuild, module preserve, moduleResolution bundler
---

# Bundler Track (Bun / Vite / esbuild / webpack)

Load when the code is executed by Bun or its imports are resolved by a bundler.
Source of truth: bun.sh/docs/typescript + typescriptlang.org release notes for TS 6.0.

## Why these flags

| Flag | Value | Why |
|------|-------|-----|
| `module` | `"Preserve"` | Emits your `import`/`export` verbatim; the bundler owns module transformation. Also allows mixing `import` and `require` in one file. |
| `moduleResolution` | `"bundler"` | Matches how bundlers and Bun resolve — no mandatory file extensions, respects `exports`/`imports` maps. |
| `verbatimModuleSyntax` | `true` | Type-only imports must be written `import type`; nothing type-only is emitted. Removes elision ambiguity. |
| `allowImportingTsExtensions` | `true` | Lets you write `import './x.ts'`; safe here because the bundler (not `tsc`) emits. Requires `noEmit` (or `emitDeclarationOnly`). |
| `noEmit` | `true` | `tsc` is the type-checker only; the bundler produces JS. |
| `moduleDetection` | `"force"` | Treats every file as a module — avoids accidental global-script scope. |
| `types` | e.g. `["bun"]` | 6.0 defaults `types` to `[]`; you must list global-affecting packages explicitly. |

## Strictness (add on top of `strict: true`)

`strict` is already the 6.0 default. Layer on:

- `noUncheckedIndexedAccess: true` — indexed access yields `T | undefined`
- `noFallthroughCasesInSwitch: true`
- `noImplicitOverride: true`
- `skipLibCheck: true` — skip `.d.ts` checking for faster builds

## JSX

Add `"jsx": "react-jsx"` only when the project renders JSX. Omit for plain libraries/CLIs.

## Migration path: bundler + commonjs (new in 6.0)

Before 6.0, `moduleResolution: bundler` required `module` `esnext` or `preserve`.
TS 6.0 now **also allows `moduleResolution: bundler` with `module: commonjs`**. This is the
recommended intermediate step when moving a CommonJS project off the deprecated
`moduleResolution: node` before committing to `module: Preserve` or `nodenext`.

## Full config

→ [templates/tsconfig.bundler.md](templates/tsconfig.bundler.md)
