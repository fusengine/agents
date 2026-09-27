---
name: per-coding-style
description: PER Coding Style 3.1 rules and its relationship to PSR-12 and PSR-1
when-to-use: Load when formatting PHP, configuring php-cs-fixer/phpcs, or explaining which style spec applies
keywords: PER coding style, PSR-12, PSR-1, formatting, indentation, line length, compound types, pipe operator
priority: high
related: psr-catalog.md
---

# PER Coding Style 3.1

## Overview

PER Coding Style is the PHP-FIG's living style specification. Version 3.1 (tag `3.1.0`, Aug 2026; 3.0 was July 2025) "extends, expands and replaces PSR-12" and requires adherence to PSR-1. Source: php-fig.org/per/coding-style/ + github.com/php-fig/per-coding-style/blob/master/migration-3.1.md.

---

## PER vs PSR-12 — The Nuance

| Aspect | Reality |
|--------|---------|
| **PSR-12** | Still the officially *Accepted* PSR (accepted 2019). Not withdrawn. |
| **PER-CS 3.1** | The actively maintained spec that supersedes PSR-12 for new syntax (enums, readonly, compound types, hooks, pipe operator) |
| **In practice** | Target `@PER-CS` in tooling; PSR-12 remains valid but frozen. PHP-CS-Fixer's newest set is still `@PER-CS3x0` (v3.95) — 3.1 additions are not auto-enforced yet |

Do not tell users "PSR-12 was replaced/removed" — it was not. PER extends it and is where new rules land.

---

## Core Rules (from PER-CS 3.1)

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

## What 3.1 Adds (PHP 8.5 syntax + clarifications)

| Section | Rule |
|---------|------|
| **Pipe `\|>`** | Binary operator: at least one space on each side; in a multi-line chain `\|>` starts each line, indented once |
| **`clone()`** | SHOULD always be called with parentheses, even without `$withProperties` |
| **`switch`/`case`** | No `{}` around a case body; every non-empty case ends with `break`/`return`/…; a multi-line condition goes in parentheses |
| **Empty closures** | Body abbreviated as `{}` on the same line; prefer `fn() => null` where possible |
| **Anonymous classes** | Attributes start on the line after `new`, indented once |
| **Enum constants** | Non-public enum constants use `private`, not `protected` |
| **Multi-line arrays** | Opening `[` never on its own line, in every context |

```php
$result = '<foo>'
    |> strtoupper(...)
    |> htmlspecialchars(...);

$copy = clone($original);
```

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
