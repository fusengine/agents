---
name: custom-directives
description: Creating custom Blade directives and conditionals
when-to-use: Extending Blade with custom syntax
keywords: custom, directive, Blade::if, Blade::directive, extend
---

# Custom Directives

## Decision Tree

```
Need custom conditional (@something/@endsomething)?
├── YES → Blade::if('name', callback)
└── NO → Need custom output (@directive)?
    ├── YES → Blade::directive('name', callback)
    └── NO → Use existing directives
```

## Blade::if - Custom Conditionals

| Use When | Example |
|----------|---------|
| Check app config | `@disk('s3')` |
| Check feature flags | `@feature('dark-mode')` |
| Check user roles | `@role('admin')` |
| Check subscriptions | `@subscribed('pro')` |

| Generated Directives | Purpose |
|---------------------|---------|
| `@name` | If true |
| `@elsename` | Else if |
| `@endname` | End block |

## Blade::directive - Custom Output

| Use When | Example |
|----------|---------|
| Format dates | `@datetime($date)` |
| Format money | `@money($amount)` |
| Render markdown | `@markdown($content)` |
| Generate URLs | `@route('name')` |

## Registration Location

| Location | When |
|----------|------|
| `AppServiceProvider::boot()` | Simple directives |
| Dedicated `BladeServiceProvider` | Many directives |

## Return Value Format

| Type | Must Return |
|------|-------------|
| `Blade::if()` | `bool` |
| `Blade::directive()` | `string` (PHP code) |

## Common Custom Directives

| Directive | Purpose |
|-----------|---------|
| `@datetime($date)` | Format Carbon dates |
| `@money($amount, $currency)` | Format currency |
| `@markdown($text)` | Render markdown |
| `@nl2br($text)` | Newlines to `<br>` |
| `@truncate($text, $length)` | Truncate with ellipsis |

## Common Custom Conditionals

| Conditional | Purpose |
|-------------|---------|
| `@admin` | Current user is admin |
| `@subscribed('plan')` | User has subscription |
| `@feature('flag')` | Feature flag enabled |
| `@disk('driver')` | Check storage driver |
| `@locale('en')` | Check app locale |

## Best Practices

| DO | DON'T |
|----|-------|
| Keep directives simple | Complex logic in directives |
| Use for repeated patterns | One-off formatting |
| Document in SKILL.md | Undocumented directives |
| Test directive output | Assume it works |

→ **Code examples**: See [templates/CustomDirectives.php.md](templates/CustomDirectives.php.md)
