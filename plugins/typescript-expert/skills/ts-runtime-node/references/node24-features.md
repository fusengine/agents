---
name: node24-features
description: Node 24 LTS runtime features relevant to TypeScript projects — watch, node:test, ESM
when-to-use: Load when configuring watch mode, native test runner, or ESM resolution on Node 24
keywords: node24, watch, node-test, esm, eval, stdin, input-type
related: type-stripping.md
---

# Node 24 LTS Features for TypeScript

## Overview

Node 24 LTS ships native TypeScript stripping as a stable, default-on feature and
pairs it with runtime tooling that removes most reasons to add extra dependencies for
scripts, CLIs, and internal tools.

Source: https://nodejs.org/api/typescript.html + https://nodejs.org/api/cli.html

## Watch mode

Re-run on file changes without `nodemon`:

```bash
node --watch src/index.ts          # restart on change
node --watch-path=./src src/app.ts # scope the watched paths
```

Works with native stripping, so `node --watch src/index.ts` runs a `.ts` entry
directly with live reload.

## Native test runner (`node:test`)

Node's built-in runner needs no dependency and runs `.ts` tests via stripping:

```bash
node --test              # discover *.test.ts / test/ files
node --test --watch      # watch mode
node --test --experimental-test-coverage   # coverage
```

```ts
import { test } from "node:test";
import assert from "node:assert/strict";

test("adds", () => {
  assert.equal(1 + 1, 2);
});
```

### node:test vs Vitest

| Use `node:test` | Use Vitest |
|-----------------|------------|
| Zero-dependency scripts, CLIs, libraries | App code needing rich mocking/snapshots |
| Native stripping is enough (no `paths`, no JSX) | Aliases, JSX/TSX, jsdom, in-source tests |
| CI wants a built-in, stable runner | Watch UI, coverage UI, Jest-compatible API |

For a Bun-based project, prefer `bun test` → [ts-runtime-bun](../../ts-runtime-bun/SKILL.md).

## Non-file input

Stripping works for `--eval` and STDIN; the module system is chosen by
`--input-type` (as with JavaScript):

```bash
node --input-type=module --eval "const x: number = 1; console.log(x)"
```

TypeScript syntax is **not** supported in the REPL, `--check`, or `inspect`.

## ESM resolution reminders

- `"type": "module"` in `package.json` makes `.ts`/`.js` load as ESM.
- Import extensions are mandatory (`./file.ts`), including in `require('./file.ts')`.
- Use subpath imports (`#name` in `package.json` `imports`) instead of `tsconfig`
  `paths`, which Node ignores at runtime. → [type-stripping.md](type-stripping.md)
