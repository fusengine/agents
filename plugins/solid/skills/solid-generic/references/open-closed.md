---
name: open-closed
description: OCP Guide - Extend via composition, strategies, and plugins for generic TypeScript
when-to-use: adding features, extending behavior, plugin systems, middleware
keywords: open closed, OCP, extension, strategy, middleware, plugins
priority: high
related: single-responsibility.md, templates/factory.md, templates/service.md
applies-to: "**/*.ts, **/*.tsx"
trigger-on-edit: "services/, factories/, strategies/"
level: principle
---

# Open/Closed Principle (OCP) for TypeScript

**Open for extension, closed for modification**

Add new features by **adding code**, not changing existing code.

---

## When to Apply OCP?

### Symptoms of Violation

1. **Adding variant requires modifying function**
   - Switch/case grows with each variant
   - Function becomes bloated

2. **New feature = modify existing code**
   - Risk of breaking existing functionality
   - Hard to test in isolation

3. **Configuration has many boolean flags**
   - `skipValidation`, `enableCache`, `dryRun`, etc.
   - Combinatorial explosion

---

## How to Apply OCP?

### 1. Strategy Pattern (Swappable Behavior)

Instead of conditionals for different behaviors:

```typescript
interface OutputStrategy {
  write(data: string): Promise<void>
}

function createProcessor(output: OutputStrategy) {
  return {
    process: async (input: string) => {
      const result = transform(input)
      await output.write(result)
    }
  }
}
```

New output format = new strategy, no modification.

-> See `templates/factory.md` for implementation

### 2. Middleware/Pipeline Pattern

Instead of hardcoded processing steps:

```typescript
type Middleware<T> = (data: T, next: () => Promise<T>) => Promise<T>

function createPipeline<T>(...middlewares: Middleware<T>[]) {
  return async (data: T): Promise<T> => {
    /* chain execution */
  }
}
```

New processing step = add middleware, no modification.

### 3. Plugin Pattern (Registry)

Instead of hardcoding supported formats:

```typescript
interface Plugin {
  name: string
  execute(input: unknown): Promise<unknown>
}

const registry = new Map<string, Plugin>()
function register(plugin: Plugin) { registry.set(plugin.name, plugin) }
```

New format = register plugin, no modification.

### 4. Generic Type Extensions

Instead of specific implementations:

```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>
  save(entity: T): Promise<T>
  delete(id: string): Promise<void>
}
```

New entity = implement generic interface.

---

## Extension Patterns Summary

| Pattern | Use Case | Example |
|---------|----------|---------|
| Strategy | Swappable behavior | Output formats, parsers |
| Middleware | Processing pipeline | Validation chain, transforms |
| Plugin | Dynamic registration | Format support, hooks |
| Generics | Type-safe extensions | Repository, service patterns |

---

## Decision Criteria

1. **Will there be more variants?** -> Strategy pattern
2. **Is processing sequential?** -> Middleware/pipeline
3. **Are features dynamic/pluggable?** -> Plugin registry
4. **Same logic, different types?** -> Generics

---

## Where to Find Code Templates?

-> `templates/factory.md` - Strategy/factory patterns
-> `templates/service.md` - Extensible services

---

## OCP Checklist

- [ ] Can add variants without modifying existing code?
- [ ] Uses strategy pattern for swappable behavior?
- [ ] Processing pipeline is composable?
- [ ] Generics used for type-safe extensions?
- [ ] No boolean flag explosion?
