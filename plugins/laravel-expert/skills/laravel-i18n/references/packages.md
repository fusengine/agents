---
name: packages
description: Package translations and vendor overrides
when-to-use: Creating package translations, overriding vendor translations
keywords: package, vendor, loadTranslationsFrom, publishes, override
---

# Package Translations

## Decision Tree

```
Package translation task?
├── Create package translations → loadTranslationsFrom()
├── Publish vendor translations → vendor:publish
├── Override package strings → lang/vendor/{package}/
└── Access package strings → trans('package::key')
```

## Loading Package Translations

| Method | Purpose |
|--------|---------|
| `$this->loadTranslationsFrom($path, 'namespace')` | Register translations |
| `$this->publishes([$from => $to])` | Make publishable |

## ServiceProvider Registration

| Step | Method |
|------|--------|
| 1. Load | `loadTranslationsFrom(__DIR__.'/../lang', 'courier')` |
| 2. Publish | `publishes([...], 'courier-lang')` |

## Accessing Package Translations

| Syntax | Description |
|--------|-------------|
| `trans('courier::messages.welcome')` | Namespaced key |
| `__('courier::errors.not_found')` | Using helper |
| `@lang('courier::ui.button')` | In Blade |

## Override Structure

```
lang/
└── vendor/
    └── courier/
        ├── en/
        │   └── messages.php
        └── fr/
            └── messages.php
```

## Override Behavior

| Scenario | Result |
|----------|--------|
| Key exists in vendor override | Uses override |
| Key missing in override | Falls back to package |
| Locale missing | Falls back to fallback_locale |

## Publishing Commands

| Command | Purpose |
|---------|---------|
| `php artisan vendor:publish --provider="..."` | All package assets |
| `php artisan vendor:publish --tag=courier-lang` | Only translations |

## Package JSON Translations

| Method | Purpose |
|--------|---------|
| `$this->loadJsonTranslationsFrom($path)` | Load JSON files |

## Best Practices for Package Authors

| DO | DON'T |
|----|-------|
| Use unique namespace | Use generic names |
| Provide fallback locale | Assume user has all locales |
| Document all keys | Leave translations undocumented |
| Use semantic tags for publish | Use generic tags |

## Best Practices for Package Users

| DO | DON'T |
|----|-------|
| Override only changed keys | Copy entire files |
| Check package updates | Forget to update overrides |
| Use vendor:publish sparingly | Publish everything |

## Common Packages with Translations

| Package | Namespace |
|---------|-----------|
| Laravel Jetstream | `jetstream` |
| Laravel Fortify | `fortify` |
| Spatie Permission | `permission` |
| Laravel Cashier | `cashier` |
