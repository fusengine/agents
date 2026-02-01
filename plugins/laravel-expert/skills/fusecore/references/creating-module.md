---
name: creating-module
description: Step-by-step guide to create a new FuseCore module
when-to-use: Creating new modules, understanding the complete process
keywords: create, new, module, guide, tutorial
priority: high
related: module-structure.md, module-json.md, service-provider.md
---

# Creating a New Module

## Overview

This guide walks through creating a complete FuseCore module from scratch.

## Prerequisites

| Requirement | Check |
|-------------|-------|
| FuseCore installed | `/FuseCore/Core/` exists |
| Laravel 12 | `php artisan --version` |
| Composer autoload | `FuseCore\\` registered |

## Step-by-Step Guide

### Step 1: Create Directory Structure

Create the module folder structure:

```bash
MODULE_NAME="Blog"

mkdir -p FuseCore/${MODULE_NAME}/{App/{Models,Http/Controllers,Http/Requests,Http/Resources,Services,Providers},Database/{Migrations,Seeders,Factories},Resources/React,Routes}
```

### Step 2: Create module.json

| Field | Value | Required |
|-------|-------|----------|
| name | Module name | ✅ |
| version | 1.0.0 | ✅ |
| enabled | true | ✅ |
| isCore | false | ❌ |
| dependencies | ["User"] | ❌ |

See [module.json.md template](templates/module.json.md)

### Step 3: Create ServiceProvider

Create `FuseCore/{Module}/App/Providers/{Module}ServiceProvider.php`:

| Component | Purpose |
|-----------|---------|
| `use HasModule` | Enable trait |
| `register()` | Bind services |
| `boot()` | Load resources |

See [ServiceProvider.php.md template](templates/ServiceProvider.php.md)

### Step 4: Create Routes

Create `FuseCore/{Module}/Routes/api.php`:

| Component | Purpose |
|-----------|---------|
| Middleware | Auth, throttle |
| Routes | API endpoints |

See [ApiRoutes.php.md template](templates/ApiRoutes.php.md)

### Step 5: Create Migration

Create migration in `/Database/Migrations/`:

| Component | Purpose |
|-----------|---------|
| Table name | Prefixed with module |
| Columns | Module data |
| Foreign keys | With dependencies |

See [Migration.php.md template](templates/Migration.php.md)

### Step 6: Create Model

Create model in `/App/Models/`:

| Component | Purpose |
|-----------|---------|
| Table | `$table` property |
| Fillable | Mass assignment |
| Relationships | Eloquent relations |
| Casts | Type casting |

See [Model.php.md template](templates/Model.php.md)

### Step 7: Create Controller

Create controller in `/App/Http/Controllers/`:

| Component | Purpose |
|-----------|---------|
| CRUD methods | API endpoints |
| Injection | Services, models |
| Resources | Response formatting |

See [Controller.php.md template](templates/Controller.php.md)

### Step 8: Create Resource

Create API resource in `/App/Http/Resources/`:

| Component | Purpose |
|-----------|---------|
| `toArray()` | Transform model |
| Relationships | Conditional loading |

See [Resource.php.md template](templates/Resource.php.md)

### Step 9: Create Request

Create form request in `/App/Http/Requests/`:

| Component | Purpose |
|-----------|---------|
| `rules()` | Validation rules |
| `authorize()` | Authorization |

See [Request.php.md template](templates/Request.php.md)

### Step 10: Clear Cache

```bash
php artisan fusecore:cache-clear
php artisan config:clear
composer dump-autoload
```

### Step 11: Run Migrations

```bash
php artisan migrate
```

### Step 12: Test Routes

```bash
php artisan route:list --path=api/blog
```

## Verification Checklist

- [ ] `module.json` exists and valid
- [ ] ServiceProvider uses `HasModule`
- [ ] Routes file exists
- [ ] Migrations run successfully
- [ ] Routes visible in `route:list`
- [ ] API endpoints respond

## Optional: Add React

### Step 1: Create React Structure

```bash
mkdir -p FuseCore/${MODULE_NAME}/Resources/React/{pages,components,hooks,stores,interfaces,schemas,i18n/locales/{fr,en}}
```

### Step 2: Add Pages

Create page components in `/pages/`.

### Step 3: Add i18n

Create translation files in `/i18n/locales/`.

See [ReactStructure.md template](templates/ReactStructure.md)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found | Check `module.json` |
| Provider not loading | Check namespace |
| Routes missing | Check `api.php` |
| Migrations fail | Check dependencies |

## Next Steps

After creating the module:

1. Add business logic to services
2. Add validation to requests
3. Add tests in `/Tests/`
4. Add React components if needed
5. Add translations

## Related Templates

| Template | Purpose |
|----------|---------|
| [module.json.md](templates/module.json.md) | Configuration |
| [ServiceProvider.php.md](templates/ServiceProvider.php.md) | Provider |
| [Controller.php.md](templates/Controller.php.md) | Controller |
| [Model.php.md](templates/Model.php.md) | Model |
| [Migration.php.md](templates/Migration.php.md) | Migration |

## Related References

- [module-structure.md](module-structure.md) - Directory layout
- [module-json.md](module-json.md) - Configuration
- [service-provider.md](service-provider.md) - Provider setup
