---
name: jsr-json
description: Complete jsr.json with multi-entry exports and slow-type-safe source
keywords: jsr.json, exports, slow types, esm, deno, module
---

# jsr.json Template

## Usage

Config file at the package root. Deno users may inline these keys in `deno.json`.

---

## Single Entry

```json
{
  "name": "@scope/greet",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

---

## Multiple Entries

```json
{
  "name": "@scope/greet",
  "version": "1.0.0",
  "exports": {
    ".": "./mod.ts",
    "./greet": "./greet.ts",
    "./farewell": "./farewell.ts"
  },
  "include": ["mod.ts", "src/**/*.ts"],
  "exclude": ["**/*.test.ts"]
}
```

Consumers import `@scope/greet`, `@scope/greet/greet`, `@scope/greet/farewell`.

---

## mod.ts (entrypoint)

```ts
/**
 * A module providing greeting functions.
 *
 * @example
 * ```ts
 * import { greet } from "@scope/greet";
 * greet("Ada");
 * ```
 *
 * @module
 */
export * from "./greet.ts";
```

---

## greet.ts (slow-type-safe)

```ts
// greet.ts
/**
 * Greet a person by name.
 * @param name The name to greet.
 * @returns The greeting string.
 */
export function greet(name: string): string {
  // Explicit return type above keeps this JSR "fast-types" compliant.
  return `Hello, ${name}!`;
}

// Explicit const type — required for exported constants.
export const DEFAULT_GREETING: string = "Hello, world!";
```

---

## Publish

```bash
# Verify without publishing
npx jsr publish --dry-run

# Publish (browser auth locally, OIDC in GitHub Actions)
npx jsr publish
```

Use relative imports with explicit `.ts` extensions between modules.
