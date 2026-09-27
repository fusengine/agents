---
name: PermissionEventListener
description: Event listeners for role and permission changes
keywords: event, listener, roleattached, audit, notification
---

# Permission Event Listeners

Listeners for Spatie Permission events (v7+ class names with `Event` suffix; enable with `'events_enabled' => true` in `config/permission.php`).

## File: app/Listeners/LogRoleChanges.php

```php
<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Support\Facades\Log;
use Spatie\Permission\Events\RoleAttachedEvent;
use Spatie\Permission\Events\RoleDetachedEvent;

/**
 * Log role assignment changes.
 */
final class LogRoleChanges
{
    /**
     * Handle role attached event.
     */
    public function handleRoleAttached(RoleAttachedEvent $event): void
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
    public function handleRoleDetached(RoleDetachedEvent $event): void
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
use Spatie\Permission\Events\PermissionAttachedEvent;
use Spatie\Permission\Events\PermissionDetachedEvent;

/**
 * Log permission assignment changes.
 */
final class LogPermissionChanges
{
    /**
     * Handle permission attached event.
     */
    public function handlePermissionAttached(PermissionAttachedEvent $event): void
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
    public function handlePermissionDetached(PermissionDetachedEvent $event): void
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
use Spatie\Permission\Events\PermissionAttachedEvent;
use Spatie\Permission\Events\PermissionDetachedEvent;
use Spatie\Permission\Events\RoleAttachedEvent;
use Spatie\Permission\Events\RoleDetachedEvent;

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
        RoleAttachedEvent::class => [
            [LogRoleChanges::class, 'handleRoleAttached'],
        ],
        RoleDetachedEvent::class => [
            [LogRoleChanges::class, 'handleRoleDetached'],
        ],
        PermissionAttachedEvent::class => [
            [LogPermissionChanges::class, 'handlePermissionAttached'],
        ],
        PermissionDetachedEvent::class => [
            [LogPermissionChanges::class, 'handlePermissionDetached'],
        ],
    ];
}
```

## Laravel 11+ Auto-Discovered Listener

Laravel discovers listeners in `app/Listeners` automatically from the type-hinted `handle()` argument — no attribute or registration needed.

```php
<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Spatie\Permission\Events\RoleAttachedEvent;

final class NotifySecurityTeam implements ShouldQueue
{
    public function handle(RoleAttachedEvent $event): void
    {
        if ($event->role->name === 'Super-Admin') {
            // Send notification to security team
            // Notification::send(...);
        }
    }
}
```
