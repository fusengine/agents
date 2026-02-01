---
name: localization
description: Laravel localization concepts and configuration
when-to-use: Setting up i18n, configuring locales, understanding translation system
keywords: i18n, localization, locale, translation, language
priority: high
related: pluralization.md, blade-translations.md
---

# Laravel Localization

## Overview

Laravel provides convenient translation features with support for PHP files and JSON-based translations.

## File Structure

```text
lang/
├── en/
│   ├── messages.php      # Short keys (namespaced)
│   └── validation.php    # Validation messages
├── fr/
│   ├── messages.php
│   └── validation.php
├── en.json               # Full text keys (JSON)
└── fr.json
```

## Configuration

Set default and fallback locales in `config/app.php`:

```php
'locale' => env('APP_LOCALE', 'en'),
'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),
```

## Setup Command

```bash
php artisan lang:publish
```

Creates `lang/` directory with default language files.

## Translation Helpers

| Helper | Usage |
|--------|-------|
| `__('key')` | Basic translation |
| `__('key', ['name' => 'value'])` | With replacements |
| `trans('key')` | Alias for `__()` |
| `trans_choice('key', count)` | Pluralization |
| `@lang('key')` | Blade directive |

## PHP vs JSON Files

| Feature | PHP Files | JSON Files |
|---------|-----------|------------|
| Keys | Short (`messages.welcome`) | Full text (`Welcome`) |
| Nesting | Supported | Flat only |
| Best for | Structured translations | Large apps with many strings |
| Namespace | Required | Not needed |

## Runtime Locale

```php
use Illuminate\Support\Facades\App;

App::setLocale('fr');           // Set locale
$locale = App::currentLocale(); // Get current
App::isLocale('fr');            // Check locale
```

See templates for complete implementation examples.
