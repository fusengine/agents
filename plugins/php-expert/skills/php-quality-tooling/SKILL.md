---
name: php-quality-tooling
description: Use when setting up or tuning static analysis, automated refactoring, and code-style enforcement on a framework-agnostic PHP project. Covers PHPStan, Rector, PHP-CS-Fixer, composer scripts, and CI wiring. Do NOT use for Laravel projects (Pint + Larastan → laravel-expert), test frameworks (→ php-testing), or language syntax questions (→ php-language-modern).
versions:
  phpstan: "2.x"
  rector: "2.x"
  php-cs-fixer: "3.x"
user-invocable: true
references: references/phpstan-levels.md, references/rector-upgrades.md, references/php-cs-fixer.md, references/templates/phpstan-neon.md, references/templates/rector-php.md, references/templates/php-cs-fixer-dist.md, references/templates/composer-ci.md
related-skills: php-testing, php-language-modern
---

# PHP Quality Tooling

Three complementary tools. PHPStan **finds** type bugs, Rector **rewrites** code
(upgrades + refactors), PHP-CS-Fixer **formats** to a coding standard. They do not
overlap — run all three.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect existing config (phpstan.neon, rector.php, .php-cs-fixer.dist.php), PHP version in composer.json
2. **fuse-ai-pilot:research-expert** - Verify latest PHPStan/Rector/PHP-CS-Fixer docs via Context7/Exa
3. **mcp__context7__query-docs** - Check current config API surface

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Tool | Role | Config file | Verdict |
|------|------|-------------|---------|
| PHPStan | Static analysis (type safety, dead code) | `phpstan.neon` | Reports errors, never edits |
| Rector | Automated upgrade + refactor | `rector.php` | Rewrites source |
| PHP-CS-Fixer | Coding-standard formatter | `.php-cs-fixer.dist.php` | Rewrites whitespace/style |

Scope note: **Laravel Pint** is a thin opinionated wrapper around PHP-CS-Fixer.
On a Laravel project use Pint (→ laravel-expert); everywhere else use PHP-CS-Fixer
directly, which is what this skill covers.

---

## Critical Rules

1. **Pick one style tool** - PHP-CS-Fixer OR Pint, never both on one repo
2. **Rector runs `--dry-run` first** - Review the diff before applying; commit before a bare run
3. **Baseline, don't lower the level** - Adopt a high PHPStan level + baseline the debt, not `level 4`
4. **Style before analysis in CI** - Fixer `check` → PHPStan → tests; a formatting diff should fail fast
5. **Pin tool versions** - `--dev` in composer.json; a minor bump can add rules and break CI

---

## Decision Guide

```
New project from scratch?
├── Static analysis → PHPStan level 8-9+ from day one (our default; nothing to baseline yet)
├── Style → PHP-CS-Fixer @PER-CS (always-latest) or @PER-CS3.0 (pinned)
└── Rector → withPhpSets() (reads composer.json) + deadCode/codeQuality prepared sets

Legacy codebase?
├── PHPStan → start at a level that passes, generate baseline, raise 1 level per PR
├── Rector → withPhpLevel(n) / withTypeCoverageLevel(n), one level at a time
└── Style → @PER-CS + fix once, then enforce check in CI
```

---

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| PHPStan levels & baseline | `references/phpstan-levels.md` | Choosing/raising analysis strictness |
| Rector sets & upgrades | `references/rector-upgrades.md` | Automating PHP upgrades or refactors |
| PHP-CS-Fixer rule sets | `references/php-cs-fixer.md` | Configuring code style |

### Templates

| Template | Use Case |
|----------|----------|
| `references/templates/phpstan-neon.md` | Complete `phpstan.neon` (strict + baseline) |
| `references/templates/rector-php.md` | Complete `rector.php` (upgrade + quality) |
| `references/templates/php-cs-fixer-dist.md` | Complete `.php-cs-fixer.dist.php` (@PER-CS3.0) |
| `references/templates/composer-ci.md` | composer scripts + GitHub Actions pipeline |

---

## Quick Start

```bash
composer require --dev phpstan/phpstan rector/rector friendsofphp/php-cs-fixer

vendor/bin/php-cs-fixer check      # style gate (no writes)
vendor/bin/phpstan analyse         # type analysis
vendor/bin/rector process --dry-run # preview refactors
```

→ Full config in `references/templates/`

---

## Best Practices

### DO
- Enable `phpstan-strict-rules` + Bleeding Edge on greenfield projects
- Let Rector read the PHP version from `composer.json` via `withPhpSets()`
- Add framework/library PHPStan extensions (Doctrine, Symfony) for accurate types

### DON'T
- Run Rector on an uncommitted working tree
- Mix PHP-CS-Fixer and Pint in the same repo
- Silence PHPStan with `@phpstan-ignore` where a real type fix is cheap
