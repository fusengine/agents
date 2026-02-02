---
name: accessors-mutators
description: Accessors, mutators, and the Attribute class
when-to-use: Transforming attribute values on get/set
keywords: accessor, mutator, Attribute, get, set, computed
---

# Accessors & Mutators

## Decision Tree

```
Transforming attribute?
├── On retrieval → Accessor (get)
├── On storage → Mutator (set)
├── Both → Attribute with get/set
├── Computed (no column) → Accessor + $appends
└── Caching needed? → shouldCache()
```

## Attribute Class (Laravel 9+)

| Method | Purpose |
|--------|---------|
| `Attribute::get(fn)` | Accessor only |
| `Attribute::set(fn)` | Mutator only |
| `Attribute::make(get: fn, set: fn)` | Both |
| `->shouldCache()` | Cache computed value |
| `->withoutObjectCaching()` | Disable caching |

## Accessor Signatures

| Parameter | Value |
|-----------|-------|
| `$value` | Raw database value |
| `$attributes` | All raw attributes |

## Mutator Signatures

| Return | Stored |
|--------|--------|
| Single value | To attribute column |
| Array | To multiple columns |

## Computed Attributes

| Step | Purpose |
|------|---------|
| Define accessor | Create `Attribute::get()` |
| Add to `$appends` | Include in serialization |
| No database column | Computed at runtime |

## Multi-column Mutators

| Feature | Return |
|---------|--------|
| Value Object | Array of columns |
| Address example | `['line1' => ..., 'line2' => ...]` |

## Attribute Caching

| Method | Behavior |
|--------|----------|
| `shouldCache()` | Cache until model saved |
| `withoutObjectCaching()` | Recalculate each access |
| Default | Cached per request |

## Legacy Syntax

| Type | Method Name |
|------|-------------|
| Accessor | `getFirstNameAttribute($value)` |
| Mutator | `setFirstNameAttribute($value)` |
| Still works | But Attribute class preferred |

## Common Patterns

| Pattern | Use |
|---------|-----|
| Name formatting | `ucfirst()`, `strtolower()` |
| JSON decode/encode | For non-cast columns |
| Hashing passwords | Set-only mutator |
| Full name | Computed from first + last |
| Money formatting | Display vs storage |

## Serialization

| Property | Purpose |
|----------|---------|
| `$appends` | Add to toArray/toJson |
| `$hidden` | Exclude attributes |
| `$visible` | Whitelist attributes |

## Accessor vs Cast

| Use Accessor | Use Cast |
|--------------|----------|
| Complex transformation | Simple type conversion |
| Computed values | Array/JSON |
| Conditional logic | Encrypted |
| Multiple columns | Enum |

## Best Practices

| DO | DON'T |
|----|-------|
| Use Attribute class | Query in accessors |
| Cache expensive computations | Modify unrelated attributes |
| Keep transformations simple | Business logic in mutators |
| Use casts for types | Duplicate cast functionality |

→ **Complete examples**: See [ModelCasts.php.md](templates/ModelCasts.php.md)
