---
name: models
description: Eloquent model basics, conventions, configuration
when-to-use: Creating models, understanding conventions
keywords: model, fillable, guarded, table, primaryKey, timestamps
---

# Eloquent Models

## Decision Tree

```
Creating a new model?
├── Has custom table name? → Set $table property
├── Has non-standard primary key? → Set $primaryKey, $keyType
├── No timestamps? → Set $timestamps = false
└── Mass assignment?
    ├── Whitelist fields → Use $fillable
    └── Blacklist fields → Use $guarded
```

## Model Configuration

| Property | Default | Purpose |
|----------|---------|---------|
| `$table` | Plural snake_case | Table name |
| `$primaryKey` | `id` | Primary key column |
| `$keyType` | `int` | Primary key type |
| `$incrementing` | `true` | Auto-increment |
| `$timestamps` | `true` | created_at/updated_at |
| `$dateFormat` | `Y-m-d H:i:s` | Date storage format |
| `$connection` | default | Database connection |

## Mass Assignment

| Approach | Property | Use When |
|----------|----------|----------|
| **Whitelist** | `$fillable` | Few fields allowed |
| **Blacklist** | `$guarded` | Most fields allowed |
| **Unguard** | `Model::unguard()` | Seeders/factories only |

## Attribute Defaults

| Method | Purpose |
|--------|---------|
| `$attributes` | Default values |
| `$casts` | Type casting |
| `$hidden` | Exclude from serialization |
| `$visible` | Include in serialization |
| `$appends` | Add computed attributes |

## Model Methods

| Method | Purpose |
|--------|---------|
| `getTable()` | Get table name |
| `getKeyName()` | Get primary key name |
| `getKey()` | Get primary key value |
| `getFillable()` | Get fillable fields |
| `getConnection()` | Get database connection |

## Artisan Commands

| Command | Purpose |
|---------|---------|
| `php artisan make:model Post` | Create model |
| `php artisan make:model Post -m` | With migration |
| `php artisan make:model Post -mf` | With migration + factory |
| `php artisan make:model Post -mfs` | With migration + factory + seeder |
| `php artisan make:model Post --all` | With all (migration, factory, seeder, policy, controller, resource) |

## UUID/ULID Primary Keys

| Trait | Key Type |
|-------|----------|
| `HasUuids` | UUID v4 |
| `HasUlids` | ULID (sortable) |

## Best Practices

| DO | DON'T |
|----|-------|
| Use `$fillable` for explicit control | Use `$guarded = []` in production |
| Set `$casts` for type safety | Store business logic in models |
| Use model events for side effects | Query in accessors/mutators |
| Keep models slim (< 200 lines) | Mix concerns |

→ **Complete examples**: See [ModelBasic.php.md](templates/ModelBasic.php.md)
