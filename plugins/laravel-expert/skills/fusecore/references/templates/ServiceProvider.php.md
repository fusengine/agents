---
name: ServiceProvider
description: Module ServiceProvider with HasModule trait
keywords: serviceprovider, provider, hasmodule, trait
---

# ServiceProvider Template

Module ServiceProvider with HasModule trait.

## File: FuseCore/{Module}/App/Providers/{Module}ServiceProvider.php

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Providers;

use FuseCore\Core\App\Traits\HasModule;
use Illuminate\Support\ServiceProvider;

/**
 * Blog module service provider.
 */
final class BlogServiceProvider extends ServiceProvider
{
    use HasModule;

    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Merge module config
        $this->mergeConfigFrom(
            $this->getModulePath() . '/Config/blog.php',
            'blog'
        );

        // Bind services
        $this->app->singleton(
            \FuseCore\Blog\App\Contracts\PostServiceInterface::class,
            \FuseCore\Blog\App\Services\PostService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Load module migrations
        $this->loadModuleMigrations();

        // Load module translations (if needed)
        // $this->loadModuleTranslations();
    }
}
```

## Minimal ServiceProvider

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Providers;

use FuseCore\Core\App\Traits\HasModule;
use Illuminate\Support\ServiceProvider;

/**
 * Blog module service provider.
 */
final class BlogServiceProvider extends ServiceProvider
{
    use HasModule;

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadModuleMigrations();
    }
}
```

## ServiceProvider with Sub-Providers

```php
<?php

declare(strict_types=1);

namespace FuseCore\User\App\Providers;

use FuseCore\Core\App\Traits\HasModule;
use Illuminate\Support\ServiceProvider;

/**
 * User module service provider.
 */
final class UserServiceProvider extends ServiceProvider
{
    use HasModule;

    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register sub-providers
        $this->app->register(AuthServiceProvider::class);
        $this->app->register(SanctumServiceProvider::class);

        // Bind user services
        $this->app->singleton(
            \FuseCore\User\App\Contracts\AuthServiceInterface::class,
            \FuseCore\User\App\Services\AuthService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadModuleMigrations();
    }
}
```

## ServiceProvider with Event Listeners

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Providers;

use FuseCore\Blog\App\Events\PostPublished;
use FuseCore\Blog\App\Listeners\NotifySubscribers;
use FuseCore\Core\App\Traits\HasModule;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

/**
 * Blog module service provider.
 */
final class BlogServiceProvider extends ServiceProvider
{
    use HasModule;

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadModuleMigrations();

        // Register event listeners
        Event::listen(PostPublished::class, NotifySubscribers::class);
    }
}
```

## ServiceProvider with Gates

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Providers;

use FuseCore\Blog\App\Models\Post;
use FuseCore\Core\App\Traits\HasModule;
use FuseCore\User\App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

/**
 * Blog module service provider.
 */
final class BlogServiceProvider extends ServiceProvider
{
    use HasModule;

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadModuleMigrations();

        // Define gates
        Gate::define('update-post', function (User $user, Post $post) {
            return $user->id === $post->user_id;
        });

        Gate::define('delete-post', function (User $user, Post $post) {
            return $user->id === $post->user_id || $user->hasRole('admin');
        });
    }
}
```
