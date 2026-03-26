---
name: drivers
description: Search driver setup for Meilisearch, Algolia, database, and custom engines
file-type: markdown
---

# Search Drivers

## Driver Comparison

| Driver | Best For | Typo Tolerant | Self-Hosted | Cost |
|--------|----------|---------------|-------------|------|
| **Meilisearch** | Production | Yes | Yes | Free |
| **Algolia** | Managed service | Yes | No | Paid |
| **Database** | Small datasets | No | N/A | Free |
| **Collection** | Testing | No | N/A | Free |

---

## Meilisearch (Recommended)

```bash
composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle
```

```env
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey
```

### Index Settings

```php
// config/scout.php
'meilisearch' => [
    'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
    'key' => env('MEILISEARCH_KEY'),
    'index-settings' => [
        Article::class => [
            'filterableAttributes' => ['category', 'author_id'],
            'sortableAttributes' => ['created_at', 'title'],
            'searchableAttributes' => ['title', 'body'],
        ],
    ],
],
```

```bash
php artisan scout:sync-index-settings
```

---

## Algolia

```bash
composer require algolia/algoliasearch-client-php
```

```env
SCOUT_DRIVER=algolia
ALGOLIA_APP_ID=your-app-id
ALGOLIA_SECRET=your-admin-key
```

---

## Database Driver

No extra dependencies. Uses `LIKE` queries. Best for prototyping.

```env
SCOUT_DRIVER=database
```

---

## Collection Driver (Testing)

```env
# .env.testing
SCOUT_DRIVER=collection
```

---

## Best Practices

### DO
- Use Meilisearch for most production apps
- Configure `filterableAttributes` for `where()` clauses
- Use collection driver in tests for speed

### DON'T
- Use database driver for large datasets
- Forget `scout:sync-index-settings` after config changes
- Store Meilisearch master key in client-side code
