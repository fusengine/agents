---
name: go-architecture
description: Structure Go 1.22+ services — standard cmd/internal layout, constructor-based dependency injection, HTTP routing (net/http ServeMux vs chi vs echo/gin/fiber), and type-safe database access with sqlc + pgx. Use when laying out a new Go project, choosing a router or DB layer, or wiring dependencies. Do NOT use for goroutines/channels patterns (go-concurrency) or language idioms (go-core-idioms).
---

# Go Architecture

Opinionated, 2026-current guidance for structuring Go backend services. Favors the
standard library and small, composable libraries over heavy frameworks.

**Use when:**
- Laying out a new Go module or service (directory structure, `cmd/`, `internal/`)
- Choosing an HTTP router (stdlib `net/http` ServeMux, chi, echo/gin/fiber)
- Choosing a database layer (sqlc + pgx, GORM) or wiring queries
- Wiring dependencies (constructors, DI without a framework)
- Reviewing an existing Go service for structural / architectural issues

**Do NOT use for:**
- Writing tests, benchmarks, fuzzing, coverage — use `go-testing-quality`
- SOLID line-limit / interface-placement enforcement — use `fuse-solid:solid-go`
- Non-Go backends (Laravel, Next.js, Rust) — use the matching expert
- Frontend / UI work — use `fuse-design` or a framework expert

---

## Decision Map

| Question | Load |
|----------|------|
| Where do files/packages go? | [project-layout.md](references/project-layout.md) |
| Which HTTP router? How do I route? | [http-routing.md](references/http-routing.md) |
| How do I talk to the database? | [database-access.md](references/database-access.md) |
| How do I wire dependencies? | [dependency-injection.md](references/dependency-injection.md) |
| I need a full working example | [templates/rest-service.md](references/templates/rest-service.md) |

---

## Core Principles (2026)

1. **Standard library first.** Since Go 1.22 the `net/http.ServeMux` supports
   method matching and path wildcards (`GET /posts/{id}`, `req.PathValue("id")`).
   Most services no longer need a routing framework.
   Source: https://go.dev/blog/routing-enhancements
2. **`internal/` is the default home for service logic.** A server binary is
   self-contained; keep packages under `internal/` and binaries under `cmd/`.
   There is no official `pkg/` requirement — do not cargo-cult it.
   Source: https://go.dev/doc/modules/layout
3. **Constructor injection, no DI framework by default.** Pass dependencies as
   interface parameters to `New…` constructors; wire them in `main`.
4. **Type-safe SQL is the 2026 default.** `sqlc` generates idiomatic Go from raw
   SQL; run it on top of the `pgx` driver for PostgreSQL. GORM still works but is
   in relative decline for new services — see database-access.md for the nuance.
   Sources: https://docs.sqlc.dev + https://pkg.go.dev/github.com/jackc/pgx/v5

---

## Workflow

1. **Explore** the existing tree first (do not assume layout).
2. **Load** the relevant reference from the Decision Map above.
3. **Cross-check** the version-sensitive claims (router, sqlc/pgx) against the
   source URLs before writing code — APIs move.
4. **Scaffold** from [templates/rest-service.md](references/templates/rest-service.md)
   when starting fresh.
5. **Keep files small** and interfaces separated (defer to `fuse-solid:solid-go`).
6. **Validate** with `go-testing-quality` + sniper after any code change.

---

## Boundaries (cross-referenced, not copied)

The community skill set at `github.com/samber/cc-skills-golang` covers overlapping
Go territory. This skill deliberately scopes to **architecture / structure /
routing / DB wiring** and hands testing off to `go-testing-quality`. When in
doubt about which skill owns a topic, prefer the more specific one.
