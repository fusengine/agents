# Template: Minimal REST Service

**Load when:** scaffolding a fresh Go REST service. Copy-paste ready, Go 1.22+,
stdlib router + pgx pool + constructor DI. sqlc is optional (shown as a repository
seam).

Verified against: https://go.dev/blog/routing-enhancements,
https://pkg.go.dev/github.com/jackc/pgx/v5, https://go.dev/doc/modules/layout

---

## Layout

```
posts-api/
  go.mod
  cmd/api/main.go
  internal/
    domain/post.go
    store/post_store.go
    httpapi/server.go
    httpapi/posts.go
```

## go.mod

```
module github.com/example/posts-api

go 1.24

require github.com/jackc/pgx/v5 v5.10.0
```

## internal/domain/post.go

```go
package domain

import "time"

// Post is the core entity. No framework or DB imports here.
type Post struct {
    ID        int64     `json:"id"`
    Title     string    `json:"title"`
    Body      string    `json:"body"`
    CreatedAt time.Time `json:"created_at"`
}
```

## internal/store/post_store.go

```go
package store

import (
    "context"

    "github.com/example/posts-api/internal/domain"
    "github.com/jackc/pgx/v5"
    "github.com/jackc/pgx/v5/pgxpool"
)

// PostStore is a thin repository over pgx. In a real project the query bodies
// come from sqlc-generated code; here they are inline to stay self-contained.
type PostStore struct{ pool *pgxpool.Pool }

// NewPostStore builds a store from a concurrency-safe pool.
func NewPostStore(pool *pgxpool.Pool) *PostStore { return &PostStore{pool: pool} }

// GetPost returns a single post by id, or pgx.ErrNoRows if absent.
func (s *PostStore) GetPost(ctx context.Context, id int64) (domain.Post, error) {
    rows, _ := s.pool.Query(ctx,
        `select id, title, body, created_at from posts where id = $1`, id)
    return pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[domain.Post])
}

// CreatePost inserts a post and returns the generated id.
func (s *PostStore) CreatePost(ctx context.Context, p domain.Post) (int64, error) {
    var id int64
    err := s.pool.QueryRow(ctx,
        `insert into posts (title, body) values ($1, $2) returning id`,
        p.Title, p.Body).Scan(&id)
    return id, err
}
```

## internal/httpapi/server.go

```go
package httpapi

import (
    "context"
    "log/slog"
    "net/http"

    "github.com/example/posts-api/internal/domain"
)

// PostStore is the narrow interface the HTTP layer needs (defined at use site).
type PostStore interface {
    GetPost(ctx context.Context, id int64) (domain.Post, error)
    CreatePost(ctx context.Context, p domain.Post) (int64, error)
}

// Server holds injected dependencies. Handlers are methods on it.
type Server struct {
    posts  PostStore
    logger *slog.Logger
}

// NewServer wires dependencies via constructor injection.
func NewServer(posts PostStore, logger *slog.Logger) *Server {
    return &Server{posts: posts, logger: logger}
}

// Handler builds the router (Go 1.22 method + wildcard patterns).
func (s *Server) Handler() http.Handler {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
        w.WriteHeader(http.StatusOK)
    })
    mux.HandleFunc("GET /posts/{id}", s.handleGetPost)
    mux.HandleFunc("POST /posts", s.handleCreatePost)
    return s.recover(s.logRequests(mux))
}
```

## internal/httpapi/posts.go

```go
package httpapi

import (
    "encoding/json"
    "errors"
    "net/http"
    "strconv"

    "github.com/example/posts-api/internal/domain"
    "github.com/jackc/pgx/v5"
)

// handleGetPost reads {id} via r.PathValue (Go 1.22) and returns JSON.
func (s *Server) handleGetPost(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
    if err != nil {
        http.Error(w, "invalid id", http.StatusBadRequest)
        return
    }
    post, err := s.posts.GetPost(r.Context(), id)
    if errors.Is(err, pgx.ErrNoRows) {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }
    if err != nil {
        s.logger.Error("get post", "err", err)
        http.Error(w, "internal error", http.StatusInternalServerError)
        return
    }
    writeJSON(w, http.StatusOK, post)
}

// handleCreatePost decodes the body, persists it, and returns the new id.
func (s *Server) handleCreatePost(w http.ResponseWriter, r *http.Request) {
    var in domain.Post
    if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
        http.Error(w, "invalid body", http.StatusBadRequest)
        return
    }
    id, err := s.posts.CreatePost(r.Context(), in)
    if err != nil {
        s.logger.Error("create post", "err", err)
        http.Error(w, "internal error", http.StatusInternalServerError)
        return
    }
    writeJSON(w, http.StatusCreated, map[string]int64{"id": id})
}

// writeJSON centralizes encoding + content-type.
func writeJSON(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    _ = json.NewEncoder(w).Encode(v)
}
```

## internal/httpapi/middleware.go

```go
package httpapi

import "net/http"

// logRequests logs method + path for every request.
func (s *Server) logRequests(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        s.logger.Info("request", "method", r.Method, "path", r.URL.Path)
        next.ServeHTTP(w, r)
    })
}

// recover turns panics into 500s instead of crashing the server.
func (s *Server) recover(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if rec := recover(); rec != nil {
                s.logger.Error("panic", "recover", rec)
                http.Error(w, "internal error", http.StatusInternalServerError)
            }
        }()
        next.ServeHTTP(w, r)
    })
}
```

## cmd/api/main.go

```go
package main

import (
    "context"
    "log/slog"
    "net/http"
    "os"

    "github.com/example/posts-api/internal/httpapi"
    "github.com/example/posts-api/internal/store"
    "github.com/jackc/pgx/v5/pgxpool"
)

func main() {
    ctx := context.Background()
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

    pool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
    if err != nil {
        logger.Error("connect db", "err", err)
        os.Exit(1)
    }
    defer pool.Close()

    srv := httpapi.NewServer(store.NewPostStore(pool), logger)

    logger.Info("listening", "addr", ":8080")
    if err := http.ListenAndServe(":8080", srv.Handler()); err != nil {
        logger.Error("serve", "err", err)
        os.Exit(1)
    }
}
```

---

## Notes

- `pgx.CollectExactlyOneRow` returns `pgx.ErrNoRows` when nothing matched — the
  handler maps that to 404.
- Swap the inline SQL in `store` for sqlc-generated methods once you add
  `sqlc.yaml` (`sql_package: "pgx/v5"`); the `httpapi.PostStore` interface stays
  identical, so handlers do not change.
- Keep every file under the SOLID line limit (`fuse-solid:solid-go`); split
  handlers per resource as the API grows.
