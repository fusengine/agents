---
name: common-patterns
description: Shared Jest-compatible test API across bun test and Vitest
when-to-use: Load when writing describe/it/expect, mocks, or snapshots
keywords: describe, it, expect, snapshot, lifecycle, mock, matchers
priority: medium
related: bun-test.md, vitest.md
---

# Common Test Patterns

## Overview

Both runners expose the same Jest-like surface. Only the import specifier
(`bun:test` vs `vitest`) and the mock namespace (`mock`/`jest` vs `vi`) differ.

---

## Structure

```ts
import { describe, it, expect, beforeEach } from "vitest"; // or "bun:test"

describe("calculator", () => {
  let value: number;
  beforeEach(() => { value = 0; });

  it("adds", () => {
    value += 2;
    expect(value).toBe(2);
  });
});
```

---

## Lifecycle Hooks

| Hook | Runs |
|------|------|
| `beforeAll` | Once before all tests |
| `beforeEach` | Before each test |
| `afterEach` | After each test |
| `afterAll` | Once after all tests |

---

## Common Matchers

| Matcher | Checks |
|---------|--------|
| `toBe` / `toEqual` | Identity / deep equality |
| `toContain` | Array/string membership |
| `toThrow` | Function throws |
| `toHaveBeenCalledWith` | Mock call args |
| `resolves` / `rejects` | Async settlement |

---

## Snapshots

```ts
expect(result).toMatchSnapshot();
expect(result).toMatchInlineSnapshot();
```

Update: `bun test --update-snapshots` or `vitest run -u`.

---

## Portability Table

| Concern | Bun | Vitest |
|---------|-----|--------|
| Import | `bun:test` | `vitest` |
| Spy | `mock()` / `jest.fn()` | `vi.fn()` |
| Module mock | `mock.module()` | `vi.mock()` |
| Fake timers | `jest.useFakeTimers()` | `vi.useFakeTimers()` |

Keep test bodies runner-agnostic; isolate the differing imports/mocks so a
future migration only touches setup, not assertions.

---

## Related References

- [bun-test.md](bun-test.md) - Bun-specific flags and mocks
- [vitest.md](vitest.md) - Vitest config, coverage, browser mode
