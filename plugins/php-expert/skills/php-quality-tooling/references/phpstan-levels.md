---
name: phpstan-levels
description: PHPStan 2.x rule levels 0-10, baseline, and extra strictness
when-to-use: Load when choosing or raising PHPStan analysis strictness
keywords: phpstan, levels, baseline, strict-rules, bleeding-edge, mixed, type-safety
priority: high
related: rector-upgrades.md, templates/phpstan-neon.md
---

# PHPStan Levels & Baseline

## Overview

PHPStan offers **11 rule levels, 0 (loosest) to 10 (strictest)**, passed via
`-l|--level`. Levels are cumulative — level 5 includes 0-4. Default is 0.

Source: https://phpstan.org/user-guide/rule-levels

## What each level adds

| Level | Adds |
|-------|------|
| 0 | Unknown classes/functions/methods, wrong arg count, always-undefined vars |
| 2 | Unknown methods on all expressions, PHPDoc validation |
| 3 | Return types, property types |
| 4 | Basic dead-code (always-false `instanceof`, unreachable code) |
| 5 | Argument types passed to methods/functions |
| 6 | Report **missing** typehints |
| 7 | Partially wrong union types |
| 8 | Calling methods / accessing props on **nullable** types |
| 9 | Strict about explicit `mixed` |
| 10 | (New in PHPStan 2.0) strict about **implicit** mixed too |

`--level max` is an alias that always tracks the highest level across upgrades.

## Adoption strategy

| Situation | Approach |
|-----------|----------|
| Greenfield | Start at level 8-9+ immediately (our default — no debt to hide) |
| Legacy | Start where it passes, then raise one level per PR |
| Too many errors to fix now | Generate a **baseline** and burn it down over time |

The baseline records existing errors so a higher level runs green while you fix
debt incrementally. Caveat from the docs: a baseline can become an upgrade
obstacle later — treat it as debt to reduce, not a permanent silencer.

## Going beyond level 10

- **`phpstan-strict-rules`** extension — extra rules, no loose casting, defensive typing.
- **Bleeding Edge** — opt into next-major analysis features early; smoother future upgrades.
- **Framework extensions** — Doctrine/Symfony/etc. improve type understanding + add rules.
- Extra config options not tied to any level, e.g. `checkUninitializedProperties`
  (typed props not set in constructor), `checkBenevolentUnionTypes`.

## Decision guide

```
How much type debt exists?
├── None (new code) → level 8-9+, phpstan-strict-rules, bleeding edge
├── Some, fixable now → highest passing level, raise per PR
└── Large → adopt target level + baseline, reduce baseline over sprints
```

→ Complete `phpstan.neon` in [templates/phpstan-neon.md](templates/phpstan-neon.md)

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Lowering the level to go green | Keep the level, baseline the errors |
| Never removing baseline entries | Track baseline size; shrink it each sprint |
| Ignoring extension packages | Install Doctrine/Symfony extensions for real types |
