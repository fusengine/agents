---
name: creating
description: Defining server functions — method, validator, handler, serialization
when-to-use: Creating createServerFn wrappers, adding input validation, opting out of strict serialization
keywords: createServerFn, validator, handler, zod, formdata, strict, serialization
priority: high
related: calling.md, security.md
---

# Creating Server Functions

## Overview

`createServerFn` builds a chainable RPC definition. The method builder accepts
an options object, then you chain `.validator()` (optional) and `.handler()`
(required). Import it from `@tanstack/react-start`.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Method** | `createServerFn({ method: 'GET' \| 'POST' })` — GET is the default |
| **Validator** | Parses/validates the single `data` argument before the handler |
| **Handler** | Server-only async body; receives `{ data, context }` |
| **Strict mode** | Default: input + output types must be serializable at compile time |

---

## Method Selection

| Scenario | Method |
|----------|--------|
| Reads (queries, fetching) | `GET` (default) |
| Mutations, `FormData` input | `POST` |

---

## Validation Options

A validator is any function `(data) => validatedData`. It can be a plain
function or a schema library.

```tsx
// Plain function (also narrows the TS type)
.validator((data: { id: string }) => data)

// Zod schema (runtime validation + inferred type)
.validator(z.object({ name: z.string().min(1), age: z.number().min(0) }))
```

`FormData` is only valid as POST input — validate its shape manually:

```tsx
.validator((data) => {
  if (!(data instanceof FormData)) throw new Error('Expected FormData')
  return { name: data.get('name')?.toString() ?? '' }
})
```

→ See [form-with-validation.md](templates/form-with-validation.md)

---

## Serialization (strict mode)

Inputs and outputs cross the network, so TypeScript checks they are
serializable. `FormData` is an allowed input; `Response` is an allowed output.

```tsx
// Disable both input + output TS checks
createServerFn({ strict: false })

// Disable one side only
createServerFn({ strict: { input: false } })
createServerFn({ strict: { output: false } })
```

> `strict: false` only relaxes the **compile-time** check. The runtime still
> serializes the payload — it does not make non-serializable values work.

---

## File Organization

| Suffix | Contents | Import from |
|--------|----------|-------------|
| `.functions.ts` | `createServerFn` wrappers | Anywhere (client-safe) |
| `.server.ts` | DB queries, secrets, internal helpers | Server function handlers only |
| `.ts` (no suffix) | Types, Zod schemas, constants | Anywhere |

→ See [crud-server-functions.md](templates/crud-server-functions.md)

---

## Best Practices

### DO
- Default to `GET`; switch to `POST` for mutations and `FormData`
- Validate every input with Zod when it carries user data
- Keep the handler thin — delegate to `.server.ts` helpers

### DON'T
- Reach for `strict: false` to "fix" a serialization error — fix the shape
- Return non-serializable values (class instances, functions) from a handler
- Dynamically `import()` the `.functions.ts` module

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Awaiting `getItems` without `()` | Call it: `await getItems()` |
| `FormData` on a GET function | Use `method: 'POST'` |
| Secrets read at module scope | Read `process.env` inside the handler |

---

## Related References

- [calling.md](calling.md) — invoking functions and handling redirects
- [security.md](security.md) — auth enforcement and CSRF

## Related Templates

- [crud-server-functions.md](templates/crud-server-functions.md) — full CRUD module
- [form-with-validation.md](templates/form-with-validation.md) — FormData + Zod
