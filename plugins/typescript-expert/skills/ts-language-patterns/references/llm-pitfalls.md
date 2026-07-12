---
name: llm-pitfalls
description: Common outdated TypeScript patterns LLMs emit, and their modern replacements
keywords: enum, namespace, import type, any, legacy, migration, anti-pattern
---

# LLM / Legacy TypeScript Pitfalls

Load when reviewing or migrating TypeScript that was written from stale training data —
these patterns compile on old configs but break under TS 6.0 defaults, `verbatimModuleSyntax`,
or Node's native type stripping. Source: typescriptlang.org 6.0 notes + nodejs.org type stripping.

## 1. `enum` → `const` object `as const`

`enum` generates runtime code the Node type stripper cannot erase (`erasableSyntaxOnly` errors).
It also has surprising semantics (numeric reverse-mapping, non-literal widening).

```typescript
// ❌ Legacy
enum Status { Active, Inactive }

// ✅ Modern — erasable, tree-shakeable, literal-typed
const Status = { Active: "active", Inactive: "inactive" } as const;
type Status = (typeof Status)[keyof typeof Status]; // "active" | "inactive"
```

`const enum` is likewise problematic across module boundaries and stripping — avoid it too.

## 2. `namespace` with runtime code → ESM modules

```typescript
// ❌ Legacy — un-erasable, blocks tree-shaking
namespace Utils { export function greet() {} }

// ✅ Modern — one module per concern
export function greet() {}
```

Type-only `namespace` (only `type`/`interface` inside) is fine. The `module Foo {}` keyword
form is a hard error in 6.0 — use `namespace` if you must, ESM otherwise.

## 3. Value import for a type → `import type`

Under `verbatimModuleSyntax` (both config tracks) a type imported without `type` is treated
as a value import and crashes Node at runtime.

```typescript
// ❌ Breaks stripping / verbatimModuleSyntax
import { User } from "./types.ts";

// ✅
import type { User } from "./types.ts";
import { createUser, type CreateUserInput } from "./user.ts"; // inline type marker
```

## 4. Implicit `any` → annotate or infer

`strict` (hence `noImplicitAny`) is the 6.0 default. Untyped parameters error. Prefer real
types or `unknown` + narrowing over `any`.

## 5. Import assertions `asserts` → `with`

```typescript
// ❌ Now an error
import data from "./d.json" asserts { type: "json" };
// ✅ Import attributes
import data from "./d.json" with { type: "json" };
```

## 6. Deprecated compiler options in generated configs

LLMs often emit `moduleResolution: "node"`, `target: "es5"`, or `esModuleInterop: false`.
All are deprecated/removed in 6.0 — see the ts-config skill's `deprecations-6.md`.

## Review checklist

- [ ] No `enum` / `const enum` / `namespace` with runtime code
- [ ] Every type-only import uses `import type` (or inline `type`)
- [ ] No `any` where a concrete type or `unknown` fits
- [ ] `with`, not `asserts`, for import attributes
- [ ] tsconfig uses `bundler`/`nodenext`, never `node`/`node10`
