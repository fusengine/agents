---
name: aggregates
description: Aggregate functions and relationship counting
when-to-use: Counting, summing, averaging without loading models
keywords: count, sum, avg, min, max, withCount, withSum, withAvg, exists
---

# Aggregate Functions

## Decision Tree

```
Need aggregate data?
├── Single value → count(), sum(), avg(), min(), max()
├── With models → withCount(), withSum(), withAvg()
├── Check existence → exists(), doesntExist()
├── Relationship count → withCount('relation')
└── Conditional count → withCount(['relation' => fn])
```

## Basic Aggregates

| Method | Returns |
|--------|---------|
| `count()` | Total row count |
| `count('column')` | Non-null count |
| `sum('column')` | Sum of values |
| `avg('column')` | Average value |
| `min('column')` | Minimum value |
| `max('column')` | Maximum value |

## Existence Checks

| Method | Returns |
|--------|---------|
| `exists()` | Boolean (any match) |
| `doesntExist()` | Boolean (no match) |

## Relationship Aggregates

| Method | Result Attribute |
|--------|------------------|
| `withCount('posts')` | `posts_count` |
| `withSum('orders', 'total')` | `orders_sum_total` |
| `withAvg('reviews', 'rating')` | `reviews_avg_rating` |
| `withMin('products', 'price')` | `products_min_price` |
| `withMax('products', 'price')` | `products_max_price` |
| `withExists('posts')` | `posts_exists` (boolean) |

## Multiple Aggregates

| Syntax | Result |
|--------|--------|
| `withCount(['posts', 'comments'])` | Both counts |
| `withCount('posts')->withSum('orders', 'total')` | Mixed |

## Conditional Aggregates

| Syntax | Purpose |
|--------|---------|
| `withCount(['posts' => fn($q) => $q->published()])` | Filtered count |
| Alias | `withCount(['posts as published_count' => fn])` |

## Lazy Loading Aggregates

| Method | When |
|--------|------|
| `loadCount('posts')` | After initial query |
| `loadSum('orders', 'total')` | After initial query |
| `loadAvg('reviews', 'rating')` | After initial query |

## Relationship Existence

| Method | SQL |
|--------|-----|
| `has('posts')` | WHERE EXISTS |
| `has('posts', '>=', 5)` | Having count >= 5 |
| `doesntHave('posts')` | WHERE NOT EXISTS |
| `whereHas('posts', fn)` | EXISTS with constraints |
| `whereDoesntHave('posts', fn)` | NOT EXISTS with constraints |

## Nested Existence

| Syntax | Checks |
|--------|--------|
| `has('posts.comments')` | Posts with comments |
| `whereHas('posts.comments', fn)` | With constraints |

## Or Conditions

| Method | Logic |
|--------|-------|
| `orHas('posts')` | OR EXISTS |
| `orWhereHas('posts', fn)` | OR EXISTS with constraints |
| `orDoesntHave('posts')` | OR NOT EXISTS |

## Performance Tips

| Instead Of | Use |
|------------|-----|
| `get()->count()` | `count()` |
| Load models for count | `withCount()` |
| Multiple queries | Single with aggregates |
| `first()` to check | `exists()` |

## Best Practices

| DO | DON'T |
|----|-------|
| Use `exists()` for checks | Load model to check |
| Use `withCount()` in listings | N+1 count queries |
| Index aggregated columns | Aggregate unindexed |
| Alias conditional counts | Confuse naming |

→ **See also**: [eager-loading.md](eager-loading.md) for has/whereHas details
