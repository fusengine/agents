---
name: bun-setup
description: Complete bun test setup — bunfig.toml, setup file, tests, CI
keywords: bun test, bunfig, setup, coverage, github actions
---

# Bun Test Setup

## Usage

Zero-config for basics; add `bunfig.toml` for coverage and preload.

---

## bunfig.toml

```toml
# bunfig.toml — project root
[test]
# Preload runs before all test files (global hooks, env)
preload = ["./test/setup.ts"]
coverage = true
coverageReporter = ["text", "lcov"]
# Fail CI below these ratios (0..1)
coverageThreshold = { line = 0.8, function = 0.8 }
retry = 2
```

---

## test/setup.ts

```ts
// test/setup.ts — global lifecycle shared by all files
import { afterEach } from "bun:test";

afterEach(() => {
  // Reset any global stubs / module state between tests
});
```

---

## src/math.ts

```ts
// src/math.ts
/**
 * Add two numbers.
 * @param a First addend.
 * @param b Second addend.
 * @returns The sum.
 */
export function add(a: number, b: number): number {
  return a + b;
}
```

---

## src/math.test.ts

```ts
// src/math.test.ts
import { describe, it, expect, mock } from "bun:test";
import { add } from "./math";

describe("add", () => {
  it("sums integers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("tracks a spy", () => {
    const spy = mock(add);
    spy(1, 1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("matches a snapshot", () => {
    expect({ sum: add(4, 4) }).toMatchSnapshot();
  });
});
```

---

## .github/workflows/test.yml

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun test --coverage
```

---

## Run

```bash
bun test                 # all tests
bun test ./src/math      # path filter
bun test -t "sums"       # name filter
bun test --coverage      # with coverage
bun test --randomize     # catch order-dependent bugs
```
