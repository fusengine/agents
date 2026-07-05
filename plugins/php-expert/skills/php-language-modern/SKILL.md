---
name: php-language-modern
description: Use when writing or reviewing modern PHP (8.1–8.5) outside a framework — property hooks, asymmetric visibility, the pipe operator, native attributes, enums, readonly, lazy objects. Covers language features that LLMs frequently get wrong or write in a pre-8.0 style. Do NOT use for coding style/PSR/autoloading (use php-standards) or Laravel-specific syntax (use the laravel plugin).
versions:
  php: "8.5"
user-invocable: false
references: references/php-85-features.md, references/php-84-features.md, references/php-81-83-baseline.md, references/attributes-over-docblocks.md, references/templates/modern-class.md
related-skills: php-standards
---

# Modern PHP Language (8.1 → 8.5)

## Agent Workflow (MANDATORY)

Before writing PHP, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect the project's minimum PHP version (`composer.json` `require.php`, CI matrix)
2. **fuse-ai-pilot:research-expert** - Verify a feature's version + syntax on php.net before using it
3. **mcp__context7__query-docs** - Cross-check idiomatic usage

After writing, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Since | Use it for |
|---------|-------|------------|
| **Enums (backed + methods/interfaces)** | 8.1 | Closed sets of values with behavior |
| **First-class callable syntax** `f(...)` | 8.1 | Passing callables without strings |
| **readonly properties / classes** | 8.1 / 8.2 | Immutable value objects / DTOs |
| **`#[\Override]`** | 8.3 | Fail-fast on broken inheritance |
| **Property hooks** `get`/`set` | 8.4 | Computed/validated properties, no getter/setter boilerplate |
| **Asymmetric visibility** `public private(set)` | 8.4 (static: 8.5) | Public read, restricted write |
| **Lazy objects** `newLazyGhost()` | 8.4 | Deferred initialization in DI containers |
| **Pipe operator** `\|>` | 8.5 | Left-to-right data transformation chains |
| **`clone()` function + `$withProperties`** | 8.5 | Immutable "with" updates, incl. readonly |
| **`#[\NoDiscard]`** | 8.5 | Enforce return-value consumption |

---

## Critical Rules

1. **Attributes, never docblock annotations** - Native `#[Attribute]` replaces `@annotation` docblocks for routing, ORM, DI, validation. This is the #1 LLM mistake — see [attributes-over-docblocks.md](references/attributes-over-docblocks.md).
2. **Check the target PHP version first** - Never emit 8.5 syntax on an 8.1 project. Read `composer.json` `require.php` before choosing a feature.
3. **Prefer enums over class constants** for closed value sets — they carry type safety and methods.
4. **Prefer `readonly` + property hooks over hand-written getters/setters** — less boilerplate, enforced immutability.
5. **`declare(strict_types=1);`** at the top of every file.

---

## Architecture

```
src/
├── Enum/
│   └── Status.php          # backed enum + interface + methods
├── ValueObject/
│   └── Money.php           # readonly class, clone() with $withProperties
└── Model/
    └── User.php            # property hooks, asymmetric visibility
```

→ See [modern-class.md](references/templates/modern-class.md) for complete working code

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **PHP 8.5 features** | [php-85-features.md](references/php-85-features.md) | Pipe operator, `clone()`, `#[\NoDiscard]`, static aviz |
| **PHP 8.4 features** | [php-84-features.md](references/php-84-features.md) | Property hooks, aviz, lazy objects, `#[\Deprecated]` |
| **8.1–8.3 baseline** | [php-81-83-baseline.md](references/php-81-83-baseline.md) | Enums, readonly, fibers, `#[\Override]` |
| **Attributes vs docblocks** | [attributes-over-docblocks.md](references/attributes-over-docblocks.md) | Any metadata: routing, ORM, DI, validation |

### Templates

| Template | When to Use |
|----------|-------------|
| [modern-class.md](references/templates/modern-class.md) | Writing a new class the modern way |

---

## Best Practices

### DO
- Read `require.php` before picking a feature version
- Use enums with interfaces + methods for stateful value sets
- Use property hooks for validation/computation instead of magic `__get`
- Use the pipe operator to flatten nested calls (8.5+)

### DON'T
- Write `@Route`/`@ORM\Column` docblock annotations — use attributes
- Emit 8.4/8.5 syntax without confirming the project supports it
- Hand-roll getters/setters when hooks or `readonly` fit
- Guess a feature's version — verify on php.net
