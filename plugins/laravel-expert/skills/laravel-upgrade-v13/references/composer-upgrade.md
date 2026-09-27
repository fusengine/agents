---
name: composer-upgrade
description: Composer commands and dependency bumps for L12 → L13
when-to-use: Phase 2 (dependency bump) of upgrade
keywords: composer, php, phpunit, pest, dependencies
---

# Composer Upgrade Commands

## Step 1: PHP version check

```bash
php -v   # must be 8.3.0 or higher
```

If on PHP 8.2: upgrade PHP first via brew/apt/Docker.

## Step 2: Bump framework + test deps

```bash
composer require \
  laravel/framework:^13.0 \
  laravel/tinker:^3.0 \
  --no-update

composer require --dev \
  phpunit/phpunit:^12.0 \
  pestphp/pest:^4.0 \
  --no-update

# Using Laravel Boost? The official guide also bumps it:
# composer require --dev laravel/boost:^2.0 --no-update

composer update --with-all-dependencies
```

> These are the minimums from the official upgrade guide. Once on PHP 8.4+, you may go further to `phpunit/phpunit:^13.0` + `pestphp/pest:^5.0` (+ `pestphp/pest-plugin-laravel:^5.0`, which requires Laravel `^13.23`).

## Step 3: Bump optional packages

Update these if used (latest majors, all L13-compatible):

```bash
composer require \
  laravel/cashier:^16.0 \
  laravel/sanctum:^4.0 \
  laravel/scout:^11.0 \
  laravel/socialite:^5.0 \
  laravel/horizon:^5.0 \
  laravel/telescope:^5.0
```

## Step 4: Beanstalkd users

```bash
composer require pda/pheanstalk:^8.0
```

Required: L13 supports `pda/pheanstalk` `^7.0 || ^8.0` only (5.x dropped).

## Step 5: Serializable closures

```bash
composer require laravel/serializable-closure:^2.0
```

v1 is no longer supported.

## Step 6: Install Laravel AI SDK (optional)

```bash
composer require laravel/ai:^1.0
```

## Step 7: Verify

```bash
php artisan about        # confirms Laravel 13.x, PHP 8.3+
composer outdated        # check for stale deps
vendor/bin/phpunit       # or vendor/bin/pest
```

## Troubleshooting

| Error | Fix |
|-------|-----|
| `composer/semver` conflict | `composer update composer/semver` |
| `nunomaduro/collision` | Bump to `^8.6` (L13 skeleton) |
| `spatie/laravel-permission` | Bump to `^8.0` (supports L12/L13, PHP 8.3+) |
| `barryvdh/laravel-debugbar` | Bump to `^4.0` |
