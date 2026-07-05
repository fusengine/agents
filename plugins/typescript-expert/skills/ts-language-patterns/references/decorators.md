---
name: decorators
description: Standard ECMAScript decorators in TypeScript (not experimentalDecorators)
keywords: decorators, ECMAScript decorators, experimentalDecorators, class decorator, accessor
---

# Standard ECMAScript Decorators

Load when adding decorators to a class. TypeScript implements the TC39 Stage 3
**standard decorators**. Do NOT enable `experimentalDecorators` for new code — that is
the old, incompatible design. Source: typescriptlang.org handbook.

## Signature shape

A standard decorator is a function receiving `(value, context)`. The `context` object
carries `kind`, `name`, `addInitializer`, and `access`.

```typescript
function logged<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const name = String(context.name);
  return function (this: This, ...args: Args): Return {
    console.log(`enter ${name}`);
    const result = target.call(this, ...args);
    console.log(`exit ${name}`);
    return result;
  };
}

class Service {
  @logged
  fetch(id: number) { return id; }
}
```

## Context types by target

| Decorator target | Context type |
|------------------|--------------|
| Class | `ClassDecoratorContext` |
| Method | `ClassMethodDecoratorContext` |
| Getter/Setter | `ClassGetterDecoratorContext` / `ClassSetterDecoratorContext` |
| Field | `ClassFieldDecoratorContext` |
| `accessor` field | `ClassAccessorDecoratorContext` |

## `accessor` keyword

Standard decorators pair with auto-accessors. `accessor x` generates a getter/setter
backed by a private field; a decorator can intercept both.

```typescript
class Box {
  @observable accessor value = 0;
}
```

## Rules & gotchas

- **No `emitDecoratorMetadata`** — that is an `experimentalDecorators`-only feature.
  Libraries relying on reflect-metadata (older DI containers) may not work with standard decorators.
- **Parameter decorators are not part of the standard proposal** — they exist only under
  `experimentalDecorators`.
- **Runtime support**: standard decorators are still a Stage 3 proposal, so Node's native
  type stripping does NOT transform them — they error at runtime. Use them only where a
  compiler/bundler emits (see ts-config bundler track), not in files run by `node file.ts`.
