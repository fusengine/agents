---
name: node-esm-setup
description: Complete ESM Node 24 project running TypeScript natively (no build step)
keywords: template, node, esm, type-stripping, node-test, tsconfig
---

# Template: Node 24 ESM + Native TypeScript

Copy-paste ready. Runs `.ts` directly via native stripping, type-checks with `tsc`,
tests with `node:test`. No bundler, no `ts-node`.

## `package.json`

```json
{
  "name": "my-node-tool",
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "start": "node src/index.ts",
    "dev": "node --watch src/index.ts",
    "typecheck": "tsc --noEmit",
    "test": "node --test",
    "test:watch": "node --test --watch"
  },
  "devDependencies": {
    "typescript": "^6.0.0",
    "@types/node": "^24.0.0"
  }
}
```

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "noEmit": true,
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src", "test"]
}
```

## `src/interfaces/greeting.ts`

```ts
/** Options controlling how {@link greet} renders its message. */
export interface GreetOptions {
  /** Name to address. */
  readonly name: string;
  /** Uppercase the whole greeting when true. */
  readonly shout?: boolean;
}
```

## `src/greeting.ts`

```ts
// Type-only import: mandatory `type` keyword for native stripping.
import type { GreetOptions } from "./interfaces/greeting.ts";

/**
 * Build a greeting string.
 * @param opts - {@link GreetOptions} name and formatting.
 * @returns The formatted greeting.
 */
export function greet(opts: GreetOptions): string {
  const msg = `Hello, ${opts.name}!`;
  return opts.shout ? msg.toUpperCase() : msg;
}
```

## `src/index.ts`

```ts
import { greet } from "./greeting.ts";

console.log(greet({ name: "Node 24", shout: true }));
```

## `test/greeting.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { greet } from "../src/greeting.ts";

test("greet formats plainly", () => {
  assert.equal(greet({ name: "world" }), "Hello, world!");
});

test("greet shouts when asked", () => {
  assert.equal(greet({ name: "world", shout: true }), "HELLO, WORLD!");
});
```

## Run it

```bash
npm run typecheck   # real type safety (stripping does NOT type-check)
npm start           # node src/index.ts  → HELLO, NODE 24!
npm test            # node --test
```

## If you hit a wall

Need `enum`, decorators, `paths`, or `.tsx`? Native stripping errors. Switch the
`start`/`dev`/`test` scripts to `tsx` (`node --import=tsx src/index.ts`).
→ See [tsx-when-needed.md](../tsx-when-needed.md).
