---
name: resource-management-template
description: Complete runnable using / await using / DisposableStack examples
keywords: template, using, await using, Symbol.dispose, DisposableStack
---

# Explicit Resource Management — Complete Examples

## Sync disposable: a scoped timer

```typescript
class Timer implements Disposable {
  private start = performance.now();
  constructor(private label: string) {}
  [Symbol.dispose]() {
    console.log(`${this.label}: ${(performance.now() - this.start).toFixed(2)}ms`);
  }
}

export function process(items: number[]): number {
  using _t = new Timer("process");
  return items.reduce((a, b) => a + b, 0);
} // Timer logs automatically here, even if the body throws
```

## Async disposable: a database connection

```typescript
class Db implements AsyncDisposable {
  private constructor(private conn: unknown) {}

  static async connect(url: string): Promise<Db> {
    const conn = await openConnection(url);
    return new Db(conn);
  }

  async query<T>(sql: string): Promise<T[]> {
    return runQuery<T>(this.conn, sql);
  }

  async [Symbol.asyncDispose]() {
    await closeConnection(this.conn);
  }
}

export async function loadUsers(url: string) {
  await using db = await Db.connect(url);
  return db.query<{ id: number }>("SELECT id FROM users");
} // db is closed (awaited) on exit

// external stubs
declare function openConnection(url: string): Promise<unknown>;
declare function closeConnection(conn: unknown): Promise<void>;
declare function runQuery<T>(conn: unknown, sql: string): Promise<T[]>;
```

## Aggregating with `DisposableStack`

```typescript
export function openWorkspace(paths: string[]) {
  using stack = new DisposableStack();

  const files = paths.map((p) => stack.use(openTempFile(p)));
  stack.defer(() => console.log("workspace torn down"));

  // Hand ownership to the caller; nothing is disposed at this return.
  const owned = stack.move();
  return { files, dispose: () => owned.dispose() };
}

declare function openTempFile(path: string): Disposable & { path: string };
```

`AsyncDisposableStack` is the `await using` equivalent: use `stack.use()` /
`stack.defer()` / `await stack.disposeAsync()`.
