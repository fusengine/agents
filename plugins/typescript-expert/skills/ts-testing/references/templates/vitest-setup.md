---
name: vitest-setup
description: Complete Vitest setup — config, coverage thresholds, tests, CI
keywords: vitest, config, coverage, v8, setup, github actions, browser
---

# Vitest Setup

## Usage

Install Vitest plus a coverage provider, then add `vitest.config.ts`.

```bash
npm install -D vitest @vitest/coverage-v8
```

---

## vitest.config.ts

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,               // describe/it/expect without imports
    environment: "node",         // or "jsdom" / "happy-dom"
    pool: "forks",               // "forks" = isolation, "threads" = speed
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",            // or "istanbul"
      reporter: ["text", "lcov"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

---

## test/setup.ts

```ts
// test/setup.ts
import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();          // undo spies between tests
});
```

---

## src/user.test.ts

```ts
// src/user.test.ts
import { describe, it, expect, vi } from "vitest";
import { fetchUser } from "./user";

describe("fetchUser", () => {
  it("returns a user by id", async () => {
    const client = { get: vi.fn().mockResolvedValue({ id: 1, name: "Ada" }) };
    const user = await fetchUser(client, 1);
    expect(user.name).toBe("Ada");
    expect(client.get).toHaveBeenCalledWith("/users/1");
  });
});
```

---

## package.json scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage"
  }
}
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
      - uses: actions/setup-node@v4
        with: { node-version: "24.x" }
      - run: npm ci
      - run: npm run test:cov
```

---

## Optional: Browser Mode

```bash
npm install -D @vitest/browser-playwright playwright
```

```ts
// vitest.config.ts (test block)
browser: {
  enabled: true,
  provider: "playwright",
  instances: [{ browser: "chromium" }],
}
```
