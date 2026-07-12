---
name: per-coding-style
description: PER Coding Style 3.0 rules and its relationship to PSR-12 and PSR-1
when-to-use: Load when formatting PHP, configuring php-cs-fixer/phpcs, or explaining which style spec applies
keywords: PER coding style, PSR-12, PSR-1, formatting, indentation, line length, compound types
priority: high
related: psr-catalog.md
---

# PER Coding Style 3.0

## Overview

PER Coding Style is the PHP-FIG's living style specification. Version 3.0 "extends, expands and replaces PSR-12" and requires adherence to PSR-1. Source: php-fig.org/per/coding-style/.

---

## PER vs PSR-12 — The Nuance

| Aspect | Reality |
|--------|---------|
| **PSR-12** | Still the officially *Accepted* PSR (accepted 2019). Not withdrawn. |
| **PER-CS 3.0** | The actively maintained spec that supersedes PSR-12 for new syntax (enums, readonly, compound types) |
| **In practice** | Target `@PER-CS` in tooling; PSR-12 remains valid but frozen |

Do not tell users "PSR-12 was replaced/removed" — it was not. PER extends it and is where new rules land.

---

## Core Rules (from PER-CS 3.0)

| Rule | Requirement |
|------|-------------|
| **Indentation** | 4 spaces per level; tabs MUST NOT be used |
| **Line endings** | Unix LF only |
| **File ending** | End with a single non-blank line + LF |
| **Closing tag** | `?>` MUST be omitted in PHP-only files |
| **Line length** | No hard limit; soft limit 120; SHOULD stay under 80 |
| **Trailing whitespace** | Forbidden |
| **Statements** | One per line |
| **Keywords/types** | Lowercase; short forms (`bool`, `int`, not `boolean`, `integer`) |
| **PSR-1 term "StudlyCaps"** | Interpreted as PascalCase (first letter capitalized too) |

---

## Compound Types

The union `|` and intersection `&` symbols MUST NOT have surrounding spaces; parentheses MUST NOT have inner spaces.

```php
function foo(int|string $a): User|Product
{
    // ...
}
```

When splitting a long compound type across lines, the split symbol goes at the **start** of each line:

```php
function reflect(
    \ReflectionClass
    |\ReflectionMethod
    |\ReflectionProperty $reflect,
): void {
    // ...
}
```

---

## Enums

PER-CS covers PHP 8.1+ syntax that PSR-12 predates:

```php
enum Suit: string
{
    case Hearts = 'H';
    case Spades = 'S';

    public function color(): string
    {
        return match ($this) {
            self::Hearts => 'red',
            self::Spades => 'black',
        };
    }
}
```

→ See [composer-json.md](templates/composer-json.md) to wire php-cs-fixer `@PER-CS` in `scripts`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Tabs for indentation | 4 spaces |
| Keeping `?>` in PHP-only files | Remove it |
| Spaces around `\|`/`&` in types | Remove them |
| Saying PER replaced PSR-12 officially | PSR-12 is still *Accepted*; PER supersedes it in practice |

---

## Related References

- [psr-catalog.md](psr-catalog.md) - PSR-1 (required by PER) and PSR-12's status
