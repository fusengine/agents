---
name: choosing-runner
description: Decision matrix for bun test vs Vitest
when-to-use: Load when deciding which TypeScript test runner to adopt
keywords: bun test, vitest, runner, choice, coverage, ci, migration
priority: high
related: bun-test.md, vitest.md
---

# Choosing a Runner

## Overview

`bun test` and Vitest share a Jest-compatible API, so test code is largely
portable. The choice hinges on cold-start speed, coverage maturity, CI
parallelism, and mocking needs.

---

## Comparison

| Criterion | `bun test` (1.3.x) | Vitest (4.x) |
|-----------|--------------------|--------------|
| Cold start | Fastest (native runtime) | Slower (Vite pipeline) |
| Setup | Zero-config TS/JSX | Needs Vite + config |
| Execution model | Single process, sequential by default | Multi-worker (forks/threads) |
| Coverage | Experimental (`--coverage`, text/lcov) | Mature: V8 + Istanbul, thresholds |
| Jest parity | High, not complete (tracked upstream) | ~Full, drop-in for most suites |
| Browser/DOM | Via happy-dom / Testing Library | Native browser mode (Playwright) |
| Mocking | `mock`, `jest.fn`, `mock.module` (some limits) | `vi.mock`, `vi.fn`, hoisted factories |

---

## When to Use

| Scenario | Pick |
|----------|------|
| Greenfield app already on Bun | `bun test` |
| Fast local TDD, small/medium suite | `bun test` |
| CLI tool or dependency-free script | `bun test` |
| Large suite needing CI parallelism | Vitest |
| Migrating an existing Jest suite | Vitest |
| Robust coverage gate (V8 + Istanbul) | Vitest |
| Component tests in a real browser | Vitest browser mode |

---

## Known Bun Limitations

| Limitation | Impact |
|------------|--------|
| Experimental coverage | Numbers can shift across releases; weak sole gate on huge suites |
| Single process | No worker-level isolation; heavy suites don't scale across cores the same way |
| `mock.module` edge cases | Re-exports and dynamic `import()` may not always intercept as expected |

→ For a large or migrating suite, prefer Vitest. → See `vitest.md`
→ For speed-first greenfield, prefer Bun. → See `bun-test.md`

---

## Migration Note

Test bodies (`describe`/`it`/`expect`, snapshots, lifecycle hooks) rarely change.
The migration cost is config, coverage wiring, and mock APIs
(`mock.module` ⇄ `vi.mock`), not assertions.

---

## Related References

- [bun-test.md](bun-test.md) - Bun runner config and features
- [vitest.md](vitest.md) - Vitest config, coverage, browser mode
- [common-patterns.md](common-patterns.md) - Shared test API
