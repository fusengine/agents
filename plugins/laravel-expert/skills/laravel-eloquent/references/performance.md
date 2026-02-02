---
name: performance
description: Eloquent performance optimization, chunking, cursors
when-to-use: Large datasets, slow queries, memory issues
keywords: performance, N+1, chunk, cursor, lazy, cache, index
---

# Performance Optimization

## Decision Tree

```
Performance issue?
├── Too many queries → N+1 (use eager loading)
├── Memory exhaustion → chunk() or cursor()
├── Slow queries → Indexes, select columns
├── Repeated queries → Caching
└── Large inserts → Batch operations
```

## N+1 Prevention

| Problem | Solution |
|---------|----------|
| Loop queries | `with('relation')` |
| Dev detection | `preventLazyLoading()` |
| Count queries | Use `withCount()` |

## Query Reduction

| Instead Of | Use |
|------------|-----|
| `first()` check + `find()` | `findOrFail()` |
| `count() > 0` | `exists()` |
| `get()->count()` | `count()` |
| `get()->first()` | `first()` |

## Column Selection

| Method | Benefit |
|--------|---------|
| `select(['id', 'name'])` | Less memory |
| `with('user:id,name')` | Relation columns |
| `addSelect()` | Add to existing |

## Chunking

| Method | Use When |
|--------|----------|
| `chunk(100, fn)` | Process in batches |
| `chunkById(100, fn)` | While modifying |
| `each(fn)` | Automatic chunking |
| `lazy(100)` | LazyCollection chunks |

## Cursor

| Method | Memory |
|--------|--------|
| `cursor()` | One model at a time |
| `lazy()` | Chunks as LazyCollection |

## Chunk vs Cursor

| Feature | Chunk | Cursor |
|---------|-------|--------|
| Memory | Batch size | 1 model |
| DB connections | 1 per chunk | 1 total |
| Modification safe | `chunkById` | No |
| Speed | Faster | Slower |

## Batch Operations

| Method | Fires Events? |
|--------|---------------|
| `create()` | Yes |
| `insert()` | No |
| `upsert()` | No |
| `update()` (query) | No |
| `delete()` (query) | No |

## Caching

| Level | Method |
|-------|--------|
| Query | `Cache::remember()` |
| Model | Custom accessor cache |
| Relation | Computed properties |

## Indexing

| Index Type | Use For |
|------------|---------|
| Primary | Always exists |
| Unique | Unique columns |
| Index | WHERE, ORDER BY |
| Composite | Multi-column queries |
| Foreign | Relationships |

## Query Monitoring

| Tool | Purpose |
|------|---------|
| `DB::listen()` | Log queries |
| Laravel Debugbar | Dev profiling |
| Laravel Telescope | Full monitoring |
| `toSql()` | Inspect query |

## Existence Checks

| Instead Of | Use |
|------------|-----|
| `Model::where(...)->first()` | `exists()` |
| `Model::where(...)->count()` | `exists()` |
| `Model::find($id)` (null check) | `findOr()` |

## Aggregate Queries

| Method | Query |
|--------|-------|
| `count()` | SELECT COUNT |
| `max('col')` | SELECT MAX |
| `min('col')` | SELECT MIN |
| `avg('col')` | SELECT AVG |
| `sum('col')` | SELECT SUM |

## Deferred Loading

| Method | Purpose |
|--------|---------|
| `loadMissing()` | Only if not loaded |
| `loadCount()` | Load count later |
| `loadMorph()` | Polymorphic |

## Best Practices

| DO | DON'T |
|----|-------|
| Eager load relationships | Lazy load in loops |
| Use `exists()` for checks | Load model to check |
| Select only needed columns | `SELECT *` |
| Index WHERE/ORDER columns | Ignore slow queries |
| Use chunking for large sets | Load all in memory |
| Batch inserts/updates | Single-row operations |

→ **See also**: [eager-loading.md](eager-loading.md)
