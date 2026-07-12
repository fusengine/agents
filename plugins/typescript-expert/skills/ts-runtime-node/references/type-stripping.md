---
name: type-stripping
description: Node.js native runtime TypeScript — what erases, what errors, required flags and tsconfig
when-to-use: Load when running .ts directly on Node and deciding what native stripping supports
keywords: type-stripping, node, no-strip-types, erasableSyntaxOnly, ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX
related: tsx-when-needed.md, node24-features.md
---

# Node Native Type Stripping

## Overview

Since Node 23.6 (stable and unflagged in **Node 24 LTS**), Node runs TypeScript by
**erasing** inline types — replacing them with whitespace — and executing the
result. No type checking, no code generation, no source maps needed (line numbers
stay intact). The legacy `--experimental-transform-types` flag has been **removed**;
stripping is the only built-in mode. Disable it with `--no-strip-types`.

Source: https://nodejs.org/api/typescript.html

## What runs vs. what errors

| Syntax | Native stripping |
|--------|-----------------|
| Inline type annotations, generics, `as`, interfaces | Erased, runs |
| `import type` / `export type`, `type` on named imports | Erased, runs |
| `namespace` with **only** types | Runs |
| `enum` | `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` |
| `namespace` with runtime code | `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` |
| Parameter properties (`constructor(private x)`) | Errors — requires codegen |
| Import aliases (`import X = require()`) | Errors — requires codegen |
| Decorators (TC39 Stage 3) | Parser error — not transformed |
| `.tsx` files | Unsupported |

Because stripping only removes syntax (never generates JS), any feature that would
need *new* JavaScript emitted is rejected. Prefer `erasableSyntaxOnly` in `tsconfig`
so `tsc` flags these before runtime.

## Hard limits (tsconfig is ignored at runtime)

Node does **not** read `tsconfig.json` when running. So these do NOT apply:

- `paths` / path aliases → use Node [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) (`#name`) instead
- `target` downleveling (recent ECMAScript stays as-is)
- `allowImportingTsExtensions` semantics (extensions are always mandatory at runtime)

For any of these, use a full loader → [tsx-when-needed.md](tsx-when-needed.md).

## Required rules

- **`import type`** is mandatory for type-only imports; a value import of a type
  crashes at runtime. Enforce with `verbatimModuleSyntax: true`.
- **Explicit extensions**: `import './file.ts'`, `require('./file.ts')`.
- **Module system** follows the same rules as `.js`: `.mts` = ESM, `.cts` = CJS,
  `.ts` inherits from nearest `package.json` `"type"`.
- Node **refuses** to strip `.ts` files under any `node_modules/` path.

## Recommended tsconfig

Node docs recommend TypeScript **5.8 or newer** (latest stable is 6.0):

```json
{
  "compilerOptions": {
    "noEmit": true,
    "target": "esnext",
    "module": "nodenext",
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true
  }
}
```

→ Full project in [templates/node-esm-setup.md](templates/node-esm-setup.md)
