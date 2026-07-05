---
name: vitest
description: Vitest configuration, coverage, and browser mode
when-to-use: Load when using Vitest for a TypeScript project
keywords: vitest, coverage, v8, istanbul, pool, browser mode, playwright, config
priority: high
related: choosing-runner.md, common-patterns.md
---

# Vitest

## Overview

Vitest (4.x) is a Vite-powered runner with ~Jest parity, mature coverage, and
multi-worker CI scaling. It reads `vite.config.*` by default; add a
`test` block or a dedicated `vitest.config.ts`.

Requires Vite `^6 || ^7 || ^8` and Node `^20 || ^22 || >=24`.

---

## Config Essentials

| Option | Purpose |
|--------|---------|
| `test.globals` | Expose `describe`/`it`/`expect` without imports |
| `test.environment` | `node` (default), `jsdom`, `happy-dom` |
| `test.pool` | `forks` (isolation) or `threads` (speed) |
| `test.setupFiles` | Run before each test file |
| `test.coverage.provider` | `v8` or `istanbul` |
| `test.coverage.thresholds` | Fail below target |

→ See `templates/vitest-setup.md` for a complete config

---

## Running

| Command | Purpose |
|---------|---------|
| `vitest` | Watch mode (default) |
| `vitest run` | Single run (CI) |
| `vitest run --coverage` | Single run + coverage |
| `vitest --project <name>` | Run one project in a monorepo |

> With Bun as package manager, use `bun run test` (not `bun test`) so Vitest runs.

---

## Coverage

Coverage lives in separate packages — install what you use:

| Package | Provider |
|---------|----------|
| `@vitest/coverage-v8` | V8 (fast, default) |
| `@vitest/coverage-istanbul` | Istanbul (broadest reporting) |

Set `thresholds` (lines/functions/branches/statements) so CI fails on regression.

---

## Browser Mode

Real-browser component testing via a provider package:

| Package | Driver |
|---------|--------|
| `@vitest/browser-playwright` | Playwright |
| `@vitest/browser-webdriverio` | WebdriverIO |

Configure under `test.browser` (`enabled`, `provider`, `instances`).

---

## Mocking

| API | Purpose |
|-----|---------|
| `vi.fn()` | Spy/stub function |
| `vi.mock('mod', factory)` | Hoisted module mock |
| `vi.spyOn(obj, 'method')` | Wrap existing method |
| `vi.useFakeTimers()` | Control time |

`vi.mock` factories are hoisted above imports — keep them self-contained.

---

## Related References

- [choosing-runner.md](choosing-runner.md) - When to prefer Vitest
- [common-patterns.md](common-patterns.md) - Shared test API
