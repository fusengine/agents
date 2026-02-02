---
name: transactions
description: Database transactions for data integrity
when-to-use: Multiple related operations, atomic updates
keywords: transaction, commit, rollback, beginTransaction, deadlock
---

# Database Transactions

## Decision Tree

```
Need atomic operations?
├── Simple closure → DB::transaction(fn)
├── Manual control → beginTransaction/commit/rollback
├── Nested transactions → Savepoints (automatic)
├── Retry on deadlock → DB::transaction(fn, attempts)
└── After commit actions → afterCommit()
```

## Transaction Methods

| Method | Purpose |
|--------|---------|
| `DB::transaction(fn)` | Auto commit/rollback |
| `DB::transaction(fn, 5)` | With retry attempts |
| `DB::beginTransaction()` | Manual start |
| `DB::commit()` | Manual commit |
| `DB::rollBack()` | Manual rollback |
| `DB::transactionLevel()` | Current nesting level |

## When to Use

| Scenario | Transaction Needed? |
|----------|---------------------|
| Create user + profile | ✅ YES |
| Update single record | ❌ NO |
| Transfer money between accounts | ✅ YES |
| Batch insert | ✅ YES |
| Read-only queries | ❌ NO |
| Create order + items + payment | ✅ YES |

## Closure Transaction

| Feature | Behavior |
|---------|----------|
| Exception thrown | Auto rollback |
| Closure completes | Auto commit |
| Return value | Returned from transaction() |

## Manual Transaction

| Step | Method |
|------|--------|
| 1. Start | `DB::beginTransaction()` |
| 2. Operations | Your queries |
| 3a. Success | `DB::commit()` |
| 3b. Failure | `DB::rollBack()` |

## Deadlock Handling

| Approach | Implementation |
|----------|---------------|
| Auto retry | `DB::transaction(fn, 5)` |
| Second parameter | Number of attempts |
| Between retries | Small delay |

## After Commit Actions

| Method | When Runs |
|--------|-----------|
| `afterCommit(fn)` | After transaction commits |
| Use for | Notifications, events, cache |
| On rollback | Callback discarded |

## Nested Transactions

| Feature | Behavior |
|---------|----------|
| Automatic | Uses savepoints |
| Inner rollback | Rolls to savepoint |
| Outer rollback | Rolls everything |

## Model Events in Transactions

| Interface | Purpose |
|-----------|---------|
| `ShouldHandleEventsAfterCommit` | Observer waits for commit |
| `$afterCommit = true` | Property on observer |
| Without | Events fire immediately |

## Best Practices

| DO | DON'T |
|----|-------|
| Keep transactions short | Long-running operations |
| Use closure style | Forget to commit/rollback |
| Handle exceptions | Ignore deadlocks |
| Use afterCommit for side effects | Send emails in transaction |

→ **See also**: [events-observers.md](events-observers.md) for afterCommit
