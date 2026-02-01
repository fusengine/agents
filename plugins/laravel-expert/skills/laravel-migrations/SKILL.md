---
name: laravel-migrations
description: Create database migrations with schema builder, indexes, foreign keys, and seeders. Use when designing database schema, creating tables, or modifying columns.
versions:
  laravel: "12.46"
  php: "8.5"
user-invocable: false
references: references/database.md, references/migrations.md, references/seeding.md, references/queries.md, references/mongodb.md
related-skills: laravel-eloquent
---

# Laravel Migrations

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing migration patterns
2. **fuse-ai-pilot:research-expert** - Verify Schema Builder docs via Context7
3. **mcp__context7__query-docs** - Check column types and constraints

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Migrations are version control for database schema.

---

## Critical Rules

1. **Always define down()** for rollback capability
2. **Use foreignId()** with constrained() for relationships
3. **Add indexes** on frequently queried columns
4. **Use factories** for test data

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Database** | [database.md](references/database.md) | DB basics |
| **Migrations** | [migrations.md](references/migrations.md) | Schema changes |
| **Seeding** | [seeding.md](references/seeding.md) | Test data |
| **Queries** | [queries.md](references/queries.md) | Query builder |
| **MongoDB** | [mongodb.md](references/mongodb.md) | NoSQL |

---

## Quick Reference

```php
// Migration
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->timestamps();
    $table->index(['status', 'published_at']);
});
```

```bash
php artisan make:migration create_posts_table
php artisan migrate
php artisan migrate:fresh --seed
```
