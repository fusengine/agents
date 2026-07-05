---
name: node-track
description: Pure Node.js tsconfig track with native type stripping (Node 24 LTS)
keywords: nodenext, type stripping, erasableSyntaxOnly, rewriteRelativeImportExtensions, node
---

# Node Track (native type stripping)

Load when code runs directly on Node.js (`node file.ts`) or emits `.js` for Node.
Source of truth: nodejs.org/api/typescript.html + typescriptlang.org TS 6.0 notes.

Node.js runs TypeScript by **stripping types** — it replaces type syntax with whitespace
and performs NO type checking and NO JS code generation. `tsc` remains your checker.
Node **ignores `tsconfig.json`**, so these flags exist to keep `tsc`'s view identical to Node's runtime.

## Why these flags

| Flag | Value | Why |
|------|-------|-----|
| `module` | `"nodenext"` | Node's real module algorithm; honours `package.json` `type`, `.mts`/`.cts`. |
| `moduleResolution` | `"nodenext"` | Paired with `module: nodenext`. |
| `rewriteRelativeImportExtensions` | `true` | Lets you author `import './x.ts'` and have `tsc` rewrite it to `./x.js` on emit — Node requires the real extension at runtime. |
| `erasableSyntaxOnly` | `true` | `tsc` errors on any syntax Node's stripper can't erase (see below). Keeps source runnable by Node unchanged. |
| `verbatimModuleSyntax` | `true` | Forces `import type`; without it Node treats a type-only import as a value import → runtime error. |
| `noEmit` | `true` *(optional)* | Use only if you run `*.ts` directly and never distribute `*.js`. Omit when you emit. |
| `allowImportingTsExtensions` | `true` *(optional)* | Lets `tsc` type-check specifiers that include the `.ts` extension. |

## Syntax Node's stripper CANNOT run (`erasableSyntaxOnly` flags these)

These require code generation, so they error under type stripping:

- `enum` declarations → use `const` objects `as const`
- `namespace` **containing runtime code** (type-only `namespace` is fine)
- constructor parameter properties (`constructor(private x: number)`)
- import aliases with runtime meaning

Standard ECMAScript decorators are a TC39 Stage 3 proposal and are **not** transformed by
Node — they cause a parser error at runtime until natively supported. Do not rely on them
in files executed directly by Node's stripper.

## Module system rules

- `.ts` resolves like `.js`: add `"type": "module"` to the nearest `package.json` for ESM.
- `.mts` → always ESM, `.cts` → always CommonJS. `.tsx` is unsupported by the stripper.
- File extensions are **mandatory** in `import`/`import()` and in `require()`.

## Full config

→ [templates/tsconfig.node.md](templates/tsconfig.node.md)
