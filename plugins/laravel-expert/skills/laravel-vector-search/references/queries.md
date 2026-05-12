---
name: vector-queries
description: Vector similarity query builder methods
---

# Vector Query Methods

## whereVectorSimilarTo

```php
$documents = Document::query()
    ->whereVectorSimilarTo('embedding', $queryEmbedding, minSimilarity: 0.4)
    ->limit(10)
    ->get();
```

| Argument | Description |
|----------|-------------|
| Column | Vector column name |
| Vector or string | Pre-computed `array<float>` OR raw text (auto-embeds via AI SDK) |
| `minSimilarity` | Threshold (0.0 - 1.0); higher = stricter |

By default, results are ORDERED by similarity descending. Disable with `order: false`:

```php
Document::query()
    ->whereVectorSimilarTo('embedding', $vec, minSimilarity: 0.4, order: false)
    ->orderBy('created_at', 'desc')
    ->limit(10)
    ->get();
```

## selectVectorDistance

Expose the distance as a column:

```php
$documents = Document::query()
    ->select('*')
    ->selectVectorDistance('embedding', $queryEmbedding, as: 'distance')
    ->orderBy('distance')
    ->limit(10)
    ->get();

$documents->first()->distance; // 0.234
```

## whereVectorDistanceLessThan

Filter by raw distance (not similarity):

```php
Document::query()
    ->whereVectorDistanceLessThan('embedding', $queryEmbedding, maxDistance: 0.3)
    ->limit(10)
    ->get();
```

Distance and similarity are inverses: `similarity = 1 - distance`. Threshold conversion:

| Similarity | Distance |
|------------|----------|
| 0.9 | 0.1 |
| 0.7 | 0.3 |
| 0.5 | 0.5 |
| 0.3 | 0.7 |

## orderByVectorDistance

Explicit ordering when not using `whereVectorSimilarTo`:

```php
Document::query()
    ->select('*')
    ->selectVectorDistance('embedding', $queryEmbedding, as: 'distance')
    ->whereVectorDistanceLessThan('embedding', $queryEmbedding, maxDistance: 0.3)
    ->orderByVectorDistance('embedding', $queryEmbedding)
    ->limit(10)
    ->get();
```

## Hybrid filtering

Combine vector with classic SQL:

```php
Document::query()
    ->whereVectorSimilarTo('embedding', $vec, minSimilarity: 0.4)
    ->where('user_id', auth()->id())
    ->where('published_at', '<', now())
    ->where('language', 'en')
    ->limit(10)
    ->get();
```

The index supports pre-filtering; SQL conditions narrow the candidate set before similarity ranking.

## Raw query builder (no Eloquent)

```php
DB::table('documents')
    ->whereVectorSimilarTo('embedding', $vec, minSimilarity: 0.4)
    ->limit(10)
    ->get();
```

## Notes

- These methods are only available on `pgsql` connections
- Without an HNSW/IVFFlat index, queries fall back to sequential scan - acceptable up to ~1k rows
