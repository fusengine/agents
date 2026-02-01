---
name: blade-translations
description: Using translations in Blade templates
when-to-use: Translating UI text in views, Blade directives
keywords: blade, @lang, templates, views
priority: medium
related: localization.md
---

# Blade Translations

## Directives

### Basic Translation

```blade
{{ __('messages.welcome') }}
@lang('messages.welcome')
```

### With Replacements

```blade
{{ __('Hello :name', ['name' => $user->name]) }}
```

### Pluralization

```blade
{{ trans_choice('messages.apples', $count) }}
```

## JSON Translations

```blade
{{ __('Welcome to our application') }}
```

Looks up key in `lang/{locale}.json`.

## Best Practices

1. **Use `@lang`** for readability in templates
2. **Extract strings early** - Avoid hardcoded text
3. **Group by feature** - `auth.login.title`, `auth.login.button`
4. **Never concatenate** - Use `:placeholder` replacements
