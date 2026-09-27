---
name: eslint-typed
description: ESLint 10 flat config + typescript-eslint with typed linting
when-to-use: Load when configuring ESLint 10 flat config or enabling type-aware rules
keywords: eslint, flat-config, typescript-eslint, typed-linting, projectService, recommendedTypeChecked, typescript6
related: tool-choice.md, biome-setup.md
---

# ESLint 10 + typescript-eslint (Typed Linting)

## Overview

ESLint 10 supports **only** the flat config format (`eslint.config.mjs`): eslintrc,
`.eslintignore`, `ESLINT_USE_FLAT_CONFIG` and `/* eslint-env */` comments (now reported as
errors) are gone. Config lookup starts from **each linted file's directory**, so a monorepo can
hold several `eslint.config.*` files. Requires Node `^20.19.0 || ^22.13.0 || >=24`. ESLint 9 is
EOL since 2026-08-06. `typescript-eslint`
provides the parser, plugin, and shareable configs. Typed rules use TypeScript's
type-checker for cross-file, type-aware analysis — the powerful `no-unsafe-*`,
narrowing, and promise rules ESLint can't do syntactically.

Source: https://typescript-eslint.io/getting-started/ + .../typed-linting/ +
https://eslint.org/blog/2026/02/eslint-v10.0.0-released/

## Install

```bash
npm install --save-dev eslint @eslint/js typescript typescript-eslint
```

### TypeScript 7.0 projects

typescript-eslint 8.x declares `typescript: ">=4.8.4 <6.1.0"` and needs the compiler API,
which TS 7.0 does not ship (typescript-eslint#12518). Keep the linter on the 6.0 API via the
official compatibility package while `tsc` runs 7.0:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.2",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

`npx tsc` then runs TS 7.0; typescript-eslint resolves `typescript` to 6.0
(devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

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
