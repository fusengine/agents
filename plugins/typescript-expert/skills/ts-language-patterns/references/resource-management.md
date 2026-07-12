---
name: resource-management
description: Explicit Resource Management in TypeScript — using, await using, Symbol.dispose
keywords: using, await using, Symbol.dispose, Symbol.asyncDispose, DisposableStack, resource management
---

# Explicit Resource Management (`using` / `await using`)

Load when a value owns a resource that must be released (file handle, DB connection,
lock, subscription). This is the ECMAScript Explicit Resource Management proposal,
stable in TypeScript. Source: typescriptlang.org handbook.

## Sync: `using` + `Symbol.dispose`

A disposable is any object with a `[Symbol.dispose]()` method. `using` binds it and
calls that method when the enclosing block exits — in reverse order, even on throw.

```typescript
class TempFile implements Disposable {
  constructor(private path: string) { /* open */ }
  [Symbol.dispose]() { /* close + unlink */ }
}

function work() {
  using file = new TempFile("./scratch");
  // ...use file...
} // file[Symbol.dispose]() runs here, guaranteed
```

`using` requires an initializer that is an object with `Symbol.dispose` (or `null`/`undefined`,
which are ignored). It cannot be reassigned.

## Async: `await using` + `Symbol.asyncDispose`

For resources whose teardown is asynchronous, implement `[Symbol.asyncDispose]()` (returns
a promise) and bind with `await using`. Only valid inside an async context.

```typescript
class Connection implements AsyncDisposable {
  async [Symbol.asyncDispose]() { await this.close(); }
  async close() { /* ... */ }
}

async function run() {
  await using conn = new Connection();
  // ...use conn...
} // await conn[Symbol.asyncDispose]() is awaited on exit
```

## Aggregating: `DisposableStack` / `AsyncDisposableStack`

Collect several disposables and release them together, with rollback safety.

```typescript
function setup() {
  using stack = new DisposableStack();
  const a = stack.use(new TempFile("./a"));
  const b = stack.use(new TempFile("./b"));
  stack.defer(() => console.log("cleanup ran"));
  const owned = stack.move(); // transfer ownership out; nothing disposed here
  return owned;
}
```

- `stack.use(d)` — register a disposable, returns it
- `stack.defer(fn)` — register a plain callback
- `stack.move()` — transfer all registrations to a new stack (prevents disposal here)
- `AsyncDisposableStack` is the `await using` counterpart

## When to use

- Prefer `using` over hand-written `try { … } finally { release() }` — clearer and throw-safe.
- Types: implement `Disposable` (sync) or `AsyncDisposable` (async).

→ [templates/resource-management.md](templates/resource-management.md) for a complete, runnable example.
