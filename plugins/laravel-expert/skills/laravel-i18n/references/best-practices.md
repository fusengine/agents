---
name: best-practices
description: Organization and patterns for large applications
when-to-use: Structuring translations for scalable apps, team workflows
keywords: organization, structure, naming, testing, large app
---

# i18n Best Practices

## Decision Tree

```
App size?
├── Small (< 100 strings) → Single file per locale
├── Medium (100-500) → Feature-based files
├── Large (500+) → Module structure + JSON
└── Enterprise → Feature modules + extraction tools
```

## File Organization

| Size | Structure |
|------|-----------|
| Small | `lang/en/messages.php` |
| Medium | `lang/en/{feature}.php` |
| Large | `lang/en/{module}/{feature}.php` |

## Key Naming Convention

| Pattern | Example |
|---------|---------|
| `{module}.{feature}.{element}` | `products.list.title` |
| `{feature}.{action}.{element}` | `auth.login.button` |

## Recommended Structure

```
lang/
├── en/
│   ├── common.php          # Shared strings
│   ├── validation.php      # Form validation
│   ├── auth/
│   │   ├── login.php
│   │   └── register.php
│   ├── admin/
│   │   ├── dashboard.php
│   │   └── users.php
│   └── frontend/
│       ├── home.php
│       └── products.php
└── en.json                  # Short generic strings
```

## Key Naming Rules

| DO | DON'T |
|----|-------|
| `products.create.title` | `create_product_title` |
| `auth.login.error.invalid` | `invalid_login_error` |
| `common.buttons.save` | `save_btn` |

## Placeholder Rules

| DO | DON'T |
|----|-------|
| `Welcome, :name` | `Welcome, ' . $name` |
| `:count items selected` | `$count . ' items selected'` |
| `:attribute is required` | `The field is required` |

## Locale Enum Pattern

| Benefit | Implementation |
|---------|----------------|
| Type safety | `Locale::FR` instead of `'fr'` |
| Autocomplete | IDE support |
| Validation | `Locale::tryFrom($value)` |
| Labels | `$locale->label()` |

## Testing Translations

| Test Type | Purpose |
|-----------|---------|
| Key existence | All keys exist in all locales |
| Placeholder consistency | Same placeholders across locales |
| Missing translations | Log missing keys in dev |

## Missing Key Handling

| Environment | Strategy |
|-------------|----------|
| Development | Log warning |
| Production | Return key, alert team |

## Cache Strategy

| Command | When |
|---------|------|
| `php artisan config:cache` | Production deploy |
| `php artisan config:clear` | After adding translations |

## Tools & Packages

| Tool | Purpose |
|------|---------|
| `barryvdh/laravel-translation-manager` | Web UI for translations |
| `mcamara/laravel-localization` | URL-based routing |
| Phrase, Lokalise, Crowdin | Translation management SaaS |

## API Translations

| Pattern | Use Case |
|---------|----------|
| `/api/translations/{locale}` | SPA frontend |
| Response headers | Locale info |
| JSON files | Frontend consumption |

## Team Workflow

| Step | Action |
|------|--------|
| 1 | Developer adds keys in base locale |
| 2 | Export to translation platform |
| 3 | Translators work in platform |
| 4 | Import back to codebase |
| 5 | PR review for consistency |

## Performance Tips

| Tip | Reason |
|-----|--------|
| Use config:cache in production | Faster locale loading |
| Avoid DB translations | I/O overhead |
| Cache NumberFormatter | Expensive to create |
| Use JSON for flat strings | Faster lookup |

→ **See template**: [LocaleServiceProvider.php.md](templates/LocaleServiceProvider.php.md)
