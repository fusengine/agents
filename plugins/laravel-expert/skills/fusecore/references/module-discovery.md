---
name: module-discovery
description: How FuseCore auto-discovers and loads modules
when-to-use: Understanding module loading, debugging discovery issues
keywords: discovery, auto-discovery, loading, scan, registration
priority: high
related: module-json.md, service-provider.md
---

# Module Discovery

## Overview

FuseCore automatically discovers and registers modules by scanning for `module.json` files in `/FuseCore/`.

## Discovery Flow

| Step | Action | Component |
|------|--------|-----------|
| 1 | App boots | `AppServiceProvider` |
| 2 | Delegates to FuseCore | `FuseCoreServiceProvider` |
| 3 | Scans modules | `ModuleDiscovery` |
| 4 | Parses config | `ModuleParser` |
| 5 | Caches results | `ModuleCacheManager` |
| 6 | Registers providers | Each module's ServiceProvider |
| 7 | Aggregates routes | `RouteAggregator` |

## ModuleDiscovery Service

### Responsibilities

| Task | Description |
|------|-------------|
| Scan directories | Find `module.json` in `/FuseCore/*/` |
| Parse configuration | Read module metadata |
| Resolve dependencies | Order by dependency graph |
| Cache results | Avoid rescanning |

### Caching

| Setting | Default | Purpose |
|---------|---------|---------|
| `cache.enabled` | true | Enable/disable cache |
| `cache.key` | `fusecore.modules` | Cache key |
| `cache.ttl` | 3600 (1 hour) | Cache lifetime |

### Cache Management

| Action | Command |
|--------|---------|
| Clear cache | `php artisan fusecore:cache-clear` |
| Refresh cache | `php artisan fusecore:cache-refresh` |
| View modules | `php artisan fusecore:list` |

## Discovery Criteria

A directory is recognized as a module if:

| Requirement | Check |
|-------------|-------|
| Has `module.json` | File exists |
| `enabled: true` | Module enabled |
| Valid JSON | Parseable config |
| Dependencies met | All deps available |

## Module Ordering

Modules are loaded in dependency order:

| Priority | Module Type |
|----------|-------------|
| 0 | Core (always first) |
| 1 | Modules with no dependencies |
| 2+ | Modules with dependencies (after deps) |

### Dependency Resolution

```
Dashboard → depends on → User → depends on → Core

Load order: Core → User → Dashboard
```

## Configuration

### fusecore.php

| Setting | Description |
|---------|-------------|
| `modules_path` | Path to modules (`base_path('FuseCore')`) |
| `namespace` | PSR-4 namespace (`FuseCore`) |
| `auto_discover` | Enable auto-discovery |
| `excluded` | Modules to skip |

## Debugging Discovery

### Module Not Loading

| Issue | Check |
|-------|-------|
| Missing `module.json` | File exists? |
| `enabled: false` | Set to true |
| Invalid JSON | Validate syntax |
| Missing dependency | Dependency enabled? |
| Cache stale | Clear cache |

### Check Discovery Status

| Command | Purpose |
|---------|---------|
| `php artisan fusecore:list` | Show all modules |
| `php artisan fusecore:status {name}` | Module details |
| `php artisan fusecore:debug` | Debug info |

## Performance

| Optimization | Benefit |
|--------------|---------|
| Caching | No rescan on every request |
| Lazy loading | Providers loaded on demand |
| Route caching | Combined with Laravel route cache |

## Best Practices

1. **Always clear cache** after adding modules
2. **Declare dependencies** for correct load order
3. **Check logs** for discovery errors
4. **Use enabled flag** to toggle modules

## Common Issues

| Issue | Solution |
|-------|----------|
| Module not found | Check directory name matches `module.json` name |
| Circular dependency | Refactor to break cycle |
| Provider not loading | Verify provider class path |
| Routes missing | Check `api.php` exists |

## Related References

- [module-json.md](module-json.md) - Configuration format
- [service-provider.md](service-provider.md) - Provider setup
