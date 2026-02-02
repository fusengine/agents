---
name: pagination
description: Query result pagination methods
when-to-use: Displaying large datasets, API responses
keywords: paginate, simplePaginate, cursorPaginate, perPage, links
---

# Pagination

## Decision Tree

```
Paginating results?
├── Need total count → paginate()
├── No total needed → simplePaginate()
├── Large offset performance → cursorPaginate()
├── Manual pagination → forPage()
└── API response → Resource::collection()
```

## Pagination Methods

| Method | Total Count | Performance | Use Case |
|--------|-------------|-------------|----------|
| `paginate()` | ✅ Yes | Normal | Standard UI |
| `simplePaginate()` | ❌ No | Better | Next/Prev only |
| `cursorPaginate()` | ❌ No | Best | Large datasets, infinite scroll |

## Method Parameters

| Parameter | Default | Purpose |
|-----------|---------|---------|
| `$perPage` | 15 | Items per page |
| `$columns` | ['*'] | Columns to select |
| `$pageName` | 'page' | Query parameter name |
| `$page` | null | Force specific page |

## Cursor Pagination

| Advantage | When |
|-----------|------|
| No OFFSET | Large page numbers |
| Consistent results | Real-time data |
| Better performance | Millions of rows |

| Limitation | Why |
|------------|-----|
| No page numbers | Cursor-based navigation |
| Sequential only | Can't jump to page 5 |
| Needs ordered column | For cursor position |

## Paginator Methods

| Method | Returns |
|--------|---------|
| `items()` | Current page items |
| `currentPage()` | Page number |
| `perPage()` | Items per page |
| `total()` | Total items (paginate only) |
| `lastPage()` | Last page (paginate only) |
| `hasMorePages()` | Boolean |
| `nextPageUrl()` | URL string |
| `previousPageUrl()` | URL string |
| `url($page)` | URL for specific page |

## Blade Rendering

| Method | Output |
|--------|--------|
| `links()` | Default pagination links |
| `links('view')` | Custom view |
| `onEachSide(2)` | Links on each side |

## API Response Format

| Key | Content |
|-----|---------|
| `data` | Items array |
| `links` | first, last, prev, next URLs |
| `meta` | current_page, per_page, total, etc. |

## Customizing

| Property | Location |
|----------|----------|
| `$perPage` | Model property |
| `Paginator::useBootstrap()` | AppServiceProvider |
| `Paginator::defaultView()` | Custom default view |

## Query String

| Method | Purpose |
|--------|---------|
| `appends(['sort' => 'name'])` | Add query params |
| `withQueryString()` | Keep all params |
| `fragment('users')` | Add URL fragment |

## Best Practices

| DO | DON'T |
|----|-------|
| Use cursorPaginate for large offsets | OFFSET on millions of rows |
| Use simplePaginate when no total needed | Always use paginate() |
| Set reasonable perPage | 1000 items per page |
| Index ORDER BY columns | Random ordering |

→ **For API Resources**: See [resources.md](resources.md)
