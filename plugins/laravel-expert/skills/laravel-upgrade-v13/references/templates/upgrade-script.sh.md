---
name: upgrade-script.sh
description: Bash script to automate the Laravel 12 → 13 upgrade
when-to-use: Run as one-shot upgrade (test in feature branch first)
keywords: bash, automation, ci, upgrade
---

# upgrade-laravel-13.sh

Save as `bin/upgrade-laravel-13.sh`, run from project root with `bash bin/upgrade-laravel-13.sh`.

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Laravel 12 → 13 Upgrade Script"
echo "==================================="

# Phase 1: Pre-checks
echo "→ Phase 1: Pre-checks"
PHP_VERSION=$(php -r "echo PHP_VERSION;")
if [[ "$(printf '%s\n' "8.3.0" "$PHP_VERSION" | sort -V | head -1)" != "8.3.0" ]]; then
  echo "❌ PHP 8.3+ required (current: $PHP_VERSION)"
  exit 1
fi
echo "✓ PHP $PHP_VERSION OK"

# Phase 2: Branch
echo "→ Phase 2: Feature branch"
git checkout -b feat/laravel-13-upgrade 2>/dev/null || git checkout feat/laravel-13-upgrade
echo "✓ On branch feat/laravel-13-upgrade"

# Phase 3: Composer bump
echo "→ Phase 3: Composer bump"
composer require \
  laravel/framework:^13.0 \
  laravel/tinker:^3.0 \
  laravel/serializable-closure:^2.0 \
  --no-update

composer require --dev \
  phpunit/phpunit:^12.0 \
  pestphp/pest:^4.0 \
  --no-update

composer update --with-all-dependencies
echo "✓ Dependencies bumped"

# Phase 4: Cache prefix preservation
echo "→ Phase 4: Cache prefix preservation"
if [ -f .env ]; then
  grep -q "^CACHE_PREFIX=" .env || echo "CACHE_PREFIX=laravel_cache_" >> .env
  grep -q "^REDIS_PREFIX=" .env || echo "REDIS_PREFIX=laravel_database_" >> .env
  echo "✓ Cache prefixes set in .env"
fi

# Phase 5: Clear caches
echo "→ Phase 5: Clear caches"
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
echo "✓ Caches cleared"

# Phase 6: Verification
echo "→ Phase 6: Verification"
php artisan about | grep -E "Laravel|PHP" || true
echo "✓ Verify Laravel 13.x reported above"

# Phase 7: Tests
echo "→ Phase 7: Tests"
if [ -f vendor/bin/pest ]; then
  vendor/bin/pest --bail
elif [ -f vendor/bin/phpunit ]; then
  vendor/bin/phpunit --stop-on-failure
fi

echo ""
echo "✅ Upgrade complete!"
echo ""
echo "Next steps:"
echo "1. Review breaking changes manually (validateCsrfTokens → validateOrigin)"
echo "2. Commit: /fuse-commit-pro:commit"
echo "3. Open PR: gh pr create"
```

## Manual steps after script

The script automates ~70% of the upgrade. Manual steps still required:

1. Rename `validateCsrfTokens` → `validateOrigin` in `bootstrap/app.php`
2. Review Eloquent service providers for `new Model()` in `register()`
3. Audit third-party packages for L13 compatibility
4. Optional: migrate Eloquent/Queue properties to PHP Attributes
