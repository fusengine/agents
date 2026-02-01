---
name: laravel-i18n
description: Laravel localization - __(), trans_choice(), lang files, JSON translations, pluralization. Use when implementing translations in Laravel apps.
versions:
  laravel: "12.46"
  php: "8.5"
user-invocable: false
references: references/localization.md, references/pluralization.md, references/blade-translations.md
related-skills: laravel-blade
---

# Laravel Internationalization

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Check existing translation patterns
2. **fuse-ai-pilot:research-expert** - Verify Laravel i18n best practices via Context7
3. **mcp__context7__query-docs** - Check Laravel localization documentation

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Laravel provides translation support with PHP arrays and JSON files.

| Feature | PHP Files | JSON Files |
|---------|-----------|------------|
| Keys | Short (`messages.welcome`) | Full text |
| Nesting | Supported | Flat only |
| Best for | Structured translations | Large apps |

---

## Critical Rules

1. **Never concatenate strings** - Use `:placeholder` replacements
2. **Always handle zero** in pluralization
3. **Group by feature** - `auth.login.title`, `auth.login.button`
4. **Extract strings early** - No hardcoded text in views

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Setup** | [localization.md](references/localization.md) | Initial configuration |
| **Pluralization** | [pluralization.md](references/pluralization.md) | Count-based translations |
| **Blade** | [blade-translations.md](references/blade-translations.md) | View translations |

### Templates

| Template | When to use |
|----------|-------------|
| [SetLocaleMiddleware.php.md](references/templates/SetLocaleMiddleware.php.md) | URL-based locale |
| [lang-files.md](references/templates/lang-files.md) | Translation file examples |

---

## Quick Reference

```php
// Basic translation
__('messages.welcome')

// With replacement
__('Hello :name', ['name' => 'John'])

// Pluralization
trans_choice('messages.items', $count)

// Runtime locale
App::setLocale('fr');
```
