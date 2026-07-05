---
name: slog-setup
description: Complete slog wiring — environment-driven handler, dynamic level, request logger, LogValuer redaction
keywords: template, slog, logger, LevelVar, LogValuer, JSONHandler
---

# Template: Application Logger (slog)

Complete setup: JSON in production / text in dev, a runtime-adjustable level,
a request-scoped child logger, and `LogValuer` redaction of secrets.

```go
package logging

import (
	"log/slog"
	"os"
)

// level is process-wide and safe to change at runtime.
var level slog.LevelVar // zero value = LevelInfo

// New builds the root logger and installs it as the slog default so that
// package-level slog.Info(...) and the standard log package both route here.
func New(env string) *slog.Logger {
	opts := &slog.HandlerOptions{Level: &level}

	var h slog.Handler
	if env == "production" {
		h = slog.NewJSONHandler(os.Stdout, opts)
	} else {
		h = slog.NewTextHandler(os.Stderr, opts)
	}

	logger := slog.New(h)
	slog.SetDefault(logger)
	return logger
}

// SetDebug flips verbose logging on/off without a restart.
func SetDebug(on bool) {
	if on {
		level.Set(slog.LevelDebug)
		return
	}
	level.Set(slog.LevelInfo)
}
```

## Request-scoped child logger

```go
func Middleware(base *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqLog := base.With(
			"trace_id", r.Header.Get("X-Trace-Id"),
			"method", r.Method,
			"path", r.URL.Path,
		)
		// Pass reqLog down via context so handlers reuse it.
		ctx := context.WithValue(r.Context(), logKey{}, reqLog)
		reqLog.InfoContext(ctx, "request started")
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
```

## Redacting secrets with LogValuer

```go
// Token never appears verbatim in logs — LogValue controls its rendering.
type Token string

func (Token) LogValue() slog.Value { return slog.StringValue("REDACTED") }

// Usage — the raw token is masked in output:
slog.Info("authenticated", "token", Token(raw), "user", id)
```

## Hot-path logging (no allocation)

```go
// LogAttrs takes only slog.Attr, letting slog skip the any-boxing allocation.
logger.LogAttrs(ctx, slog.LevelInfo, "cache lookup",
	slog.String("key", key), slog.Bool("hit", hit))
```
