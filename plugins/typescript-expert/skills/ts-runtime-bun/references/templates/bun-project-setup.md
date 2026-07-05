---
name: bun-project-setup
description: Complete Bun 1.3 TypeScript project — bunfig test/coverage, build, compile, workspace
keywords: template, bun, bunfig, bun-test, coverage, junit, workspace, compile
---

# Template: Bun 1.3 TypeScript Project

Copy-paste ready. Runs `.ts`/`.tsx` natively, tests with `bun:test` + coverage gate,
builds and compiles a CLI. Works standalone or as a workspace member.

## `package.json` (root / single package)

```json
{
  "name": "my-bun-app",
  "version": "1.0.0",
  "type": "module",
  "module": "src/index.ts",
  "workspaces": ["packages/*"],
  "scripts": {
    "start": "bun run src/index.ts",
    "dev": "bun --watch src/index.ts",
    "typecheck": "bunx tsc --noEmit",
    "test": "bun test",
    "test:ci": "bun test --coverage --reporter=junit --reporter-outfile=./bun.xml",
    "build": "bun build ./src/index.ts --outdir ./out --target bun --minify",
    "compile": "bun build ./src/cli.ts --compile --outfile ./bin/mycli"
  },
  "devDependencies": {
    "typescript": "^6.0.0",
    "@types/bun": "latest"
  }
}
```

## `bunfig.toml`

```toml
[test]
coverage = true
coverageThreshold = { line = 0.85, function = 0.85, statement = 0.85 }
coverageReporter = ["text", "lcov"]
coverageDir = "coverage"
coveragePathIgnorePatterns = ["**/*.spec.ts", "src/generated/**"]
preload = ["./test/setup.ts"]

[test.reporter]
junit = "test-results.xml"
```

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "bundler",
    "types": ["bun"],
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src", "test"]
}
```

## `src/interfaces/greeting.ts`

```ts
/** Options for {@link greet}. */
export interface GreetOptions {
  /** Name to address. */
  readonly name: string;
  /** Uppercase output when true. */
  readonly shout?: boolean;
}
```

## `src/greeting.ts`

```ts
import type { GreetOptions } from "./interfaces/greeting";

/**
 * Build a greeting string.
 * @param opts - {@link GreetOptions}.
 * @returns Formatted greeting.
 */
export function greet(opts: GreetOptions): string {
  const msg = `Hello, ${opts.name}!`;
  return opts.shout ? msg.toUpperCase() : msg;
}
```

## `src/index.ts`

```ts
import { greet } from "./greeting";

console.log(greet({ name: "Bun", shout: true }));
```

## `test/setup.ts`

```ts
import { beforeAll } from "bun:test";

beforeAll(() => {
  // global test setup runs once before any test file
});
```

## `test/greeting.test.ts`

```ts
import { test, expect } from "bun:test";
import { greet } from "../src/greeting";

test("greet formats plainly", () => {
  expect(greet({ name: "world" })).toBe("Hello, world!");
});

test("greet shouts when asked", () => {
  expect(greet({ name: "world", shout: true })).toBe("HELLO, WORLD!");
});
```

## Run it

```bash
bun install
bun run typecheck   # tsc --noEmit  (Bun does NOT type-check)
bun start           # → HELLO, BUN!
bun test            # coverage gate from bunfig.toml
bun run test:ci     # + JUnit XML for CI
bun run compile     # ./bin/mycli standalone binary
```

## Workspace member (`packages/core/package.json`)

```json
{
  "name": "core",
  "version": "1.0.0",
  "type": "module",
  "module": "src/index.ts"
}
```

Consumer package references it with the workspace protocol:

```json
{ "name": "cli", "dependencies": { "core": "workspace:*" } }
```

→ Filtering and catalogs in [../workspaces.md](../workspaces.md)
