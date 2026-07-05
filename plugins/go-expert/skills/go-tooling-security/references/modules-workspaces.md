---
name: modules-workspaces
description: go.mod directives and go.work multi-module workspaces
when-to-use: Editing go.mod, wiring a multi-module repo, or choosing workspace vs replace
keywords: go.mod, go.work, workspace, module, require, toolchain, replace, GOWORK
priority: high
related: golangci-lint-v2.md
---

# Go Modules & Workspaces

**Load when:** editing `go.mod`/`go.work`, setting up multi-module development, or deciding between workspaces and `replace` directives.

## Overview

`go.mod` defines a single module; `go.work` groups several on-disk modules as main modules for minimal version selection, so you can develop across them without polluting each `go.mod` with `replace` directives.
Source: https://go.dev/ref/mod

---

## go.mod Directives

| Directive | Purpose |
|-----------|---------|
| `module` | Main module path (exactly one; `/v2+` suffix for major versions ≥2) |
| `go` | Minimum Go version semantics; mandatory min since Go 1.21 |
| `toolchain` | Suggested toolchain; cannot be lower than the `go` directive |
| `require` | Minimum version of a dependency (`// indirect` added automatically) |
| `exclude` / `replace` / `retract` | Block, substitute, or withdraw versions (main module only) |
| `tool` (Go 1.24+) | Register a package for `go tool` |

> Go 1.26: `go mod init` now writes a lower `go` line — release `1.N` produces `go 1.(N-1).0`. Source: https://go.dev/doc/go1.26

---

## go.work Directives

| Directive | Purpose |
|-----------|---------|
| `go` | Toolchain version for the workspace (required, at most one) |
| `use` | Add an on-disk module by path to `go.mod`'s directory (no recursion into subdirs) |
| `replace` | Override module contents; wildcard replace overrides per-module `go.mod` replaces |
| `toolchain` / `godebug` | Suggested toolchain / workspace-wide GODEBUG settings |

```
go 1.26.0

use (
    ./module-a
    ./module-b
)

replace example.com/x/net => ./fork/net
```
Source: https://go.dev/ref/mod

---

## Workspace Commands

| Command | Effect |
|---------|--------|
| `go work init [dirs...]` | Create `go.work` with initial `use` entries |
| `go work use [dir]` | Add a module directory to the workspace |
| `go work sync` | Push the workspace build list back into each module's `go.mod` |
| `go env GOWORK` | Show the active `go.work` (empty if not in workspace mode) |

`GOWORK=off` disables workspace mode; `GOWORK=/path/to/x.work` selects an explicit file.

---

## Decision Guide

```
Need to use local, unreleased versions of related modules?
├── Only on YOUR machine / temporary → go.work (do not commit)
├── Modules developed EXCLUSIVELY together → go.work (may commit)
└── A single dependency permanently forked → replace in go.mod
```

---

## Best Practices

### DO
- Set a `toolchain` directive for reproducible CI builds
- Use `go work use` to onboard a new local module quickly
- Run `go work sync` before committing per-module `go.mod` changes

### DON'T
- Commit `go.work` when modules are also built against external modules — it can make CI test wrong versions
- Add `replace` directives to every `go.mod` for local dev — use a workspace instead
- Expect `use ./parent` to include nested modules; each needs its own `use`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| CI resolves unexpected versions | A committed `go.work` overrides deps; set `GOWORK=off` in CI or don't commit it |
| `go.mod` `go` line above toolchain | Raise the `toolchain` directive or lower the `go` line |
| Major-version import fails | Module path must end in `/v2`, `/v3`, … for versions ≥ 2 |

## Related Templates

- [ci-workflow.md](templates/ci-workflow.md) - Sets `GOWORK` and matrix Go versions in CI
