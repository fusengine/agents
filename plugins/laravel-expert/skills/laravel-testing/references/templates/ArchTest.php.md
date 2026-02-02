---
name: ArchTest
description: Architecture test template for code structure validation
file-type: template
---

# Architecture Test Template

## tests/Arch.php

```php
<?php

declare(strict_types=1);

/**
 * Architecture tests ensure code structure follows conventions.
 * Run with: ./vendor/bin/pest --test-arch
 */

// =============================================
// STRICT TYPES
// =============================================

arch('all files use strict types')
    ->expect('App')
    ->toUseStrictTypes();

// =============================================
// CONTROLLERS
// =============================================

arch('controllers extend base controller')
    ->expect('App\Http\Controllers')
    ->toExtend('App\Http\Controllers\Controller');

arch('controllers have Controller suffix')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller');

arch('controllers are final')
    ->expect('App\Http\Controllers')
    ->toBeFinal();

arch('controllers should not use models directly')
    ->expect('App\Http\Controllers')
    ->not->toUse('App\Models')
    ->ignoring('App\Http\Controllers\Api'); // API controllers may use models

// =============================================
// MODELS
// =============================================

arch('models extend eloquent model')
    ->expect('App\Models')
    ->toExtend('Illuminate\Database\Eloquent\Model');

arch('models use HasFactory trait')
    ->expect('App\Models')
    ->toUseTrait('Illuminate\Database\Eloquent\Factories\HasFactory');

// =============================================
// JOBS
// =============================================

arch('jobs implement ShouldQueue')
    ->expect('App\Jobs')
    ->toImplement('Illuminate\Contracts\Queue\ShouldQueue');

arch('jobs are final')
    ->expect('App\Jobs')
    ->toBeFinal();

// =============================================
// REQUESTS
// =============================================

arch('requests extend FormRequest')
    ->expect('App\Http\Requests')
    ->toExtend('Illuminate\Foundation\Http\FormRequest');

arch('requests have Request suffix')
    ->expect('App\Http\Requests')
    ->toHaveSuffix('Request');

// =============================================
// SERVICES
// =============================================

arch('services are final')
    ->expect('App\Services')
    ->toBeFinal();

arch('services have Service suffix')
    ->expect('App\Services')
    ->toHaveSuffix('Service');

// =============================================
// REPOSITORIES
// =============================================

arch('repositories implement interface')
    ->expect('App\Repositories')
    ->toImplement('App\Contracts\RepositoryInterface');

// =============================================
// EVENTS
// =============================================

arch('events are final')
    ->expect('App\Events')
    ->toBeFinal();

arch('events are readonly')
    ->expect('App\Events')
    ->toBeReadonly();

// =============================================
// LISTENERS
// =============================================

arch('listeners have Listener suffix')
    ->expect('App\Listeners')
    ->toHaveSuffix('Listener');

// =============================================
// MAIL
// =============================================

arch('mailables extend Mailable')
    ->expect('App\Mail')
    ->toExtend('Illuminate\Mail\Mailable');

// =============================================
// NOTIFICATIONS
// =============================================

arch('notifications extend Notification')
    ->expect('App\Notifications')
    ->toExtend('Illuminate\Notifications\Notification');

// =============================================
// POLICIES
// =============================================

arch('policies have Policy suffix')
    ->expect('App\Policies')
    ->toHaveSuffix('Policy');

// =============================================
// DEBUGGING
// =============================================

arch('no debugging statements')
    ->expect(['dd', 'dump', 'var_dump', 'print_r', 'ray'])
    ->not->toBeUsed();

arch('no die or exit')
    ->expect(['die', 'exit'])
    ->not->toBeUsed();

// =============================================
// ENVIRONMENT
// =============================================

arch('env() only used in config')
    ->expect('env')
    ->toOnlyBeUsedIn('config');

// =============================================
// DEPENDENCIES
// =============================================

arch('domain layer does not depend on infrastructure')
    ->expect('App\Domain')
    ->not->toUse('App\Infrastructure');

arch('services only use contracts')
    ->expect('App\Services')
    ->toOnlyUse([
        'App\Contracts',
        'App\Data',
        'App\Exceptions',
        'Illuminate\Support',
    ]);

// =============================================
// LARAVEL PRESET
// =============================================

// Use Laravel preset for common rules
arch()->preset()->laravel();

// Use security preset
arch()->preset()->security();
```

## Custom Architecture Rules

```php
<?php

// tests/Arch/CustomRules.php

arch('DTOs are readonly')
    ->expect('App\Data')
    ->toBeReadonly()
    ->toHaveSuffix('Data');

arch('actions have single public method')
    ->expect('App\Actions')
    ->toHaveMethod('execute')
    ->toHaveSuffix('Action');

arch('no facade usage in domain')
    ->expect('App\Domain')
    ->not->toUse('Illuminate\Support\Facades');

arch('value objects are immutable')
    ->expect('App\ValueObjects')
    ->toBeReadonly()
    ->toBeFinal();

arch('exceptions extend base exception')
    ->expect('App\Exceptions')
    ->toExtend('Exception');

arch('contracts are interfaces')
    ->expect('App\Contracts')
    ->toBeInterfaces();

arch('enums are backed')
    ->expect('App\Enums')
    ->toBeEnums()
    ->toHaveMethod('value');
```

## Ignoring Legacy Code

```php
<?php

arch('modern code uses strict types')
    ->expect('App')
    ->ignoring([
        'App\Legacy',
        'App\Generated',
    ])
    ->toUseStrictTypes();

arch('controllers are final')
    ->expect('App\Http\Controllers')
    ->ignoring('App\Http\Controllers\Admin\LegacyController')
    ->toBeFinal();
```
