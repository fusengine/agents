---
name: slog-logging
description: Structured logging with the stdlib log/slog — handlers, attrs, groups, With, LogValuer, levels, performance
keywords: slog, logging, structured, JSONHandler, TextHandler, LogValuer, LogAttrs
---

# Structured Logging (log/slog)

**Load when:** setting up application logging, choosing a handler, or shaping
log output with attributes and groups. Source: https://pkg.go.dev/log/slog.

## Why slog

`log/slog` is the standard-library structured logger (records = message +
severity + key/value attributes). Prefer it over `log.Printf` and over
third-party loggers for new code — it is stdlib, allocation-aware, and handler
pluggable.

## Handlers

A `Logger` wraps a `Handler` that decides the output format:

```go
// Human/dev text: key=value pairs
logger := slog.New(slog.NewTextHandler(os.Stderr, nil))

// Production: line-delimited JSON
logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
```

Set a process-wide default so top-level `slog.Info(...)` and the old `log`
package both route through it:

```go
slog.SetDefault(logger)
```

## Attributes over format strings

Pass alternating key/value pairs, or typed `slog.Attr` constructors. Log the
*data*, not a pre-formatted sentence:

```go
slog.Info("payment settled", "order", id, slog.Int("cents", amount))
```

## Contextual loggers with With

`Logger.With` returns a new logger carrying attributes on every subsequent call
— attach request-scoped fields once instead of repeating them:

```go
reqLog := logger.With("trace_id", traceID, "url", r.URL.Path)
reqLog.Info("handling request") // trace_id + url included automatically
```

## Groups

`slog.Group` namespaces related attributes; `Logger.WithGroup` qualifies all of
a logger's output, preventing key collisions between subsystems:

```go
slog.Info("request", slog.Group("http",
    "method", r.Method, "status", status))
```

## Dynamic levels

A fixed `Level` sets the threshold for the handler's lifetime; a `LevelVar` lets
you change it at runtime, safely across goroutines:

```go
var lvl slog.LevelVar // defaults to LevelInfo
h := slog.NewJSONHandler(os.Stderr, &slog.HandlerOptions{Level: &lvl})
slog.SetDefault(slog.New(h))
lvl.Set(slog.LevelDebug) // flip on debug without restarting
```

## Redaction with LogValuer

Implement `LogValuer` to control how a type appears in logs — e.g. redact
secrets or expand a struct into a group:

```go
type Password string

func (Password) LogValue() slog.Value { return slog.StringValue("REDACTED") }
```

## Performance: LogAttrs

On hot paths, `Logger.LogAttrs` takes only `slog.Attr` values (no `any`
key/value pairs), which lets slog avoid allocation:

```go
logger.LogAttrs(ctx, slog.LevelInfo, "hello", slog.Int("count", n))
```

## Context and wrapping

- Prefer the `*Context` variants (`InfoContext`, `LogAttrs`) when a `ctx` is
  available — handlers can extract trace/span data from it.
- If you wrap slog in your own helper, source location will point at the
  wrapper file. Avoid thin `Infof`-style wrappers unless you handle this.

## Anti-patterns

- Falling back to `fmt.Println`/`log.Printf` for structured events
- Building a message with `fmt.Sprintf` instead of passing attributes
- Logging secrets/tokens without a `LogValuer` redaction
