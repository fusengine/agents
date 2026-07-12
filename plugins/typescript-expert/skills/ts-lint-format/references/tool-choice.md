---
name: tool-choice
description: 2026 arbitrage — Biome 2.x vs ESLint 9 + typescript-eslint, with Oxlint as challenger
when-to-use: Load when deciding which lint/format stack a TypeScript project should adopt
keywords: biome, eslint, typescript-eslint, oxlint, tool-choice, type-aware, prettier
related: biome-setup.md, eslint-typed.md
---

# Choosing a Lint/Format Stack (2026)

## Overview

Two mature stacks, plus one fast challenger. The axis that decides is **how much
typed-linting depth you need** versus **how much you value a single fast binary**.

Sources: https://biomejs.dev/linter/ + https://typescript-eslint.io/getting-started/typed-linting/

## The two main options

| | Biome 2.x | ESLint 9 + typescript-eslint |
|---|-----------|------------------------------|
| Binary | One (Rust); lint + format + import-organize | ESLint + parser + plugins (Node) |
| Formatter | Built-in (replaces Prettier) | Prettier (separate) |
| Config | `biome.json` | `eslint.config.mjs` flat config |
| Rule count | ~509 rules, recommended-by-default | Full ESLint ecosystem + typed rules |
| Type-aware | Yes, **no `tsc` invocation**; ~75% coverage | Yes, via TS type-checker (full) |
| Speed | Very fast (Rust, parallel) | Slower, esp. typed linting |
| Plugins | Limited (no `import/no-cycle`, no testing-library) | Vast ecosystem |

### Biome gaps to know

Biome's type-aware analysis reaches roughly 75% of typed-linting needs **without**
running `tsc`, but it does **not** yet cover, among others:

- `import/no-cycle` (circular-import detection)
- Full `no-unsafe-*` and cross-file type narrowing that ESLint gets from the checker
- Plugin-specific rule sets (e.g. `testing-library`, framework a11y plugins)

## Decision guide

**New project → Biome 2.x.** One binary, format+lint+import-sort, near-zero config,
fast enough to run on every save and in CI. Accept the ~75% typed coverage.

**Established or type-heavy codebase → ESLint 9 + typescript-eslint typed linting.**
When you need `no-unsafe-*`, cross-file narrowing, `import/no-cycle`, or a specific
plugin, the full type-checker-backed rules are worth the slower runs (mitigated by
IDE caching; teams usually run the full pass pre-push or in CI).

**Hybrid** is possible — Biome for format + fast rules, ESLint for the deep typed
rules — but it doubles config surface; only do it if a real gap forces it.

## Oxlint — the challenger

[Oxlint](https://oxc.rs/) (Rust, part of the Oxc toolchain) is an ESLint-oriented
linter focused on raw speed, positioned as a drop-in fast first pass alongside or
ahead of ESLint. As of 2026 its rule coverage and type-aware story are still
maturing versus typescript-eslint; treat it as a **fast pre-filter / challenger**,
not yet a full replacement for typed linting. Worth watching, worth benchmarking.

→ Configure the chosen stack: [biome-setup.md](biome-setup.md) or [eslint-typed.md](eslint-typed.md)
