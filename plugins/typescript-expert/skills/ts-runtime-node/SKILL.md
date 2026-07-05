---
name: ts-runtime-node
description: Use when running TypeScript directly on Node.js without a build step — native type stripping, its limits, when to reach for tsx, ESM setup, watch mode, and node:test. Covers Node 24 LTS. Do NOT use for Bun runtime specifics (ts-runtime-bun) or tsconfig details (ts-config).
versions:
  node: "24 LTS"
  typescript: "5.8+ (latest stable 6.0)"
  tsx: "4.x"
references: references/type-stripping.md, references/tsx-when-needed.md, references/node24-features.md, references/templates/node-esm-setup.md
related-skills: ts-runtime-bun, ts-lint-format, solid-generic
---

# TypeScript on Node.js

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Inspect existing `package.json`, `tsconfig.json`, entry scripts
2. **fuse-ai-pilot:research-expert** - Verify latest Node LTS + type-stripping behavior via Context7/Exa
3. **mcp__context7__query-docs** - Check Node `Modules: TypeScript` and CLI flag docs

After implementation, run **fuse-ai-pilot:sniper** for validation.

## Use when

- Running `.ts`/`.mts`/`.cts` files directly with `node file.ts` (no bundler)
- Deciding between native **type stripping** and a full loader (`tsx`)
- Setting up an ESM-only Node project, `--watch` mode, or `node:test`
- Migrating a script/CLI/hook off `ts-node` to Node's built-in support

## Do NOT use for

- Bun runtime or `bun test` → use [ts-runtime-bun](../ts-runtime-bun/SKILL.md)
- Linting / formatting choices → use [ts-lint-format](../ts-lint-format/SKILL.md)
- Framework runtimes (Next.js, Astro) that own their own transpile pipeline
- Browser/bundled output → use a bundler skill

## Critical Rules

1. **Type stripping is erase-only** - Node replaces types with whitespace and does NO type checking. Run `tsc --noEmit` separately for safety.
2. **`tsconfig.json` is ignored at runtime** - `paths`, downleveling, and JS target lowering do not apply. Native stripping only erases inline types.
3. **Non-erasable syntax errors out** - `enum`, `namespace` with runtime code, parameter properties, and import aliases throw `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`.
4. **Use `import type` / `verbatimModuleSyntax`** - Value imports of types crash at runtime; the `type` keyword is mandatory for type-only imports.
5. **File extensions are mandatory** - `import './file.ts'`, not `./file`. `.tsx` is unsupported by native stripping.

## Architecture

```
project/
├── package.json          # "type": "module"
├── tsconfig.json         # noEmit, erasableSyntaxOnly, verbatimModuleSyntax
├── src/
│   ├── index.ts          # node src/index.ts
│   └── interfaces/       # type-only modules (import type)
└── test/
    └── unit.test.ts      # node --test (node:test)
```

→ See [node-esm-setup.md](references/templates/node-esm-setup.md) for a complete setup

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Type Stripping** | [type-stripping.md](references/type-stripping.md) | Running `.ts` natively, understanding what erases and what errors |
| **When tsx** | [tsx-when-needed.md](references/tsx-when-needed.md) | Native stripping is insufficient (paths, enums, decorators, `.tsx`) |
| **Node 24 features** | [references/node24-features.md](references/node24-features.md) | Watch mode, `node:test`, ESM resolution, relevant built-ins |

### Templates

| Template | When to Use |
|----------|-------------|
| [node-esm-setup.md](references/templates/node-esm-setup.md) | Starting an ESM Node + native TS project |

## Best Practices

### DO
- Set `"type": "module"` and use `.ts`/`.mts` with explicit import extensions
- Keep `tsc --noEmit` in CI for real type safety alongside runtime stripping
- Reach for `tsx` the moment you need `paths`, decorators, `enum`, or `.tsx`

### DON'T
- Assume `tsconfig` `paths` or `target` downleveling work at runtime — they don't
- Publish `.ts` files inside `node_modules` — Node refuses to strip them
- Rely on native stripping for decorators (TC39 Stage 3, not transformed)
