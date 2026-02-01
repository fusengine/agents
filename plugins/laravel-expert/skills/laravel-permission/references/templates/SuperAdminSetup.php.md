---
name: SuperAdminSetup
description: Complete Super Admin setup with Gate::before
keywords: super-admin, gate, bypass, provider
---

# Super Admin Setup

Complete setup for Super Admin role with Gate::before bypass.

## File: app/Providers/AppServiceProvider.php

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

/**
 * Application service provider.
 */
final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureSuperAdmin();
    }

    /**
     * Configure Super Admin to bypass all permission checks.
     */
    private function configureSuperAdmin(): void
    {
        Gate::before(function ($user, $ability) {
            // Super Admin bypasses all checks
            if ($user->hasRole('Super-Admin')) {
                return true;
            }

            // Return null to continue normal authorization
            return null;
        });
    }
}
```

## File: database/seeders/SuperAdminSeeder.php

```php
<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Create Super Admin role and user.
 */
final class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Create Super Admin role
        $superAdminRole = Role::firstOrCreate([
            'name' => 'Super-Admin',
            'guard_name' => 'web',
        ]);

        // Create Super Admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign role
        $superAdmin->assignRole($superAdminRole);

        $this->command->info('Super Admin created: admin@example.com');
    }
}
```

## Usage in Tests

```php
<?php

declare(strict_types=1);

use App\Models\User;

describe('Super Admin', function () {
    beforeEach(function () {
        $this->superAdmin = User::factory()->create();
        $this->superAdmin->assignRole('Super-Admin');

        $this->regularUser = User::factory()->create();
    });

    it('bypasses all permission checks', function () {
        expect($this->superAdmin->can('any-permission'))->toBeTrue();
        expect($this->superAdmin->can('non-existent'))->toBeTrue();
    });

    it('regular user cannot bypass', function () {
        expect($this->regularUser->can('any-permission'))->toBeFalse();
    });

    it('can access admin routes', function () {
        $this->actingAs($this->superAdmin)
            ->get('/admin/dashboard')
            ->assertOk();

        $this->actingAs($this->regularUser)
            ->get('/admin/dashboard')
            ->assertForbidden();
    });
});
```
