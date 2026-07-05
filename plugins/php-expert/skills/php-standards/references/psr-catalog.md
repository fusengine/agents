---
name: psr-catalog
description: The active PSR catalog with statuses — which interfaces to depend on and which to avoid
when-to-use: Load when choosing a PSR interface to type-hint against (logging, cache, HTTP, DI, events, clock)
keywords: PSR, PSR-3, PSR-4, PSR-6, PSR-7, PSR-11, PSR-14, PSR-16, PSR-20, deprecated, abandoned
priority: high
related: per-coding-style.md, psr4-autoloading.md
---

# PSR Catalog

## Overview

PSRs are PHP-FIG interoperability standards. Depend on their interface packages so components stay swappable. Status source: php-fig.org/psr/.

---

## Accepted (safe to depend on)

| PSR | Title | Package / Interface |
|-----|-------|---------------------|
| **1** | Basic Coding Standard | (rules, required by PER-CS) |
| **3** | Logger Interface | `psr/log` — `LoggerInterface` |
| **4** | Autoloading Standard | (composer autoload) |
| **6** | Caching Interface | `psr/cache` — `CacheItemPoolInterface` |
| **7** | HTTP Message Interface | `psr/http-message` — `RequestInterface`, `ResponseInterface` |
| **11** | Container Interface | `psr/container` — `ContainerInterface` |
| **12** | Extended Coding Style | (see PER-CS 3.0) |
| **13** | Hypermedia Links | `psr/link` |
| **14** | Event Dispatcher | `psr/event-dispatcher` |
| **15** | HTTP Server Handlers | `psr/http-server-handler`, `...-middleware` |
| **16** | Simple Cache | `psr/simple-cache` — `CacheInterface` |
| **17** | HTTP Factories | `psr/http-factory` |
| **18** | HTTP Client | `psr/http-client` — `ClientInterface` |
| **20** | Clock | `psr/clock` — `ClockInterface` |

---

## Deprecated — do NOT use for new code

| PSR | Title | Replacement |
|-----|-------|-------------|
| **0** | Autoloading Standard | PSR-4 |
| **2** | Coding Style Guide | PSR-12 / PER-CS |

---

## Abandoned — never depend on

| PSR | Title |
|-----|-------|
| **8** | Huggable Interface |
| **9** | Security Advisories |
| **10** | Security Reporting Process |

---

## Choosing Between Overlaps

| Need | Use | Not |
|------|-----|-----|
| Simple key/value cache | PSR-16 `CacheInterface` | PSR-6 unless you need pools/deferred |
| Rich cache (pools, deferred save) | PSR-6 `CacheItemPoolInterface` | — |
| Build HTTP messages | PSR-17 factories | Instantiating a concrete lib directly |
| Testable "current time" | PSR-20 `ClockInterface` | `new DateTimeImmutable()` inline |

---

## Core Pattern

```php
use Psr\Log\LoggerInterface;
use Psr\Clock\ClockInterface;

final class Job
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly ClockInterface $clock,
    ) {}
}
```

Type-hint the interface; let the container inject the implementation.

→ See [composer-json.md](templates/composer-json.md) for requiring PSR packages

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Depending on PSR-0/PSR-2 | Use PSR-4 / PER-CS |
| Type-hinting a concrete logger | Type-hint `Psr\Log\LoggerInterface` |
| `new DateTimeImmutable()` in domain logic | Inject `Psr\Clock\ClockInterface` |
| Requiring PSR-8/9/10 | They are abandoned — no package |

---

## Related References

- [psr4-autoloading.md](psr4-autoloading.md) - PSR-4 in detail
