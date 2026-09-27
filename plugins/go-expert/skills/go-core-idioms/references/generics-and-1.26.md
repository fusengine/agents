---
name: generics-and-1.26
description: Mature Go generics plus Go 1.26–1.27 language changes — generic methods (1.27), field-selector struct literal keys (1.27), self-referential type params, new(expr), go fix modernizers
keywords: generics, type parameters, generic methods, constraints, self-referential, new expression, struct literal, go fix, modernizers
---

# Generics & Go 1.26–1.27 Language Changes

**Load when:** writing generic code, using type constraints, or adopting Go 1.26 /
1.27 language/tooling features. Sources: https://go.dev/doc/go1.27,
https://go.dev/doc/go1.26.

## Generics: use them, don't overuse them

Generics are mature. Reach for a type parameter when a function or container is
genuinely type-agnostic (collections, `Map`/`Filter`, numeric helpers). If a
single `any` plus a type switch reads more clearly, or an interface already
expresses the behavior, prefer that — generics are not a default.

```go
func Map[T, U any](in []T, f func(T) U) []U {
    out := make([]U, len(in))
    for i, v := range in {
        out[i] = f(v)
    }
    return out
}
```

Constrain to behavior, not to concrete types. Define constraint interfaces where
they are consumed, same as ordinary interfaces.

## Generic methods (1.27)

Go 1.27 lets a **concrete method declare its own type parameters** — generic
helpers can now live in a type's namespace instead of at package scope. The
stdlib example: `math/rand/v2` adds `(*Rand) N[Int intType](Int) Int` next to
the top-level `N`. Source: https://go.dev/doc/go1.27 (Changes to the language),
proposal https://go.dev/issue/77273.

```go
type Set[K comparable] struct{ m map[K]struct{} }

// Method-level type parameter V, independent of the receiver's K.
func (s *Set[K]) MapTo[V any](f func(K) V) []V {
    out := make([]V, 0, len(s.m))
    for k := range s.m {
        out = append(out, f(k))
    }
    return out
}
```

Limit: **interface methods may not declare type parameters**, and a generic
method never satisfies an interface method. Use generic methods for namespacing
and left-to-right chaining, not for polymorphism.

## Struct literal keys may be field selectors (1.27)

A key in a struct literal may now be any valid field selector — including a
field promoted from an embedded struct. Source: https://go.dev/doc/go1.27,
https://go.dev/issue/9859.

```go
type E struct{ A int }
type T struct{ E }

t := T{A: 1} // 1.27+; before: T{E: E{A: 1}}
```

Go 1.27 also generalizes function type inference to every context where a
generic function is assigned or converted to a matching function type
(https://go.dev/issue/77245).

## Self-referential type parameters (1.26)

Go 1.26 lifts the restriction that a generic type may not refer to itself in its
own type-parameter list. This enables the "curiously recurring" constraint —
require a type to be instantiated with something like itself:

```go
type Adder[A Adder[A]] interface {
    Add(A) A
}

func algo[A Adder[A]](x, y A) A { return x.Add(y) }
```

Before 1.26 the self-reference to `Adder` on the first line was rejected.

## new(expr) — allocate and initialize (1.26)

`new` now accepts an **expression**, not just a type. `new(x)` allocates a new
value, initializes it to `x`, and returns a pointer — perfect for optional
struct fields that are pointers:

```go
type Person struct {
    Name string
    Age  *int `json:"age"` // pointer = "known / unknown"
}

p := Person{Name: name, Age: new(yearsSince(born))} // no temp var needed
```

Previously this required a throwaway local: `age := yearsSince(born); ... &age`.

## go fix modernizers (1.26)

`go fix` has been rebuilt as the home of Go's **modernizers** — a push-button
way to update a codebase to current idioms and stdlib APIs. The initial suite
ships dozens of fixers, plus a source-level inliner driven by `//go:fix inline`
directives for automating your own API migrations. These fixers are
behavior-preserving.

```bash
go fix ./...   # apply modernizers across the module
go vet ./...   # still run vet for correctness checks
```

Treat `go fix` as routine maintenance: run it, review the diff, commit.

Go 1.27 adds the `atomictypes`, `embedlit`, `slicesbackward`, and `unsafefuncs`
modernizers, removes `fmtappendf`, and renames `waitgroup` to `waitgroupgo`.
Source: https://go.dev/doc/go1.27 (go fix).

## Anti-patterns

- Adding type parameters to a function that only ever handles one type
- Over-abstract constraints that no caller can satisfy cleanly
- Hand-rolling migrations that `go fix` modernizers already perform
- Keeping a throwaway local just to take its address, now that `new(expr)` exists
- Adding a type parameter to an interface method — still illegal in 1.27
