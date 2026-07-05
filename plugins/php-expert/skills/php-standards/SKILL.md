---
name: php-standards
description: Use when setting up a PHP package, choosing a coding style, wiring autoloading, or selecting PSR interfaces — PSR-4 autoloading, PER Coding Style 3.0 vs PSR-12, the active PSR catalog, and modern composer.json. Do NOT use for language syntax/features (use php-language-modern) or Laravel-specific conventions (use the laravel plugin).
versions:
  per-coding-style: "3.0"
  psr-4: "accepted"
  composer: "2"
user-invocable: false
references: references/per-coding-style.md, references/psr-catalog.md, references/psr4-autoloading.md, references/templates/composer-json.md, references/templates/project-structure.md
related-skills: php-language-modern
---

# PHP Standards (PSR / PER / Composer)

## Agent Workflow (MANDATORY)

Before applying a standard, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect existing style config (`.php-cs-fixer.php`, `phpcs.xml`), `composer.json` autoload
2. **fuse-ai-pilot:research-expert** - Verify a PSR's current status on php-fig.org before recommending it
3. **mcp__context7__query-docs** - Cross-check composer.json schema

After changes, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Concern | Standard | Notes |
|---------|----------|-------|
| **Autoloading** | PSR-4 | Recommended; PSR-0 is deprecated |
| **Coding style** | PER Coding Style 3.0 | "Extends, expands and replaces PSR-12"; PSR-12 remains the *Accepted* PSR |
| **Logging** | PSR-3 | `LoggerInterface` |
| **Caching** | PSR-6 / PSR-16 | Pool vs Simple Cache |
| **HTTP** | PSR-7 / 15 / 17 / 18 | Message / Handlers / Factories / Client |
| **DI container** | PSR-11 | `ContainerInterface` |
| **Events** | PSR-14 | Event Dispatcher |
| **Time** | PSR-20 | `ClockInterface` — testable "now" |

---

## Critical Rules

1. **PSR-4 for autoloading, never PSR-0** - PSR-0 and `target-dir` are deprecated. See [psr4-autoloading.md](references/psr4-autoloading.md).
2. **PER Coding Style 3.0 is the current style spec** - It supersedes PSR-12 in practice while requiring PSR-1. PSR-12 is still the officially *Accepted* PSR — document the nuance, don't pretend PSR-12 was withdrawn. See [per-coding-style.md](references/per-coding-style.md).
3. **Depend on PSR interfaces, not implementations** - Type-hint `Psr\Log\LoggerInterface`, not a concrete logger.
4. **4 spaces, no tabs; LF line endings; omit closing `?>`** - Core PER/PSR-1 file rules.
5. **`src/` for library code, `tests/` for tests** - Wire `tests/` via `autoload-dev`, never `autoload`.

---

## Architecture

```
my-package/
├── composer.json           # PSR-4 autoload + autoload-dev + scripts
├── src/                    # Namespace root (Vendor\Package\)
│   └── Service.php
├── tests/                  # PSR-4 dev namespace (Vendor\Package\Tests\)
│   └── ServiceTest.php
└── bin/                    # CLI entry points (composer "bin")
```

→ See [project-structure.md](references/templates/project-structure.md) for the full layout

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **PER Coding Style** | [per-coding-style.md](references/per-coding-style.md) | Formatting rules, PER vs PSR-12 |
| **PSR catalog** | [psr-catalog.md](references/psr-catalog.md) | Which PSR to depend on / avoid |
| **PSR-4 autoloading** | [psr4-autoloading.md](references/psr4-autoloading.md) | Namespace-to-path mapping |

### Templates

| Template | When to Use |
|----------|-------------|
| [composer-json.md](references/templates/composer-json.md) | Starting or modernizing a package |
| [project-structure.md](references/templates/project-structure.md) | Laying out directories |

---

## Best Practices

### DO
- Use PSR-4 with `src/` mapped to the vendor namespace
- Follow PER Coding Style 3.0 (run php-cs-fixer with the `@PER-CS` ruleset)
- Depend on PSR interface packages (`psr/log`, `psr/http-message`, …)
- Put test-only classes under `autoload-dev`

### DON'T
- Use PSR-0 autoloading or `target-dir` (deprecated)
- Claim PER "replaced" PSR-12 as the official standard — PSR-12 is still *Accepted*
- Depend on PSR-2/PSR-0 (deprecated) or PSR-8/9/10 (abandoned)
- Hardcode a concrete logger/cache when a PSR interface exists
