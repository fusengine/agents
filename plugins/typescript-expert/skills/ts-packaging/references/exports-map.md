---
name: exports-map
description: Modern package.json exports field and conditional resolution
when-to-use: Load when writing or debugging the exports map
keywords: exports, conditions, types, import, require, default, subpath, dual
priority: high
related: npm-publishing.md, validation.md
---

# Exports Map

## Overview

The `"exports"` field defines a package's public entry points, enables
per-environment conditional resolution, and **encapsulates** everything not
listed (unlisted subpaths throw `ERR_PACKAGE_PATH_NOT_EXPORTED`). It supersedes
`"main"` for modern Node.

---

## Condition Ordering (CRITICAL)

Conditions are matched **top-to-bottom by object key order**. The first match
wins, so most-specific first, `"default"` last. `"types"` must precede runtime
conditions so the type system resolves before JS.

| Condition | Matches |
|-----------|---------|
| `types` | TypeScript resolution (must be first) |
| `import` | ESM `import` / `import()` |
| `require` | CommonJS `require()` |
| `default` | Fallback (must be last) |

---

## Dual ESM/CJS

```json
{
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts",  "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    }
  }
}
```

Key rule: `import` points at ESM, `require` at CJS — never cross them. Each
branch carries its own `types` (`.d.ts` for ESM, `.d.cts` for CJS) so
`require`-side consumers get correct declarations.

---

## ESM-Pure

```json
{
  "type": "module",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" }
  }
}
```

Prefer this when no consumer needs CommonJS — it halves build output.

---

## Subpaths

```json
{
  "exports": {
    ".":       { "types": "./dist/index.d.ts",  "default": "./dist/index.js" },
    "./utils": { "types": "./dist/utils.d.ts",  "default": "./dist/utils.js" },
    "./package.json": "./package.json"
  }
}
```

Provide one specifier per module (extensioned or extensionless, consistently).
Target paths must be relative and start with `./`.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `"default"` before `"types"` | Put `"types"` first |
| `require` → `.js` (ESM) | Point `require` at a `.cjs`/CJS build |
| Missing `types` in a branch | Add per-condition `types` |
| Relying on `main` only | Add `exports`; keep `main` for legacy fallback |

---

## Related References

- [npm-publishing.md](npm-publishing.md) - Building dual output, publishing
- [validation.md](validation.md) - attw verifies the map resolves correctly
