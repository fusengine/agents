---
name: PermissionTest
description: Complete test examples for roles and permissions
keywords: test, pest, phpunit, permission, role
---

# Permission Tests

Complete test examples using Pest and PHPUnit.

## File: tests/Feature/PermissionTest.php (Pest)

```php
<?php

declare(strict_types=1);

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function () {
    // Reset permission cache before each test
    app(PermissionRegistrar::class)->forgetCachedPermissions();
});

describe('Role Assignment', function () {
    it('can assign a role to a user', function () {
        $user = User::factory()->create();
        $role = Role::create(['name' => 'admin']);

        $user->assignRole('admin');

        expect($user->hasRole('admin'))->toBeTrue();
        expect($user->roles)->toHaveCount(1);
    });

    it('can assign multiple roles', function () {
        $user = User::factory()->create();
        Role::create(['name' => 'writer']);
        Role::create(['name' => 'editor']);

        $user->assignRole(['writer', 'editor']);

        expect($user->hasAllRoles(['writer', 'editor']))->toBeTrue();
    });

    it('can sync roles replacing existing', function () {
        $user = User::factory()->create();
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'writer']);

        $user->assignRole('admin');
        $user->syncRoles(['writer']);

        expect($user->hasRole('admin'))->toBeFalse();
        expect($user->hasRole('writer'))->toBeTrue();
    });

    it('can remove a role', function () {
        $user = User::factory()->create();
        Role::create(['name' => 'admin']);

        $user->assignRole('admin');
        $user->removeRole('admin');

        expect($user->hasRole('admin'))->toBeFalse();
    });
});

describe('Permission Checks', function () {
    it('user has permission directly assigned', function () {
        $user = User::factory()->create();
        Permission::create(['name' => 'edit articles']);

        $user->givePermissionTo('edit articles');

        expect($user->hasPermissionTo('edit articles'))->toBeTrue();
        expect($user->can('edit articles'))->toBeTrue();
    });

    it('user has permission via role', function () {
        $user = User::factory()->create();
        $permission = Permission::create(['name' => 'publish articles']);
        $role = Role::create(['name' => 'editor']);
        $role->givePermissionTo($permission);

        $user->assignRole('editor');

        expect($user->hasPermissionTo('publish articles'))->toBeTrue();
        expect($user->can('publish articles'))->toBeTrue();
    });

    it('user lacks permission they were not given', function () {
        $user = User::factory()->create();
        Permission::create(['name' => 'delete articles']);

        expect($user->hasPermissionTo('delete articles'))->toBeFalse();
        expect($user->can('delete articles'))->toBeFalse();
    });
});

describe('Middleware Protection', function () {
    it('allows access with correct role', function () {
        $user = User::factory()->create();
        Role::create(['name' => 'admin']);
        $user->assignRole('admin');

        $this->actingAs($user)
            ->get('/admin/dashboard')
            ->assertOk();
    });

    it('denies access without correct role', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/dashboard')
            ->assertForbidden();
    });

    it('allows access with correct permission', function () {
        $user = User::factory()->create();
        Permission::create(['name' => 'access dashboard']);
        $user->givePermissionTo('access dashboard');

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk();
    });
});

describe('Super Admin', function () {
    it('bypasses all permission checks', function () {
        $user = User::factory()->create();
        Role::create(['name' => 'Super-Admin']);
        $user->assignRole('Super-Admin');

        // Super admin can do anything
        expect($user->can('any-permission'))->toBeTrue();
        expect($user->can('non-existent-permission'))->toBeTrue();
    });

    it('can access admin routes', function () {
        $user = User::factory()->create();
        Role::create(['name' => 'Super-Admin']);
        $user->assignRole('Super-Admin');

        $this->actingAs($user)
            ->get('/admin/dangerous-action')
            ->assertOk();
    });
});

describe('Direct vs Role Permissions', function () {
    it('distinguishes direct from role permissions', function () {
        $user = User::factory()->create();
        $role = Role::create(['name' => 'editor']);

        Permission::create(['name' => 'edit articles']);
        Permission::create(['name' => 'delete articles']);

        $role->givePermissionTo('edit articles');
        $user->assignRole('editor');
        $user->givePermissionTo('delete articles');

        expect($user->hasDirectPermission('delete articles'))->toBeTrue();
        expect($user->hasDirectPermission('edit articles'))->toBeFalse();

        $direct = $user->getDirectPermissions()->pluck('name')->toArray();
        $viaRole = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        expect($direct)->toContain('delete articles');
        expect($viaRole)->toContain('edit articles');
    });
});
```

## File: tests/Feature/PermissionTest.php (PHPUnit)

```php
<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

final class PermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Reset permission cache
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function test_can_assign_role_to_user(): void
    {
        $user = User::factory()->create();
        Role::create(['name' => 'admin']);

        $user->assignRole('admin');

        $this->assertTrue($user->hasRole('admin'));
        $this->assertCount(1, $user->roles);
    }

    public function test_user_has_permission_via_role(): void
    {
        $user = User::factory()->create();
        $permission = Permission::create(['name' => 'edit articles']);
        $role = Role::create(['name' => 'editor']);
        $role->givePermissionTo($permission);

        $user->assignRole('editor');

        $this->assertTrue($user->can('edit articles'));
    }

    public function test_middleware_blocks_unauthorized_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/admin/dashboard')
            ->assertForbidden();
    }

    public function test_middleware_allows_authorized_user(): void
    {
        $user = User::factory()->create();
        Role::create(['name' => 'admin']);
        $user->assignRole('admin');

        $this->actingAs($user)
            ->get('/admin/dashboard')
            ->assertOk();
    }
}
```

## File: tests/Feature/Api/PermissionApiTest.php

```php
<?php

declare(strict_types=1);

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function () {
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    // Create API permissions
    Permission::create(['name' => 'api:posts:list', 'guard_name' => 'api']);
    Permission::create(['name' => 'api:posts:create', 'guard_name' => 'api']);

    $role = Role::create(['name' => 'api-editor', 'guard_name' => 'api']);
    $role->givePermissionTo(['api:posts:list', 'api:posts:create']);
});

it('allows API access with correct permission', function () {
    $user = User::factory()->create();
    $user->assignRole('api-editor');

    Sanctum::actingAs($user);

    $this->getJson('/api/posts')
        ->assertOk();
});

it('denies API access without permission', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $this->getJson('/api/posts')
        ->assertForbidden()
        ->assertJson([
            'error' => 'unauthorized',
        ]);
});

it('returns permissions in login response', function () {
    $user = User::factory()->create();
    $user->assignRole('api-editor');

    $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
        'device_name' => 'test',
    ])
        ->assertOk()
        ->assertJsonStructure([
            'token',
            'user' => [
                'roles',
                'permissions',
            ],
        ]);
});
```
