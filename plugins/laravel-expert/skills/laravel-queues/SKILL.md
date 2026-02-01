---
name: laravel-queues
description: Implement background jobs with queues, workers, batches, chains, events, broadcasting, and failure handling. Use when processing async tasks, sending emails, or handling long-running operations.
versions:
  laravel: "12.46"
  horizon: "5.43"
  php: "8.5"
user-invocable: false
references: references/queues.md, references/horizon.md, references/scheduling.md, references/events.md, references/broadcasting.md, references/notifications.md, references/mail.md, references/cache.md, references/redis.md, references/telescope.md, references/pulse.md
related-skills: laravel-architecture
---

# Laravel Queues & Events

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing job patterns
2. **fuse-ai-pilot:research-expert** - Verify Queue docs via Context7
3. **mcp__context7__query-docs** - Check job and event patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Queues process tasks asynchronously for better performance.

| Component | Purpose |
|-----------|---------|
| **Jobs** | Background tasks |
| **Events** | Domain events |
| **Listeners** | Event handlers |
| **Notifications** | Multi-channel alerts |
| **Batches** | Grouped job processing |

---

## Critical Rules

1. **Use ShouldQueue** for async processing
2. **Set retries and backoff** for resilience
3. **Handle failures** with failed() method
4. **Monitor with Horizon** in production

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Queues** | [queues.md](references/queues.md) | Job processing |
| **Horizon** | [horizon.md](references/horizon.md) | Queue monitoring |
| **Scheduling** | [scheduling.md](references/scheduling.md) | Cron jobs |
| **Events** | [events.md](references/events.md) | Event system |
| **Broadcasting** | [broadcasting.md](references/broadcasting.md) | WebSockets |
| **Notifications** | [notifications.md](references/notifications.md) | Alerts |
| **Mail** | [mail.md](references/mail.md) | Email |

---

## Quick Reference

```php
// Job
final class SendEmail implements ShouldQueue
{
    public int $tries = 3;
    public int $backoff = 60;

    public function handle(): void { ... }
    public function failed(\Throwable $e): void { ... }
}

// Dispatch
SendEmail::dispatch($user);
```
