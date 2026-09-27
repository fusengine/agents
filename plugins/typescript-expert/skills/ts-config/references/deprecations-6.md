---
name: deprecations-6
description: TypeScript 6.0 breaking changes, deprecations, and default changes for 5.x migration — hard errors in TS 7.0
keywords: typescript 6.0, typescript 7.0, deprecation, ignoreDeprecations, migration, breaking changes, ts 7.0, tsgo, typescript6
---

# TypeScript 6.0 Deprecations & Default Changes (enforced by 7.0)

Load when migrating a 5.x/6.0 config or when `tsc` reports deprecation errors.
TS 6.0 was the transition release toward the native TS 7.0 port. On 6.0, deprecated options
still work if you set `"ignoreDeprecations": "6.0"`; **TS 7.0 (current stable) turns them into
hard errors with no-op behavior** and adopts every 6.0 default below.
Sources: devblogs.microsoft.com/typescript/announcing-typescript-6-0/ and
devblogs.microsoft.com/typescript/announcing-typescript-7-0/.

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
| `stableTypeOrdering` | opt-in flag in 6.0; **always on in 7.0** (cannot be disabled) | On 6.0, enable it to preview 7.0's deterministic union/property ordering; fix surfaced errors with an explicit type argument or annotation. |

In 7.0 the `target` default is "the current stable ECMAScript version immediately preceding
`esnext`" — still pin `"target"` explicitly for reproducible emit.

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

1. On TS 6.0, add `"ignoreDeprecations": "6.0"` so the project still builds.
2. Fix new defaults first (`types`, `rootDir`).
3. Replace deprecated options one by one.
4. Remove `ignoreDeprecations` and build once with `--stableTypeOrdering` — code that compiles
   cleanly this way on 6.0 should compile identically on TS 7.0.
5. Upgrade to `typescript@^7` (see below).

## TypeScript 7.0 (native Go compiler, current stable)

- **Install**: `npm install -D typescript` — the `typescript` package (7.x) ships the native
  `tsc` binary. `@typescript/native-preview` was the preview channel; nightlies move to
  `typescript@next`.
- **No compiler API in 7.0** (a new, different API is expected in 7.1). Tools that import the
  `typescript` API (typescript-eslint, Volar-based Vue/MDX/Astro/Svelte tooling) must stay on
  6.0. Run both side by side with npm aliases — `@typescript/typescript6` re-exports the 6.0
  API and ships a `tsc6` binary:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.2",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

  With this layout `npx tsc` runs 7.0 while API consumers resolve `typescript` to 6.0.
- **Parallelism flags**: `--checkers <n>` (type-checker workers, default 4), `--builders <n>`
  (parallel project-reference builds under `--build`; multiplies with `--checkers`),
  `--singleThreaded` (disable all parallelism). `--checkers`/`--builders` are experimental;
  pin `--checkers` across environments if you see order-dependent results.
- **`--watch`** is rebuilt on a Go port of Parcel's file watcher.
- **Language change**: template-literal inference now splits on Unicode code points, not
  UTF-16 halves (`"😀abc"` → `["😀", "abc"]`).
- **JS/JSDoc checking** was reworked (no `@enum`, no Closure function syntax, `@class` no longer
  makes a constructor). Full list: github.com/microsoft/typescript-go/blob/main/CHANGES.md.
