---
name: cache
description: Permission cache management for performance optimization
when-to-use: Optimizing permission lookups, debugging cache issues
keywords: cache, performance, reset, clear, redis
priority: medium
related: spatie-permission.md
---

# Permission Cache

## Overview

Spatie caches permissions for performance. This cache stores all roles, permissions, and their relationships, avoiding database queries on every authorization check.

## Why Caching Matters

| Without Cache | With Cache |
|---------------|------------|
| DB query per `can()` check | Single query, then memory |
| Slow on high-traffic pages | Fast lookups |
| Database load increases | Minimal DB impact |

## Cache Configuration

### Key Settings

| Setting | Purpose | Default |
|---------|---------|---------|
| `expiration_time` | How long to keep cache | 24 hours |
| `key` | Cache key prefix | `spatie.permission.cache` |
| `store` | Which cache driver | `default` |

### Cache Stores

| Store | Use Case |
|-------|----------|
| `default` | Single server |
| `redis` | Multi-server / high performance |
| `memcached` | Alternative to Redis |
| `file` | Development only |

## Automatic Invalidation

Cache is **automatically cleared** when using Spatie's methods:

| Action | Auto-Clear |
|--------|------------|
| Role created/updated/deleted | Yes |
| Permission created/updated/deleted | Yes |
| Permission assigned/removed from role | Yes |
| Permission assigned/removed from user | Yes |
| Role assigned/removed from user | Yes |

## Manual Invalidation Required

Cache is **NOT automatically cleared** for:

| Action | Solution |
|--------|----------|
| Direct DB queries | Call `forgetCachedPermissions()` |
| Raw SQL migrations | Run `permission:cache-reset` |
| DB imports | Run `permission:cache-reset` |

## Debugging Cache Issues

### Symptoms

| Symptom | Likely Cause |
|---------|--------------|
| New permission not working | Stale cache |
| Removed permission still works | Stale cache |
| Works after artisan call | Was stale cache |

### Diagnosis Steps

1. Clear cache manually
2. Test again
3. If fixed, identify what bypassed auto-clear

## Performance Optimization

### Cache Driver Selection

| Environment | Recommended Store |
|-------------|-------------------|
| Local development | File or array |
| Single production server | Redis or file |
| Load-balanced servers | Redis (shared) |

### TTL Considerations

| Permission Change Frequency | Recommended TTL |
|-----------------------------|-----------------|
| Rarely (seeder only) | 24 hours |
| Occasionally (admin panel) | 1 hour |
| Frequently (self-service) | 15 minutes |

## Deployment Checklist

| Step | Command/Action |
|------|----------------|
| After deploy | `php artisan permission:cache-reset` |
| After seeder | Automatic (if using Spatie methods) |
| After raw SQL | `php artisan permission:cache-reset` |

## Testing Considerations

| Context | Recommendation |
|---------|----------------|
| Test setUp | Clear cache before each test |
| Parallel tests | Use separate cache keys |
| CI/CD | Reset cache after migrations |

## Best Practices

1. **Use Redis** for multi-server deployments
2. **Set appropriate TTL** based on change frequency
3. **Always clear after deploy** as part of deployment script
4. **Avoid raw SQL** for permission changes
5. **Monitor cache hits** in production

## Related Templates

| Template | Purpose |
|----------|---------|
| [CacheConfig.php.md](templates/CacheConfig.php.md) | Cache configuration examples |
| [DeployScript.sh.md](templates/DeployScript.sh.md) | Deployment cache reset |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [artisan-commands.md](artisan-commands.md) - Cache reset command
