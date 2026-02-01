---
name: teams
description: Multi-tenant team-based permissions with Spatie Laravel Permission
when-to-use: Implementing multi-tenant RBAC with team/organization scoping
keywords: teams, multi-tenant, organization, scope, team-id
priority: high
related: spatie-permission.md
---

# Team-Based Permissions (Multi-Tenant)

## Overview

Teams allow scoping roles and permissions to specific teams/organizations in multi-tenant applications.

## Enable Teams

```php
// config/permission.php
'teams' => true,
```

Run migration upgrade:

```bash
php artisan permission:upgrade-teams
php artisan migrate
```

## Setting Team Context

```php
use App\Models\Team;

// Set current team context
$team = Team::find(1);
setPermissionsTeamId($team->id);

// Get current team ID
$currentTeamId = getPermissionsTeamId();
```

## Team-Scoped Roles

```php
use Spatie\Permission\Models\Role;

// Create role for specific team
$teamEditor = Role::create([
    'name' => 'editor',
    'team_id' => $team->id
]);

// Global role (no team restriction)
$globalAdmin = Role::create([
    'name' => 'super-admin',
    'team_id' => null
]);
```

## Team-Scoped Permissions

```php
use Spatie\Permission\Models\Permission;

// Create permission for specific team
$teamPermission = Permission::create([
    'name' => 'edit team articles',
    'team_id' => $team->id
]);

// Assign to role
$teamEditor->givePermissionTo($teamPermission);
```

## Assigning Roles Within Team

```php
// Set team context BEFORE assigning
setPermissionsTeamId($team->id);
$user->assignRole('editor');

// Switch team context
$otherTeam = Team::find(2);
setPermissionsTeamId($otherTeam->id);

// User's permissions are now scoped to other team
if (!$user->hasRole('editor')) {
    // User might not have editor role in THIS team
}
```

## Team Model Boot Example

```php
namespace App\Models;

class Team extends Model
{
    public static function boot()
    {
        parent::boot();

        self::created(function ($model) {
            // Store current team
            $previousTeamId = getPermissionsTeamId();

            // Set new team context
            setPermissionsTeamId($model->id);

            // Assign role to creator
            auth()->user()->assignRole('team-admin');

            // Restore previous context
            setPermissionsTeamId($previousTeamId);
        });
    }
}
```

## Middleware for Team Context

```php
// app/Http/Middleware/SetTeamPermissions.php
public function handle(Request $request, Closure $next): Response
{
    if ($user = $request->user()) {
        $teamId = $request->route('team')?->id
            ?? $user->current_team_id;

        setPermissionsTeamId($teamId);
    }

    return $next($request);
}
```

## Best Practices

1. **Set team context early** in request lifecycle (middleware)
2. **Store/restore context** when switching teams temporarily
3. **Use global roles** for super-admins (`team_id = null`)
4. **Create team on registration** with default roles
