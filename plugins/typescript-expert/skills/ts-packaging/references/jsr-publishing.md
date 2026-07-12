---
name: jsr-publishing
description: Publishing TypeScript source to JSR
when-to-use: Load when publishing an ESM package to JSR
keywords: jsr, jsr.json, slow types, esm, deno publish, oidc, provenance
priority: high
related: exports-map.md, npm-publishing.md
---

# JSR Publishing

## Overview

JSR publishes **TypeScript source directly** (not `.js` + `.d.ts` pairs),
enabling richer auto-generated docs and editor completions. Packages are **ESM
only**; CommonJS cannot be published. Importable from Deno, Node.js, and Bun.

---

## Package Rules

| Rule | Detail |
|------|--------|
| ESM only | Only `import`/`export`; no CommonJS |
| Dependencies | npm (`npm:`), JSR (`jsr:`), or `node:` built-ins |
| File names | Windows + Unix safe; no casing collisions |
| No "slow types" | Explicit types on all exported symbols (enforced) |
| Valid imports | Every relative import resolves at publish time |

---

## Slow Types

To keep type-checking fast and docs generatable, exported symbols must have
**explicit** types. Internal (non-exported) symbols are exempt.

| Required | Example fix |
|----------|-------------|
| Explicit return types | `function add(a: number, b: number): number` |
| Explicit class props | `name: string` (not bare `name`) |
| Explicit const types | `export const ID: string = crypto.randomUUID()` |
| No `declare global` / `declare module` | Avoid augmentation |
| No `export =` / `import = require()` | Use ESM syntax |
| No destructuring in exports | Export each symbol individually |

`--allow-slow-types` bypasses the check but degrades docs, npm-compat types, and
consumer type-check speed. Fix the types instead.

---

## jsr.json

```json
{
  "name": "@scope/pkg",
  "version": "1.0.0",
  "exports": { ".": "./mod.ts", "./utils": "./utils.ts" }
}
```

Deno users may inline these fields in `deno.json`. → See `templates/jsr-json.md`

---

## Publishing

| Tool | Command |
|------|---------|
| Deno | `deno publish` |
| npm | `npx jsr publish` |
| pnpm / yarn | `pnpm dlx jsr publish` / `yarn dlx jsr publish` |

Dry-run everything with `--dry-run` (runs all checks, publishes nothing).

---

## CI & Provenance

From **GitHub Actions**, publishing is tokenless via OIDC and generates
provenance automatically:

```yaml
permissions: { contents: read, id-token: write }
steps:
  - uses: actions/checkout@v6
  - run: npx jsr publish
```

Other CI (GitLab, CircleCI) uses a `--token $JSR_TOKEN` access token, but
**token-based publishing does not generate provenance**.

---

## Related References

- [exports-map.md](exports-map.md) - Multi-entry exports
- [npm-publishing.md](npm-publishing.md) - When dual npm output is still needed
