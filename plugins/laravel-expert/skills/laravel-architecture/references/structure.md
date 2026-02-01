---
name: structure
description: Laravel application directory structure
when-to-use: Understanding Laravel file organization
keywords: laravel, php, structure, directories, organization
priority: medium
related: providers.md, configuration.md
---

# Directory Structure

## Overview

Laravel follows a conventional directory structure. Understanding it helps navigate and organize code effectively.

## Root Directories

| Directory | Purpose |
|-----------|---------|
| `app/` | Application code |
| `bootstrap/` | Framework bootstrap |
| `config/` | Configuration files |
| `database/` | Migrations, seeders, factories |
| `public/` | Web server document root |
| `resources/` | Views, assets, lang |
| `routes/` | Route definitions |
| `storage/` | Logs, cache, sessions |
| `tests/` | Test files |
| `vendor/` | Composer dependencies |

## App Directory

| Directory | Purpose |
|-----------|---------|
| `Console/` | Artisan commands |
| `Exceptions/` | Exception handlers |
| `Http/` | Controllers, middleware, requests |
| `Models/` | Eloquent models |
| `Providers/` | Service providers |

### Http Subdirectories

| Directory | Purpose |
|-----------|---------|
| `Controllers/` | HTTP controllers |
| `Middleware/` | Request middleware |
| `Requests/` | Form requests |
| `Resources/` | API resources |

## Common Custom Directories

| Directory | Purpose |
|-----------|---------|
| `app/Services/` | Business logic |
| `app/Repositories/` | Data access |
| `app/Actions/` | Single-action classes |
| `app/DTOs/` | Data transfer objects |
| `app/Enums/` | PHP enums |
| `app/Events/` | Event classes |
| `app/Jobs/` | Queued jobs |
| `app/Listeners/` | Event listeners |
| `app/Policies/` | Authorization policies |
| `app/Rules/` | Custom validation rules |

## Routes Directory

| File | Purpose |
|------|---------|
| `web.php` | Web routes (sessions) |
| `api.php` | API routes (stateless) |
| `console.php` | Artisan commands |
| `channels.php` | Broadcast channels |

## Storage Directory

| Directory | Purpose |
|-----------|---------|
| `app/` | Application files |
| `app/public/` | Public uploads |
| `framework/` | Cache, sessions |
| `logs/` | Log files |

## Best Practices

1. **Follow conventions** - Use standard directories
2. **Services for logic** - Keep controllers thin
3. **Group by feature** - For large apps
4. **API versioning** - `Controllers/Api/V1/`

## Related References

- [providers.md](providers.md) - Bootstrapping
- [configuration.md](configuration.md) - Config files
