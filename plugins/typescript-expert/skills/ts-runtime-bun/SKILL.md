---
name: ts-runtime-bun
description: Use when running TypeScript on Bun — bunfig.toml, bun test (coverage, JUnit, preload), Bun.build and --compile, workspaces, and the Bun vs Node transpiler tradeoff. Covers Bun 1.3.x. Do NOT use for Node.js runtime setup (ts-runtime-node) or tsconfig details (ts-config).
versions:
  bun: "1.3.x"
  typescript: "5.8+ (latest stable 6.0)"
references: references/bunfig-test.md, references/build-compile.md, references/workspaces.md, references/bun-vs-node.md, references/templates/bun-project-setup.md
related-skills: ts-runtime-node, ts-lint-format, solid-generic
---

# TypeScript on Bun

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Inspect `package.json`, `bunfig.toml`, `tsconfig.json`
2. **fuse-ai-pilot:research-expert** - Verify Bun 1.3.x behavior via Context7/Exa
3. **mcp__context7__query-docs** - Check Bun runtime, test, and bundler docs

After implementation, run **fuse-ai-pilot:sniper** for validation.

## Use when

- Running `.ts`/`.tsx` directly on Bun with no separate transpile step
- Configuring `bunfig.toml` (`[test]` coverage thresholds, JUnit reporter, preload)
- Bundling with `Bun.build` / `bun build`, or producing a `--compile` single-file binary
- Structuring a Bun **workspaces** monorepo
- Deciding **Bun vs Node** for a given project

## Do NOT use for

- Node's native type stripping / `node:test` → use [ts-runtime-node](../ts-runtime-node/SKILL.md)
- Linting / formatting → use [ts-lint-format](../ts-lint-format/SKILL.md)
- Framework runtimes that own their build pipeline (Next.js, Astro)

## Critical Rules

1. **Bun runs `.ts`/`.tsx` natively** - Its transpiler handles TS + JSX with no config; unlike Node, `.tsx`, `enum`, and decorators work at runtime.
2. **Bun does NOT down-convert syntax** - Recent ECMAScript appears as-is in bundled output; the bundler is not a replacement for `tsc` typechecking.
3. **`bunfig.toml` is Bun-only** - It complements, never replaces, `package.json` and `tsconfig.json`; CLI flags override `bunfig` values.
4. **`bun test` is Jest-compatible** - Import from `bun:test`; not every Jest feature is implemented.
5. **Type-check separately** - Keep `tsc --noEmit` (or `bun x tsc`) in CI; Bun's runtime and bundler do no type checking.

## Architecture

```
monorepo/
├── package.json          # "workspaces": ["packages/*"]
├── bunfig.toml           # [test] coverage + [test.reporter] junit
├── bun.lock
├── tsconfig.json
└── packages/
    ├── core/             # bun:test, Bun.build
    └── cli/              # bun build --compile → binary
```

→ See [bun-project-setup.md](references/templates/bun-project-setup.md) for a complete setup

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **bunfig + test** | [bunfig-test.md](references/bunfig-test.md) | Coverage thresholds, JUnit, preload, watch |
| **Build + compile** | [build-compile.md](references/build-compile.md) | `Bun.build`, single-file executables, cross-compile |
| **Workspaces** | [workspaces.md](references/workspaces.md) | Monorepo layout, `workspace:*`, `--filter`, catalogs |
| **Bun vs Node** | [references/bun-vs-node.md](references/bun-vs-node.md) | Choosing a runtime; transpiler differences |

### Templates

| Template | When to Use |
|----------|-------------|
| [bun-project-setup.md](references/templates/bun-project-setup.md) | Starting a Bun TS project or monorepo |

## Best Practices

### DO
- Put coverage thresholds and the JUnit reporter in `bunfig.toml` for CI
- Use `bun test --coverage` and `--reporter=junit --reporter-outfile` in pipelines
- Use `--compile --target=` to cross-compile CLIs for other platforms

### DON'T
- Treat `bun build` as a typechecker — run `tsc --noEmit` alongside it
- Assume Bun downlevels modern syntax — it does not
- Duplicate `tsconfig` settings into `bunfig.toml` — Bun reads `tsconfig` directly
