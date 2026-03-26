---
name: cache-formats
description: JSON schema for ai-pilot cache types, file locations, TTL, eviction, size limits
when-to-use: When reading, writing, or managing ai-pilot cache files in .claude/cache/
keywords: cache, JSON, schema, TTL, eviction, LRU
priority: medium
---

# Cache Formats - ai-pilot

## File Locations

| File | Content |
|------|---------|
| `.claude/cache/lessons.json` | Learned patterns and corrections |
| `.claude/cache/docs.json` | Documentation lookups |
| `.claude/cache/tests.json` | Test results and coverage |
| `.claude/cache/explore.json` | Codebase exploration results |

## Common Envelope Schema

```json
{
  "version": "1.0",
  "type": "lessons | docs | tests | explore",
  "entries": [{
    "key": "unique-identifier",
    "value": {},
    "created_at": "2026-01-15T10:30:00Z",
    "accessed_at": "2026-03-20T14:00:00Z",
    "ttl_days": 30
  }]
}
```

## Value Schemas Per Type

**lessons**: `pattern` (string), `context` (string), `correction` (string), `source` (string: user-feedback | auto-detected)

**docs**: `library` (string), `topic` (string), `content` (string), `url` (string)

**tests**: `file` (string), `passed` (number), `failed` (number), `coverage` (number)

**explore**: `path` (string), `summary` (string), `files` (string[]), `dependencies` (string[])

## TTL Policy

| Setting | Value |
|---------|-------|
| Default TTL | 30 days from creation |
| TTL check | On read access |
| Expired entries | Removed on next read |
| Manual invalidation | Delete entry by key |

## Eviction Strategy (LRU)

| Setting | Value |
|---------|-------|
| Algorithm | LRU by `accessed_at` |
| Max entries per type | 50 |
| Eviction trigger | On write when entries >= 50 |
| Eviction count | Remove oldest 10 per cycle |

## Size Limits

| Type | Max Entries | Max Value Size |
|------|-------------|----------------|
| lessons | 50 | 2 KB |
| docs | 50 | 5 KB |
| tests | 50 | 1 KB |
| explore | 50 | 3 KB |
