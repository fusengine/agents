---
name: RoleSeeder
description: Complete seeder for roles and permissions
keywords: seeder, role, permission, database
---

# Role & Permission Seeder

## File: database/seeders/RoleSeeder.php

```php
<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seed roles and permissions.
 */
final class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'view articles',
            'create articles',
            'edit articles',
            'delete articles',
            'publish articles',
            'manage users',
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        $writer = Role::create(['name' => 'writer']);
        $writer->givePermissionTo([
            'view articles',
            'create articles',
            'edit articles',
        ]);

        $editor = Role::create(['name' => 'editor']);
        $editor->givePermissionTo([
            'view articles',
            'create articles',
            'edit articles',
            'publish articles',
        ]);

        $viewer = Role::create(['name' => 'viewer']);
        $viewer->givePermissionTo(['view articles']);
    }
}
```

## Register in DatabaseSeeder

```php
// database/seeders/DatabaseSeeder.php
public function run(): void
{
    $this->call([
        RoleSeeder::class,
        UserSeeder::class,
    ]);
}
```

## Assign Role in UserSeeder

```php
// database/seeders/UserSeeder.php
$admin = User::factory()->create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
]);
$admin->assignRole('admin');
```
