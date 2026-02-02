---
name: middleware
description: Locale detection and middleware patterns
when-to-use: Setting locale from URL, session, user preference
keywords: middleware, setLocale, session, URL prefix, locale detection
---

# Locale Middleware

## Decision Tree

```
Detect locale from?
├── URL prefix (/fr/page) → SetLocaleFromUrl middleware
├── Session → SetLocaleFromSession middleware
├── User preference → Check auth user first
├── Browser → Accept-Language header
└── Default → config('app.locale')
```

## Detection Priority

| Priority | Source | When to Use |
|----------|--------|-------------|
| 1 | URL segment | SEO-friendly multilingual sites |
| 2 | User preference | Authenticated users |
| 3 | Session | Returning visitors |
| 4 | Browser header | First-time visitors |
| 5 | Default | Fallback |

## Middleware Methods

| Method | Purpose |
|--------|---------|
| `App::setLocale($locale)` | Set current locale |
| `App::currentLocale()` | Get current locale |
| `App::isLocale('fr')` | Check locale |
| `URL::defaults(['locale' => $locale])` | Set URL default |

## Configuration

| Setting | Location |
|---------|----------|
| `locale` | config/app.php |
| `fallback_locale` | config/app.php |
| `available_locales` | config/app.php (custom) |

## Validation Pattern

| Check | Implementation |
|-------|----------------|
| Valid locale | `in_array($locale, config('app.available_locales'))` |
| Exists | `is_dir(lang_path($locale))` |
| Enum | `Locale::tryFrom($locale) !== null` |

## Session Storage

| Method | Usage |
|--------|-------|
| `Session::put('locale', $locale)` | Store preference |
| `Session::get('locale')` | Retrieve preference |
| `Session::forget('locale')` | Clear preference |

## Cookie Storage

| Method | Usage |
|--------|-------|
| `Cookie::queue('locale', $locale, 43200)` | 30 days |
| `$request->cookie('locale')` | Retrieve |

## URL Defaults

| Method | Purpose |
|--------|---------|
| `URL::defaults(['locale' => $locale])` | Named routes include locale |
| `route('posts.show', ['post' => 1])` | Auto-includes locale |

## Registration (Laravel 11+)

| Location | Method |
|----------|--------|
| `bootstrap/app.php` | `$middleware->append()` |
| `bootstrap/app.php` | `$middleware->alias()` |

## Best Practices

| DO | DON'T |
|----|-------|
| Validate locale against whitelist | Accept any locale |
| Set URL::defaults for named routes | Manually add locale to every route |
| Store in session for persistence | Query DB on every request |
| Use enum for type safety | Use raw strings |

→ **See template**: [SetLocaleMiddleware.php.md](templates/SetLocaleMiddleware.php.md)
