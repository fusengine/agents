---
name: psr18-client
description: PSR-18 HTTP client interface — sending PSR-7 requests, exception hierarchy
source: https://www.php-fig.org/psr/psr-18/ (verified)
keywords: psr-18, client, sendrequest, clientexception, networkexception
---

# PSR-18 — HTTP Client

Load when sending outbound HTTP requests from a library that must not depend on a specific client.

## Overview

PSR-18 (`psr/http-client`, namespace `Psr\Http\Client`) lets a library send a PSR-7 request and receive a PSR-7 response through a swappable client. Goal: decouple calling libraries from Guzzle/Symfony/cURL so they carry fewer dependencies and avoid version conflicts. Clients are interchangeable per the Liskov substitution principle.

## The interface

```php
namespace Psr\Http\Client;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

interface ClientInterface
{
    public function sendRequest(RequestInterface $request): ResponseInterface;
}
```

## Error handling (the critical distinction)

| Situation | Client MUST |
|-----------|-------------|
| Response is 4xx or 5xx | Return it as a **normal** response — NEVER throw |
| Cannot send request at all, or response unparseable | Throw `ClientExceptionInterface` |
| Request malformed / missing Host or Method | Throw `RequestExceptionInterface` (extends `ClientExceptionInterface`) |
| Network failure / timeout / DNS | Throw `NetworkExceptionInterface` (extends `ClientExceptionInterface`) |

```php
try {
    $response = $client->sendRequest($request);
    // 404 and 500 land HERE, not in catch
    if ($response->getStatusCode() >= 400) {
        // application-level handling
    }
} catch (NetworkExceptionInterface $e) {
    // transport failed — no response exists; $e->getRequest() available
} catch (ClientExceptionInterface $e) {
    // request could not be sent / parsed
}
```

## Immutability caveat

Because PSR-7 objects are immutable and a client MAY alter the request (e.g. compress the body, add headers), the object actually sent MAY be a **different instance** than the one you passed. Do not compare by reference (`===`). The request returned by an exception's `getRequest()` may also differ from the original.

A client MUST also collapse any multi-step `1xx` response into a final response of status ≥ 200 before returning.

## Reference clients

`guzzlehttp/guzzle`, `symfony/http-client`, `php-http/curl-client`, and `kriswallsmith/buzz` all implement `ClientInterface`.

→ For pairing a client with a PSR-17 factory, see [implementations.md](implementations.md)
