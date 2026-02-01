---
name: UserQueryExamples
description: Examples of querying users by roles and permissions
keywords: query, scope, filter, role, permission
---

# User Query Examples

Query scope examples for filtering users.

## Basic Queries

```php
<?php

use App\Models\User;

// Get all users with a specific role
$admins = User::role('admin')->get();

// Get all users with any of these roles
$staff = User::role(['admin', 'editor', 'writer'])->get();

// Get all users WITHOUT a specific role
$nonAdmins = User::withoutRole('admin')->get();

// Get all users with a specific permission
$editors = User::permission('edit articles')->get();

// Get all users WITHOUT a specific permission
$viewers = User::withoutPermission('delete articles')->get();
```

## Chained Queries

```php
<?php

use App\Models\User;

// Admins who are verified
$verifiedAdmins = User::role('admin')
    ->whereNotNull('email_verified_at')
    ->get();

// Editors created this month
$newEditors = User::role('editor')
    ->where('created_at', '>=', now()->startOfMonth())
    ->get();

// Users with permission, ordered by name
$sortedUsers = User::permission('publish articles')
    ->orderBy('name')
    ->get();

// Paginated admin list
$paginatedAdmins = User::role('admin')
    ->orderBy('created_at', 'desc')
    ->paginate(20);
```

## Complex Queries

```php
<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

// Users with role, eager loading roles
$usersWithRoles = User::role('editor')
    ->with('roles')
    ->get();

// Count users by role
$adminCount = User::role('admin')->count();
$editorCount = User::role('editor')->count();

// Users with multiple specific permissions
$powerUsers = User::permission('edit articles')
    ->permission('publish articles')
    ->get();

// Users with role in specific department
$departmentAdmins = User::role('admin')
    ->where('department_id', 5)
    ->get();
```

## Admin Panel Examples

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Spatie\Permission\Models\Role;

/**
 * Admin user management controller.
 */
final class UserController extends Controller
{
    /**
     * List users with optional role filter.
     */
    public function index(Request $request): View
    {
        $query = User::with('roles');

        // Filter by role if provided
        if ($role = $request->get('role')) {
            $query->role($role);
        }

        // Filter by permission if provided
        if ($permission = $request->get('permission')) {
            $query->permission($permission);
        }

        // Search by name or email
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('name')->paginate(25);
        $roles = Role::all();

        return view('admin.users.index', compact('users', 'roles'));
    }

    /**
     * Get users for a specific role.
     */
    public function byRole(Role $role): View
    {
        $users = User::role($role->name)
            ->with('roles', 'permissions')
            ->orderBy('name')
            ->paginate(25);

        return view('admin.users.by-role', compact('users', 'role'));
    }

    /**
     * Get users with sensitive permissions.
     */
    public function sensitiveUsers(): View
    {
        $sensitivePermissions = [
            'delete users',
            'manage settings',
            'view financials',
        ];

        $users = User::query()
            ->where(function ($query) use ($sensitivePermissions) {
                foreach ($sensitivePermissions as $permission) {
                    $query->orWhere(function ($q) use ($permission) {
                        $q->permission($permission);
                    });
                }
            })
            ->with('roles', 'permissions')
            ->get();

        return view('admin.users.sensitive', compact('users'));
    }
}
```

## Statistics Queries

```php
<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

// Count users per role
$roleCounts = Role::withCount('users')->get();

// Get role distribution
$distribution = [];
foreach (Role::all() as $role) {
    $distribution[$role->name] = User::role($role->name)->count();
}

// Active users by role (logged in last 30 days)
$activeByRole = [];
foreach (Role::all() as $role) {
    $activeByRole[$role->name] = User::role($role->name)
        ->where('last_login_at', '>=', now()->subDays(30))
        ->count();
}
```
