---
name: deployment
description: Laravel production deployment checklist
when-to-use: Deploying to production, server setup
keywords: laravel, php, deployment, production, server
priority: medium
related: configuration.md, octane.md
---

# Deployment

## Overview

Deploying Laravel requires proper server configuration, environment setup, and optimization. Follow this checklist for production deployments.

## Server Requirements

- PHP >= 8.2
- Required extensions: Ctype, cURL, DOM, Fileinfo, Filter, Hash, Mbstring, OpenSSL, PCRE, PDO, Session, Tokenizer, XML
- Composer
- Web server (Nginx/Apache)

## Deployment Steps

### 1. Clone/Upload Code

```shell
git clone repo /var/www/app
cd /var/www/app
composer install --optimize-autoloader --no-dev
```

### 2. Environment Setup

```shell
cp .env.example .env
php artisan key:generate
# Edit .env with production values
```

### 3. Directory Permissions

```shell
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 4. Database Migration

```shell
php artisan migrate --force
```

### 5. Optimize

```shell
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
# Or all at once:
php artisan optimize
```

## Nginx Config

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Environment Variables

| Variable | Production Value |
|----------|-----------------|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | Your domain |
| `LOG_LEVEL` | `error` |

## Queue Workers

```shell
# Supervisor config for queue workers
php artisan queue:work --sleep=3 --tries=3
```

## Scheduler

Add cron entry:

```
* * * * * cd /var/www/app && php artisan schedule:run >> /dev/null 2>&1
```

## Zero-Downtime Deploy

Use tools like Envoyer, Deployer, or GitHub Actions.

## Best Practices

1. **Never debug in production** - `APP_DEBUG=false`
2. **Cache everything** - Config, routes, views
3. **Use queue workers** - For background jobs
4. **Monitor logs** - Set up log rotation
5. **SSL** - Always use HTTPS

## Related References

- [configuration.md](configuration.md) - Environment config
- [octane.md](octane.md) - High-performance deployment
