---
name: PermissionEventListener
description: Event listeners for role and permission changes
keywords: event, listener, roleattached, audit, notification
---

# Permission Event Listeners

Listeners for Spatie Permission events.

## File: app/Listeners/LogRoleChanges.php

```php
<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Support\Facades\Log;
use Spatie\Permission\Events\RoleAttached;
use Spatie\Permission\Events\RoleDetached;

/**
 * Log role assignment changes.
 */
final class LogRoleChanges
{
    /**
     * Handle role attached event.
     */
    public function handleRoleAttached(RoleAttached $event): void
    {
        Log::info('Role assigned', [
            'role' => $event->role->name,
            'model_type' => get_class($event->model),
            'model_id' => $event->model->getKey(),
            'actor_id' => auth()->id(),
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Handle role detached event.
     */
    public function handleRoleDetached(RoleDetached $event): void
    {
        Log::info('Role removed', [
            'role' => $event->role->name,
            'model_type' => get_class($event->model),
            'model_id' => $event->model->getKey(),
            'actor_id' => auth()->id(),
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
```

## File: app/Listeners/LogPermissionChanges.php

```php
<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Support\Facades\Log;
use Spatie\Permission\Events\PermissionAttached;
use Spatie\Permission\Events\PermissionDetached;

/**
 * Log permission assignment changes.
 */
final class LogPermissionChanges
{
    /**
     * Handle permission attached event.
     */
    public function handlePermissionAttached(PermissionAttached $event): void
    {
        Log::info('Permission granted', [
            'permission' => $event->permission->name,
            'model_type' => get_class($event->model),
            'model_id' => $event->model->getKey(),
            'actor_id' => auth()->id(),
        ]);
    }

    /**
     * Handle permission detached event.
     */
    public function handlePermissionDetached(PermissionDetached $event): void
    {
        Log::info('Permission revoked', [
            'permission' => $event->permission->name,
            'model_type' => get_class($event->model),
            'model_id' => $event->model->getKey(),
            'actor_id' => auth()->id(),
        ]);
    }
}
```

## File: app/Providers/EventServiceProvider.php

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use App\Listeners\LogPermissionChanges;
use App\Listeners\LogRoleChanges;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Spatie\Permission\Events\PermissionAttached;
use Spatie\Permission\Events\PermissionDetached;
use Spatie\Permission\Events\RoleAttached;
use Spatie\Permission\Events\RoleDetached;

/**
 * Event service provider.
 */
final class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        RoleAttached::class => [
            [LogRoleChanges::class, 'handleRoleAttached'],
        ],
        RoleDetached::class => [
            [LogRoleChanges::class, 'handleRoleDetached'],
        ],
        PermissionAttached::class => [
            [LogPermissionChanges::class, 'handlePermissionAttached'],
        ],
        PermissionDetached::class => [
            [LogPermissionChanges::class, 'handlePermissionDetached'],
        ],
    ];
}
```

## Laravel 11+ Attribute-Based Listener

```php
<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Events\Attribute\AsEventListener;
use Spatie\Permission\Events\RoleAttached;

#[AsEventListener]
final class NotifySecurityTeam implements ShouldQueue
{
    public function handle(RoleAttached $event): void
    {
        if ($event->role->name === 'Super-Admin') {
            // Send notification to security team
            // Notification::send(...);
        }
    }
}
```
