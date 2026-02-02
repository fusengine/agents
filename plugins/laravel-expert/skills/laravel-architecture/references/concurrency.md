---
name: concurrency
description: Laravel Concurrency facade for parallel task execution
when-to-use: Consult when running multiple slow tasks in parallel, optimizing performance
keywords: concurrency, parallel, async, fork, process, defer, performance
priority: medium
related: queues.md, jobs.md
---

# Concurrency

## Overview

The `Concurrency` facade executes multiple slow, independent tasks in parallel for performance gains.

---

## When to Use

| Scenario | Use Concurrency | Alternative |
|----------|-----------------|-------------|
| Multiple independent DB queries | ✅ Yes | - |
| External API calls in parallel | ✅ Yes | - |
| Tasks dependent on each other | ❌ No | Sequential |
| Long-running background work | ❌ No | Queues |
| Fire-and-forget tasks | ✅ `defer()` | Events |

---

## Drivers

| Driver | Context | Performance | Setup |
|--------|---------|-------------|-------|
| **process** | Web + CLI | Good | Default |
| **fork** | CLI only | Better | `spatie/fork` |
| **sync** | Testing | None (sequential) | Built-in |

### Fork Driver Setup

```bash
composer require spatie/fork
```

**Note**: Fork only works in CLI (Artisan commands, queues). Not in web requests.

---

## Key Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| `run([closures])` | Execute in parallel | Array of results |
| `defer([closures])` | Execute after response | void |
| `driver('fork')` | Use specific driver | Concurrency instance |

---

## Decision Guide

```
Tasks independent?
├── No → Run sequentially
└── Yes → Need results?
    ├── Yes → Concurrency::run()
    └── No → Concurrency::defer()
```

---

## How It Works

1. Closures are **serialized**
2. Dispatched to **hidden Artisan command**
3. Each runs in **separate PHP process**
4. Results **serialized back** to parent

**Important**: Closures must be serializable (no anonymous classes, no `$this` from non-serializable objects).

---

## Performance Patterns

| Pattern | Without Concurrency | With Concurrency |
|---------|---------------------|------------------|
| 3 queries × 100ms each | 300ms | ~100ms |
| 5 API calls × 500ms each | 2500ms | ~500ms |

---

## Use Cases

### Aggregating Counts

Multiple independent database counts executed in parallel.

### Multiple API Calls

Fetching data from multiple external services simultaneously.

### Post-Response Tasks

Using `defer()` for analytics, logging, or notifications after sending response.

---

## Constraints

| Constraint | Reason |
|------------|--------|
| Closures must be serializable | Sent to child process |
| No shared state | Each process isolated |
| Fork only CLI | PHP limitation |
| Results must be serializable | Returned to parent |

---

## Best Practices

### DO
- Use for truly independent tasks
- Use `defer()` for non-critical post-response work
- Consider `fork` driver in CLI for performance
- Keep closures simple and serializable

### DON'T
- Don't use for dependent tasks (use sequential)
- Don't expect shared memory
- Don't use fork in web requests
- Don't defer critical operations

---

## Testing

Use `sync` driver in tests:

```php
// config/concurrency.php or test setup
'default' => 'sync'
```

This runs closures sequentially for predictable test results.
