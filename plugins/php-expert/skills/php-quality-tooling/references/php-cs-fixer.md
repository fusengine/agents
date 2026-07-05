---
name: php-cs-fixer
description: PHP-CS-Fixer 3.x rule sets, @PER-CS, and the Pint boundary
when-to-use: Load when configuring code style on a non-Laravel PHP project
keywords: php-cs-fixer, per-cs, symfony, coding-standard, pint, fix, check, autoPHPMigration
priority: medium
related: templates/php-cs-fixer-dist.md, templates/composer-ci.md
---

# PHP-CS-Fixer Rule Sets

## Overview

PHP-CS-Fixer detects **and fixes** coding-standard violations. It supports
PHP 7.4-8.5 and configures via a `.php-cs-fixer.dist.php` file.

Source: https://cs.symfony.com/ + /doc/ruleSets/PER-CS.html

## Built-in rule sets

| Rule set | Standard | Use when |
|----------|----------|----------|
| `@PER-CS` | PHP-FIG PER Coding Style, latest revision | Default modern choice, always in sync |
| `@PER-CS3.0` | Pinned PER-CS 3.x revision | Deterministic across versions |
| `@Symfony` | Symfony conventions (superset of PER) | Symfony apps / that house style |
| `@PhpCsFixer` | Maintainers' opinionated set | Strictest, most rules |

`@PER-CS` is an alias that always resolves to the newest PER-CS revision (3.x as
of 2026). Pin `@PER-CS3.0` when you want CI to be immune to a rule-set bump.

## Modernization rule sets

Beyond style, Fixer can migrate code toward newer PHP/PHPUnit:

- `@autoPHPMigration` / `@autoPHPMigration:risky` — modernize to newer PHP syntax.
- `@autoPHPUnitMigration:risky` — modernize toward newer PHPUnit.

Risky rules can change behavior — enable `setRiskyAllowed(true)` and review diffs.
For deep upgrades prefer Rector (see rector-upgrades.md); Fixer handles style-level
modernization.

## The Pint boundary

**Laravel Pint** is an official Laravel wrapper around PHP-CS-Fixer with a
zero-config preset. It is the same engine underneath. Rule of thumb:

```
Laravel project?  → Pint (→ laravel-expert), do NOT add PHP-CS-Fixer too
Anything else?    → PHP-CS-Fixer directly (this skill)
```

Never run both on one repo — they will fight over the same files.

## Commands

```bash
vendor/bin/php-cs-fixer init   # scaffold config
vendor/bin/php-cs-fixer check  # report only, non-zero exit on diff (CI gate)
vendor/bin/php-cs-fixer fix    # apply fixes
```

Install via `composer require --dev friendsofphp/php-cs-fixer` (or
`php-cs-fixer/shim` when dependency conflicts arise).

→ Complete config in [templates/php-cs-fixer-dist.md](templates/php-cs-fixer-dist.md)

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Fixer + Pint in one repo | Choose one; Pint for Laravel, Fixer elsewhere |
| Enabling risky rules blindly | `setRiskyAllowed(true)` + review every diff |
| Using `fix` in CI | Use `check` in CI (fails on diff), `fix` locally |
