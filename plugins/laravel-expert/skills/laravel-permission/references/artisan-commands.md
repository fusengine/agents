---
name: artisan-commands
description: Spatie Permission artisan commands for CLI management
when-to-use: Managing roles and permissions from command line
keywords: artisan, cli, command, create-role, create-permission, show
priority: medium
related: spatie-permission.md
---

# Artisan Commands

## Overview

Spatie provides artisan commands for managing roles and permissions from CLI.

## Create Permission

```bash
# Basic
php artisan permission:create-permission "edit articles"

# With specific guard
php artisan permission:create-permission "edit articles" api

# Multiple permissions
php artisan permission:create-permission "create articles"
php artisan permission:create-permission "delete articles"
```

## Create Role

```bash
# Basic
php artisan permission:create-role editor

# With specific guard
php artisan permission:create-role editor web

# With permissions (pipe-separated)
php artisan permission:create-role editor web "edit articles|delete articles"

# With team ID (when teams enabled)
php artisan permission:create-role editor --team-id=1
php artisan permission:create-role editor api --team-id=1
```

## Show Permissions and Roles

```bash
php artisan permission:show
```

Output example:

```
+-------+-------------------+
| Guard | Permissions       |
+-------+-------------------+
| web   | edit articles     |
|       | delete articles   |
|       | publish articles  |
+-------+-------------------+
| api   | api-access        |
+-------+-------------------+

+-------+-------------------+
| Guard | Roles             |
+-------+-------------------+
| web   | admin             |
|       | editor            |
|       | writer            |
+-------+-------------------+
```

## Reset Permission Cache

```bash
php artisan permission:cache-reset
```

Use after:
- Direct database modifications
- Deployment with permission changes
- Debugging permission issues

## Upgrade Teams

```bash
php artisan permission:upgrade-teams
```

Adds `team_id` column to permission tables when enabling teams feature.

## Custom Commands

### Create Setup Command

```php
<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

final class SetupPermissions extends Command
{
    protected $signature = 'app:setup-permissions';
    protected $description = 'Setup default roles and permissions';

    public function handle(): int
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $this->createPermissions();
        $this->createRoles();

        $this->info('Permissions setup complete!');

        return Command::SUCCESS;
    }

    private function createPermissions(): void
    {
        $permissions = [
            'view articles',
            'create articles',
            'edit articles',
            'delete articles',
            'publish articles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
            $this->line("Created permission: $permission");
        }
    }

    private function createRoles(): void
    {
        $roles = [
            'admin' => Permission::all(),
            'editor' => ['view articles', 'create articles', 'edit articles'],
            'writer' => ['view articles', 'create articles'],
        ];

        foreach ($roles as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($permissions);
            $this->line("Created role: $roleName");
        }
    }
}
```

### Usage

```bash
php artisan app:setup-permissions
```

## Scripts for CI/CD

```bash
#!/bin/bash
# deploy.sh

# Clear permission cache after deployment
php artisan permission:cache-reset

# Show current state
php artisan permission:show
```
