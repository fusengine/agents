---
name: laravel-scout
description: Implement full-text search with Laravel Scout. Use when adding search to Eloquent models with Meilisearch, Algolia, or database driver.
versions:
  laravel: "13.0"
  scout: "10.12"
  php: "8.3"
user-invocable: false
references: references/searchable.md, references/drivers.md
related-skills: laravel-architecture, laravel-eloquent
---

# Laravel Scout

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

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

### Vector search natif pgvector
Pour la recherche sémantique (embeddings) sur PostgreSQL, Laravel 13 expose `Schema::ensureVectorExtensionExists()` et `whereVectorSimilarTo()` via la skill dédiée [[laravel-vector-search]]. Scout reste pertinent pour le full-text (Meilisearch/Algolia) ; pour la similarité vectorielle, utiliser pgvector directement sans driver Scout.

```php
// Hybride : Scout pour full-text, pgvector pour similarité
$keyword = Post::search($query)->get();
$semantic = Post::whereVectorSimilarTo('embedding', $embedding, limit: 10)->get();
```
