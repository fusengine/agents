---
name: sail
description: Laravel Sail Docker development environment
when-to-use: Docker-based development, team environments
keywords: laravel, php, sail, docker, containers
priority: high
related: installation.md, homestead.md
---

# Laravel Sail

## Overview

Sail is Laravel's Docker development environment with a lightweight CLI. It provides consistent environments across teams without Docker expertise. Only Docker is required locally.

## Installation

```shell
composer require laravel/sail --dev
php artisan sail:install
```

## Basic Commands

```shell
sail up              # Start containers
sail up -d           # Start in background
sail stop            # Stop containers
sail down            # Destroy containers
```

**Shell alias** (add to ~/.zshrc):
```shell
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
```

## Executing Commands

| Command | Description |
|---------|-------------|
| `sail artisan` | Run Artisan |
| `sail composer` | Run Composer |
| `sail npm` | Run NPM |
| `sail test` | Run tests |
| `sail tinker` | Start REPL |
| `sail shell` | Container bash |

## Database Services

- **MySQL**: `mysql` host inside, `localhost:3306` from host
- **Redis**: `redis` host inside, `localhost:6379` from host
- **PostgreSQL**: `pgsql` host inside, `localhost:5432` from host

Add services: `php artisan sail:add`

## PHP Versions

Edit `compose.yaml`:
```yaml
build:
    context: ./vendor/laravel/sail/runtimes/8.3
```

Then: `sail build --no-cache && sail up`

## Debugging (Xdebug)

```ini
# .env
SAIL_XDEBUG_MODE=develop,debug,coverage
```

Rebuild after changes. Use `sail debug artisan migrate` for CLI.

## Email Preview

Mailpit at `http://localhost:8025`:
```ini
MAIL_HOST=mailpit
MAIL_PORT=1025
```

## File Storage (MinIO)

S3-compatible storage at `http://localhost:8900`:
```ini
AWS_ENDPOINT=http://minio:9000
AWS_ACCESS_KEY_ID=sail
AWS_SECRET_ACCESS_KEY=password
```

## Sharing Sites

```shell
sail share
```

Configure trusted proxies in `bootstrap/app.php`.

## Best Practices

1. **Use alias** - Saves typing
2. **Run detached** - Use `-d` flag
3. **Rebuild after PHP changes** - `sail build --no-cache`

## Related References

- [installation.md](installation.md) - Laravel installation
