---
name: psr7-messages
description: PSR-7 HTTP message interfaces — immutability, headers, streams, URIs, server requests
source: https://www.php-fig.org/psr/psr-7/ (verified)
keywords: psr-7, message, request, response, stream, uri, immutable, serverrequest
---

# PSR-7 — HTTP Messages

Load when reading or building HTTP requests, responses, streams, or URIs in framework-agnostic code.

## Overview

PSR-7 (`psr/http-message`, interfaces in namespace `Psr\Http\Message`) models HTTP messages as **immutable value objects**. Every mutator is a `with*()` method that returns a **new** instance, leaving the original untouched.

## Interface map

| Interface | Extends | Represents |
|-----------|---------|------------|
| `MessageInterface` | — | Common: protocol version, headers, body |
| `RequestInterface` | `MessageInterface` | Outgoing/client request (method, URI, target) |
| `ResponseInterface` | `MessageInterface` | Response (status code, reason phrase) |
| `ServerRequestInterface` | `RequestInterface` | Incoming server request (+ cookies, query, parsed body, uploaded files, attributes) |
| `StreamInterface` | — | Message body as a stream (NOT immutable) |
| `UriInterface` | — | URI value object (scheme, host, path, query…) |
| `UploadedFileInterface` | — | A single normalized file upload |

## Immutability (the core rule)

```php
// WRONG — result discarded, $request unchanged
$request->withHeader('X-Api-Key', 'secret');

// RIGHT — reassign
$request = $request->withHeader('X-Api-Key', 'secret');
```

`with*()` returns a clone with the change applied. This makes messages safe to share and reason about, but means a forgotten reassignment is a silent no-op.

## Headers

- **Case-insensitive lookup**: `getHeaderLine('foo')` equals `getHeaderLine('FOO')`.
- **Original case preserved** in `getHeaders()`.
- **Multi-value**: `getHeader()` returns an array; `getHeaderLine()` joins with commas.
- **`Set-Cookie`** cannot be comma-joined — always read it with `getHeader()`.

```php
$message = $message
    ->withHeader('foo', 'bar')
    ->withAddedHeader('foo', 'baz');
$message->getHeader('foo');      // ['bar', 'baz']
$message->getHeaderLine('foo');  // 'bar,baz'
```

## Streams

`StreamInterface` wraps a real PHP resource, so it is the **one non-immutable** part of PSR-7 — any code touching the resource can change cursor position or contents. Capabilities are advertised by `isReadable()`, `isWritable()`, `isSeekable()`; `__toString()` dumps the whole body.

```php
$response->getBody()->write('Hello');   // mutates in place
$body = (string) $response->getBody();  // full body as string
```

Use built-in streams `php://memory` / `php://temp` for in-memory bodies.

## Server requests

`ServerRequestInterface` adds the server-side surface: `getQueryParams()`, `getParsedBody()`, `getCookieParams()`, `getUploadedFiles()`, and application-scoped `getAttribute()` / `withAttribute()` (used by routers/middleware to pass data down the pipeline).

`getUploadedFiles()` returns a normalized tree of `UploadedFileInterface` leaves — it fixes the broken shape of PHP's `$_FILES` for array inputs.

→ To build these objects without naming a concrete class, see [psr17-factories.md](psr17-factories.md)
→ For the concrete packages, see [implementations.md](implementations.md)
