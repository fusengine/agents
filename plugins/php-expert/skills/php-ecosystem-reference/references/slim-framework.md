---
name: slim-framework
description: Slim micro-framework orientation — PSR-7 / PSR-15 / PSR-11 based
source: https://www.slimframework.com/ + github.com/slimphp/Slim/releases (verified — Slim 4.15.3 released 2026-09-01)
keywords: slim, micro-framework, psr-7, psr-15, psr-11, appfactory, routing
---

# Slim Framework (Orientation)

Load when a project needs a tiny HTTP framework for a small API or service. Orientation only —
have the research agent verify the current API on slimframework.com before implementing.

## What it is

Slim is a **PHP micro-framework** for building simple yet capable web applications and APIs. It is
built directly on the PSR HTTP standards:

| Standard | Role in Slim |
|----------|-------------|
| **PSR-7** | Slim works with any PSR-7 HTTP message implementation (verified from slimframework.com) |
| **PSR-15** | Concentric middleware wraps the request/response — see [[php-http-psr]] |
| **PSR-11** | Uses any PSR-11 `ContainerInterface` for dependency injection |

## Version status (verified 2026-09-27)

- **Slim 4.15.3** (2026-09-01) is the current release. It fixes a route-parameter constraint
  bypass via double percent-encoded input (**GHSA-h377-p8x2-prf9**, Slim 4.x up to 4.15.2) —
  relevant if you use route placeholder values without revalidating them. Use ≥ 4.15.3.
- **Slim 4.15.2** (2026-05-22) fixed a reflected XSS advisory
  (**CVE-2026-48157 / GHSA-53h4-8rc4-f539**) affecting Slim `>= 4.4.0, <= 4.15.1` in the HTML error
  renderer when untrusted data reaches `HttpException::setTitle()` / `setDescription()`.
- The older **Slim 3.13.0** line supports PHP 8.1 through 8.5.

## Minimal shape (from slimframework.com)

```php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/hello/{name}', function (Request $request, Response $response, array $args) {
    $response->getBody()->write("Hello, {$args['name']}");
    return $response;                    // PSR-7 response returned
});

$app->run();
```

Bootstrap a project with `composer create-project slim/slim-skeleton [my-app-name]`.

## When to reach for it

| Fits | Poor fit |
|------|----------|
| Small API, microservice, webhook receiver | Large API-first product → API Platform ([api-platform.md](api-platform.md)) |
| You want explicit routes + PSR middleware, minimal magic | Full MVC app with ORM, auth scaffolding → Laravel (`laravel-expert`) |

## Boundary

This skill does not carry Slim implementation depth (route groups, custom middleware ordering,
container wiring, error middleware config). Route those specifics through the research agent —
see [boundaries.md](boundaries.md).
