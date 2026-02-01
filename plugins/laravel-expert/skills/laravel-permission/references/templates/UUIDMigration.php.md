---
name: UUIDMigration
description: Migration for UUID-based permission tables
keywords: uuid, migration, permission, role, pivot
---

# UUID Migration

Complete migration for UUID-based permission tables.

## File: database/migrations/xxxx_create_permission_tables.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $teams = config('permission.teams');
        $tableNames = config('permission.table_names');
        $columnNames = config('permission.column_names');
        $pivotRole = $columnNames['role_pivot_key'] ?? 'role_uuid';
        $pivotPermission = $columnNames['permission_pivot_key'] ?? 'permission_uuid';

        if (empty($tableNames)) {
            throw new \Exception('Error: config/permission.php not loaded.');
        }

        // Permissions table
        Schema::create($tableNames['permissions'], function (Blueprint $table) use ($teams) {
            $table->uuid('uuid')->primary();
            $table->string('name');
            $table->string('guard_name');

            if ($teams) {
                $table->unsignedBigInteger('team_id')->nullable();
                $table->unique(['team_id', 'name', 'guard_name']);
            } else {
                $table->unique(['name', 'guard_name']);
            }

            $table->timestamps();
        });

        // Roles table
        Schema::create($tableNames['roles'], function (Blueprint $table) use ($teams) {
            $table->uuid('uuid')->primary();
            $table->string('name');
            $table->string('guard_name');

            if ($teams) {
                $table->unsignedBigInteger('team_id')->nullable();
                $table->unique(['team_id', 'name', 'guard_name']);
            } else {
                $table->unique(['name', 'guard_name']);
            }

            $table->timestamps();
        });

        // Model has permissions pivot
        Schema::create($tableNames['model_has_permissions'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotPermission, $teams) {
            $table->uuid($pivotPermission);
            $table->string('model_type');
            $table->uuid($columnNames['model_morph_key']);

            if ($teams) {
                $table->unsignedBigInteger('team_id')->nullable();
            }

            $table->index([$columnNames['model_morph_key'], 'model_type']);

            $table->foreign($pivotPermission)
                ->references('uuid')
                ->on($tableNames['permissions'])
                ->cascadeOnDelete();

            if ($teams) {
                $table->primary([$pivotPermission, $columnNames['model_morph_key'], 'model_type', 'team_id']);
            } else {
                $table->primary([$pivotPermission, $columnNames['model_morph_key'], 'model_type']);
            }
        });

        // Model has roles pivot
        Schema::create($tableNames['model_has_roles'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole, $teams) {
            $table->uuid($pivotRole);
            $table->string('model_type');
            $table->uuid($columnNames['model_morph_key']);

            if ($teams) {
                $table->unsignedBigInteger('team_id')->nullable();
            }

            $table->index([$columnNames['model_morph_key'], 'model_type']);

            $table->foreign($pivotRole)
                ->references('uuid')
                ->on($tableNames['roles'])
                ->cascadeOnDelete();

            if ($teams) {
                $table->primary([$pivotRole, $columnNames['model_morph_key'], 'model_type', 'team_id']);
            } else {
                $table->primary([$pivotRole, $columnNames['model_morph_key'], 'model_type']);
            }
        });

        // Role has permissions pivot
        Schema::create($tableNames['role_has_permissions'], function (Blueprint $table) use ($tableNames, $pivotRole, $pivotPermission) {
            $table->uuid($pivotPermission);
            $table->uuid($pivotRole);

            $table->foreign($pivotPermission)
                ->references('uuid')
                ->on($tableNames['permissions'])
                ->cascadeOnDelete();

            $table->foreign($pivotRole)
                ->references('uuid')
                ->on($tableNames['roles'])
                ->cascadeOnDelete();

            $table->primary([$pivotPermission, $pivotRole]);
        });

        app('cache')
            ->store(config('permission.cache.store') ?? 'default')
            ->forget(config('permission.cache.key'));
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableNames = config('permission.table_names');

        if (empty($tableNames)) {
            throw new \Exception('Error: config/permission.php not loaded.');
        }

        Schema::dropIfExists($tableNames['role_has_permissions']);
        Schema::dropIfExists($tableNames['model_has_roles']);
        Schema::dropIfExists($tableNames['model_has_permissions']);
        Schema::dropIfExists($tableNames['roles']);
        Schema::dropIfExists($tableNames['permissions']);
    }
};
```

## Config Adjustments

```php
<?php

// config/permission.php
return [
    'models' => [
        'permission' => App\Models\Permission::class,
        'role' => App\Models\Role::class,
    ],

    'table_names' => [
        'roles' => 'roles',
        'permissions' => 'permissions',
        'model_has_permissions' => 'model_has_permissions',
        'model_has_roles' => 'model_has_roles',
        'role_has_permissions' => 'role_has_permissions',
    ],

    'column_names' => [
        'role_pivot_key' => 'role_uuid',
        'permission_pivot_key' => 'permission_uuid',
        'model_morph_key' => 'model_uuid',
        'team_foreign_key' => 'team_id',
    ],

    // ... rest of config
];
```

## User Model with UUID

```php
<?php

// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;

final class User extends Authenticatable
{
    use HasFactory;
    use HasRoles;
    use HasUuids;
    use Notifiable;

    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';

    // ... rest of model
}
```

## Users Migration with UUID

```php
<?php

// database/migrations/xxxx_create_users_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }
};
```
