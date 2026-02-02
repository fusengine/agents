---
name: soft-deletes
description: Soft deleting, restoring, pruning models
when-to-use: Recoverable deletes, data retention
keywords: softDeletes, trash, restore, forceDelete, withTrashed, onlyTrashed
---

# Soft Deletes

## Decision Tree

```
Deleting models?
├── Permanent delete → delete() or forceDelete()
├── Recoverable → SoftDeletes trait
├── Need to query trashed → withTrashed()
├── Only trashed → onlyTrashed()
└── Auto-cleanup old → Pruning
```

## Setup

| Step | Implementation |
|------|---------------|
| Migration | `$table->softDeletes()` |
| Model | `use SoftDeletes` trait |
| Column | `deleted_at` (nullable timestamp) |

## Querying

| Method | Includes |
|--------|----------|
| Default query | Non-trashed only |
| `withTrashed()` | All records |
| `onlyTrashed()` | Trashed only |

## Checking Status

| Method | Returns |
|--------|---------|
| `$model->trashed()` | bool |
| `deleted_at` | timestamp or null |

## Deleting

| Method | Effect |
|--------|--------|
| `$model->delete()` | Sets deleted_at |
| `$model->forceDelete()` | Permanent delete |

## Restoring

| Method | Effect |
|--------|--------|
| `$model->restore()` | Clears deleted_at |
| `Model::onlyTrashed()->restore()` | Restore all trashed |

## Query Scopes

| Scope | SQL |
|-------|-----|
| Default | `WHERE deleted_at IS NULL` |
| `withTrashed()` | No deleted_at clause |
| `onlyTrashed()` | `WHERE deleted_at IS NOT NULL` |

## Events

| Event | When |
|-------|------|
| `trashed` | After soft delete |
| `restoring` | Before restore |
| `restored` | After restore |
| `forceDeleting` | Before permanent |
| `forceDeleted` | After permanent |

## Relationships

| Setting | Behavior |
|---------|----------|
| Default | Exclude trashed in relations |
| `withTrashed()` on relation | Include trashed |

## Unique Constraints

| Problem | Solution |
|---------|----------|
| Soft deleted conflicts | Partial unique index |
| Migration | `whereNull('deleted_at')` |

## Pruning

| Purpose | Auto-delete old records |
|---------|-------------------------|
| Trait | `Prunable` or `MassPrunable` |
| Method | `prunable()` query |
| Schedule | `$schedule->command('model:prune')` |

## Pruning Types

| Trait | Use |
|-------|-----|
| `Prunable` | Events fired per model |
| `MassPrunable` | Bulk delete (faster, no events) |

## Prunable Query

| Method | Returns |
|--------|---------|
| `prunable()` | Query for deletable records |
| `pruning()` | Optional before-delete hook |

## Schedule Pruning

| Command | Options |
|---------|---------|
| `model:prune` | All prunable models |
| `--model=User` | Specific model |
| `--chunk=1000` | Batch size |

## Best Practices

| DO | DON'T |
|----|-------|
| Use for data retention | Soft delete everything |
| Set up pruning schedule | Keep forever |
| Consider cascade | Forget related data |
| Test restore flow | Assume it works |

→ **Complete examples**: See [ModelBasic.php.md](templates/ModelBasic.php.md)
