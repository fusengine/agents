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

Sail is Laravel's official Docker development environment. It provides a lightweight CLI for interacting with Docker containers without requiring Docker expertise. Sail is ideal for teams needing consistent development environments across different operating systems.

## Why Use Sail

- **Zero local requirements** - Only Docker needed
- **Consistent environments** - Identical setup for all team members
- **Easy services** - MySQL, Redis, Meilisearch, etc. pre-configured
- **Isolated** - Doesn't conflict with local installations

## Installation

Sail comes with new Laravel applications. For existing projects:

```shell
composer require laravel/sail --dev
php artisan sail:install
```

The installer lets you choose services (MySQL, Redis, Meilisearch, etc.).

## Basic Commands

```shell
# Start containers
./vendor/bin/sail up

# Start in background
./vendor/bin/sail up -d

# Stop containers
./vendor/bin/sail stop

# Destroy containers
./vendor/bin/sail down
```

### Shell Alias (Recommended)

```shell
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
```

Add to `~/.zshrc` or `~/.bashrc` for permanent use.

## Executing Commands

Sail wraps common commands to run inside containers:

| Command | Description |
|---------|-------------|
| `sail php` | Run PHP commands |
| `sail artisan` | Run Artisan commands |
| `sail composer` | Run Composer commands |
| `sail npm` | Run NPM commands |
| `sail node` | Run Node commands |
| `sail test` | Run tests |
| `sail tinker` | Start Tinker REPL |

## Database Services

### MySQL

- Connects via `mysql` hostname inside containers
- Accessible at `localhost:3306` from host
- Creates `testing` database automatically for tests

### Redis/Valkey

- Connects via `redis` or `valkey` hostname
- Accessible at `localhost:6379` from host

### MongoDB

```ini
MONGODB_URI=mongodb://mongodb:27017
```

## Additional Services

Add services after initial setup:

```shell
php artisan sail:add
```

Available services include MySQL, PostgreSQL, MariaDB, Redis, Valkey, Meilisearch, Typesense, MinIO, Mailpit, and Selenium.

## PHP Versions

Change PHP version in `compose.yaml`:

```yaml
build:
    context: ./vendor/laravel/sail/runtimes/8.3  # or 8.4, 8.2, 8.1
```

Then rebuild:

```shell
sail build --no-cache && sail up
```

## Testing

```shell
sail test
sail test --group=feature
sail artisan test
```

Sail automatically uses the `testing` database.

### Laravel Dusk

Uncomment the Selenium service in `compose.yaml`, add `depends_on`, then:

```shell
sail dusk
```

## Debugging with Xdebug

1. Publish Sail configuration: `sail artisan sail:publish`
2. Add to `.env`: `SAIL_XDEBUG_MODE=develop,debug,coverage`
3. Configure `php.ini` with `xdebug.mode=${XDEBUG_MODE}`
4. Rebuild: `sail build --no-cache`

Use `sail debug` for CLI debugging:

```shell
sail debug artisan migrate
```

## Sharing Sites

```shell
sail share
```

Creates a public URL via Expose. Configure trusted proxies in `bootstrap/app.php`:

```php
$middleware->trustProxies(at: '*');
```

## File Storage with MinIO

For S3-compatible local storage:

```ini
FILESYSTEM_DISK=s3
AWS_ENDPOINT=http://minio:9000
AWS_ACCESS_KEY_ID=sail
AWS_SECRET_ACCESS_KEY=password
```

Access MinIO console at `http://localhost:8900`.

## Email Preview

Mailpit captures all outgoing emails at `http://localhost:8025`:

```ini
MAIL_HOST=mailpit
MAIL_PORT=1025
```

## Customization

Publish Dockerfiles for customization:

```shell
sail artisan sail:publish
```

This creates a `docker/` directory with customizable configurations.

## Best Practices

1. **Use the alias** - Saves typing `./vendor/bin/sail`
2. **Run in background** - Use `-d` for detached mode
3. **Rebuild after changes** - PHP version, extensions
4. **Use sail shell** - For interactive container access
5. **Don't edit compose.yaml directly** - Publish first

## Related References

- [installation.md](installation.md) - Laravel installation
- [homestead.md](homestead.md) - Vagrant alternative
