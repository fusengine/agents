---
name: migrations
description: Database migrations in FuseCore modules
when-to-use: Creating module tables, managing database schema
keywords: migration, database, schema, table, eloquent
priority: medium
related: traits.md, module-structure.md
---

# Module Migrations

## Overview

Each FuseCore module manages its own database migrations. Migrations are loaded automatically via the `HasModule` trait.

## Migration Location

```
FuseCore/{Module}/Database/Migrations/
```

## Naming Convention

| Format | Example |
|--------|---------|
| `{date}_{number}_create_{table}_table.php` | `2026_01_15_000001_create_posts_table.php` |
| `{date}_{number}_add_{column}_to_{table}_table.php` | `2026_01_16_000001_add_slug_to_posts_table.php` |

## Loading Migrations

### Via Trait

```php
class BlogServiceProvider extends ServiceProvider
{
    use HasModule;

    public function boot(): void
    {
        $this->loadModuleMigrations();
    }
}
```

### What Happens

| Step | Action |
|------|--------|
| 1 | `loadModuleMigrations()` called |
| 2 | Scans `/Database/Migrations/` |
| 3 | Registers with Laravel migrator |
| 4 | Runs with `php artisan migrate` |

## Migration Best Practices

### 1. Module Prefix

Prefix tables with module name for clarity:

| Module | Table |
|--------|-------|
| Blog | `blog_posts` |
| Blog | `blog_categories` |
| Shop | `shop_products` |
| Shop | `shop_orders` |

### 2. Foreign Keys

Reference tables from other modules carefully:

| Approach | When |
|----------|------|
| `users` table | Always safe (Core) |
| Other module table | Check dependency |

### 3. Down Method

Always implement rollback:

| Method | Purpose |
|--------|---------|
| `up()` | Apply changes |
| `down()` | Reverse changes |

## Artisan Commands

### Standard Laravel

| Command | Purpose |
|---------|---------|
| `php artisan migrate` | Run all migrations |
| `php artisan migrate:rollback` | Rollback last batch |
| `php artisan migrate:fresh` | Drop all, re-run |

### FuseCore Commands

| Command | Purpose |
|---------|---------|
| `php artisan fusecore:make-migration` | Create module migration |

## Seeders

### Location

```
FuseCore/{Module}/Database/Seeders/
```

### Naming

| Convention | Example |
|------------|---------|
| `{Resource}Seeder` | `PostSeeder` |
| `{Module}DatabaseSeeder` | `BlogDatabaseSeeder` |

### Running

```bash
php artisan db:seed --class=FuseCore\\Blog\\Database\\Seeders\\PostSeeder
```

## Factories

### Location

```
FuseCore/{Module}/Database/Factories/
```

### Usage

| Command | Purpose |
|---------|---------|
| Define factory | `Factory` class |
| Use in tests | `Post::factory()->create()` |
| Use in seeders | `Post::factory()->count(10)->create()` |

## Module Dependencies

### Order of Migrations

Migrations run in order:

| Order | Migrations |
|-------|------------|
| 1 | Core (users, etc.) |
| 2 | User module |
| 3 | Dependent modules (by deps) |

### Cross-Module References

| Reference | Requirement |
|-----------|-------------|
| `users` table | Declare `User` as dependency |
| Other module table | Declare that module as dependency |

## Best Practices

1. **Prefix tables** with module name
2. **Always include down()** for rollback
3. **Declare dependencies** for cross-module foreign keys
4. **Use timestamps** by default
5. **Index foreign keys** for performance

## Common Patterns

### Standard Table

```php
Schema::create('blog_posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->foreignId('user_id')->constrained();
    $table->timestamps();
});
```

### Pivot Table

```php
Schema::create('blog_post_tag', function (Blueprint $table) {
    $table->foreignId('post_id')->constrained('blog_posts');
    $table->foreignId('tag_id')->constrained('blog_tags');
    $table->primary(['post_id', 'tag_id']);
});
```

## Related Templates

| Template | Purpose |
|----------|---------|
| [Migration.php.md](templates/Migration.php.md) | Migration examples |

## Related References

- [traits.md](traits.md) - HasModuleDatabase trait
- [module-structure.md](module-structure.md) - Database location
