---
name: WildcardSeeder
description: Seeder for hierarchical wildcard permissions
keywords: wildcard, seeder, hierarchy, module
---

# Wildcard Permission Seeder

Seeder for creating hierarchical permissions with wildcards.

## File: database/seeders/WildcardPermissionSeeder.php

```php
<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seed hierarchical permissions with wildcards.
 */
final class WildcardPermissionSeeder extends Seeder
{
    /**
     * Modules and their CRUD permissions.
     *
     * @var list<string>
     */
    private array $modules = [
        'articles',
        'users',
        'settings',
        'reports',
    ];

    /**
     * Standard CRUD actions.
     *
     * @var list<string>
     */
    private array $actions = [
        'view',
        'create',
        'edit',
        'delete',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Create specific permissions
        $this->createModulePermissions();

        // Create wildcard permissions
        $this->createWildcardPermissions();

        // Create roles with wildcards
        $this->createRoles();

        $this->command->info('Wildcard permissions created!');
    }

    /**
     * Create specific permissions for each module.
     */
    private function createModulePermissions(): void
    {
        foreach ($this->modules as $module) {
            foreach ($this->actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$module}.{$action}",
                    'guard_name' => 'web',
                ]);
            }
        }

        // Add nested permissions for complex modules
        $nestedPermissions = [
            'articles.comments.view',
            'articles.comments.create',
            'articles.comments.delete',
            'articles.comments.moderate',
            'reports.export',
            'reports.schedule',
        ];

        foreach ($nestedPermissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }

    /**
     * Create wildcard permissions.
     */
    private function createWildcardPermissions(): void
    {
        $wildcards = [
            // Module-level wildcards
            'articles.*',
            'users.*',
            'settings.*',
            'reports.*',
            // Sub-module wildcards
            'articles.comments.*',
            // View-all wildcard
            '*.view',
            // Super wildcard
            '*',
        ];

        foreach ($wildcards as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }

    /**
     * Create roles with appropriate wildcard permissions.
     */
    private function createRoles(): void
    {
        // Super Admin - all permissions
        $superAdmin = Role::firstOrCreate([
            'name' => 'Super-Admin',
            'guard_name' => 'web',
        ]);
        $superAdmin->givePermissionTo('*');

        // Admin - full article and user management
        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);
        $admin->givePermissionTo([
            'articles.*',
            'users.*',
            'reports.*',
        ]);

        // Editor - all article operations including comments
        $editor = Role::firstOrCreate([
            'name' => 'editor',
            'guard_name' => 'web',
        ]);
        $editor->givePermissionTo([
            'articles.*',
            'articles.comments.*',
        ]);

        // Writer - create and edit articles, view comments
        $writer = Role::firstOrCreate([
            'name' => 'writer',
            'guard_name' => 'web',
        ]);
        $writer->givePermissionTo([
            'articles.view',
            'articles.create',
            'articles.edit',
            'articles.comments.view',
            'articles.comments.create',
        ]);

        // Viewer - view everything
        $viewer = Role::firstOrCreate([
            'name' => 'viewer',
            'guard_name' => 'web',
        ]);
        $viewer->givePermissionTo('*.view');

        // Report Analyst - all report operations
        $analyst = Role::firstOrCreate([
            'name' => 'analyst',
            'guard_name' => 'web',
        ]);
        $analyst->givePermissionTo('reports.*');
    }
}
```

## Config Requirement

```php
// config/permission.php
'enable_wildcard_permission' => true,
```

## Usage

```bash
php artisan db:seed --class=WildcardPermissionSeeder
```
