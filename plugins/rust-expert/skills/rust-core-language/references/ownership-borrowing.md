# Ownership & Borrowing

**Load when:** choosing owned vs borrowed parameters, designing lifetimes, or deciding
how to share data (`Rc`/`Arc`) instead of cloning.

Ownership is a design decision, not a compiler obstacle. The borrow checker rejecting
code is a prompt to reconsider who owns what — not a prompt to `.clone()`.

## Parameter rules of thumb

| You need to… | Take |
|--------------|------|
| Read the value | `&T` |
| Read a string | `&str` (not `&String`) |
| Read a sequence | `&[T]` (not `&Vec<T>`) |
| Mutate in place | `&mut T` |
| Store / consume the value | `T` (owned) |

`&str`/`&[T]` accept more callers than `&String`/`&Vec<T>` (a `String` derefs to
`&str`, a `Vec<T>` to `&[T]`), so borrowed slices are the more general signature.

```rust
// Over-owning: forces every caller to hand over a String they may still need.
fn greet(name: String) -> String { format!("Hi {name}") }

// Idiomatic: borrows, works with &str, String, &String, string literals.
fn greet(name: &str) -> String { format!("Hi {name}") }
```

## Lifetimes: elide by default

Rust elides lifetimes for the common cases. Annotate only when the compiler genuinely
cannot infer the relationship (e.g. a struct holding a reference, or multiple input
references where the output's origin is ambiguous).

```rust
// Over-annotated — every one of these lifetimes is inferable.
fn first<'a>(s: &'a str) -> &'a char { /* ... */ }

// Idiomatic — elision handles it.
fn first(s: &str) -> Option<&u8> { s.as_bytes().first() }
```

Reach for a named lifetime when a type stores a borrow:

```rust
struct Parser<'src> {
    input: &'src str,   // borrow tied to the source buffer's lifetime
    pos: usize,
}
```

## Sharing: Rc / Arc, and the explicit-clone convention

When two owners really must exist, share with `Rc<T>` (single-thread) or `Arc<T>`
(cross-thread). Clone the *handle* with the associated-function form so reviewers see
it is a cheap refcount bump, not a deep copy:

```rust
use std::sync::Arc;
let config = Arc::new(Config::load()?);
let worker_copy = Arc::clone(&config);   // preferred over config.clone()
```

For shared mutation, wrap the inner value: `Arc<Mutex<T>>` / `Arc<RwLock<T>>` across
threads, `Rc<RefCell<T>>` on a single thread. Do not reach for these to dodge a borrow
error — only when shared ownership is the actual requirement.

## The redesign-vs-clone decision

Before adding `.clone()`, ask:
1. Can the callee borrow instead of own? → change the signature to `&T`.
2. Does the value need to outlive this scope? → if not, borrowing is correct.
3. Are there truly two independent owners? → only then clone, or share via `Arc`.

A clone that exists solely because "the borrow checker complained" is the clone tax
(see [llm-pitfalls.md](llm-pitfalls.md)) and should be removed in review.
