# fuse-php

Expert **modern, framework-agnostic PHP** development — libraries, standalone Symfony components, Slim / API-first applications, and CLI tools. Targets PHP 8.5 (PHP 8.4 still supported), with PER Coding Style 3.0, PHPStan static analysis, PSR interoperability, and SOLID principles.

## Agent

| Agent | Description |
|-------|-------------|
| **php-expert** | Expert non-Laravel PHP developer (PHP 8.5 / 8.4, PER-CS 3.0, PHPStan) |

## Skills

| Skill | Description |
|-------|-------------|
| php-language-modern | PHP 8.5 / 8.4 language features — property hooks, asymmetric visibility, lazy objects, enums, pipe operator, `#[\NoDiscard]`, attributes |
| php-standards | Coding standards — PER Coding Style 3.0, PSR-1/PSR-4/PSR-12, naming, autoloading |
| php-quality-tooling | Quality tooling — PHPStan levels, php-cs-fixer / PHP_CodeSniffer, Rector, CI |
| php-testing | Testing — PHPUnit (attributes-only) or Pest, data providers, mocking, coverage |
| php-http-psr | HTTP and PSR interop — PSR-7/PSR-15/PSR-17/PSR-18, Slim, standalone Symfony HTTP |
| php-ecosystem-reference | Ecosystem — Composer, common libraries, framework boundaries, conventions |

SOLID principles are provided by the shared **`fuse-laravel:solid-php`** skill (files < 100 lines, interfaces separated, PHPDoc mandatory) — no local duplicate.

## Architecture

```
src/
├── Contract/            # interfaces (one per contract)
├── ...                  # PSR-4 namespaced source
composer.json            # PSR-4 autoload, PHP version constraint, dev tooling
phpstan.neon             # static analysis level
.php-cs-fixer.php        # PER Coding Style 3.0 ruleset
tests/                   # PHPUnit or Pest suite
```

## Installation

```bash
/plugin install fuse-php
```

## Usage

The agent activates for **non-Laravel PHP** projects — a `composer.json` is present but there is **no** `artisan` file:
- libraries and packages published to Packagist
- standalone Symfony components (used without the full framework)
- Slim and other micro / API-first applications
- CLI tools

**Boundary with Laravel:** when a project has both `composer.json` **and** an `artisan` file, it is a Laravel application — use **`laravel-expert`** (plugin `fuse-laravel`) instead. `php-expert` deliberately does not cover Laravel-specific abstractions (Eloquent, Blade, Artisan commands, service container conventions).

For frontend work use the relevant framework expert.
