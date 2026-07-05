---
name: config-examples
description: Complete copy-paste configs for both stacks — Biome 2.x and ESLint 9 + typescript-eslint
keywords: template, biome.json, eslint.config.mjs, prettier, package.json, ci
---

# Template: Lint/Format Configs (Both Stacks)

Pick ONE stack. Do not run Biome and Prettier on the same files.

---

## Stack A — Biome 2.x (recommended for new projects)

### `biome.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "includes": ["src/**", "test/**"] },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": { "noExplicitAny": "warn", "noDebugger": "error" },
      "correctness": { "noUnusedVariables": "error" },
      "style": { "useConst": "error", "useNamingConvention": "off" }
    },
    "domains": { "test": "recommended" }
  },
  "assist": { "actions": { "source": { "organizeImports": "on" } } }
}
```

### `package.json` scripts

```json
{
  "scripts": {
    "lint": "biome lint .",
    "lint:fix": "biome lint --write .",
    "format": "biome format --write .",
    "check": "biome check --write .",
    "ci": "biome ci ."
  },
  "devDependencies": { "@biomejs/biome": "2.x" }
}
```

### CI step

```yaml
- run: npx @biomejs/biome ci .
```

---

## Stack B — ESLint 9 flat config + typescript-eslint + Prettier

### `eslint.config.mjs`

```js
// @ts-check
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/**", "coverage/**"]),
  {
    files: ["**/*.{js,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: { projectService: true },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
]);
```

### `.prettierrc`

```json
{ "printWidth": 100, "singleQuote": false, "semi": true, "trailingComma": "all" }
```

### `package.json` scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "@eslint/js": "^9.0.0",
    "typescript-eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^6.0.0"
  }
}
```

### CI step

```yaml
- run: npx eslint .
- run: npx tsc --noEmit
```

---

## Reminder

Both stacks lint only. Neither replaces `tsc --noEmit` — keep it in CI for real type
safety. → [../tool-choice.md](../tool-choice.md)
