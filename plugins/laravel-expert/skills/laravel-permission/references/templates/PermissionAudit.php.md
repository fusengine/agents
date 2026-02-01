---
name: PermissionAudit
description: Service for auditing user permissions breakdown
keywords: audit, permission, direct, role, breakdown
---

# Permission Audit Service

Service for auditing and displaying user permissions breakdown.

## File: app/Services/PermissionAuditService.php

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Service for auditing user permissions.
 */
final class PermissionAuditService
{
    /**
     * Get complete permission breakdown for a user.
     *
     * @return array<string, mixed>
     */
    public function getBreakdown(User $user): array
    {
        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'roles' => $user->getRoleNames()->toArray(),
            'permissions' => [
                'direct' => $user->getDirectPermissions()->pluck('name')->toArray(),
                'via_roles' => $user->getPermissionsViaRoles()->pluck('name')->toArray(),
                'all' => $user->getAllPermissions()->pluck('name')->toArray(),
            ],
            'breakdown' => $this->getDetailedBreakdown($user),
        ];
    }

    /**
     * Get detailed breakdown showing source of each permission.
     *
     * @return array<string, array<string, mixed>>
     */
    public function getDetailedBreakdown(User $user): array
    {
        $breakdown = [];

        // Get all permissions with their source
        foreach ($user->getAllPermissions() as $permission) {
            $source = $this->getPermissionSource($user, $permission->name);

            $breakdown[$permission->name] = [
                'source' => $source['type'],
                'roles' => $source['roles'],
                'is_direct' => $source['is_direct'],
            ];
        }

        ksort($breakdown);

        return $breakdown;
    }

    /**
     * Determine the source of a permission.
     *
     * @return array{type: string, roles: list<string>, is_direct: bool}
     */
    public function getPermissionSource(User $user, string $permissionName): array
    {
        $isDirect = $user->hasDirectPermission($permissionName);
        $roles = [];

        // Check which roles provide this permission
        foreach ($user->roles as $role) {
            if ($role->hasPermissionTo($permissionName)) {
                $roles[] = $role->name;
            }
        }

        $type = match (true) {
            $isDirect && count($roles) > 0 => 'direct+role',
            $isDirect => 'direct',
            count($roles) > 0 => 'role',
            default => 'unknown',
        };

        return [
            'type' => $type,
            'roles' => $roles,
            'is_direct' => $isDirect,
        ];
    }

    /**
     * Find users with a specific permission.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function findUsersWithPermission(string $permissionName): Collection
    {
        return User::permission($permissionName)
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'source' => $this->getPermissionSource($user, $permissionName),
            ]);
    }

    /**
     * Compare permissions between two users.
     *
     * @return array<string, mixed>
     */
    public function compareUsers(User $userA, User $userB): array
    {
        $permissionsA = $userA->getAllPermissions()->pluck('name');
        $permissionsB = $userB->getAllPermissions()->pluck('name');

        return [
            'user_a' => [
                'name' => $userA->name,
                'permissions' => $permissionsA->toArray(),
            ],
            'user_b' => [
                'name' => $userB->name,
                'permissions' => $permissionsB->toArray(),
            ],
            'common' => $permissionsA->intersect($permissionsB)->values()->toArray(),
            'only_a' => $permissionsA->diff($permissionsB)->values()->toArray(),
            'only_b' => $permissionsB->diff($permissionsA)->values()->toArray(),
        ];
    }
}
```

## File: app/Http/Controllers/Admin/PermissionAuditController.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PermissionAuditService;
use Illuminate\View\View;

/**
 * Admin controller for permission auditing.
 */
final class PermissionAuditController extends Controller
{
    public function __construct(
        private PermissionAuditService $auditService
    ) {}

    /**
     * Show permission breakdown for a user.
     */
    public function show(User $user): View
    {
        $breakdown = $this->auditService->getBreakdown($user);

        return view('admin.permissions.audit', compact('breakdown'));
    }

    /**
     * Find all users with a specific permission.
     */
    public function usersWithPermission(string $permission): View
    {
        $users = $this->auditService->findUsersWithPermission($permission);

        return view('admin.permissions.users', compact('users', 'permission'));
    }
}
```

## Usage

```php
$auditService = app(PermissionAuditService::class);

// Get full breakdown
$breakdown = $auditService->getBreakdown($user);

// Find where permission comes from
$source = $auditService->getPermissionSource($user, 'edit articles');
// Returns: ['type' => 'role', 'roles' => ['editor'], 'is_direct' => false]

// Find all users with permission
$users = $auditService->findUsersWithPermission('admin');

// Compare two users
$comparison = $auditService->compareUsers($userA, $userB);
```
