---
name: eager-loading
description: Eager loading, N+1 prevention, lazy loading
when-to-use: Optimizing relationship queries, preventing N+1
keywords: with, load, eager, lazy, N+1, withCount, loadMissing
---

# Eager Loading

## Decision Tree

```
Loading relationships?
├── Know upfront → with() (eager)
├── Conditionally after → load() (lazy eager)
├── Already loaded? → loadMissing()
├── Need count only → withCount()
└── Preventing N+1?
    ├── Development → preventLazyLoading()
    └── Production → Log violations
```

## N+1 Problem

| Pattern | Queries |
|---------|---------|
| ❌ `Book::all()` + foreach `$book->author` | 1 + N |
| ✅ `Book::with('author')->get()` | 2 |

## Eager Loading Methods

| Method | When |
|--------|------|
| `with('relation')` | At query time |
| `with(['rel1', 'rel2'])` | Multiple |
| `with('author:id,name')` | Select columns |
| `with('posts.comments')` | Nested |

## Constrained Eager Loading

| Method | Purpose |
|--------|---------|
| `with(['posts' => fn($q) => $q->where('active', true)])` | Filter |
| `with(['posts' => fn($q) => $q->orderBy('created_at')])` | Order |
| `with(['posts' => fn($q) => $q->limit(3)])` | Limit |

## Lazy Eager Loading

| Method | Purpose |
|--------|---------|
| `$books->load('author')` | Load after retrieval |
| `$books->load(['author', 'publisher'])` | Multiple |
| `$books->loadMissing('author')` | Only if not loaded |

## Default Eager Loading

| Property | Purpose |
|----------|---------|
| `protected $with = ['author']` | Always load |
| `without('author')` | Override default |
| `withOnly('publisher')` | Replace defaults |

## Counting Relations

| Method | Result Column |
|--------|---------------|
| `withCount('posts')` | `posts_count` |
| `withCount(['posts', 'comments'])` | Both counts |
| `withCount(['posts' => fn($q) => $q->where('draft', false)])` | Filtered count |

## Aggregates

| Method | Purpose |
|--------|---------|
| `withSum('products', 'price')` | Sum of column |
| `withMin('products', 'price')` | Minimum |
| `withMax('products', 'price')` | Maximum |
| `withAvg('products', 'rating')` | Average |
| `withExists('posts')` | Boolean exists |

## Morphed Loading

| Method | Purpose |
|--------|---------|
| `loadMorph('parentable', [...])` | Load by type |
| Type-specific relations | Different relations per type |

## Preventing N+1

| Method | Scope |
|--------|-------|
| `Model::preventLazyLoading()` | All models |
| `Model::preventLazyLoading(!app()->isProduction())` | Dev only |
| `Model::handleLazyLoadingViolationUsing(fn)` | Custom handler |

## Relationship Existence

| Method | Use |
|--------|-----|
| `has('posts')` | Has any |
| `has('posts', '>=', 3)` | Has at least 3 |
| `doesntHave('posts')` | Has none |
| `whereHas('posts', fn)` | Has with constraint |

## Performance Tips

| DO | DON'T |
|----|-------|
| Use `with()` for known relations | Lazy load in loops |
| Use `withCount()` for counts | Load full relation for count |
| Select only needed columns | `with('user')` without columns |
| Use `loadMissing()` | Double-load relations |

→ **Complete examples**: See [EagerLoadingExamples.php.md](templates/EagerLoadingExamples.php.md)
