---
name: laravel-boost-mcp
description: Automated upgrade via Laravel Boost MCP server inside Claude Code/Cursor
when-to-use: Want guided/automated upgrade instead of manual
keywords: laravel-boost, mcp, automation, ai-assisted
---

# Laravel Boost MCP — Automated Upgrade

Laravel Boost is an official MCP server for Laravel-aware AI assistance.

## Installation

```bash
composer require laravel/boost --dev
php artisan boost:install
```

The installer registers an MCP server for Claude Code / Cursor / Windsurf.

## Usage in Claude Code

```
/upgrade-laravel-v13
```

This command (provided by Laravel Boost MCP):
1. Audits your composer.json + lockfile
2. Bumps dependencies safely
3. Applies known breaking-change fixes
4. Runs tests after each step
5. Pauses for manual review on ambiguous changes

## What it covers automatically

- ✅ Composer dependency bumps
- ✅ `bootstrap/app.php` middleware rename (VerifyCsrfToken → PreventRequestForgery)
- ✅ Cache prefix preservation in `.env`
- ✅ PHPUnit 11 → 12 config migration
- ✅ Deprecated method replacements

## What still requires manual review

- ⚠️ Eloquent / Queue Attributes migration (intentionally manual — DX choice)
- ⚠️ Custom middleware referencing internal Laravel classes
- ⚠️ Third-party packages without L13 support yet

## Without MCP

If MCP not available, follow [composer-upgrade.md](composer-upgrade.md) + [breaking-changes.md](breaking-changes.md) manually.

## Verification

After Boost completes:

```bash
php artisan about
php artisan migrate --pretend
vendor/bin/pest
```

## Source

- Laravel Boost: https://github.com/laravel/boost
- MCP spec: https://modelcontextprotocol.io
