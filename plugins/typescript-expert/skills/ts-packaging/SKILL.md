---
name: ts-packaging
description: Use when publishing a TypeScript library — exports map, JSR vs npm, dual ESM/CJS, type validation, provenance. Covers modern package.json, jsr.json, and release CI. Do NOT use for application deployment (not a library) or framework build pipelines (use the framework expert's skills).
versions:
  node: "26"
  attw: "0.18.4"
user-invocable: true
references: references/exports-map.md, references/jsr-publishing.md, references/npm-publishing.md, references/validation.md, references/templates/package-json-dual.md, references/templates/jsr-json.md, references/templates/publish-workflow.md
related-skills: solid-generic, ts-testing
---

# TypeScript Packaging

Ship a TypeScript library with a correct exports map, on the right registry.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Inspect package.json, build output, targets
2. **fuse-ai-pilot:research-expert** - Verify latest JSR / npm / Node exports docs via Context7/Exa
3. **mcp__context7__query-docs** - Check conditions ordering, attw usage

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Registry | Format | Publishes | Best for |
|----------|--------|-----------|----------|
| JSR | ESM only | TS **source** directly | Deno/Node/Bun libs, doc-rich APIs |
| npm | ESM (or dual ESM/CJS) | Built `.js` + `.d.ts` | Broadest public reach, CJS consumers |

Rule of thumb: internal or Bun/Deno/ESM-only consumer → **ESM-pure**;
broad public library still serving CommonJS → **dual ESM/CJS**.

---

## Critical Rules

1. **`"types"` first, `"default"` last** - Conditions match in object order
2. **Match `import`↔ESM and `require`↔CJS** - Never point `require` at ESM
3. **One subpath per module** - Consistent specifier; set `"type": "module"` explicitly
4. **Validate with attw** - `arethetypeswrong` before every publish
5. **Provenance on public releases** - Publish from CI with `id-token: write`

---

## Decision Guide

```
Publishing a TS library?
├── Consumers on Deno/Bun/Node ESM, want source + docs → JSR (ESM only)
│   └── Fix "slow types" (explicit return/prop/const types)
└── Public npm audience
    ├── ESM-only consumers → ESM-pure package.json
    └── Some consumers still on CJS → dual ESM/CJS exports
```

→ See `references/exports-map.md` for the conditions model

---

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| Exports map & conditions | `references/exports-map.md` | Writing the `exports` field |
| JSR publishing | `references/jsr-publishing.md` | Publishing TS source to JSR |
| npm publishing | `references/npm-publishing.md` | Publishing to npm (dual/ESM) |
| Type validation | `references/validation.md` | Checking types resolve correctly |

### Templates

| Template | Use Case |
|----------|----------|
| `references/templates/package-json-dual.md` | Dual ESM/CJS + ESM-pure package.json |
| `references/templates/jsr-json.md` | jsr.json with multi-entry exports |
| `references/templates/publish-workflow.md` | GitHub Actions release with provenance |

---

## Quick Start

### Modern exports (ESM-pure)

```json
{
  "type": "module",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" }
  }
}
```

### Validate before publish

```bash
npx @arethetypeswrong/cli --pack
```

→ See `references/validation.md`

---

## Best Practices

### DO
- Set `"type"` explicitly, even for CJS packages
- Provide `types` in every conditional branch
- Publish from CI so provenance is automatic

### DON'T
- Ship dual CJS when every consumer is ESM (dead weight)
- Order `"default"` before `"types"` (breaks type resolution)
- Use `--allow-slow-types` on JSR as a habit (degrades docs + npm compat)
