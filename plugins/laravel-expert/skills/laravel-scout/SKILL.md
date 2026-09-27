---
name: laravel-scout
description: Implement full-text search with Laravel Scout. Use when adding search to Eloquent models with Meilisearch, Algolia, or database driver.
versions:
  laravel: "13.0"
  scout: "11.8"
  php: "8.3"
user-invocable: false
references: references/searchable.md, references/drivers.md
related-skills: laravel-architecture, laravel-eloquent
---

<objective>
Covers Laravel Scout full-text search: the Searchable trait on Eloquent
models, driver selection (Meilisearch, Algolia, database, collection),
automatic index sync on model changes, the fluent search builder with
filters, toSearchableArray() field control, queued indexing, and bulk
import/reindexing. For semantic/vector similarity search on PostgreSQL, see
laravel-vector-search instead — Scout stays the tool for keyword/full-text
search.
</objective>

# Laravel Scout

## Agent Workflow (MANDATORY)

Before ANY implementation, spawn 3 agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing model and search patterns
2. **fuse-ai-pilot:research-expert** - Verify Scout docs via Context7
3. **mcp__context7__query-docs** - Check search and indexing patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Component | Purpose |
|-----------|---------|
| **Searchable Trait** | Makes Eloquent models searchable |
| **Search Drivers** | Meilisearch, Algolia, database, collection |
| **Indexing** | Automatic sync on model changes |
| **Search Builder** | Fluent search API with filters |

---

## Decision Guide: Search Driver

```
Which driver?
├── Production (recommended) → Meilisearch (fast, self-hosted, free)
├── Managed service → Algolia (hosted, pay per search)
├── Small dataset → database (no extra infra)
└── Testing → collection (in-memory, no engine)
```

---

## Quick Setup

```bash
composer require laravel/scout
composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle
```

```env
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey
```

```php
$results = Article::search('laravel tutorial')->paginate(15);
```

---

## Critical Rules

1. **Use `toSearchableArray()`** to control indexed data
2. **Queue indexing** with `SCOUT_QUEUE=true` for performance
3. **Use `searchable()`** for bulk import after setup
4. **Pause indexing** during seeders with `Scout::withoutSyncing()`

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Searchable trait, indexing, conditions | [searchable.md](references/searchable.md) |
| Driver setup, Meilisearch, Algolia | [drivers.md](references/drivers.md) |

---

## Best Practices

### DO
- Use Meilisearch for production (fast, typo-tolerant)
- Queue indexing operations (`SCOUT_QUEUE=true`)
- Limit indexed fields with `toSearchableArray()`

### DON'T
- Index sensitive data (passwords, tokens)
- Forget to import existing records after setup
- Use collection driver in production

---

## Laravel 13 Notes

### Native pgvector vector search
For semantic search (embeddings) on PostgreSQL, Laravel 13 exposes `Schema::ensureVectorExtensionExists()` and `whereVectorSimilarTo()`, covered by the dedicated [[laravel-vector-search]] skill. Scout remains relevant for full-text (Meilisearch/Algolia); for vector similarity, use pgvector directly without a Scout driver.

```php
// Hybrid: Scout for full-text, pgvector for similarity
$keyword = Post::search($query)->get();
$semantic = Post::whereVectorSimilarTo('embedding', $embedding, minSimilarity: 0.4)->limit(10)->get();
```

### Scout 11 (current 11.8, L13 compatible)
- `where()` accepts comparison operators: `User::search('*')->where('age', '>', 30)->get()`
- Custom engines: `$builder->wheres` becomes a list of `['field', 'operator', 'value']`
- Algolia uses `filters` (instead of `numericFilters`); `scout:delete-all-indexes` (Meilisearch) only deletes indexes with the `SCOUT_PREFIX` prefix
