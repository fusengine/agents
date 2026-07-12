---
name: attributes-over-docblocks
description: Native PHP attributes replace docblock annotations everywhere — the single most common modern-PHP mistake LLMs make
when-to-use: Load whenever adding metadata to code — routing, ORM mapping, DI, validation, serialization, deprecation
keywords: attributes, annotations, docblock, doctrine, symfony, routing, ORM, Override, Deprecated
priority: high
related: php-81-83-baseline.md
---

# Attributes Over Docblocks

## Overview

Native attributes exist since PHP 8.0. Framework metadata that used to live in `@annotation` docblocks (Doctrine ORM, Symfony routing/validation, DI) is now written as `#[Attribute]`. Emitting docblock annotations is the #1 modern-PHP mistake — it looks plausible but is legacy syntax.

---

## The Shift

| Legacy docblock | Modern attribute |
|-----------------|------------------|
| `@Route("/users", methods={"GET"})` | `#[Route('/users', methods: ['GET'])]` |
| `@ORM\Column(type="string")` | `#[ORM\Column(type: 'string')]` |
| `@Assert\NotBlank` | `#[Assert\NotBlank]` |
| `@var` on a property for DI | Typed property + `#[Autowire]` |
| `@deprecated` (tooling-only) | `#[\Deprecated]` (runtime `E_USER_DEPRECATED`) |

---

## Why It Matters

| Docblock annotation | Native attribute |
|---------------------|------------------|
| A string comment, parsed at runtime by a library | Part of the AST, inspected via Reflection |
| No syntax checking | Validated by the compiler |
| Needs `doctrine/annotations` | Zero runtime dependency |

---

## Core Pattern

```php
use Symfony\Component\Routing\Attribute\Route;

class UserController
{
    #[Route('/users/{id}', name: 'user_show', methods: ['GET'])]
    public function show(int $id): Response { /* ... */ }
}
```

Read attributes back with Reflection:

```php
$refl = new ReflectionMethod(UserController::class, 'show');
foreach ($refl->getAttributes(Route::class) as $attr) {
    $route = $attr->newInstance();
}
```

---

## Built-in Attributes to Know

| Attribute | Since | Purpose |
|-----------|-------|---------|
| `#[\Attribute]` | 8.0 | Declare a class as an attribute |
| `#[\Override]` | 8.3 | Assert a method overrides a parent |
| `#[\Deprecated]` | 8.4 | Deprecate with runtime notice |
| `#[\NoDiscard]` | 8.5 | Require return-value consumption |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Writing `@Route`/`@ORM\Column` docblocks | Use the framework's attribute classes |
| Adding `doctrine/annotations` to a new project | Not needed; use attributes |
| `@deprecated` comment only | Use `#[\Deprecated]` for a real runtime signal |

---

## Related References

- [php-81-83-baseline.md](php-81-83-baseline.md) - `#[\Override]` and enums
