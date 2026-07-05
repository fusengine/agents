---
name: ts-testing
description: Use when writing or configuring TypeScript tests and choosing between bun test and Vitest. Covers runner selection, config, mocks, snapshots, and coverage. Do NOT use for framework-specific testing (React components → react-expert react-testing, Laravel → laravel-testing) or browser E2E suites.
versions:
  bun: "1.3.14"
  vitest: "4.1.9"
user-invocable: true
references: references/choosing-runner.md, references/bun-test.md, references/vitest.md, references/common-patterns.md, references/templates/bun-setup.md, references/templates/vitest-setup.md
related-skills: solid-generic, ts-packaging
---

# TypeScript Testing

Pick the right runner, then write tests with a shared Jest-compatible API.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect existing runner, config, test layout
2. **fuse-ai-pilot:research-expert** - Verify latest bun test / Vitest docs via Context7/Exa
3. **mcp__context7__query-docs** - Check mock, coverage, config APIs

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Both runners share a Jest-like API (`describe`/`it`/`expect`, lifecycle hooks,
snapshots, mocks). They differ on speed, coverage maturity, and CI scaling.

| Runner | Strength | Weakness |
|--------|----------|----------|
| `bun test` | Fastest cold start, zero-config TS/JSX, built-in | Single process, experimental coverage, mock limits |
| Vitest | V8/Istanbul coverage, multi-worker CI scaling, ~Jest parity, browser mode | Needs Vite + config, slower cold start |

---

## Critical Rules

1. **One runner per package** - Never mix `bun:test` and `vitest` imports
2. **`bun run test`, not `bun test`, when the runner is Vitest** - Else Bun runs its own
3. **Explicit coverage thresholds** - Fail CI below target, don't just report
4. **Deterministic tests** - Isolate shared state; use `--randomize` (Bun) to catch order bugs
5. **Mock at boundaries** - Network/FS/time, never internal implementation detail

---

## Decision Guide

```
Choosing a runner?
├── Greenfield, Bun runtime, fast local TDD → bun test
├── Large suite / heavy CI parallelism → Vitest (multi-worker)
├── Migrating from Jest / need full coverage → Vitest (V8 + Istanbul)
├── Component/DOM in real browser → Vitest browser mode (Playwright)
└── Zero-dependency script or CLI → bun test
```

→ See `references/choosing-runner.md` for the full matrix

---

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| Runner selection | `references/choosing-runner.md` | Deciding bun test vs Vitest |
| Bun test runner | `references/bun-test.md` | Using `bun test` |
| Vitest | `references/vitest.md` | Using Vitest |
| Shared API | `references/common-patterns.md` | Writing describe/it/mock/snapshot |

### Templates

| Template | Use Case |
|----------|----------|
| `references/templates/bun-setup.md` | bunfig.toml + first Bun tests |
| `references/templates/vitest-setup.md` | vitest.config.ts + coverage + CI |

---

## Quick Start

### Bun

```ts
import { test, expect } from "bun:test";

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});
```

```bash
bun test --coverage
```

→ See `references/templates/bun-setup.md`

### Vitest

```ts
import { test, expect } from "vitest";

test("adds 1 + 2", () => {
  expect(1 + 2).toBe(3);
});
```

```bash
npx vitest run --coverage
```

→ See `references/templates/vitest-setup.md`

---

## Best Practices

### DO
- Colocate tests as `*.test.ts` next to source
- Assert inside every `waitFor`/async block
- Set per-test timeouts for network-bound tests

### DON'T
- Mix both runners in one package
- Rely on test execution order
- Ship experimental Bun coverage as the sole quality gate on huge suites
