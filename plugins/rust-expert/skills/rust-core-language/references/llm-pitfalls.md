# LLM Pitfalls in Generated Rust

**Load when:** reviewing or repairing machine-generated Rust before merge. These are
the recurring failure modes of generated Rust code — each has a grep-able symptom and
a fix.

## 1. The clone tax

**Symptom:** `.clone()` scattered to make borrow errors disappear; owned parameters
(`String`, `Vec<T>`) where a reference would do; `.clone()` on a hot path.
**Why it happens:** cloning is the path of least resistance out of a borrow-checker
error, so generators reach for it instead of rethinking ownership.
**Fix:** change the signature to borrow (`&str`, `&[T]`); pass the same reference to
several callees; only clone when a second independent owner truly exists. Redesign
ownership before cloning — see [ownership-borrowing.md](ownership-borrowing.md).

```rust
// smell: clones just to satisfy the checker
fn total(items: Vec<Item>) -> u32 { items.iter().map(|i| i.qty).sum() }
let t = total(items.clone()); use_again(items);

// fix: borrow, no clone needed
fn total(items: &[Item]) -> u32 { items.iter().map(|i| i.qty).sum() }
let t = total(&items); use_again(items);
```

## 2. Unwrap infestation

**Symptom:** `.unwrap()` / `.expect()` on `Result`/`Option` that can genuinely fail
(file I/O, parsing, map lookups, network).
**Why it happens:** it makes generated snippets compile and "look done".
**Fix:** grep the whole diff for `unwrap(`/`expect(` before merge. Replace with `?`,
`match`, `if let`, or `unwrap_or`/`ok_or`. If an unwrap is genuinely infallible, keep
it but write a one-line comment stating the invariant that guarantees it.

```rust
// smell
let cfg = std::fs::read_to_string("cfg.toml").unwrap();

// fix (application code)
let cfg = std::fs::read_to_string("cfg.toml")
    .context("reading cfg.toml")?;   // see rust-error-handling
```

## 3. String vs &str in parameters

**Symptom:** `fn f(s: String)` / `fn f(s: &String)` for read-only text.
**Fix:** take `&str`. It accepts literals, `String`, and `&String`, and avoids forcing
callers to give up ownership. Mirror for `&Vec<T>` → `&[T]`.

## 4. Indexed loops instead of iterators

**Symptom:** `for i in 0..v.len() { let x = v[i]; ... }`.
**Why it matters:** bounds checks on every access, off-by-one risk, and it hides intent.
**Fix:** iterate directly; reach for `enumerate`, `zip`, `windows`, `chunks` when the
index or pairing matters.

```rust
// smell
for i in 0..names.len() { println!("{}: {}", i, names[i]); }
// fix
for (i, name) in names.iter().enumerate() { println!("{i}: {name}"); }
```

## 5. Over-annotated lifetimes

**Symptom:** explicit `'a` on functions where elision applies; lifetimes copied onto
every reference "to be safe".
**Fix:** delete annotations the compiler can infer; keep named lifetimes only where a
type stores a borrow or output origin is ambiguous. See
[ownership-borrowing.md](ownership-borrowing.md).

## 6. Implicit deep clone on shared handles

**Symptom:** `rc.clone()` / `arc.clone()` where a refcount bump is meant.
**Fix:** write `Rc::clone(&rc)` / `Arc::clone(&arc)` so the cheap pointer copy is
visually distinct from a deep clone in review.

## Review checklist

- [ ] `grep -n 'unwrap(\|expect(' ` over the diff — each survivor justified
- [ ] no `.clone()` that a borrow would remove
- [ ] read-only string/slice params are `&str` / `&[T]`
- [ ] no `for i in 0..len` indexing where an iterator fits
- [ ] no elidable lifetime annotations
- [ ] shared handles use `Arc::clone(&x)` form
