---
name: go-core-idioms
description: "Use when: writing or reviewing idiomatic sequential Go — error handling (%w wrapping, errors.Join, errors.Is/As, errors.AsType), slog structured logging, generics, small consumer-side interfaces, naming/style, new(expr), go fix modernizers. Do NOT use for: goroutines/channels/errgroup/context concurrency (use go-concurrency), non-Go languages, framework-specific code."
versions:
  go: "1.26"
user-invocable: false
references: references/error-handling.md, references/slog-logging.md, references/generics-and-1.26.md, references/interfaces-and-style.md, references/templates/error-patterns.md, references/templates/slog-setup.md
related-skills: go-concurrency, solid-go
---

# Go Core Idioms

Idiomatic sequential Go for 1.26. For anything touching goroutines, channels,
`errgroup`, or `context` cancellation, use **go-concurrency** instead.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Map existing error/logging/interface patterns
2. **fuse-ai-pilot:research-expert** - Verify latest Go docs via Context7/Exa
3. **mcp__context7__query-docs** - Confirm stdlib signatures (errors, log/slog)

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Error handling** | Explicit `if err != nil`, `%w` wrapping, `errors.Join`, `errors.AsType` (1.26) |
| **Structured logging** | `log/slog` stdlib — handlers, attrs, groups, `LogValuer` |
| **Generics** | Type params, constraints, self-referential types (1.26) |
| **Interfaces** | Small, consumer-side — "accept interfaces, return structs" |
| **Modernizers** | `go fix` auto-applies dozens of idiom/API fixers (1.26) |

---

## Critical Rules

1. **Explicit `if err != nil`** - No sugar exists; never discard with `_ = err`
2. **Wrap with `%w`, not `%v`** - Preserves the chain for `errors.Is`/`As`/`AsType`
3. **Accept interfaces, return structs** - Define interfaces where consumed, not where produced
4. **Value receivers by default** - Use pointer receivers only for mutation or large structs
5. **Run `go fix` + `go vet`** - Let modernizers migrate to current idioms (1.26)

---

## Architecture

```
internal/
├── user/
│   ├── user.go          # struct + value-receiver methods
│   ├── errors.go        # sentinel + typed errors
│   └── repository.go    # consumer-side interface, concrete struct returned
└── platform/
    └── logging/
        └── logger.go    # slog setup, one *slog.Logger injected downward
```

→ See [error-patterns.md](references/templates/error-patterns.md) for full example

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Error handling** | [error-handling.md](references/error-handling.md) | Wrapping, sentinels, `errors.Join`, `AsType` |
| **Structured logging** | [slog-logging.md](references/slog-logging.md) | Choosing handlers, attrs, groups, perf |
| **Generics & 1.26** | [generics-and-1.26.md](references/generics-and-1.26.md) | Type params, self-ref types, `new(expr)` |
| **Interfaces & style** | [interfaces-and-style.md](references/interfaces-and-style.md) | Interface placement, naming, receivers |

### Templates

| Template | When to Use |
|----------|-------------|
| [error-patterns.md](references/templates/error-patterns.md) | Building an error strategy for a package |
| [slog-setup.md](references/templates/slog-setup.md) | Wiring a structured logger into an app |

---

## Quick Reference

### Wrap and inspect errors

```go
if err != nil {
    return fmt.Errorf("load user %d: %w", id, err) // %w keeps the chain
}
// 1.26: type-safe, generic replacement for errors.As
if pathErr, ok := errors.AsType[*fs.PathError](err); ok {
    log.Printf("failed path: %s", pathErr.Path)
}
```

→ See [error-handling.md](references/error-handling.md)

### Structured logging with slog

```go
logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
logger.Info("user created", "id", id, slog.Duration("took", elapsed))
```

→ See [slog-logging.md](references/slog-logging.md)

---

## Best Practices

### DO
- Keep interfaces one-to-three methods, named at the call site
- Add context on the way up with `%w`; check with `errors.Is`/`AsType`
- Use `slog.LogAttrs` on hot paths to avoid allocation
- Run `go fix` to adopt current APIs and idioms automatically (1.26)

### DON'T
- Swallow errors (`_ = err`) or return bare `err` when context helps
- Define interfaces next to their implementation "just in case"
- Reach for pointer receivers without a mutation or size reason
- Write Java-esque getters/setters or `IFoo` interface prefixes
