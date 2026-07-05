---
name: psr15-middleware
description: PSR-15 request handlers and middleware — the pipeline pattern
source: https://www.php-fig.org/psr/psr-15/ (verified)
keywords: psr-15, middleware, requesthandler, pipeline, dispatcher
---

# PSR-15 — Request Handlers & Middleware

Load when building a middleware pipeline that processes a `ServerRequestInterface` into a `ResponseInterface`.

## Overview

PSR-15 defines two interfaces in namespace `Psr\Http\Server`. Both operate on **server** requests (PSR-7 `ServerRequestInterface`).

## The two interfaces (exact signatures)

```php
namespace Psr\Http\Server;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

interface RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface;
}

interface MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface;
}
```

## How the pipeline works

A **request handler** takes a request and produces a response (the "innermost" app logic, or a dispatcher).

A **middleware** wraps the handler: it may act on the request, delegate to `$handler->handle($request)`, then act on the returned response — or **short-circuit** by returning its own response without delegating (auth failure, cache hit, rate limit).

```
request →  [ErrorHandler] → [Auth] → [Router] → handler → response
           ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

Each middleware's `process()` receives a `$handler` representing "the rest of the queue". A dispatcher implements `RequestHandlerInterface` and, on each `handle()`, pops the next middleware and calls its `process($request, $next)`.

## Spec recommendations

| Recommendation | Why |
|----------------|-----|
| Exception-catching middleware runs **first** (wraps everything) | Guarantees a response is always produced (PSR-15 §1.4) |
| Middleware/handlers generating a response should compose a `ResponseFactoryInterface` | Avoids coupling to a specific PSR-7 implementation (PSR-15 §1.3) |
| A middleware MAY throw | The type is not defined by the spec; the error middleware converts it to a response |

## Short-circuit example

```php
public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
{
    if (!$this->isAuthorized($request)) {
        return $this->responseFactory->createResponse(403); // never delegates
    }
    return $handler->handle($request->withAttribute('user', $this->user));
}
```

→ For a complete dispatcher + middleware queue, see [templates/middleware-pipeline.md](templates/middleware-pipeline.md)
→ For the `ResponseFactoryInterface` used here, see [psr17-factories.md](psr17-factories.md)
