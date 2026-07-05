# Project Layout

**Load when:** starting a new Go module, deciding where a package or binary goes,
or reviewing an existing tree for structural drift.

Source of truth: https://go.dev/doc/modules/layout (official Go docs).

---

## The rules that actually matter

- **A single binary needs no elaborate tree.** A basic command is just
  `main.go` + `go.mod` in the root. Add structure only when it earns its place.
- **`internal/` is for code you do not want other modules importing.** The Go
  toolchain enforces this: packages under `internal/` are importable only within
  the same module. For a service, this is where the bulk of the logic lives.
- **`cmd/<name>/main.go` per binary.** Use a `cmd/` directory when you have more
  than one binary, or when the repo also holds non-Go directories. Each subdir
  declares `package main`.
- **There is NO official `pkg/` directory.** The `pkg/` convention is community
  folklore, not part of the Go docs. Do not add it reflexively. Only expose a
  public package (top-level, outside `internal/`) when another module will really
  import it — and then consider splitting it into its own module.

---

## Recommended server layout

```
myservice/
  go.mod
  go.sum
  cmd/
    api/
      main.go            # wiring + http.ListenAndServe only
  internal/
    config/              # env / flags parsing
    http/                # handlers, router, middleware
    store/               # sqlc-generated code + repository wrappers
      queries/           # *.sql query files (sqlc input)
    domain/              # entities + business rules, no framework imports
  db/
    migrations/          # *.sql migration files
    query.sql            # or split per-domain in internal/store/queries
  sqlc.yaml
```

Adjust freely — this is a starting point, not a spec. The load-bearing ideas are:
`main` stays thin, logic lives under `internal/`, and generated DB code is
isolated in `store/`.

---

## Package naming

- Name packages for **what they provide**, not layers: prefer `store`, `user`,
  `billing` over `utils`, `helpers`, `common`, `base`.
- Avoid stutter: package `user` exposing `user.User` reads worse than
  `user.Account`. Name the type so the qualified name flows.
- One package per directory. The directory name is the import path segment; the
  `package` clause should usually match it.

---

## When to split into a separate module

Split a shared package into its own module only when a *different* repository
needs to depend on it. Until then, keep it in `internal/` where you can refactor
its API freely without breaking external consumers. Premature module boundaries
are harder to undo than to introduce.

---

## Anti-patterns

- `pkg/` added out of habit with everything dumped inside it.
- A `models/` package importing HTTP, SQL, and config — mixing layers.
- Deep nesting (`internal/app/service/impl/v1/...`) with one file per level.
- A giant `utils` package that every other package imports (cyclic-dependency
  magnet, no cohesion).
