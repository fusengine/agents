---
name: upgrade
description: Laravel upgrade guide and breaking changes
when-to-use: Upgrading Laravel versions, handling breaking changes
keywords: laravel, php, upgrade, migration, breaking-changes
priority: medium
related: installation.md, configuration.md
---

# Upgrade Guide

## Overview

Laravel follows semantic versioning with annual major releases. Upgrading requires updating dependencies and addressing breaking changes. The upgrade from 11.x to 12.0 is typically straightforward.

## Upgrade Process

### 1. Update Dependencies

Update your `composer.json` with new version constraints:

```json
{
    "require": {
        "laravel/framework": "^12.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^11.0",
        "pestphp/pest": "^3.0"
    }
}
```

Then run:

```shell
composer update
```

### 2. Update Laravel Installer

If using the Laravel installer CLI, update it for compatibility:

```shell
composer global update laravel/installer
```

Or re-run the php.new installation commands for your OS.

## Breaking Changes by Impact

### High Impact

Changes that affect most applications:

| Change | Action Required |
|--------|-----------------|
| Framework version | Update to `^12.0` |
| PHPUnit | Update to `^11.0` |
| Pest | Update to `^3.0` |

### Medium Impact

Changes affecting common use cases:

**UUIDv7 Migration**: The `HasUuids` trait now generates UUIDv7 (ordered) instead of UUIDv4. To keep UUIDv4 behavior:

```php
// Before
use Illuminate\Database\Eloquent\Concerns\HasUuids;

// After (to keep UUIDv4)
use Illuminate\Database\Eloquent\Concerns\HasVersion4Uuids as HasUuids;
```

### Low Impact

Changes affecting edge cases:

| Change | Details |
|--------|---------|
| **Carbon 3** | Carbon 2.x support removed |
| **Concurrency results** | Associative arrays now return keyed results |
| **Container resolution** | Respects default values for class properties |
| **Image validation** | SVGs excluded by default |
| **Local disk root** | Defaults to `storage/app/private` |
| **Schema inspection** | Multi-schema results by default |

## Specific Changes

### Container Dependency Resolution

Default parameter values are now respected:

```php
class Example
{
    public function __construct(public ?Carbon $date = null) {}
}

$example = resolve(Example::class);
// Laravel 11.x: $date is Carbon instance
// Laravel 12.x: $date is null (respects default)
```

### Image Validation with SVG

To allow SVGs in image validation:

```php
'photo' => 'required|image:allow_svg'

// Or using File rule
'photo' => ['required', File::image(allowSvg: true)]
```

### Request Merging

`mergeIfMissing()` now supports dot notation for nested arrays:

```php
$request->mergeIfMissing([
    'user.last_name' => 'Otwell', // Creates nested array
]);
```

## Automated Upgrades

[Laravel Shift](https://laravelshift.com/) provides automated upgrade services that handle most changes automatically, saving significant time on larger applications.

## Best Practices

1. **Read the full guide** - Review all changes before upgrading
2. **Test thoroughly** - Run your test suite after upgrading
3. **Upgrade incrementally** - Don't skip major versions
4. **Check packages** - Ensure third-party packages support the new version
5. **Use Shift** - For large applications, automated upgrades save time

## Related References

- [installation.md](installation.md) - Fresh installation
- [configuration.md](configuration.md) - Configuration changes
