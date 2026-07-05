---
name: interfaces-and-style
description: Consumer-side interfaces, receiver choice, naming conventions, and idiomatic Go style — plus LLM anti-patterns
keywords: interface, accept interfaces return structs, receiver, pointer receiver, naming, style
---

# Interfaces & Style

**Load when:** deciding where an interface lives, choosing a receiver type, or
reviewing code for idiomatic naming and structure.

## Accept interfaces, return structs

Define an interface where it is **consumed**, listing only the methods that
consumer needs. Return concrete structs from constructors so callers keep full
access and you avoid premature abstraction.

```go
// consumer package declares exactly what it needs
type UserStore interface {
    ByID(ctx context.Context, id int64) (*User, error)
}

func NewService(s UserStore) *Service { return &Service{store: s} } // returns struct
```

Anti-pattern (Java-esque): shipping an `IUserRepository` interface next to its
only implementation "for testing". If there is one implementation and no second
consumer shape, you do not need the interface yet.

## Keep interfaces small

The most reusable interfaces are one method (`io.Reader`, `io.Writer`,
`fmt.Stringer`). Large interfaces couple consumers to methods they never call.
Compose small interfaces rather than declaring wide ones.

## Receivers: value by default

Use a **value receiver** unless you have a reason not to:

- **Pointer receiver** when the method mutates the receiver, or the struct is
  large enough that copying is a measurable cost, or the type already has any
  pointer-receiver method (keep the method set consistent).
- **Value receiver** for small, immutable-by-convention types.

Do not sprinkle pointer receivers everywhere by reflex — an unjustified
`*T` receiver is a common LLM tell and forces heap-ish thinking on the caller.

## Naming conventions

- Packages: short, lowercase, no underscores or plurals (`user`, not `users` or `user_utils`)
- Exported identifiers: `MixedCaps`; unexported: `mixedCaps` — never `snake_case`
- No `Get` prefix on getters: `u.Name()`, not `u.GetName()`
- Interface names often end in `-er` (`Reader`, `Notifier`); avoid `I` prefixes
- Errors: sentinel vars named `Err...`; error types named `...Error`
- Acronyms keep case: `userID`, `serveHTTP`, `parseURL`

## Zero values that work

Design types so the zero value is usable where practical (`sync.Mutex`,
`bytes.Buffer`, `errgroup.Group` are all valid zero). It removes constructor
ceremony and a class of nil-pointer bugs.

## Loop variables (Go 1.22+)

Each iteration gets a fresh loop variable, so the old `x := x` shadowing copy is
**obsolete** in Go 1.22+ — including inside goroutine closures. Delete it; `go
fix` modernizers will too.

## LLM anti-patterns to reject in review

- `_ = err` / swallowed errors (see [error-handling.md](error-handling.md))
- Interfaces declared beside their single implementation
- Pointer receivers with no mutation/size justification
- `GetX`/`SetX` accessors and `IFoo` interface names
- Leftover `x := x` loop-var copies on Go 1.22+
- Packages named `utils`, `helpers`, `common`, `base`
