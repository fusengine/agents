---
name: module-json
description: The module.json configuration file format
when-to-use: Creating modules, configuring module metadata
keywords: module.json, configuration, manifest, metadata
priority: high
related: module-discovery.md, creating-module.md
---

# module.json Configuration

## Overview

Every FuseCore module requires a `module.json` file at its root. This manifest defines module metadata and dependencies.

## Basic Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Module identifier (PascalCase) |
| `version` | string | ✅ | Semantic version |
| `description` | string | ❌ | Human-readable description |
| `enabled` | boolean | ✅ | Toggle module on/off |
| `isCore` | boolean | ❌ | Core infrastructure module |
| `dependencies` | array | ❌ | Required modules |

## Field Details

### name

| Rule | Example |
|------|---------|
| PascalCase | `BlogPost`, `UserProfile` |
| Match folder | `/FuseCore/BlogPost/` |
| Unique | No duplicates |

### version

| Format | Example |
|--------|---------|
| Semantic versioning | `1.0.0`, `2.1.3` |
| Major.Minor.Patch | Breaking.Feature.Fix |

### enabled

| Value | Effect |
|-------|--------|
| `true` | Module is loaded |
| `false` | Module is skipped |

Useful for:
- Disabling broken modules
- Environment-specific modules
- Feature flags

### isCore

| Value | Meaning |
|-------|---------|
| `true` | Infrastructure module (Core, User) |
| `false` | Feature module (Blog, Dashboard) |

Core modules:
- Load first
- Provide shared services
- Are not optional

### dependencies

| Format | Effect |
|--------|--------|
| `["User"]` | Loads after User module |
| `["User", "Blog"]` | Loads after both |
| `[]` | No dependencies |

Dependencies must:
- Exist
- Be enabled
- Not be circular

## Examples

### Core Module

```json
{
    "name": "Core",
    "version": "1.0.0",
    "description": "FuseCore infrastructure",
    "enabled": true,
    "isCore": true,
    "dependencies": []
}
```

### Feature Module

```json
{
    "name": "Blog",
    "version": "1.0.0",
    "description": "Blog management module",
    "enabled": true,
    "isCore": false,
    "dependencies": ["User"]
}
```

### Module with Multiple Dependencies

```json
{
    "name": "Analytics",
    "version": "1.0.0",
    "description": "Analytics and reporting",
    "enabled": true,
    "isCore": false,
    "dependencies": ["User", "Dashboard"]
}
```

## Validation

`module.json` must be:

| Check | Requirement |
|-------|-------------|
| Valid JSON | Parseable syntax |
| Required fields | name, version, enabled |
| Name match | Matches folder name |
| Deps exist | All dependencies available |

## Optional Extended Fields

| Field | Type | Purpose |
|-------|------|---------|
| `author` | string | Module author |
| `license` | string | License type |
| `keywords` | array | Search keywords |
| `config` | object | Module-specific config |

### Extended Example

```json
{
    "name": "Payment",
    "version": "2.0.0",
    "description": "Payment processing with Stripe",
    "author": "FuseCore Team",
    "license": "MIT",
    "keywords": ["payment", "stripe", "checkout"],
    "enabled": true,
    "isCore": false,
    "dependencies": ["User"],
    "config": {
        "gateway": "stripe",
        "sandbox": true
    }
}
```

## Best Practices

1. **Match folder name** exactly with `name` field
2. **Use semantic versioning** for version tracking
3. **Declare all dependencies** for correct load order
4. **Meaningful descriptions** for documentation
5. **Start enabled:true** - disable only if needed

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Folder `blog/` but name `Blog` | Use consistent casing |
| Missing dependency | Add to dependencies array |
| Circular deps | Refactor module structure |
| Invalid JSON | Validate with JSON linter |

## Related Templates

| Template | Purpose |
|----------|---------|
| [module.json.md](templates/module.json.md) | Complete examples |

## Related References

- [module-discovery.md](module-discovery.md) - How discovery works
- [creating-module.md](creating-module.md) - Step-by-step guide
