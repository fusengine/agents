---
name: sail-config
description: Laravel Sail configuration and commands from official Laravel 12 docs
keywords: sail, docker, xdebug, commands
source: https://laravel.com/docs/12.x/sail
---

# Laravel Sail Configuration

## Installation

```shell
composer require laravel/sail --dev
php artisan sail:install
```

## Shell Alias

```shell
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
```

## Basic Commands

```shell
# Start containers
sail up

# Start in background
sail up -d

# Stop containers
sail stop

# Rebuild containers
sail build --no-cache
sail up
```

## Executing Commands

```shell
# PHP commands
sail php --version
sail php script.php

# Composer commands
sail composer require laravel/sanctum

# Artisan commands
sail artisan queue:work

# Node/NPM commands
sail node --version
sail npm run dev

# Yarn
sail yarn
```

## Testing

```shell
sail test
sail test --group orders
sail artisan test
```

## Xdebug Configuration

```ini
# .env
SAIL_XDEBUG_MODE=develop,debug,coverage
```

```ini
# php.ini (after sail:publish)
[xdebug]
xdebug.mode=${XDEBUG_MODE}
```

```shell
# Rebuild after changes
sail build --no-cache

# Debug Artisan commands
sail debug migrate
```

## Database Configuration

```ini
# MySQL
DB_HOST=mysql

# PostgreSQL
DB_HOST=pgsql

# Redis
REDIS_HOST=redis

# MongoDB
MONGODB_URI=mongodb://mongodb:27017
```

## Sharing Sites

```shell
sail share
sail share --subdomain=my-sail-site
```

```php
// bootstrap/app.php - Trust proxies
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustProxies(at: '*');
})
```

## PHP Versions

```yaml
# compose.yaml
build:
    context: ./vendor/laravel/sail/runtimes/8.4
    # or 8.3, 8.2, 8.1

image: sail-8.4/app
```

## MinIO (S3-compatible storage)

```ini
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=sail
AWS_SECRET_ACCESS_KEY=password
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=local
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
AWS_URL=http://localhost:9000/local
```

## Mailpit

```ini
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_ENCRYPTION=null
```

## Customization

```shell
sail artisan sail:publish
```

## Container Shell

```shell
sail shell
sail root-shell
sail tinker
```

## Dusk Testing

```yaml
# compose.yaml - uncomment selenium
selenium:
    image: 'selenium/standalone-chrome'
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    volumes:
        - '/dev/shm:/dev/shm'
    networks:
        - sail
```

```shell
sail dusk
```
