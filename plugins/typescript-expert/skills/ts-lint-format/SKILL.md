---
name: ts-lint-format
description: Use when choosing and configuring a TypeScript linter/formatter — Biome 2.x (one binary, type-aware) vs ESLint 9 flat config + typescript-eslint (full typed linting). Includes the 2026 arbitrage and Oxlint note. Do NOT use for type checking itself (tsc, ts-config skill) or test-runner configuration (ts-testing).
versions:
  biome: "2.x"
  eslint: "9 (flat config)"
  typescript-eslint: "8.x"
  typescript: "5.8+ (latest stable 6.0)"
references: references/tool-choice.md, references/biome-setup.md, references/eslint-typed.md, references/templates/config-examples.md
related-skills: ts-runtime-node, ts-runtime-bun, solid-generic
---

# TypeScript Linting & Formatting

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect existing lint/format config, project age, framework
2. **fuse-ai-pilot:research-expert** - Verify latest Biome 2.x + typescript-eslint via Context7/Exa
3. **mcp__context7__query-docs** - Check Biome and typescript-eslint docs

After implementation, run **fuse-ai-pilot:sniper** for validation.

## Use when

- Choosing a linter/formatter stack for a TS project (new vs established codebase)
- Configuring **Biome 2.x** (`biome.json`, `biome check`, domains, type-aware rules)
- Configuring **ESLint 9 flat config** + **typescript-eslint** typed linting
- Migrating from ESLint+Prettier, or adding a CI lint gate

## Do NOT use for

- Runtime execution → use [ts-runtime-node](../ts-runtime-node/SKILL.md) / [ts-runtime-bun](../ts-runtime-bun/SKILL.md)
- Framework-specific style rules owned by that framework's own config
- Type checking itself — linters complement, never replace, `tsc --noEmit`

## Critical Rules

1. **Pick ONE formatter** - Biome formats AND lints in one binary; do not also run Prettier on the same files.
2. **Type-aware linting needs the type checker** - `typescript-eslint` typed rules and Biome's type-aware rules both cost a build pass; expect them to be slower than syntactic rules.
3. **Biome does NOT format-lint** - It never reports formatting via lint rules; the formatter owns all formatting decisions.
4. **ESLint 9 = flat config** - Use `eslint.config.mjs` with `typescript-eslint`'s `tseslint.configs.*`; legacy `.eslintrc` is deprecated.
5. **Coverage gap is real** - Biome's type-aware rules cover ~75% of typed-linting needs; full cross-file narrowing and `no-unsafe-*` still require typescript-eslint.

## Architecture

```
project/
├── biome.json            # Biome path: one binary, format + lint
│   OR
├── eslint.config.mjs     # ESLint path: flat config + typescript-eslint
├── .prettierrc           #   (only on ESLint path; Biome replaces Prettier)
└── tsconfig.json         # required for typed linting (both tools)
```

→ See [config-examples.md](references/templates/config-examples.md) for both stacks

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Tool choice (2026)** | [tool-choice.md](references/tool-choice.md) | Deciding Biome vs ESLint; Oxlint challenger |
| **Biome setup** | [biome-setup.md](references/biome-setup.md) | Configuring `biome.json`, rules, domains, CI |
| **ESLint typed** | [eslint-typed.md](references/eslint-typed.md) | Flat config + typescript-eslint typed linting |

### Templates

| Template | When to Use |
|----------|-------------|
| [config-examples.md](references/templates/config-examples.md) | Copy a Biome or ESLint config into a project |

## Best Practices

### DO
- New project → default to **Biome 2.x** (one binary, fast, zero-config start)
- Established/typed-heavy codebase → **ESLint 9 + typescript-eslint** typed linting
- Run the linter in CI with `error` severity to gate merges

### DON'T
- Run Biome and Prettier on the same files (conflicting formatting)
- Enable typed linting and then complain about speed — it's the type checker cost
- Assume Biome covers every typescript-eslint rule — check the gaps first
