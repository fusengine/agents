---
name: generics-and-inference
description: const type parameters, satisfies, and TS 6.0 inference improvements
keywords: const type parameter, satisfies, inference, contextual sensitivity, generics
---

# Generics, `satisfies` & Inference

Load when writing generic APIs, using `satisfies`, or diagnosing why a type inferred
wider than expected. Source: typescriptlang.org handbook + TS 6.0 release notes.

## `const` type parameters

Prefix a type parameter with `const` so arguments are inferred with the narrowest
literal type — as if the caller wrote `as const` — without the caller doing anything.

```typescript
declare function route<const T>(config: T): T;

const r = route({ path: "/users", method: "GET" });
// r: { path: "/users"; method: "GET" }  (literals preserved)
// Without `const`: { path: string; method: string }
```

Constraint still applies: `<const T extends readonly string[]>`. Note `const` only affects
inference at the call site; it does not make the resulting type deeply `readonly`.

## `satisfies`

Check a value conforms to a type **without** widening it to that type. You keep the
precise inferred type for downstream use.

```typescript
type Palette = Record<string, [number, number, number] | string>;

const theme = {
  primary: [255, 0, 0],
  accent: "#00ff00",
} satisfies Palette;

theme.primary; // [number, number, number] — tuple preserved, not the union
theme.accent.toUpperCase(); // ok: known to be string
```

Use `satisfies` when a plain annotation (`const theme: Palette = …`) would erase the
member-level specificity you still need.

`as const` + `satisfies` compose: `{ … } as const satisfies Palette` locks literals
*and* validates shape.

## TS 6.0: less context-sensitivity on `this`-less functions

Before 6.0, method-syntax callbacks without explicit parameter types were treated as
*contextually sensitive*, so inference could fail depending on property order:

```typescript
declare function callIt<T>(obj: {
  produce: (x: number) => T;
  consume: (y: T) => void;
}): void;

// TS 6.0: infers T from `produce` regardless of order — both compile.
callIt({
  consume(y) { return y.toFixed(); }, // y: number (was `unknown` pre-6.0)
  produce(x: number) { return x * 2; },
});
```

In 6.0, a method with no `this` reference is no longer contextually sensitive, so
generic inference no longer depends on declaration order. Practical upshot: fewer
spurious `'y' is of type 'unknown'` errors — you can delete workaround annotations.
