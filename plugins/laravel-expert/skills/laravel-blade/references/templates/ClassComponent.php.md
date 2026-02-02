---
name: ClassComponent
description: Class-based component with dependency injection
when-to-use: Components requiring services or computed properties
keywords: class, component, injection, computed, props
---

# Class-based Component

## Component Class

```php
<?php

declare(strict_types=1);

namespace App\View\Components;

use App\Services\NotificationService;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public string $message = '',
        public bool $dismissible = true,
        private NotificationService $notifications = new NotificationService()
    ) {}

    /**
     * Computed property - accessible in view as $alertClasses
     */
    public function alertClasses(): string
    {
        return match ($this->type) {
            'success' => 'bg-green-100 border-green-500 text-green-700',
            'warning' => 'bg-yellow-100 border-yellow-500 text-yellow-700',
            'error' => 'bg-red-100 border-red-500 text-red-700',
            default => 'bg-blue-100 border-blue-500 text-blue-700',
        };
    }

    /**
     * Computed property - accessible as $icon
     */
    public function icon(): string
    {
        return match ($this->type) {
            'success' => 'check-circle',
            'warning' => 'exclamation-triangle',
            'error' => 'x-circle',
            default => 'information-circle',
        };
    }

    /**
     * Control rendering
     */
    public function shouldRender(): bool
    {
        return !empty($this->message);
    }

    public function render(): View
    {
        return view('components.alert');
    }
}
```

## Component View

```blade
{{-- resources/views/components/alert.blade.php --}}
<div
    {{ $attributes->merge([
        'class' => 'border-l-4 p-4 rounded ' . $alertClasses(),
        'role' => 'alert'
    ]) }}
    x-data="{ open: true }"
    x-show="open"
>
    <div class="flex items-start">
        <x-dynamic-component :component="'heroicon-o-' . $icon()" class="h-5 w-5 mr-3 flex-shrink-0" />

        <div class="flex-1">
            {{ $message }}
            {{ $slot }}
        </div>

        @if ($dismissible)
            <button
                type="button"
                class="ml-4 text-current opacity-50 hover:opacity-100"
                @click="open = false"
            >
                <x-heroicon-o-x-mark class="h-5 w-5" />
            </button>
        @endif
    </div>
</div>
```

## Usage

```blade
{{-- Basic usage --}}
<x-alert type="success" message="Operation completed!" />

{{-- With additional content --}}
<x-alert type="error" message="Failed to save">
    <p class="mt-2 text-sm">Please try again or contact support.</p>
</x-alert>

{{-- With attributes --}}
<x-alert
    type="warning"
    message="Session expiring"
    :dismissible="false"
    class="mt-4"
    id="session-alert"
/>

{{-- Dynamic type --}}
<x-alert :type="$notification->level" :message="$notification->text" />
```

## With Service Injection

```php
<?php

declare(strict_types=1);

namespace App\View\Components;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class UserCard extends Component
{
    public User $user;

    public function __construct(
        int $userId,
        private UserRepository $users
    ) {
        $this->user = $this->users->findOrFail($userId);
    }

    public function avatarUrl(): string
    {
        return $this->user->avatar_url
            ?? 'https://ui-avatars.com/api/?name=' . urlencode($this->user->name);
    }

    public function render(): View
    {
        return view('components.user-card');
    }
}
```

## Artisan Command

```bash
# Create class component
php artisan make:component Alert

# Create in subdirectory
php artisan make:component Forms/Input

# Create inline (no view)
php artisan make:component Alert --inline
```
