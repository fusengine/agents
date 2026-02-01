---
name: AppServiceProvider
description: Service provider with dependency injection bindings
keywords: provider, di, binding, container
---

# App Service Provider

## File: app/Providers/AppServiceProvider.php

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\PostRepositoryInterface;
use App\Contracts\UserRepositoryInterface;
use App\Repositories\EloquentPostRepository;
use App\Repositories\EloquentUserRepository;
use Illuminate\Support\ServiceProvider;

/**
 * Application service provider.
 */
final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register application services.
     */
    public function register(): void
    {
        $this->registerRepositories();
    }

    /**
     * Bootstrap application services.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Register repository bindings.
     */
    private function registerRepositories(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class
        );

        $this->app->bind(
            PostRepositoryInterface::class,
            EloquentPostRepository::class
        );
    }
}
```

## Directory Structure

```text
app/
├── Contracts/                # Interfaces
│   ├── UserRepositoryInterface.php
│   └── PostRepositoryInterface.php
├── DTOs/                     # Data Transfer Objects
│   ├── CreateUserDTO.php
│   └── UpdateUserDTO.php
├── Repositories/             # Repository implementations
│   ├── EloquentUserRepository.php
│   └── EloquentPostRepository.php
├── Services/                 # Business logic
│   ├── UserService.php
│   └── PostService.php
└── Providers/
    └── AppServiceProvider.php
```
