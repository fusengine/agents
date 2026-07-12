---
name: error-handling
description: Idiomatic Go error handling — explicit checks, %w wrapping, sentinels, errors.Join, errors.Is/As/AsType
keywords: error, errors, wrapping, errors.Join, errors.AsType, errors.Is, sentinel
---

# Error Handling

**Load when:** wrapping errors, designing a package's error strategy, or
migrating `errors.As` call sites to `errors.AsType`.

## The explicit check is the idiom

Go has **no** `try`/`catch` and, as of 1.26, still no syntactic sugar for error
handling. The `if err != nil { return ... }` block is deliberate and correct.
Never hide it behind a helper that panics, and never silence it:

```go
val, err := doThing()
if err != nil {
    return fmt.Errorf("do thing: %w", err)
}
_ = err // WRONG — discards a real failure (common LLM anti-pattern)
```

## Wrap with %w to preserve the chain

`fmt.Errorf("context: %w", err)` wraps the underlying error so it stays
inspectable. Use `%v` only when you deliberately want to *flatten* and hide the
cause (rare). Add context that the caller does not already have — an id, an
operation name — not a restatement of the wrapped message.

## Sentinels and typed errors

```go
var ErrNotFound = errors.New("user not found") // package-level sentinel

type ValidationError struct{ Field, Reason string }

func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Reason)
}
```

- **Sentinel** (`errors.Is`): caller only needs to know *which* error.
- **Typed** (`errors.As` / `errors.AsType`): caller needs the error's *fields*.

## Inspecting: Is, As, AsType

```go
if errors.Is(err, ErrNotFound) { /* ... */ }
```

`errors.AsType[T]` (Go 1.26) is the **generic, type-safe** replacement for
`errors.As`. It is faster and removes the out-parameter boilerplate. Source:
https://go.dev/doc/go1.26 (package `errors`).

```go
// Before (still valid):
var ve *ValidationError
if errors.As(err, &ve) { use(ve) }

// Go 1.26 — preferred:
if ve, ok := errors.AsType[*ValidationError](err); ok { use(ve) }
```

## Joining multiple errors

`errors.Join` (Go 1.20) aggregates several errors into one; the result matches
`errors.Is`/`AsType` against **any** joined member. Ideal for validating many
fields or closing several resources:

```go
var errs error
for _, f := range fields {
    if err := f.Validate(); err != nil {
        errs = errors.Join(errs, err)
    }
}
return errs // nil if every Join arg was nil
```

## Note on fmt.Errorf allocation (1.26)

For an unformatted string, `fmt.Errorf("x")` now allocates about the same as
`errors.New("x")` — but still prefer `errors.New` when there is nothing to
format. Source: https://go.dev/doc/go1.26 (package `fmt`).

## Anti-patterns

- `_ = err` or `if err != nil { return err }` when context would help debugging
- Wrapping with `%v` then trying to `errors.Is` the cause (the chain is broken)
- `panic` for expected/recoverable conditions — reserve it for programmer bugs
- Comparing error strings (`err.Error() == "..."`) instead of `errors.Is`
