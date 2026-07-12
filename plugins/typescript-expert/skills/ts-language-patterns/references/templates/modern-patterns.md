---
name: modern-patterns
description: Complete copy-paste examples for const type params, satisfies, and standard decorators
keywords: template, const type parameter, satisfies, decorator, as const
---

# Modern TypeScript Patterns — Complete Examples

## `const` type parameter + `satisfies` for a typed config API

```typescript
// config.ts
type FieldType = "string" | "number" | "boolean";

interface FieldSpec {
  readonly type: FieldType;
  readonly required?: boolean;
}

type Schema = Record<string, FieldSpec>;

/** Preserve exact literal keys/values of the passed schema. */
export function defineSchema<const T extends Schema>(schema: T): T {
  return schema;
}

export const userSchema = defineSchema({
  id: { type: "number", required: true },
  name: { type: "string", required: true },
  active: { type: "boolean" },
}) satisfies Schema;

// Keys are the literal union "id" | "name" | "active", not `string`:
export type UserField = keyof typeof userSchema;
```

## Enum replacement (erasable, literal-typed)

```typescript
// status.ts
export const Status = {
  Draft: "draft",
  Published: "published",
  Archived: "archived",
} as const;

export type Status = (typeof Status)[keyof typeof Status];
// "draft" | "published" | "archived"

export function isPublished(s: Status): boolean {
  return s === Status.Published;
}
```

## Standard decorator: timing a method

```typescript
// timed.ts
export function timed<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const label = String(context.name);
  return function (this: This, ...args: Args): Return {
    const start = performance.now();
    try {
      return target.call(this, ...args);
    } finally {
      console.log(`${label} took ${(performance.now() - start).toFixed(2)}ms`);
    }
  };
}

class Report {
  @timed
  build(rows: number) {
    return Array.from({ length: rows }, (_, i) => i).reduce((a, b) => a + b, 0);
  }
}
```

> Requires a bundler/compiler emit (ts-config bundler track). Do not run this file directly
> with Node's type stripper — decorators are not yet stripped.
