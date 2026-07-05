---
name: eslint-typed
description: ESLint 9 flat config + typescript-eslint with typed linting
when-to-use: Load when configuring ESLint 9 flat config or enabling type-aware rules
keywords: eslint, flat-config, typescript-eslint, typed-linting, projectService, recommendedTypeChecked
related: tool-choice.md, biome-setup.md
---

# ESLint 9 + typescript-eslint (Typed Linting)

## Overview

ESLint 9 uses the **flat config** format (`eslint.config.mjs`). `typescript-eslint`
provides the parser, plugin, and shareable configs. Typed rules use TypeScript's
type-checker for cross-file, type-aware analysis — the powerful `no-unsafe-*`,
narrowing, and promise rules ESLint can't do syntactically.

Source: https://typescript-eslint.io/getting-started/ + .../typed-linting/

## Install

```bash
npm install --save-dev eslint @eslint/js typescript typescript-eslint
```

## Base flat config (syntactic rules)

```js
// eslint.config.mjs
// @ts-check
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["**/*.{js,ts}"],
  extends: [js.configs.recommended, tseslint.configs.recommended],
});
```

Run with `npx eslint .`.

## Enabling typed linting (two changes)

1. Swap presets to their `*TypeChecked` variants.
2. Point the parser at your TSConfig via `projectService: true`.

```js
export default defineConfig({
  files: ["**/*.{js,ts}"],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommendedTypeChecked,   // + strictTypeChecked / stylisticTypeChecked
  ],
  languageOptions: {
    parserOptions: { projectService: true },
  },
});
```

- `recommendedTypeChecked` adds rules that require type information.
- `projectService: true` (recommended) asks TS's type-checking service per file; the
  older `project: "./tsconfig.json"` option is an alternative.

## Shared config tiers

| Config | Adds |
|--------|------|
| `recommended` | Core recommended rules |
| `strict` | More opinionated, catches more bugs |
| `stylistic` | Consistent styling (non-logic) |
| `*TypeChecked` | Type-aware versions of the above (`strictTypeChecked`, `stylisticTypeChecked`) |

Replace `strict`/`stylistic` with `strictTypeChecked`/`stylisticTypeChecked` when
going typed.

## Performance tradeoff

Typed linting runs a TS build before ESLint lints, so it is slower on large
projects. IDE plugins cache and stay fast; teams typically run the full typed pass
pre-push or in CI. typescript-eslint **strongly recommends** typed linting despite
the cost — the safety of type-aware rules is the whole point.

## Formatting

ESLint does not format well; pair with **Prettier** (`.prettierrc`) on this stack —
or reconsider Biome, which bundles formatting. → [tool-choice.md](tool-choice.md)

→ Full config in [templates/config-examples.md](templates/config-examples.md)
