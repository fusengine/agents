---
name: ts-language-patterns
description: "Use when: writing or reviewing modern TypeScript syntax and idioms — const type parameters, using / await using resource management, standard ECMAScript decorators, satisfies, or fixing LLM-authored anti-patterns (legacy enum/namespace, missing import type). Covers TS 6.0 language features and inference. Do NOT use for: tsconfig / compiler flags (use ts-config), SOLID structure and file-size rules (use solid-generic), or framework-specific APIs."
versions:
  typescript: "6.0"
user-invocable: false
references: references/resource-management.md, references/generics-and-inference.md, references/decorators.md, references/llm-pitfalls.md, references/templates/modern-patterns.md, references/templates/resource-management.md
related-skills: ts-config, solid-generic
---

# TypeScript Language Patterns (TS 6.0)

## Agent Workflow (MANDATORY)

Before writing non-trivial TypeScript, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect existing idioms, `verbatimModuleSyntax`, tsconfig
2. **fuse-ai-pilot:research-expert** - Verify current syntax on typescriptlang.org
3. **mcp__context7__query-docs** - `/microsoft/typescript` for exact API shapes

After writing, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | What it gives you |
|---------|-------------------|
| **`const` type parameters** | `<const T>` infers the narrowest literal type without `as const` at call sites |
| **`using` / `await using`** | Deterministic cleanup via `Symbol.dispose` / `Symbol.asyncDispose` |
| **Standard decorators** | ECMAScript decorators — NOT `experimentalDecorators` |
| **`satisfies`** | Validate a value against a type while keeping its narrow inferred type |
| **6.0 inference** | Method-syntax callbacks are no longer contextually sensitive → order-independent inference |

---

## Critical Rules

1. **`import type` is mandatory under `verbatimModuleSyntax`** - type-only imports must say `type`, or emit/stripping breaks.
2. **No legacy `enum`** - prefer `const` objects `as const`; `enum` is un-erasable by Node's type stripper.
3. **No `namespace` with runtime code** - use ESM modules; type-only `namespace` is acceptable.
4. **Use standard decorators** - never enable `experimentalDecorators` for new code.
5. **Never rely on implicit `any`** - `strict` is the 6.0 default; annotate or infer explicitly.

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Resource management** | [resource-management.md](references/resource-management.md) | Load when using `using` / `await using` / disposables |
| **Generics & inference** | [generics-and-inference.md](references/generics-and-inference.md) | Load when using `const` type params, `satisfies`, or debugging inference |
| **Decorators** | [decorators.md](references/decorators.md) | Load when adding decorators |
| **LLM pitfalls** | [llm-pitfalls.md](references/llm-pitfalls.md) | Load when reviewing or migrating legacy/AI-authored TypeScript |

### Templates

| Template | When to Use |
|----------|-------------|
| [modern-patterns.md](references/templates/modern-patterns.md) | Copy-paste `const`/`satisfies`/decorator examples |
| [resource-management.md](references/templates/resource-management.md) | Copy-paste `using` / `DisposableStack` examples |

---

## Quick Reference

### `const` type parameter

```typescript
function first<const T extends readonly unknown[]>(arr: T): T[0] {
  return arr[0];
}
const x = first(["a", "b"]); // x: "a"  (literal, no `as const` needed)
```

### `using` for deterministic cleanup

```typescript
function openFile(path: string) {
  const handle = acquire(path);
  return { handle, [Symbol.dispose]() { release(handle); } };
}
{
  using file = openFile("./data"); // released automatically at block end
}
```

### `satisfies`

```typescript
const config = {
  port: 3000,
  host: "localhost",
} satisfies Record<string, string | number>;
// config.port stays `number`, not widened to `string | number`
```

---

## Best Practices

### DO
- Replace `enum Color { Red }` with `const Color = { Red: "red" } as const`
- Reach for `using` over manual `try/finally` cleanup when a resource has a disposer
- Use `satisfies` instead of a type annotation when you want to keep the narrow inferred type

### DON'T
- Write `import { SomeType }` for a type-only import — use `import type { SomeType }`
- Enable `experimentalDecorators` or `emitDecoratorMetadata` for new code
- Use `namespace` to organize runtime code — that is what ESM modules are for
