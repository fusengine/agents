---
name: rector-upgrades
description: Rector 2.x prepared sets, PHP upgrade sets, and level-by-level adoption
when-to-use: Load when automating PHP version upgrades or bulk refactors
keywords: rector, sets, withPhpSets, withPhpLevel, prepared-sets, upgrade, dry-run, type-coverage
priority: high
related: phpstan-levels.md, templates/rector-php.md
---

# Rector Sets & Upgrades

## Overview

Rector rewrites source from a `rector.php` config. It requires PHP 7.2+ but can
target 5.x-8.x code. Always preview with `--dry-run`, then apply.

Source: https://getrector.com/documentation/set-lists + /documentation/levels

## The two families of change

| Family | What it does | Enable via |
|--------|--------------|-----------|
| PHP upgrade sets | Rewrite syntax to a newer PHP version | `withPhpSets()` / `withSets([SetList::PHP_*])` |
| Prepared sets | Quality/style/dead-code/type refactors | `withPreparedSets(...)` |

## PHP upgrade sets

```php
->withPhpSets()             // reads PHP version from composer.json (recommended)
->withPhpSets(php84: true)  // pin a specific target with named args
->withSets([SetList::PHP_73]) // legacy: step PHP_53..PHP_74 one at a time
->withPhpLevel(5)           // upgrade progressively, level by level
```

The docs recommend the empty `->withPhpSets()` so the target follows
`composer.json` automatically.

## Prepared sets (named arguments)

`withPreparedSets()` accepts booleans: `deadCode`, `codeQuality`, `codingStyle`,
`naming`, `privatization`, `typeDeclarations`, `rectorPreset`. Group by topic to
keep config small:

```php
->withPreparedSets(deadCode: true, codeQuality: true, typeDeclarations: true)
```

## Level methods — incremental adoption

A full `typeDeclarations` set can touch 90%+ of files. Prefer level methods that
apply rules from easy to complex, one integer at a time, one PR each:

```php
->withTypeCoverageLevel(0)
->withTypeCoverageDocblockLevel(0) // since Rector 2.2: fills @param/@return/@var
->withDeadCodeLevel(0)
->withCodeQualityLevel(0)
->withCodingStyleLevel(0)
```

## Framework / community sets

External packages ship their own set constants, added via `withSets()`:

```php
use Rector\Doctrine\Set\DoctrineSetList;
->withSets([DoctrineSetList::DOCTRINE_CODE_QUALITY, __DIR__.'/config/custom.php'])
```

## Decision guide

```
Goal?
├── Bump PHP version → withPhpSets() (or withPhpLevel for big legacy jumps)
├── Reduce mixed / add types → withTypeCoverageLevel, one level per PR
├── Remove dead code / modernize → withPreparedSets(deadCode, codeQuality)
└── Framework migration → withSets([<Framework>SetList::...])
```

→ Complete `rector.php` in [templates/rector-php.md](templates/rector-php.md)

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Running bare `process` on dirty tree | Commit first, then `process --dry-run` |
| Full prepared set on legacy code | Use `withXxxLevel(n)` incrementally |
| Hardcoding PHP target | `withPhpSets()` reads composer.json |
