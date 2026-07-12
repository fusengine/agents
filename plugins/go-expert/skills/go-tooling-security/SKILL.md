---
name: go-tooling-security
description: "Use when: setting up Go modules/workspaces, configuring golangci-lint v2, scanning dependencies with govulncheck, modernizing code with go fix, or building a Go CI quality gate. Do NOT use for: writing Go application logic (use the Go expert), non-Go languages, SOLID/architecture refactoring (use solid-go), or generic dependency audits in other ecosystems."
versions:
  go: "1.26"
  golangci-lint: "2"
  govulncheck: "latest"
user-invocable: true
references: references/modules-workspaces.md, references/golangci-lint-v2.md, references/govulncheck.md, references/go-fix-modernizers.md, references/templates/golangci-v2-config.md, references/templates/ci-workflow.md
related-skills: solid-go
---

# Go Tooling & Security

## Agent Workflow (MANDATORY)

Before ANY tooling/security change, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Find existing go.mod/go.work, `.golangci.yml`, CI files
2. **fuse-ai-pilot:research-expert** - Verify latest golangci-lint v2 + govulncheck docs via Context7/Exa
3. **mcp__context7__query-docs** - Check current Go 1.26 `go fix` modernizer set

After changes, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Area | Description |
|------|-------------|
| **Modules & Workspaces** | `go.mod` directives, `go.work` for multi-module dev without `replace` |
| **golangci-lint v2** | Config version `"2"`, `formatters` section, `golangci-lint migrate` |
| **govulncheck** | Reachability-based scan of the call graph against `vuln.go.dev` |
| **go fix modernizers** | Go 1.26 suite of fixers, `//go:fix inline` for API migrations |
| **CI quality gate** | fmt → vet → golangci-lint → govulncheck → test -race |

---

## Critical Rules

1. **Never invent flags or directives** - Confirm every `go`/tool flag against official docs first
2. **golangci-lint v2 config MUST start with `version: "2"`** - v1 configs are rejected; migrate, don't hand-edit
3. **govulncheck runs in source mode by default** - Reachability filters noise; only reported findings matter
4. **`go.work` is usually not committed** - Commit only when modules are developed exclusively together
5. **CI gate order is fail-fast** - Formatting/vet before linters before vulnerability scan before tests

---

## Architecture

```
repo/
├── go.work                 # optional: multi-module workspace
├── go.work.sum
├── module-a/
│   ├── go.mod              # module, go, require, toolchain
│   └── go.sum
├── module-b/
│   └── go.mod
├── .golangci.yml           # version: "2"
└── .github/workflows/ci.yml
```

→ See [ci-workflow.md](references/templates/ci-workflow.md) for the complete gate

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Modules & Workspaces** | [modules-workspaces.md](references/modules-workspaces.md) | Editing go.mod/go.work, multi-module repos |
| **golangci-lint v2** | [golangci-lint-v2.md](references/golangci-lint-v2.md) | Config, v1→v2 migration, formatters |
| **govulncheck** | [govulncheck.md](references/govulncheck.md) | Dependency vulnerability scanning |
| **go fix modernizers** | [go-fix-modernizers.md](references/go-fix-modernizers.md) | Modernizing code, `//go:fix inline`, PGO |

### Templates

| Template | When to Use |
|----------|-------------|
| [golangci-v2-config.md](references/templates/golangci-v2-config.md) | Dropping in a recommended `.golangci.yml` |
| [ci-workflow.md](references/templates/ci-workflow.md) | Wiring the full CI quality gate |

---

## Quick Reference

### Workspace bootstrap

```bash
go work init ./module-a ./module-b   # create go.work
go work use ./module-c               # add a module
go work sync                         # sync build list to modules
```

→ See [modules-workspaces.md](references/modules-workspaces.md)

### Migrate + run golangci-lint v2

```bash
golangci-lint migrate                # v1 config → v2 (backs up original)
golangci-lint run ./...
```

→ See [golangci-v2-config.md](references/templates/golangci-v2-config.md)

### Scan for reachable vulnerabilities

```bash
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...                    # source mode, call-graph reachability
```

→ See [govulncheck.md](references/govulncheck.md)

### Modernize the codebase

```bash
go fix ./...                         # apply Go 1.26 modernizers
```

→ See [go-fix-modernizers.md](references/go-fix-modernizers.md)

---

## Best Practices

### DO
- Pin toolchain with the `toolchain` directive for reproducible builds
- Gate CI on `govulncheck ./...` and treat reachable findings as failures
- Use `go.work` for local cross-module work instead of scattering `replace` directives
- Keep `formatters` (gofmt/goimports) separate from `linters` in the v2 config

### DON'T
- Hand-write a v2 config from a v1 file — run `golangci-lint migrate`
- Commit `go.work` in repos whose modules are also developed with external modules
- Suppress govulncheck findings without confirming the vulnerable symbol is unreachable
- Assume `go vet`/`gofmt` changed in 1.26 — the 1.26 change is `go fix`, not those
