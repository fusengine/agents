---
name: performance
description: Performance optimization tips for Spatie Permission
when-to-use: Optimizing large applications, reducing database queries
keywords: performance, optimization, eager, loading, n+1, cache
priority: medium
related: cache.md, spatie-permission.md
---

# Performance Tips

## Overview

Spatie Permission is optimized for performance, but large applications need additional considerations for roles, permissions, and query optimization.

## Built-in Optimizations

| Feature | Description |
|---------|-------------|
| **Permission caching** | All permissions cached automatically |
| **Lazy loading prevention** | Relationships loaded efficiently |
| **Query optimization** | Minimal database queries |

## Common Performance Issues

### N+1 Queries

| Problem | Solution |
|---------|----------|
| Looping users + checking roles | Eager load with `with('roles')` |
| Checking permissions in loop | Use query scopes instead |
| Multiple permission checks | Cache or batch checks |

### Cache Misses

| Problem | Solution |
|---------|----------|
| Frequent cache clears | Batch permission changes |
| Direct DB modifications | Always use Spatie methods |
| Missing cache driver | Use Redis for production |

## Optimization Strategies

### Eager Loading

| Scenario | Method |
|----------|--------|
| User list with roles | `User::with('roles')->get()` |
| User with all permissions | `User::with('permissions', 'roles.permissions')` |
| Paginated with roles | `User::with('roles')->paginate()` |

### Query Scopes vs Loop Checks

| Bad (N+1) | Good (Single Query) |
|-----------|---------------------|
| Loop + `hasRole()` | `User::role('admin')->get()` |
| Filter after fetch | `User::permission('edit')->get()` |

### Batch Operations

| Operation | Optimization |
|-----------|--------------|
| Create multiple permissions | Single transaction |
| Assign multiple roles | `assignRole(['a', 'b'])` not loop |
| Sync permissions | `syncPermissions()` once |

## Caching Recommendations

### Cache Driver Selection

| Environment | Driver | Reason |
|-------------|--------|--------|
| Development | File/Array | Simple, no setup |
| Production (single) | Redis/File | Persistent |
| Production (cluster) | Redis | Shared cache |

### Cache TTL

| Change Frequency | TTL |
|------------------|-----|
| Rarely (seeder only) | 24 hours |
| Occasionally (admin) | 1 hour |
| Frequently (self-service) | 15 minutes |

## Database Indexing

### Important Indexes

| Table | Column(s) | Purpose |
|-------|-----------|---------|
| `model_has_roles` | `model_id, model_type` | Role lookups |
| `model_has_permissions` | `model_id, model_type` | Permission lookups |
| `roles` | `name, guard_name` | Role queries |
| `permissions` | `name, guard_name` | Permission queries |

## Reducing Permission Checks

### Check Once, Use Result

| Pattern | Description |
|---------|-------------|
| Store in variable | `$canEdit = $user->can('edit')` |
| Pass to views | Share computed permissions |
| Middleware check | Don't re-check in controller |

### Use Proper Layer

| Check Location | Use For |
|----------------|---------|
| Middleware | Route protection |
| Policy | Resource-level |
| Blade | UI display |

Avoid checking same permission at multiple layers.

## Monitoring

### Identify Issues

| Tool | Purpose |
|------|---------|
| Laravel Telescope | Query analysis |
| Debugbar | N+1 detection |
| `DB::enableQueryLog()` | Manual logging |

### Metrics to Watch

| Metric | Target |
|--------|--------|
| Permission queries per request | < 5 |
| Cache hit ratio | > 95% |
| Middleware execution time | < 10ms |

## Best Practices

1. **Always eager load** - `with('roles')` when listing users
2. **Use Redis** - For production caching
3. **Batch operations** - Don't loop for assignments
4. **Index pivot tables** - Essential for large user bases
5. **Check once** - Store result, don't re-check
6. **Profile regularly** - Monitor query counts

## Related References

- [cache.md](cache.md) - Cache configuration
- [query-scopes.md](query-scopes.md) - Efficient queries
