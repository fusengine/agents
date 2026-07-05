# Database Access

**Load when:** choosing a Go database layer or wiring queries for a PostgreSQL
service.

Sources: https://docs.sqlc.dev + https://pkg.go.dev/github.com/jackc/pgx/v5

---

## The 2026 default: sqlc + pgx

For PostgreSQL, the current idiomatic stack is **sqlc for code generation** on top
of the **pgx driver**.

- **sqlc** generates *fully type-safe idiomatic Go* from raw SQL. You write `.sql`
  queries, run `sqlc generate`, and get typed methods — no runtime reflection, no
  hand-written scanning boilerplate. Source: https://docs.sqlc.dev
- **pgx v5** is a pure-Go, high-performance PostgreSQL driver exposing PG-specific
  features (`LISTEN`/`NOTIFY`, `COPY`, batch queries, binary protocol). It can also
  act as a `database/sql` driver via the `stdlib` subpackage.
  Source: https://pkg.go.dev/github.com/jackc/pgx/v5

Why this pairing wins: you keep SQL as the source of truth (reviewable, portable,
uses real DB features), and Go stays type-safe end to end without ORM magic.

---

## GORM — the honest nuance

GORM is still widely used and perfectly viable, but for **new** services in 2026 it
is in relative decline versus sqlc+pgx. Weigh it fairly:

- **Reasons to still pick GORM:** rapid CRUD scaffolding, associations/auto-migrate,
  a team already fluent in it, or a DB-agnostic app.
- **Reasons teams move away:** reflection-based queries hide cost and N+1s, generated
  SQL is opaque, and the API fights Go's explicitness. sqlc surfaces the exact SQL.

This is a trade-off, not a verdict. Do not tell a user their working GORM codebase
is "wrong" — recommend sqlc+pgx as the *default for greenfield*, and migrate only
with cause.

---

## pgx essentials

Use a **pool** for concurrency — a single `*pgx.Conn` is not concurrency-safe:

```go
import "github.com/jackc/pgx/v5/pgxpool"

pool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
// pool is safe for concurrent use; defer pool.Close()
```

Prefer the generic row helpers over manual `Next()`/`Scan()`/`Close()`:

```go
rows, _ := pool.Query(ctx, "select id, name from users")
users, err := pgx.CollectRows(rows, pgx.RowToStructByName[User])
```

`CollectRows` + `RowToStructByName` (or `RowToAddrOfStructByPos`) map columns to
struct fields via `db:"..."` tags and handle cleanup for you. Single row:
`pool.QueryRow(ctx, sql, args...).Scan(&a, &b)`. Non-returning statements:
`pool.Exec(ctx, sql, args...)`, then check `commandTag.RowsAffected()`.

---

## Wiring sqlc to pgx

`sqlc.yaml` configured with `sql_package: "pgx/v5"` makes sqlc emit a `Queries`
type whose constructor takes a `DBTX` (satisfied by `*pgxpool.Pool`):

```go
queries := store.New(pool)          // store = sqlc "package: store"
user, err := queries.GetUser(ctx, id) // typed method, typed args, typed return
```

Wrap `queries` in a repository interface (defined in your `internal/store` or an
`interfaces` package) so handlers depend on the interface, not on generated code.
See [dependency-injection.md](dependency-injection.md).

---

## Migrations

sqlc does **not** run migrations — it only reads your schema to generate code. Pair
it with a migration tool: `golang-migrate`, `goose`, `tern` (from the pgx author),
or Atlas. Keep migration `.sql` files under `db/migrations/`.
