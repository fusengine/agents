---
name: tsx-when-needed
description: When Node native stripping is insufficient and tsx (or another loader) is required
when-to-use: Load when the project needs paths, decorators, enums, .tsx, or downleveling at runtime
keywords: tsx, full-support, loader, decorators, paths, node-import
related: type-stripping.md
---

# When You Need tsx (Full TypeScript Support)

## Overview

Node's native stripping only erases types. For **full** TypeScript support —
including features that require code generation and `tsconfig.json` awareness — the
Node docs recommend a third-party loader, using [`tsx`](https://tsx.hirok.io/) as the
canonical example (esbuild-powered). Other loaders exist, but `tsx` is the one Node's
own documentation points to.

Source: https://nodejs.org/api/typescript.html (Full TypeScript support)

## Reach for tsx when you need

| Need | Why native stripping fails |
|------|----------------------------|
| `tsconfig` `paths` / aliases | Node ignores `tsconfig` at runtime |
| `enum`, `namespace` with runtime code | Requires JS codegen |
| Parameter properties, import aliases | Requires JS codegen |
| Decorators | Not transformed (Stage 3 proposal) |
| `.tsx` files | Unsupported by native stripping |
| Downleveling to an older JS target | Node runs syntax as-is |

If none of these apply, prefer native stripping — zero dependencies, faster startup.

## Install and run

```bash
npm install --save-dev tsx
```

Two invocation styles:

```bash
# Direct
npx tsx your-file.ts

# Via node's --import (keeps `node` as the entry command)
node --import=tsx your-file.ts
```

`node --import=tsx` is useful when tooling expects to invoke `node` directly (e.g.
debuggers, process managers) while still getting full TS support.

## Decision guide

1. Only inline types, ESM, no aliases → **native stripping**, no dependency.
2. Need `paths` but nothing else → try Node subpath imports (`#name`) first; fall
   back to `tsx` if the ergonomics don't fit.
3. Need decorators, `enum`, `.tsx`, or downleveling → **tsx**.

## Note on type checking

Neither native stripping nor `tsx` type-checks. Keep `tsc --noEmit` in CI regardless
of which runtime path you choose. → [type-stripping.md](type-stripping.md)
