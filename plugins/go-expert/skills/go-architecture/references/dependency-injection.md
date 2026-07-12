# Dependency Injection

**Load when:** wiring dependencies in a Go service, deciding whether to add a DI
framework, or structuring constructors and interfaces.

---

## Default: constructor injection, no framework

Idiomatic Go does dependency injection with **plain constructors and interfaces**.
There is no framework by default — `main` is the composition root.

- Each component exposes a `New…` constructor that **accepts its dependencies as
  parameters**, typed as interfaces it needs.
- `main` (or a small `wire`-style setup func) constructs the leaves first, then
  passes them up: `db → store → service → server`.
- The **consumer** defines the interface it needs (accept interfaces, return
  structs). Keep interfaces small and local to the consumer, not the provider.

```go
// internal/store defines what it provides (a concrete type)
type Store struct{ q *Queries }
func New(pool *pgxpool.Pool) *Store { return &Store{q: store.New(pool)} }

// internal/http defines what IT needs (a narrow interface)
type PostStore interface {
    GetPost(ctx context.Context, id int64) (Post, error)
}

type Server struct {
    posts  PostStore
    logger *slog.Logger
}
func NewServer(posts PostStore, logger *slog.Logger) *Server {
    return &Server{posts: posts, logger: logger}
}
```

`*store.Store` satisfies `PostStore` structurally — no explicit `implements`, no
registration. Tests pass a fake `PostStore` (see `go-testing-quality`).

---

## Composition root (`main`)

```go
func main() {
    ctx := context.Background()
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

    pool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
    if err != nil { logger.Error("db", "err", err); os.Exit(1) }
    defer pool.Close()

    store := store.New(pool)
    srv := httpapi.NewServer(store, logger)

    logger.Info("listening", "addr", ":8080")
    if err := http.ListenAndServe(":8080", srv.Handler()); err != nil {
        logger.Error("serve", "err", err); os.Exit(1)
    }
}
```

All wiring is explicit and greppable. No magic, no reflection, no init-order
surprises.

---

## When a DI framework earns its place

Reach for a tool only when manual wiring genuinely hurts (dozens of providers, deep
graphs):

- **google/wire** — compile-time codegen; generates the wiring you would have
  written by hand. Zero runtime cost, errors caught at build time. Preferred when
  you want help but not runtime reflection.
- **uber-go/fx / dig** — runtime reflection-based container with lifecycle hooks.
  Powerful for large apps, but hides the graph and moves errors to runtime.

Default to hand-wiring. Add `wire` before `fx`. Adding a container to a
five-dependency service is over-engineering.

---

## Rules of thumb

- **Accept interfaces, return concrete types.**
- **Define interfaces at the point of use**, kept narrow (1–3 methods).
- **No global/singleton state** for dependencies — pass them explicitly.
- **`context.Context` is the first parameter**, never stored in a struct.
- Keep interface declarations in an `interfaces` location per your SOLID rules
  (`fuse-solid:solid-go`).
