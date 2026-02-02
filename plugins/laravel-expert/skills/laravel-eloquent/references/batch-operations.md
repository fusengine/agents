---
name: batch-operations
description: Bulk insert, update, upsert operations
when-to-use: Inserting/updating many records efficiently
keywords: insert, upsert, update, delete, mass, bulk, batch
---

# Batch Operations

## Decision Tree

```
Bulk operation needed?
├── Insert many → insert() or Model::insert()
├── Insert or update → upsert()
├── Update many → where()->update()
├── Delete many → where()->delete()
├── Need events → Loop with save()
└── Very large → chunk + batch
```

## Insert Methods

| Method | Events | Returns |
|--------|--------|---------|
| `Model::create([])` | ✅ Yes | Model |
| `Model::insert([])` | ❌ No | Boolean |
| `DB::table()->insert([])` | ❌ No | Boolean |
| `Model::insertOrIgnore([])` | ❌ No | Int (inserted) |

## Upsert

| Feature | Description |
|---------|-------------|
| `upsert($values, $uniqueBy, $update)` | Insert or update |
| `$values` | Array of records |
| `$uniqueBy` | Columns for match |
| `$update` | Columns to update on conflict |

## Mass Update

| Method | Events |
|--------|--------|
| `Model::where()->update([])` | ❌ No |
| `$model->update([])` | ✅ Yes |
| `Model::query()->update([])` | ❌ No |

## Mass Delete

| Method | Events |
|--------|--------|
| `Model::where()->delete()` | ❌ No |
| `$model->delete()` | ✅ Yes |
| `Model::destroy([1, 2, 3])` | ✅ Yes |

## Events Comparison

| Operation | Model Events | Observer |
|-----------|--------------|----------|
| `create()` | ✅ | ✅ |
| `insert()` | ❌ | ❌ |
| `upsert()` | ❌ | ❌ |
| `where()->update()` | ❌ | ❌ |
| `$model->save()` | ✅ | ✅ |
| `where()->delete()` | ❌ | ❌ |
| `destroy()` | ✅ | ✅ |

## Insert Chunks

| Scenario | Approach |
|----------|----------|
| < 1000 records | Single insert |
| > 1000 records | Chunk into batches |
| MySQL limit | ~65535 placeholders |

## Upsert Parameters

| Parameter | Purpose |
|-----------|---------|
| `$values` | Records to insert/update |
| `$uniqueBy` | Unique constraint columns |
| `$update` | Columns to update (optional, defaults to all) |

## Timestamps in Batch

| Method | created_at | updated_at |
|--------|------------|------------|
| `insert()` | ❌ Manual | ❌ Manual |
| `upsert()` | ❌ Manual | ❌ Manual |
| `create()` | ✅ Auto | ✅ Auto |

## Increment/Decrement

| Method | Purpose |
|--------|---------|
| `increment('views')` | Add 1 |
| `increment('views', 5)` | Add N |
| `decrement('stock')` | Subtract 1 |
| `incrementQuietly()` | Without events |

## First or Create

| Method | If Not Found |
|--------|--------------|
| `firstOrCreate([search], [values])` | Create with both |
| `firstOrNew([search], [values])` | New instance (not saved) |
| `updateOrCreate([search], [values])` | Update or create |

## Best Practices

| DO | DON'T |
|----|-------|
| Use insert() for bulk | Loop with create() |
| Chunk large inserts | Hit placeholder limits |
| Add timestamps manually | Expect auto timestamps |
| Use upsert for sync | Delete + insert |

## When Events Matter

| Need Events? | Use |
|--------------|-----|
| Audit logging | Loop with save() |
| Cache invalidation | Observer or after batch |
| Notifications | Queue after batch |
| No side effects | Batch operations |

→ **See also**: [performance.md](performance.md) for chunking
