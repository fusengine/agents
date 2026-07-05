---
name: middleware-pipeline
description: Complete framework-agnostic PSR-15 middleware pipeline — dispatcher + middleware queue
keywords: template, psr-15, dispatcher, middleware, pipeline, runner
---

# Complete PSR-15 Middleware Pipeline

A framework-agnostic dispatcher that runs a queue of PSR-15 middleware and ends at a final handler.
Depends only on `psr/http-message`, `psr/http-server-handler`, `psr/http-server-middleware`,
`psr/http-factory`, plus one PSR-7/17 implementation (example uses `nyholm/psr7`).

```bash
composer require psr/http-message psr/http-server-handler psr/http-server-middleware psr/http-factory nyholm/psr7 nyholm/psr7-server
```

## The dispatcher (RequestHandlerInterface)

```php
<?php
// src/Http/Handler/Dispatcher.php
declare(strict_types=1);

namespace App\Http\Handler;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Runs a queue of PSR-15 middleware. Each handle() call pops the next
 * middleware and passes a clone of itself as "the rest of the queue".
 * When the queue is empty it delegates to the final handler.
 */
final class Dispatcher implements RequestHandlerInterface
{
    /** @var list<MiddlewareInterface> */
    private array $queue;

    /**
     * @param list<MiddlewareInterface> $queue Middleware in execution order (first runs first).
     * @param RequestHandlerInterface   $final Terminal handler (e.g. router / controller).
     */
    public function __construct(array $queue, private RequestHandlerInterface $final)
    {
        $this->queue = array_values($queue);
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if ($this->queue === []) {
            return $this->final->handle($request);
        }

        $middleware = array_shift($this->queue);

        // $this now represents the remaining queue for the next middleware.
        return $middleware->process($request, $this);
    }
}
```

## Middleware 1 — error handler (runs first, per PSR-15 §1.4)

```php
<?php
// src/Http/Middleware/ErrorHandlerMiddleware.php
declare(strict_types=1);

namespace App\Http\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Throwable;

/**
 * Wraps the whole pipeline so a response is ALWAYS produced.
 * Composes a ResponseFactoryInterface to stay implementation-agnostic (PSR-15 §1.3).
 */
final class ErrorHandlerMiddleware implements MiddlewareInterface
{
    public function __construct(private ResponseFactoryInterface $responseFactory) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            return $handler->handle($request);
        } catch (Throwable $e) {
            $response = $this->responseFactory->createResponse(500);
            $response->getBody()->write(
                json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR)
            );
            return $response->withHeader('Content-Type', 'application/json');
        }
    }
}
```

## Middleware 2 — auth (short-circuits without delegating)

```php
<?php
// src/Http/Middleware/AuthMiddleware.php
declare(strict_types=1);

namespace App\Http\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final class AuthMiddleware implements MiddlewareInterface
{
    public function __construct(private ResponseFactoryInterface $responseFactory) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $token = $request->getHeaderLine('Authorization');

        if ($token === '') {
            // Short-circuit: return a response WITHOUT calling $handler.
            return $this->responseFactory->createResponse(401);
        }

        // Attach data for downstream middleware/handlers, then delegate.
        return $handler->handle($request->withAttribute('token', $token));
    }
}
```

## Final handler (terminal — produces the app response)

```php
<?php
// src/Http/Handler/HelloHandler.php
declare(strict_types=1);

namespace App\Http\Handler;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Server\RequestHandlerInterface;

final class HelloHandler implements RequestHandlerInterface
{
    public function __construct(private ResponseFactoryInterface $responseFactory) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $token = $request->getAttribute('token', 'anonymous');
        $response = $this->responseFactory->createResponse(200);
        $response->getBody()->write("Hello, {$token}");
        return $response->withHeader('Content-Type', 'text/plain');
    }
}
```

## Wiring it together (front controller)

```php
<?php
// public/index.php
declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use App\Http\Handler\Dispatcher;
use App\Http\Handler\HelloHandler;
use App\Http\Middleware\AuthMiddleware;
use App\Http\Middleware\ErrorHandlerMiddleware;
use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7Server\ServerRequestCreator;

$psr17 = new Psr17Factory();                     // PSR-17 factory (also PSR-7)
$creator = new ServerRequestCreator($psr17, $psr17, $psr17, $psr17);
$request = $creator->fromGlobals();              // PSR-7 ServerRequest from superglobals

$pipeline = new Dispatcher(
    queue: [
        new ErrorHandlerMiddleware($psr17),      // MUST be first
        new AuthMiddleware($psr17),
    ],
    final: new HelloHandler($psr17),
);

$response = $pipeline->handle($request);

// Minimal emitter (production: use laminas/laminas-httphandlerrunner SapiEmitter).
http_response_code($response->getStatusCode());
foreach ($response->getHeaders() as $name => $values) {
    foreach ($values as $value) {
        header("{$name}: {$value}", false);
    }
}
echo $response->getBody();
```

## Execution order

```
request → ErrorHandler.process → Auth.process → HelloHandler.handle → response
                                     │
                                     └─ no Authorization header → returns 401, HelloHandler never runs
```

Any thrown `Throwable` bubbles up to `ErrorHandlerMiddleware`, which converts it to a 500 JSON response.
