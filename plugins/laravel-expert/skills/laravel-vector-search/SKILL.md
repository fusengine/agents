---
name: laravel-vector-search
description: Use when implementing semantic / vector search in Laravel 13 with PostgreSQL + pgvector. Covers schema setup, embedding workflow, and the new query builder methods (`whereVectorSimilarTo`, `selectVectorDistance`, etc.).
versions:
  laravel: "13.0"
  php: "8.3"
  postgresql: "16+"
  pgvector: "0.7+"
user-invocable: true
references: references/pgvector-setup.md, references/embeddings-workflow.md, references/queries.md, references/templates/Document-model.php.md, references/templates/VectorSearchService.php.md
related-skills: laravel-ai-sdk, laravel-eloquent, laravel-migrations
---

# Laravel 13 Vector Search (pgvector)

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Check current DB driver (must be PostgreSQL) and existing embedding columns
2. **fuse-ai-pilot:research-expert** - Verify pgvector extension version and HNSW vs IVFFlat tradeoffs
3. **mcp__context7__query-docs** - Pull `laravel.com/docs/13.x/search` + `queries` examples

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **PostgreSQL only** | Requires `pgvector` extension; not available on MySQL/SQLite |
| **Schema helper** | `Schema::ensureVectorExtensionExists()` enables the extension |
| **Query builder** | `whereVectorSimilarTo()`, `selectVectorDistance()`, `whereVectorDistanceLessThan()`, `orderByVectorDistance()` |
| **Auto-embedding** | Pass a raw string and Laravel generates the embedding via AI SDK |
| **Cosine similarity** | Default distance; threshold via `minSimilarity` (0.0 - 1.0) |

---

## Critical Rules

1. **Use PostgreSQL** - Vector clauses ONLY work on `pgsql` connections - no fallback to MySQL/SQLite
2. **Create an HNSW index** - Without an index, queries do full table scans; > 10k rows means seconds-to-minutes latency
3. **Match dimensions exactly** - Insert-time and query-time embedding models MUST share the same dimensions
4. **Cache embeddings** - Regenerating embeddings on every request is the #1 cost driver; persist them
5. **Lock the embedding model** - Changing the model invalidates ALL stored embeddings; treat the model as a schema field

---

## Architecture

```
database/migrations/
└── XXXX_create_documents_table.php   # Schema::ensureVectorExtensionExists(), vector(1536) col, HNSW index

app/Models/
└── Document.php                       # casts embedding to array, uses whereVectorSimilarTo

app/Ai/Services/
└── VectorSearchService.php            # encapsulates query + threshold logic
```

→ See [Document-model.php.md](references/templates/Document-model.php.md) for full example

---

## Reference Guide

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **pgvector setup** | [pgvector-setup.md](references/pgvector-setup.md) | Migrations + index creation |
| **Embedding workflow** | [embeddings-workflow.md](references/embeddings-workflow.md) | Generating + persisting vectors |
| **Query patterns** | [queries.md](references/queries.md) | `whereVectorSimilarTo` and friends |

### Templates

| Template | When to Use |
|----------|-------------|
| [Document-model.php.md](references/templates/Document-model.php.md) | Eloquent model with vector column |
| [VectorSearchService.php.md](references/templates/VectorSearchService.php.md) | Reusable service |

---

## Quick Reference

### Migration

```php
Schema::ensureVectorExtensionExists();

Schema::create('documents', function (Blueprint $table) {
    $table->id();
    $table->text('content');
    $table->vector('embedding', 1536);
    $table->timestamps();
    $table->vectorIndex('embedding', algorithm: 'hnsw');
});
```

### Query

```php
$documents = Document::query()
    ->whereVectorSimilarTo('embedding', 'best wineries in Napa Valley', minSimilarity: 0.4)
    ->limit(10)
    ->get();
```

→ See [VectorSearchService.php.md](references/templates/VectorSearchService.php.md) for complete example

---

## Best Practices

### DO
- Create an HNSW index BEFORE inserting bulk data - faster total ingest
- Store the embedding model name alongside the vector to detect drift
- Use `minSimilarity` 0.3-0.5 as a starting threshold; tune empirically
- Combine vector search with classic `where()` for hybrid filtering (date ranges, tenancy)

### DON'T
- Don't run vector queries without an index past a few thousand rows - it becomes a full table scan
- Don't mix embedding models in the same column - distances become meaningless
- Don't generate query embeddings inside loops - batch them via `Embeddings::for([...])`
- Don't store embeddings as JSON strings - use the native `vector` column type for index support
