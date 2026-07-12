---
name: bunfig-test
description: Configuring the Bun test runner via bunfig.toml and CLI — coverage, JUnit, preload
when-to-use: Load when setting up bun test, coverage thresholds, reporters, or lifecycle preload
keywords: bunfig, bun-test, coverage, coverageThreshold, junit, preload, watch
related: build-compile.md, bun-vs-node.md
---

# Bun Test Runner + bunfig.toml

## Overview

`bunfig.toml` is Bun's only config file; it holds Bun-specific settings and
shallow-merges a global `~/.bunfig.toml` with the project-local one (local wins, CLI
flags win over both). The `[test]` section configures the built-in, Jest-compatible
runner. Tests import from `bun:test`.

Sources: https://bun.sh/docs/runtime/bunfig + https://bun.sh/docs/cli/test

## `[test]` coverage

```toml
[test]
coverage = true
# Single number = line + function coverage minimum:
coverageThreshold = 0.9
# Or per-metric:
# coverageThreshold = { line = 0.7, function = 0.8, statement = 0.9 }
coverageReporter = ["text", "lcov"]   # default ["text"]
coverageDir = "coverage"              # for persistent reporters (lcov)
coverageSkipTestFiles = false
coveragePathIgnorePatterns = ["**/*.spec.ts", "src/generated/**"]
```

If the suite misses `coverageThreshold`, `bun test` exits non-zero — ideal as a CI
gate. `--coverage` on the CLI overrides the `bunfig` value.

## `[test.reporter]` — JUnit for CI

```toml
[test.reporter]
dots = true                 # one dot per test
junit = "test-results.xml"  # JUnit XML output path
```

Equivalent CLI form (GitLab, generic CI):

```bash
bun test --reporter=junit --reporter-outfile=./bun.xml
```

`bun test` still writes stdout/stderr; the JUnit file is written at the end.
Inside GitHub Actions, `bun test` auto-emits annotations — no config needed.

## Preload (lifecycle setup)

```toml
[test]
preload = ["./test/setup.ts"]   # runs before test files; define beforeAll/etc. here
```

Top-level `preload` (outside `[test]`) applies to `bun run` too. Lifecycle hooks
(`beforeAll`, `beforeEach`, `afterEach`, `afterAll`) live in test files or the
preload script.

## Useful CLI flags

| Flag | Purpose |
|------|---------|
| `--watch` | Re-run on change |
| `--coverage` | Force coverage on |
| `-t, --test-name-pattern` | Filter by test name |
| `--timeout <ms>` | Per-test timeout (default 5000) |
| `--concurrent` / `--max-concurrency N` | Parallel tests in a file (default cap 20) |
| `--randomize` / `--seed N` | Randomized, reproducible order |
| `--rerun-each N` / `--retry N` / `--bail[=N]` | Flake detection & CI early-exit |

Discovery matches `*.test.{ts,tsx,js,jsx}`, `*_test.*`, `*.spec.*`, `*_spec.*`.
Also configurable in `bunfig`: `test.root`, `test.pathIgnorePatterns`,
`test.concurrentTestGlob`, `test.randomize`/`seed`, `test.retry`, `test.onlyFailures`.

→ Example test file in [templates/bun-project-setup.md](templates/bun-project-setup.md)
