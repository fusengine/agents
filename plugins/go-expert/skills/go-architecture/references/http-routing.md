# HTTP Routing

**Load when:** choosing an HTTP router for a Go service or writing route
definitions / handlers.

Primary source: https://go.dev/blog/routing-enhancements (Go 1.22, Feb 2024).

---

## The 2026 default: stdlib `net/http`

Since **Go 1.22**, `net/http.ServeMux` handles the two features that used to force
a framework dependency:

- **Method matching:** `mux.HandleFunc("GET /posts/{id}", handler)`. A wrong method
  returns `405 Method Not Allowed` with an `Allow` header automatically. `GET` also
  matches `HEAD`; other methods match exactly.
- **Wildcards:** `{id}` matches one path segment; `{pathname...}` matches all
  remaining segments. Read them with `req.PathValue("id")`.
- **Exact trailing slash:** `/posts/{$}` matches only `/posts/`, not `/posts/234`.
- **Precedence:** the *most specific* pattern wins regardless of registration
  order (`/posts/latest` beats `/posts/{id}`). Genuinely ambiguous overlaps
  (`/posts/{id}` vs `/{resource}/latest`) **panic at registration** — a feature,
  not a bug. Old brace-literal behavior is restorable with GODEBUG `httpmuxgo121`.

For most services this removes the need for a routing library entirely.

---

## When to reach for a library

| Need | Pick | Why |
|------|------|-----|
| Nothing beyond method + wildcard routing | **stdlib ServeMux** | Zero deps, Go 1.22+ |
| Route groups, middleware chains, still `net/http`-native | **chi** | `http.Handler`-compatible, minimal, no lock-in |
| Batteries-included (binding, validation, render) | **echo** / **gin** | Larger API surface, own `Context` type |
| Max raw throughput, willing to leave the ecosystem | **fiber** | See the warning below |

### Honest criteria

- **chi** — thin layer over `net/http`; handlers stay `http.HandlerFunc`, so you
  keep the whole `net/http` middleware ecosystem. Best default *if* stdlib routing
  is not enough.
- **echo / gin** — introduce a framework `Context` (`c.JSON`, `c.Bind`). Ergonomic,
  but your handlers are now coupled to that framework. Fine for app teams, worse
  for reusable libraries.
- **fiber** — built on `fasthttp`, **NOT compatible with `net/http`**. You cannot
  reuse `net/http` middleware, `httptest`, or standard `http.Handler` integrations.
  Choose it only when a benchmarked throughput requirement justifies that isolation.

---

## Recommendation

1. Start with **stdlib ServeMux** on Go 1.22+.
2. Move to **chi** the moment you want route groups / composable middleware and
   want to stay `net/http`-native.
3. Reach for echo/gin only if you actively want their batteries; reach for fiber
   only behind a measured performance need — never by default.

---

## Handler shape (stdlib)

```go
func (s *Server) routes() http.Handler {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /healthz", s.handleHealth)
    mux.HandleFunc("GET /posts/{id}", s.handleGetPost)
    mux.HandleFunc("POST /posts", s.handleCreatePost)
    return s.withMiddleware(mux) // logging, recovery, auth
}

func (s *Server) handleGetPost(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id")
    // ... fetch, then encode JSON
}
```

Keep handlers as methods on a `Server` struct that holds dependencies (store,
logger). See [dependency-injection.md](dependency-injection.md) and the full
[templates/rest-service.md](templates/rest-service.md).
