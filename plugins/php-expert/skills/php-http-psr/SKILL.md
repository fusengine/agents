---
name: php-http-psr
description: Use when building framework-agnostic PHP HTTP code — PSR-7/15/17/18 messages, middleware, factories, clients. Do NOT use for Laravel HTTP or Symfony HttpFoundation (not PSR-7).
versions:
  psr-http-message: "2.0"
  psr-http-server-middleware: "1.0"
  psr-http-factory: "1.1"
  psr-http-client: "1.0"
user-invocable: true
references: references/psr7-messages.md, references/psr15-middleware.md, references/psr17-factories.md, references/psr18-client.md, references/implementations.md, references/templates/middleware-pipeline.md
related-skills: php-ecosystem-reference, solid-php
---

<objective>
Covers the four PSR HTTP standards that let PHP libraries handle HTTP without coupling to any framework: PSR-7 immutable Request/Response/Stream/Uri messages, PSR-15 RequestHandler + Middleware pipelines, PSR-17 factory interfaces, and PSR-18 HTTP clients.

Includes guidance on reference implementations (nyholm/psr7, guzzlehttp/psr7, laminas-diactoros) and how to choose between them, plus a complete middleware-pipeline template.

Do NOT use this skill for Laravel's own HTTP layer (route to laravel-expert instead) or for Symfony's HttpFoundation component, which is a different, non-PSR-7 HTTP model — bridge the two via symfony/psr-http-message-bridge when needed (see references/implementations.md).
</objective>

# PHP HTTP — PSR-7 / 15 / 17 / 18

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect the PSR-7 implementation already in use (composer.json)
2. **fuse-ai-pilot:research-expert** - Verify current interface versions on php-fig.org + Packagist
3. **mcp__context7__query-docs** - Check the chosen implementation's factory API

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

These four PSR standards let libraries handle HTTP without coupling to any framework. Code depends on **interfaces** (`Psr\Http\*`); a concrete implementation is injected.

| Standard | Package | Provides |
|----------|---------|----------|
| **PSR-7** | `psr/http-message` | Immutable HTTP messages: `MessageInterface`, `RequestInterface`, `ResponseInterface`, `ServerRequestInterface`, `StreamInterface`, `UriInterface`, `UploadedFileInterface` |
| **PSR-15** | `psr/http-server-handler` + `psr/http-server-middleware` | `RequestHandlerInterface`, `MiddlewareInterface` — the middleware pipeline |
| **PSR-17** | `psr/http-factory` | Factories that create PSR-7 objects without naming a concrete class |
| **PSR-18** | `psr/http-client` | `ClientInterface::sendRequest()` — send a PSR-7 request, get a PSR-7 response |

---

## Critical Rules

1. **Messages are immutable** - Every `with*()` returns a NEW instance; the original is unchanged. `$r->withHeader(...)` alone is a no-op — reassign.
2. **Depend on interfaces, not classes** - Type-hint `ResponseInterface`, inject a `ResponseFactoryInterface`. NEVER `new Response()` inside reusable code.
3. **Streams are NOT immutable** - `StreamInterface` wraps a real resource; use read-only streams for requests/responses.
4. **PSR-18 4xx/5xx are NOT errors** - A client MUST return them as normal responses; it throws only on transport failure (`NetworkExceptionInterface`) or malformed requests (`RequestExceptionInterface`).
5. **Headers are case-insensitive** - `getHeaderLine('foo')` == `getHeaderLine('FOO')`; original case is preserved in `getHeaders()`.

---

## Architecture

```
src/
├── Http/
│   ├── Middleware/          # implements Psr\Http\Server\MiddlewareInterface
│   │   ├── ErrorHandlerMiddleware.php
│   │   └── AuthMiddleware.php
│   ├── Handler/             # implements Psr\Http\Server\RequestHandlerInterface
│   │   └── Dispatcher.php   # the pipeline runner
│   └── Client/              # wraps a Psr\Http\Client\ClientInterface
└── interfaces/              # your own contracts (SOLID)
```

→ See [middleware-pipeline.md](references/templates/middleware-pipeline.md) for a complete runnable pipeline

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Messages** | [psr7-messages.md](references/psr7-messages.md) | Reading/building requests, responses, streams, URIs |
| **Middleware** | [psr15-middleware.md](references/psr15-middleware.md) | Building a middleware + handler pipeline |
| **Factories** | [psr17-factories.md](references/psr17-factories.md) | Creating PSR-7 objects implementation-agnostically |
| **HTTP Client** | [psr18-client.md](references/psr18-client.md) | Sending outbound requests, exception handling |
| **Implementations** | [implementations.md](references/implementations.md) | Choosing nyholm / guzzle / laminas + PSR-18 clients |

### Templates

| Template | When to Use |
|----------|-------------|
| [middleware-pipeline.md](references/templates/middleware-pipeline.md) | Building a PSR-15 dispatcher with middleware queue |

---

## Quick Reference

### Immutable update (reassign!)

```php
$response = $response
    ->withStatus(201)
    ->withHeader('Content-Type', 'application/json');
```

### Minimal middleware

```php
final class AuthMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if (!$request->hasHeader('Authorization')) {
            return $this->responseFactory->createResponse(401);
        }
        return $handler->handle($request);
    }
}
```

### PSR-17 factory (no concrete class named)

```php
$request = $requestFactory->createRequest('GET', 'https://api.example.com');
$request = $request->withBody($streamFactory->createStream('{"ping":true}'));
```

→ See [psr17-factories.md](references/psr17-factories.md) for all six factory interfaces

---

## Best Practices

### DO
- Inject a `ResponseFactoryInterface` so middleware never names a concrete class
- Put an exception-catching middleware FIRST in the queue (PSR-15 recommendation)
- Use `nyholm/psr7` when you want a lightweight, strict PSR-7 + PSR-17 in one package
- Reassign the result of every `with*()` call

### DON'T
- Mutate a message in place — `with*()` returns a new object
- Treat a 404/500 response from a PSR-18 client as an exception
- Confuse Symfony `HttpFoundation` with PSR-7 — they are different; bridge via `symfony/psr-http-message-bridge`
- Hardcode `new GuzzleHttp\Psr7\Response()` in library code — depend on the factory
