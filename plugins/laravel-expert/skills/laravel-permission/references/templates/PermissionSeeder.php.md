---
name: PermissionSeeder
description: Database seeder for creating permissions
keywords: seeder, permission, database, seed
---

# Permission Seeder

Seeder for creating all application permissions.

## File: database/seeders/PermissionSeeder.php

```php
<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seed application permissions.
 */
final class PermissionSeeder extends Seeder
{
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
        ],
        'settings' => [
            'view settings',
            'edit settings',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach ($this->permissions as $group => $permissions) {
            $this->command->info("Creating {$group} permissions...");

            foreach ($permissions as $permission) {
                Permission::firstOrCreate([
                    'name' => $permission,
                    'guard_name' => 'web',
                ]);
            }
        }

        $this->command->info('Permissions created successfully!');
    }
}
```

## Usage

```bash
# Run seeder
php artisan db:seed --class=PermissionSeeder

# Or add to DatabaseSeeder.php
$this->call([
    PermissionSeeder::class,
    RoleSeeder::class,
]);
```
