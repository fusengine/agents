---
name: psr17-factories
description: PSR-17 HTTP factory interfaces — create PSR-7 objects without naming a concrete class
source: https://www.php-fig.org/psr/psr-17/ (verified)
keywords: psr-17, factory, requestfactory, responsefactory, streamfactory, urifactory
---

# PSR-17 — HTTP Factories

Load when a component must create PSR-7 objects but must NOT depend on a specific implementation.

## Overview

PSR-7 deliberately said nothing about how to *construct* messages, so each implementation has its own constructors. PSR-17 (`psr/http-factory`, namespace `Psr\Http\Message`) fixes this: type-hint a factory interface, and any implementation can be injected.

## The six factory interfaces

| Interface | Method | Returns |
|-----------|--------|---------|
| `RequestFactoryInterface` | `createRequest(string $method, $uri)` | `RequestInterface` |
| `ResponseFactoryInterface` | `createResponse(int $code = 200, string $reasonPhrase = '')` | `ResponseInterface` |
| `ServerRequestFactoryInterface` | `createServerRequest(string $method, $uri, array $serverParams = [])` | `ServerRequestInterface` |
| `StreamFactoryInterface` | `createStream(string $content = '')` / `createStreamFromFile(...)` / `createStreamFromResource($resource)` | `StreamInterface` |
| `UploadedFileFactoryInterface` | `createUploadedFile(StreamInterface $stream, ?int $size = null, int $error = \UPLOAD_ERR_OK, ?string $clientFilename = null, ?string $clientMediaType = null)` | `UploadedFileInterface` |
| `UriFactoryInterface` | `createUri(string $uri = '')` | `UriInterface` |

The interfaces MAY be implemented together in one class or split apart. Most implementations ship a single class covering all six (e.g. `Nyholm\Psr7\Factory\Psr17Factory`).

## Why it matters

```php
final class ApiClient
{
    public function __construct(
        private RequestFactoryInterface $requestFactory,
        private StreamFactoryInterface $streamFactory,
    ) {}

    public function ping(): RequestInterface
    {
        return $this->requestFactory
            ->createRequest('POST', 'https://api.example.com/ping')
            ->withBody($this->streamFactory->createStream('{"ping":true}'));
    }
}
```

`ApiClient` never names `Nyholm`, `Guzzle`, or `Laminas` — the concrete factory is wired in the container. Swapping implementations changes one binding.

## Notes from the spec

- `StreamFactoryInterface` implementations SHOULD back string streams with a temp resource: `fopen('php://temp', 'r+')`.
- Since `psr/http-factory` 1.1, `createUploadedFile()` uses explicit nullable types (`?int`, `?string`).
- `createServerRequest()` takes server params **verbatim** — it does not parse method or URI from them.

→ For which package to inject, see [implementations.md](implementations.md)
