---
name: ApiExceptionHandler
description: JSON error responses for API permission errors
keywords: exception, handler, json, 403, unauthorized
---

# API Exception Handler

Handle permission exceptions with JSON responses.

## File: bootstrap/app.php (Laravel 11+)

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Middleware configuration
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle Spatie UnauthorizedException
        $exceptions->render(function (UnauthorizedException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => 'unauthorized',
                    'required_roles' => $e->getRequiredRoles(),
                    'required_permissions' => $e->getRequiredPermissions(),
                ], 403);
            }

            // For web requests, redirect or show error page
            return response()->view('errors.403', [
                'message' => $e->getMessage(),
            ], 403);
        });

        // Handle AccessDeniedHttpException (from policies)
        $exceptions->render(function (AccessDeniedHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'This action is unauthorized.',
                    'error' => 'forbidden',
                ], 403);
            }
        });
    })
    ->create();
```

## Laravel 10 Handler (app/Exceptions/Handler.php)

```php
<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Throwable;

/**
 * Application exception handler.
 */
final class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function (UnauthorizedException $e, Request $request) {
            if ($request->expectsJson()) {
                return $this->jsonUnauthorizedResponse($e);
            }
        });

        $this->renderable(function (AccessDeniedHttpException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'This action is unauthorized.',
                    'error' => 'forbidden',
                ], 403);
            }
        });
    }

    /**
     * Create JSON response for unauthorized exception.
     */
    private function jsonUnauthorizedResponse(UnauthorizedException $e): JsonResponse
    {
        $data = [
            'message' => $e->getMessage(),
            'error' => 'unauthorized',
        ];

        // Include required roles/permissions for debugging
        if (config('app.debug')) {
            $data['required_roles'] = $e->getRequiredRoles();
            $data['required_permissions'] = $e->getRequiredPermissions();
        }

        return response()->json($data, 403);
    }
}
```

## Custom API Response Trait

```php
<?php

declare(strict_types=1);

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;

/**
 * Trait for standardized API responses.
 */
trait ApiResponses
{
    /**
     * Success response.
     */
    protected function success(mixed $data = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Error response.
     */
    protected function error(string $message, int $code = 400, array $errors = []): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Forbidden response.
     */
    protected function forbidden(string $message = 'You do not have permission to perform this action'): JsonResponse
    {
        return $this->error($message, 403);
    }

    /**
     * Unauthorized response.
     */
    protected function unauthorized(string $message = 'Unauthenticated'): JsonResponse
    {
        return $this->error($message, 401);
    }
}
```

## Usage in Controller

```php
<?php

use App\Http\Traits\ApiResponses;

final class PostController extends Controller
{
    use ApiResponses;

    public function store(Request $request)
    {
        // Manual permission check with custom response
        if (!$request->user()->can('api:posts:create')) {
            return $this->forbidden('You cannot create posts');
        }

        $post = Post::create($request->validated());

        return $this->success($post, 'Post created', 201);
    }
}
```
