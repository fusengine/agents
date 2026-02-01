---
name: SetupPermissions
description: Custom artisan command for permission setup
keywords: artisan, command, setup, permission, role
---

# Setup Permissions Command

Custom artisan command for reproducible permission setup.

## File: app/Console/Commands/SetupPermissions.php

```php
<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Setup application roles and permissions.
 */
final class SetupPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:setup-permissions
                            {--fresh : Clear existing permissions before setup}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup application roles and permissions';

    /**
     * Permissions grouped by resource.
     *
     * @var array<string, list<string>>
     */
    private array $permissions = [
        'articles' => [
            'view articles',
            'create articles',
            'edit articles',
            'delete articles',
            'publish articles',
        ],
        'users' => [
            'view users',
            'create users',
            'edit users',
            'delete users',
            'manage users',
        ],
        'settings' => [
            'view settings',
            'edit settings',
        ],
        'reports' => [
            'view reports',
            'export reports',
        ],
    ];

    /**
     * Roles and their permissions.
     *
     * @var array<string, list<string>>
     */
    private array $roles = [
        'admin' => ['*'],  // Will get all permissions
        'editor' => [
            'view articles',
            'create articles',
            'edit articles',
            'delete articles',
            'publish articles',
        ],
        'writer' => [
            'view articles',
            'create articles',
            'edit articles',
        ],
        'viewer' => [
            'view articles',
            'view reports',
        ],
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Setting up permissions...');

        // Reset cache
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        if ($this->option('fresh')) {
            $this->freshSetup();
        }

        $this->createPermissions();
        $this->createRoles();

        $this->info('Permissions setup complete!');
        $this->newLine();
        $this->call('permission:show');

        return Command::SUCCESS;
    }

    /**
     * Clear existing permissions and roles.
     */
    private function freshSetup(): void
    {
        $this->warn('Clearing existing permissions and roles...');

        // Clear pivot tables first
        \DB::table('model_has_permissions')->truncate();
        \DB::table('model_has_roles')->truncate();
        \DB::table('role_has_permissions')->truncate();

        // Then clear main tables
        Role::query()->delete();
        Permission::query()->delete();
    }

    /**
     * Create all permissions.
     */
    private function createPermissions(): void
    {
        $this->info('Creating permissions...');

        $bar = $this->output->createProgressBar(
            collect($this->permissions)->flatten()->count()
        );

        foreach ($this->permissions as $group => $permissions) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate([
                    'name' => $permission,
                    'guard_name' => 'web',
                ]);
                $bar->advance();
            }
        }

        $bar->finish();
        $this->newLine();
    }

    /**
     * Create roles and assign permissions.
     */
    private function createRoles(): void
    {
        $this->info('Creating roles...');

        foreach ($this->roles as $roleName => $permissions) {
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);

            if ($permissions === ['*']) {
                $role->syncPermissions(Permission::all());
                $this->line("  Created role: {$roleName} (all permissions)");
            } else {
                $role->syncPermissions($permissions);
                $this->line("  Created role: {$roleName}");
            }
        }
    }
}
```

## Usage

```bash
# Normal setup (adds missing permissions)
php artisan app:setup-permissions

# Fresh setup (clears and recreates all)
php artisan app:setup-permissions --fresh
```

## Registration

The command is auto-discovered in Laravel 11+. For older versions:

```php
// app/Console/Kernel.php
protected $commands = [
    \App\Console\Commands\SetupPermissions::class,
];
```
