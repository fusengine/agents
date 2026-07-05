---
name: bun-test
description: Bun built-in test runner configuration and features
when-to-use: Load when using `bun test` for a TypeScript project
keywords: bun test, bunfig, coverage, mock, concurrent, snapshot, watch
priority: high
related: choosing-runner.md, common-patterns.md
---

# Bun Test Runner

## Overview

Bun ships a fast, Jest-compatible runner (`bun test`) with native TS/JSX,
lifecycle hooks, snapshots, mocks, and watch mode. Tests run in the Bun runtime.

---

## File Discovery

The runner recursively matches these patterns:

| Pattern |
|---------|
| `*.test.{js,jsx,ts,tsx}` |
| `*_test.{js,jsx,ts,tsx}` |
| `*.spec.{js,jsx,ts,tsx}` |
| `*_spec.{js,jsx,ts,tsx}` |

Run a specific file with a `./` or `/` prefix; positional args without a prefix
are path filters. Filter by test name with `-t`/`--test-name-pattern`.

---

## Key Flags

| Flag | Purpose |
|------|---------|
| `--coverage` | Generate a coverage profile (experimental) |
| `--coverage-reporter text\|lcov` | Report format (default `text`) |
| `--coverage-dir <dir>` | Output dir (default `coverage`) |
| `--timeout <ms>` | Per-test timeout (default 5000) |
| `--concurrent` / `--max-concurrency N` | Run async tests in parallel (default cap 20) |
| `--bail[=N]` | Stop after N failures |
| `--retry N` | Retry failed tests up to N times |
| `--randomize` / `--seed N` | Randomize order (reproduce with seed) |
| `--rerun-each N` | Re-run each test N times to surface flakiness |
| `--watch` | Re-run on change |
| `--preload ./setup.ts` | Load setup/hooks before tests |

---

## Concurrency Model

Tests run sequentially within a file by default. Opt into parallelism:

| Construct | Effect |
|-----------|--------|
| `--concurrent` | All async tests parallel in their file |
| `test.concurrent(...)` | This test parallel even without the flag |
| `test.serial(...)` | Force sequential even under `--concurrent` |

---

## bunfig.toml

```toml
[test]
coverage = true
coverageReporter = ["text", "lcov"]
retry = 3
```

→ See `templates/bun-setup.md` for a complete config

---

## Mocks

`mock(fn)` and `jest.fn(fn)` behave identically. `mock.module()` replaces a
module. **Limitation**: re-exports and dynamic `import()` may not always be
intercepted — verify the mock actually applies.

---

## CI Integration

| CI | Behavior |
|----|----------|
| GitHub Actions | Auto-detected; emits annotations, no config |
| GitLab / JUnit | `bun test --reporter=junit --reporter-outfile=./bun.xml` |
| AI agents | `CLAUDECODE=1` / `AGENT=1` → failures-only output |

---

## Related References

- [choosing-runner.md](choosing-runner.md) - When to prefer Bun
- [common-patterns.md](common-patterns.md) - describe/it/expect/snapshot API
