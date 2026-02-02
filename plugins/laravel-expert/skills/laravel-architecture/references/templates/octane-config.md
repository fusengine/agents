---
name: octane-config
description: Laravel Octane configuration from official Laravel 12 docs
keywords: octane, swoole, frankenphp, roadrunner, performance
source: https://laravel.com/docs/12.x/octane
---

# Laravel Octane Configuration

## Installation

```shell
composer require laravel/octane
php artisan octane:install
```

## FrankenPHP via Sail

```shell
./vendor/bin/sail up
./vendor/bin/sail composer require laravel/octane
./vendor/bin/sail artisan octane:install --server=frankenphp
```

```yaml
# docker-compose.yml
services:
  laravel.test:
    environment:
      SUPERVISOR_PHP_COMMAND: "/usr/bin/php -d variables_order=EGPCS /var/www/html/artisan octane:start --server=frankenphp --host=0.0.0.0 --admin-port=2019 --port='${APP_PORT:-80}'"
      XDG_CONFIG_HOME: /var/www/html/config
      XDG_DATA_HOME: /var/www/html/data
```

## RoadRunner via Sail

```shell
./vendor/bin/sail up
./vendor/bin/sail composer require laravel/octane spiral/roadrunner-cli spiral/roadrunner-http
./vendor/bin/sail shell
./vendor/bin/rr get-binary
```

```yaml
services:
  laravel.test:
    environment:
      SUPERVISOR_PHP_COMMAND: "/usr/bin/php -d variables_order=EGPCS /var/www/html/artisan octane:start --server=roadrunner --host=0.0.0.0 --rpc-port=6001 --port='${APP_PORT:-80}'"
```

## Swoole Installation

```shell
pecl install swoole
# or openswoole
pecl install openswoole
```

## Basic Commands

```shell
php artisan octane:start
php artisan octane:start --watch
php artisan octane:start --workers=4
php artisan octane:start --workers=4 --task-workers=6
php artisan octane:start --max-requests=250
php artisan octane:reload
php artisan octane:stop
php artisan octane:status
```

## Concurrent Tasks (Swoole)

```php
use App\Models\User;
use App\Models\Server;
use Laravel\Octane\Facades\Octane;

[$users, $servers] = Octane::concurrently([
    fn () => User::all(),
    fn () => Server::all(),
]);
```

## Ticks/Intervals (Swoole)

```php
Octane::tick('simple-ticker', fn () => ray('Ticking...'))
    ->seconds(10);

Octane::tick('simple-ticker', fn () => ray('Ticking...'))
    ->seconds(10)
    ->immediate();
```

## Octane Cache (Swoole)

```php
Cache::store('octane')->put('framework', 'Laravel', 30);
```

## Swoole Tables

```php
// config/octane.php
'tables' => [
    'example:1000' => [
        'name' => 'string:1000',
        'votes' => 'int',
    ],
],
```

```php
use Laravel\Octane\Facades\Octane;

Octane::table('example')->set('uuid', [
    'name' => 'Nuno Maduro',
    'votes' => 1000,
]);

return Octane::table('example')->get('uuid');
```

## Safe Singleton Pattern

```php
use App\Service;
use Illuminate\Container\Container;

// Bad - stale container
$this->app->singleton(Service::class, function ($app) {
    return new Service($app);
});

// Good - always fresh
$this->app->singleton(Service::class, function () {
    return new Service(fn () => Container::getInstance());
});
```

## Safe Request Pattern

```php
// Bad - stale request
$this->app->singleton(Service::class, function ($app) {
    return new Service($app['request']);
});

// Good - closure resolver
$this->app->singleton(Service::class, function ($app) {
    return new Service(fn () => $app['request']);
});

// Best - pass at runtime
$service->method($request->input('name'));
```

## Supervisor Configuration

```ini
[program:octane]
process_name=%(program_name)s_%(process_num)02d
command=php /home/forge/example.com/artisan octane:start --server=frankenphp --host=127.0.0.1 --port=8000
autostart=true
autorestart=true
user=forge
redirect_stderr=true
stdout_logfile=/home/forge/example.com/storage/logs/octane.log
stopwaitsecs=3600
```

## HTTPS Configuration

```php
// config/octane.php
'https' => env('OCTANE_HTTPS', false),
```
