---
name: query-debugging
description: Query inspection, debugging, logging
when-to-use: Debugging queries, performance analysis
keywords: toSql, dd, dump, getBindings, listen, query log
---

# Query Debugging

## Decision Tree

```
Debugging query?
├── See SQL → toSql()
├── See bindings → getBindings()
├── Stop and inspect → dd()
├── Print and continue → dump()
├── Log all queries → DB::listen()
└── Use tool → Laravel Debugbar
```

## Query Inspection

| Method | Returns |
|--------|---------|
| `toSql()` | SQL string with ? placeholders |
| `toRawSql()` | SQL with bindings inserted |
| `getBindings()` | Array of binding values |
| `dd()` | Dump and die |
| `dump()` | Dump and continue |
| `ddRawSql()` | DD with bindings |
| `dumpRawSql()` | Dump with bindings |

## Query Logging

| Method | Purpose |
|--------|---------|
| `DB::enableQueryLog()` | Start logging |
| `DB::disableQueryLog()` | Stop logging |
| `DB::getQueryLog()` | Get logged queries |
| `DB::flushQueryLog()` | Clear log |

## Query Listener

| Method | When |
|--------|------|
| `DB::listen(fn($query))` | Every query |
| `$query->sql` | SQL string |
| `$query->bindings` | Binding values |
| `$query->time` | Execution time (ms) |

## Explain Query

| Method | Purpose |
|--------|---------|
| `explain()` | Get query plan |
| `explain()->dd()` | Dump explain |

## Debugging Tools

| Tool | Features |
|------|----------|
| Laravel Debugbar | Queries, timing, memory |
| Laravel Telescope | Full request inspection |
| Clockwork | Chrome extension |
| Ray | Desktop debugging |

## Common Debug Patterns

| Goal | Method |
|------|--------|
| See generated SQL | `->toSql()` |
| Check N+1 | Debugbar or listen |
| Slow query | `->explain()` |
| Missing index | EXPLAIN output |

## Preventing Issues

| Setting | Purpose |
|---------|---------|
| `Model::preventLazyLoading()` | Catch N+1 |
| `Model::preventSilentlyDiscardingAttributes()` | Catch mass assignment |
| `Model::preventAccessingMissingAttributes()` | Catch typos |

## Strict Mode

| Method | Catches |
|--------|---------|
| `Model::shouldBeStrict()` | All of above |
| Dev only | `!app()->isProduction()` |

## Log Slow Queries

| Configuration | Location |
|---------------|----------|
| `DB::whenQueryingForLongerThan()` | AppServiceProvider |
| Threshold | Milliseconds |
| Handler | Log, notify, etc. |

## Production Tips

| DO | DON'T |
|----|-------|
| Use Telescope in staging | dd() in production |
| Log slow queries only | Log all queries |
| Disable query log | Leave enabled |
| Use APM tools | Manual debugging |

## Best Practices

| Phase | Tool |
|-------|------|
| Development | dd(), dump(), Debugbar |
| Staging | Telescope, query log |
| Production | APM (NewRelic, Datadog) |
| Performance | explain(), indexes |

→ **See also**: [performance.md](performance.md) for optimization
