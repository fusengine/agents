---
name: laravel-upgrade-v13
description: Use when upgrading a Laravel 12 application to Laravel 13.0. Covers PHP 8.3 requirement, composer commands, breaking changes (PHPUnit 12, Pest 4, VerifyCsrfToken → PreventRequestForgery, cache prefixes, serializable_classes, pheanstalk 8.0+), Attributes migration (Eloquent + Queue), Symfony 7.4/8.0 upgrade, and Laravel Boost MCP automated upgrade.
versions:
  laravel: "13.0"
  php: "8.3"
user-invocable: true
references: references/composer-upgrade.md, references/breaking-changes.md, references/attributes-migration.md, references/laravel-boost-mcp.md, references/checklist.md, references/templates/composer.json.md, references/templates/upgrade-script.sh.md
related-skills: laravel-architecture, laravel-eloquent, laravel-queues, laravel-attributes, laravel-auth, laravel-testing, solid-php
---

# Laravel 12 → 13 Upgrade Guide

Centralized upgrade path from Laravel 12.46 to Laravel 13.0 (released March 17, 2026).

## Agent Workflow (MANDATORY)

Before ANY upgrade, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** — Audit current Laravel 12 patterns (`$fillable`, `$tries`, `VerifyCsrfToken` references)
2. **fuse-ai-pilot:research-expert** — Verify latest Laravel 13 docs via Context7 (`/laravel/docs/13.x/upgrade`)
3. **fuse-laravel:laravel-expert** — Apply Laravel 13 best practices

After upgrade, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Phase | Goal | Effort |
|-------|------|--------|
| **1. Pre-upgrade audit** | Detect L12 patterns in codebase | 30 min |
| **2. Composer bump** | Update Laravel + PHPUnit + Pest + Tinker | 5 min |
| **3. Breaking changes fixes** | Apply mandatory L13 changes | 1-3 h |
| **4. Attributes migration** | Eloquent + Queue properties → Attributes (optional) | 2-4 h |
| **5. Validation** | Tests pass, CI green | 30 min |

Most projects: **< 1 day total**.

---

## Critical Rules

1. **PHP 8.3 minimum** — Drop PHP 8.2 support before upgrading composer.
2. **PHPUnit 12 + Pest 4 required** — bump dev dependencies first to catch test failures early.
3. **VerifyCsrfToken → PreventRequestForgery** — rename middleware references in `bootstrap/app.php` and aliases.
4. **Cache prefix breaking change** — hyphens replace underscores by default. Set `CACHE_PREFIX`, `REDIS_PREFIX`, `SESSION_COOKIE` to preserve old behavior if cache invalidation is unacceptable.
5. **Never mix Attributes + properties** on the same Eloquent/Queue class — pick one source of truth per model/job.

---

## Architecture

```
upgrade-path/
├── 1-composer/        # bump dependencies
├── 2-breaking-fixes/  # mandatory changes
├── 3-attributes/      # optional refactor to Attributes
└── 4-validation/      # tests + sniper
```

→ See [composer-upgrade.md](references/composer-upgrade.md) for exact commands.

---

## Reference Guide

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Composer commands** | [composer-upgrade.md](references/composer-upgrade.md) | Bump dependencies |
| **Breaking changes** | [breaking-changes.md](references/breaking-changes.md) | Fix L13 mandatory updates |
| **Attributes migration** | [attributes-migration.md](references/attributes-migration.md) | Modernize Eloquent/Queue classes |
| **Laravel Boost MCP** | [laravel-boost-mcp.md](references/laravel-boost-mcp.md) | Automated `/upgrade-laravel-v13` |
| **Checklist** | [checklist.md](references/checklist.md) | Step-by-step validation |

---

## Quick Reference

### Composer bump (5 min)

```bash
composer require laravel/framework:^13.0 laravel/tinker:^3.0
composer require --dev phpunit/phpunit:^12.0 pestphp/pest:^4.0
composer update
```

→ See [composer-upgrade.md](references/composer-upgrade.md) for full sequence.

### Breaking change: PreventRequestForgery

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateOrigin(except: [
        'stripe/*',
        'webhook/*',
    ]);
})
```

→ See [breaking-changes.md](references/breaking-changes.md) for all 12 changes.

### Cache prefix migration

```env
# .env — preserve L12 underscore behavior
CACHE_PREFIX=laravel_cache
REDIS_PREFIX=laravel_database_
SESSION_COOKIE=laravel_session
```

→ See [breaking-changes.md](references/breaking-changes.md#cache-prefixes).

---

## Best Practices

### DO
- Bump PHPUnit + Pest FIRST so failing tests appear before refactor
- Run upgrade on a feature branch (`feat/laravel-13-upgrade`)
- Use `Laravel Boost MCP` `/upgrade-laravel-v13` for guided automation
- Test in staging with real cache + queue workers before prod
- Keep properties + Attributes migration as a SEPARATE PR (not bundled with breaking fixes)

### DON'T
- ❌ Skip the cache prefix env vars if you have warm caches in prod
- ❌ Upgrade composer directly on `main` without CI verification
- ❌ Mix `#[Fillable]` and `$fillable` on the same model
- ❌ Forget `pheanstalk/pheanstalk: ^8.0` if you use Beanstalkd
- ❌ Leave `new Model()` calls inside service provider `register()` — throws `LogicException` in L13
