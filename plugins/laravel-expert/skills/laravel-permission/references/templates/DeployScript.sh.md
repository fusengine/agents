---
name: DeployScript
description: Deployment script with permission cache management
keywords: deploy, script, cache, ci, cd
---

# Deployment Script

Deployment script with permission cache management.

## File: deploy.sh

```bash
#!/bin/bash

set -e

echo "=== Starting deployment ==="

# Configuration
APP_DIR="/var/www/app"
BRANCH="${1:-main}"

cd "$APP_DIR"

# Put application in maintenance mode
php artisan down --render="errors::503" --retry=60

# Pull latest code
echo "Pulling latest code..."
git fetch origin
git reset --hard "origin/$BRANCH"

# Install/update dependencies
echo "Installing dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Clear all caches
echo "Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# IMPORTANT: Reset permission cache
echo "Resetting permission cache..."
php artisan permission:cache-reset

# Rebuild caches for production
echo "Rebuilding caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Show current permission state (for logging)
echo "Current permissions:"
php artisan permission:show

# Restart queue workers
echo "Restarting queue workers..."
php artisan queue:restart

# Bring application back online
php artisan up

echo "=== Deployment complete ==="
```

## GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.5'

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run migrations
        run: php artisan migrate --force

      - name: Reset permission cache
        run: php artisan permission:cache-reset

      - name: Verify permissions
        run: php artisan permission:show
```

## Docker Entrypoint

```bash
#!/bin/bash
# docker-entrypoint.sh

set -e

# Wait for database
echo "Waiting for database..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Reset permission cache
echo "Resetting permission cache..."
php artisan permission:cache-reset

# Cache configuration
php artisan config:cache
php artisan route:cache

# Start PHP-FPM
exec php-fpm
```

## Laravel Forge Post-Deployment Hook

```bash
# Forge Deployment Script
cd /home/forge/example.com

git pull origin $FORGE_SITE_BRANCH

$FORGE_COMPOSER install --no-dev --no-interaction --prefer-dist --optimize-autoloader

( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service $FORGE_PHP_FPM reload ) 9>/tmp/fpmlock

if [ -f artisan ]; then
    $FORGE_PHP artisan migrate --force
    $FORGE_PHP artisan permission:cache-reset
    $FORGE_PHP artisan config:cache
    $FORGE_PHP artisan route:cache
    $FORGE_PHP artisan view:cache
    $FORGE_PHP artisan queue:restart
fi
```
