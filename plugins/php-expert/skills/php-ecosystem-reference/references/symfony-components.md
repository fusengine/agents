---
name: symfony-components
description: Standalone Symfony components usable via Composer outside the framework — orientation map
source: https://symfony.com/packages (verified list) — orientation, not deep how-to
keywords: symfony, components, console, process, httpfoundation, eventdispatcher, validator, serializer
---

# Symfony Standalone Components (Orientation)

Load when you need ONE reusable library without pulling in a full framework. These are decoupled,
independently versioned packages, each installable with `composer require symfony/<name>`. This is a
map — for exact current APIs, have the research agent verify on symfony.com/doc.

## Major components (verified present on symfony.com/packages)

| Component | Package | Use it for |
|-----------|---------|-----------|
| **Console** | `symfony/console` | Building CLI commands, arguments/options, styled output |
| **Process** | `symfony/process` | Running and controlling sub-processes safely |
| **HttpFoundation** | `symfony/http-foundation` | Object layer over the HTTP spec (Request/Response/Session) — NOT PSR-7 |
| **HttpKernel** | `symfony/http-kernel` | Turning a Request into a Response (the request→response pipeline) |
| **EventDispatcher** | `symfony/event-dispatcher` | Decoupled communication via events + listeners/subscribers |
| **Validator** | `symfony/validator` | Constraint-based validation of objects/values |
| **Serializer** | `symfony/serializer` | (De)serializing objects to/from JSON, XML, CSV, YAML |
| **Routing** | `symfony/routing` | Mapping URLs to configuration/handlers |
| **Finder** | `symfony/finder` | Fluent file/directory discovery |
| **Filesystem** | `symfony/filesystem` | Cross-platform filesystem utilities |
| **Yaml** | `symfony/yaml` | Parsing/dumping YAML |
| **String / Uid** | `symfony/string`, `symfony/uid` | Unified string handling; UUID/ULID generation |
| **Mailer / Mime** | `symfony/mailer`, `symfony/mime` | Sending email; building MIME messages |
| **Translation** | `symfony/translation` | i18n message catalogs |
| **OptionsResolver** | `symfony/options-resolver` | Validating/normalizing config option arrays |

## Why standalone matters

Each component works on its own. A CLI tool, a WordPress plugin, or a Laravel app can all
`composer require symfony/console` and use it directly — no Symfony framework, no bundle system.

```php
// Minimal standalone Console usage
use Symfony\Component\Console\Application;

$app = new Application('my-tool', '1.0.0');
$app->add(new MyCommand());
$app->run();
```

## Relationship to PSR

- **HttpFoundation is NOT PSR-7.** It predates PSR-7 and has its own mutable `Request`/`Response`.
  Convert with `symfony/psr-http-message-bridge` when you need PSR-7 — see [[php-http-psr]].
- Many components are used *inside* API Platform and other frameworks — see [api-platform.md](api-platform.md).

## Boundary

Deep, version-specific Symfony **framework** work (bundles, DI container config, Doctrine
integration, Symfony full-stack MVC) is **out of scope** — see [boundaries.md](boundaries.md).
