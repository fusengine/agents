---
name: CacheConfig
description: Permission cache configuration examples
keywords: cache, config, redis, performance
---

# Cache Configuration

Permission cache configuration examples for different environments.

## File: config/permission.php (Cache Section)

### Default Configuration

```php
<?php

return [
    // ... other config

    'cache' => [
        /*
         * By default all permissions are cached for 24 hours.
         * When permissions or roles are updated, cache is automatically flushed.
         */
        'expiration_time' => \DateInterval::createFromDateString('24 hours'),

        /*
         * The cache key used to store all permissions.
         */
        'key' => 'spatie.permission.cache',

        /*
         * You may optionally indicate a specific cache driver to use.
         * Using 'default' will use the `default` set in config/cache.php.
         */
        'store' => 'default',
    ],
];
```

### Redis Configuration (Recommended for Production)

```php
<?php

return [
    'cache' => [
        'expiration_time' => \DateInterval::createFromDateString('1 hour'),
        'key' => 'spatie.permission.cache',
        'store' => 'redis',
    ],
];
```

### Multi-Server Configuration

```php
<?php

return [
    'cache' => [
        // Shorter TTL for distributed systems
        'expiration_time' => \DateInterval::createFromDateString('15 minutes'),

        // Unique key per environment
        'key' => 'spatie.permission.cache.' . env('APP_ENV'),

        // Shared Redis instance
        'store' => 'redis',
    ],
];
```

### Development Configuration

```php
<?php

return [
    'cache' => [
        // Very short TTL for development
        'expiration_time' => \DateInterval::createFromDateString('1 minute'),
        'key' => 'spatie.permission.cache',
        'store' => 'array', // No persistence, cleared on each request
    ],
];
```

### Testing Configuration

```php
<?php

// config/permission.php in testing environment
return [
    'cache' => [
        'expiration_time' => \DateInterval::createFromDateString('0 seconds'),
        'key' => 'spatie.permission.cache.testing',
        'store' => 'array',
    ],
];
```

## Environment-Based Configuration

```php
<?php

// config/permission.php
return [
    'cache' => [
        'expiration_time' => \DateInterval::createFromDateString(
            env('PERMISSION_CACHE_TTL', '24 hours')
        ),
        'key' => env('PERMISSION_CACHE_KEY', 'spatie.permission.cache'),
        'store' => env('PERMISSION_CACHE_STORE', 'default'),
    ],
];
```

```env
# .env.production
PERMISSION_CACHE_TTL="1 hour"
PERMISSION_CACHE_STORE=redis

# .env.local
PERMISSION_CACHE_TTL="5 minutes"
PERMISSION_CACHE_STORE=file

# .env.testing
PERMISSION_CACHE_TTL="0 seconds"
PERMISSION_CACHE_STORE=array
```

## Redis Connection Setup

```php
<?php

// config/database.php
return [
    'redis' => [
        'client' => env('REDIS_CLIENT', 'phpredis'),

        'default' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
        ],

        // Separate connection for permissions
        'permissions' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_PERMISSIONS_DB', '1'),
        ],
    ],
];
```

```php
// config/cache.php
return [
    'stores' => [
        'permissions' => [
            'driver' => 'redis',
            'connection' => 'permissions',
            'lock_connection' => 'default',
        ],
    ],
];
```

```php
// config/permission.php
return [
    'cache' => [
        'store' => 'permissions', // Use dedicated Redis DB
    ],
];
```
