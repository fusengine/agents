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

Vitest (5.x) is a Vite-powered runner with ~Jest parity, mature coverage, and
multi-worker CI scaling. It reads `vite.config.*` by default; add a
`test` block or a dedicated `vitest.config.ts`.

Requires Vite `>=6.4.0` (peer `^6.4 || ^7 || ^8`) and Node `^22.12 || ^24 || >=26`.
`vite` is a **peer dependency** since 5.0 — Yarn users must add it explicitly.

Source: https://vitest.dev/blog/vitest-5 + https://vitest.dev/guide/migration/

---

## Vitest 5 breaking changes to know

| Change | Action |
|--------|--------|
| `clearMocks` defaults to `true` (mock call history cleared before every test) | Set `clearMocks: false` to keep v4 behavior |
| `vi.mock` / `vi.unmock` / `vi.hoisted` inside a function or `describe` now **throws** | Move them to module top level (`vi.doMock` may still be nested) |
| `test.sequential` / `describe.sequential` / `sequential` option removed | Use `{ concurrent: false }` |
| Reports/artifacts (html, json, junit, traces) go to a single `.vitest/` dir | Add `.vitest` to `.gitignore` |
| Config files are no longer looked up from parent directories | Keep `vitest.config.*` at the project root or pass `--config` |
| Entry points `vitest/coverage`, `vitest/reporters`, `vitest/environments`, … removed | Import from `vitest/node` / `vitest/runtime` |
| `@vitest/browser-webdriverio` moved to the vitest-community org | Update the dependency if you use WebdriverIO |

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
| `@vitest/browser-webdriverio` | WebdriverIO (community-maintained since 5.0) |

Configure under `test.browser` (`enabled`, `provider`, `instances`); `provider` is a
factory call, e.g. `provider: playwright()` imported from `@vitest/browser-playwright`.

---

## Mocking

| API | Purpose |
|-----|---------|
| `vi.fn()` | Spy/stub function |
| `vi.mock('mod', factory)` | Hoisted module mock |
| `vi.spyOn(obj, 'method')` | Wrap existing method |
| `vi.useFakeTimers()` | Control time |

`vi.mock` factories are hoisted above imports — keep them self-contained, and call
`vi.mock` at module top level (Vitest 5 throws otherwise).

---

## Related References

- [choosing-runner.md](choosing-runner.md) - When to prefer Vitest
- [common-patterns.md](common-patterns.md) - Shared test API
