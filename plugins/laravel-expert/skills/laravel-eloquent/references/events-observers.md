---
name: events-observers
description: Model events, observers, lifecycle hooks
when-to-use: Side effects on model changes, audit logging
keywords: observer, event, creating, created, updating, updated, deleting, deleted
---

# Events & Observers

## Decision Tree

```
Reacting to model changes?
├── Simple inline → Closure in booted()
├── Multiple handlers → Observer class
├── Custom event class → $dispatchesEvents
├── Queue handling → ShouldQueue on observer
└── Mute temporarily → withoutEvents()
```

## Model Events

| Event | Fires |
|-------|-------|
| `retrieved` | After fetched from DB |
| `creating` | Before insert |
| `created` | After insert |
| `updating` | Before update |
| `updated` | After update |
| `saving` | Before insert/update |
| `saved` | After insert/update |
| `deleting` | Before delete |
| `deleted` | After delete |
| `trashed` | After soft delete |
| `restoring` | Before restore |
| `restored` | After restore |
| `forceDeleting` | Before force delete |
| `forceDeleted` | After force delete |
| `replicating` | When replicated |

## Event Timing

| Phase | Events |
|-------|--------|
| Create | `saving` → `creating` → DB → `created` → `saved` |
| Update | `saving` → `updating` → DB → `updated` → `saved` |
| Delete | `deleting` → DB → `deleted` (→ `trashed` if soft) |

## Observer Methods

| Method | Receives |
|--------|----------|
| `created(User $user)` | Model instance |
| `updated(User $user)` | Model instance |
| `deleted(User $user)` | Model instance |

## Observer Registration

| Method | Location |
|--------|----------|
| `#[ObservedBy(UserObserver::class)]` | Model attribute |
| `User::observe(UserObserver::class)` | Service provider |

## Inline Events

| Location | Method |
|----------|--------|
| `booted()` method | `static::created(fn($model) => ...)` |
| Traits | Share event logic |

## Custom Event Classes

| Property | Purpose |
|----------|---------|
| `$dispatchesEvents` | Map events to classes |
| Event receives model | Constructor injection |

## Queued Observers

| Feature | Implementation |
|---------|---------------|
| `ShouldQueue` interface | On observer class |
| `afterCommit` | After DB transaction |
| `$afterCommit = true` | Property on observer |

## Muting Events

| Method | Scope |
|--------|-------|
| `Model::withoutEvents(fn)` | Single model type |
| `$model->saveQuietly()` | Single save |
| `$model->deleteQuietly()` | Single delete |
| `$model->restoreQuietly()` | Single restore |

## Preventing Actions

| In Event | Return |
|----------|--------|
| `creating`, `updating`, etc. | `return false` |
| Stops the operation | Before events only |

## Mass Operations

| Operation | Events? |
|-----------|---------|
| `Model::create()` | ✅ Yes |
| `Model::insert()` | ❌ No |
| `Model::update()` (query) | ❌ No |
| `Model::delete()` (query) | ❌ No |
| `$model->save()` | ✅ Yes |
| `$model->delete()` | ✅ Yes |

## Common Patterns

| Pattern | Use |
|---------|-----|
| Audit logging | `created`, `updated`, `deleted` |
| Cache invalidation | `saved`, `deleted` |
| Sending notifications | `created` |
| Cascading deletes | `deleting` |
| Slug generation | `creating` |

→ **Complete examples**: See [Observer.php.md](templates/Observer.php.md)
