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

Teams allow scoping roles and permissions to specific teams or organizations. Each team has its own set of role assignments, enabling true multi-tenant authorization.

## When to Use Teams

| Scenario | Teams Needed |
|----------|--------------|
| SaaS with organizations | Yes |
| Multi-company platform | Yes |
| Single company app | No |
| User groups without isolation | No |

## How Teams Work

### Conceptual Model

| Concept | Description |
|---------|-------------|
| **Team Context** | Current active team for permission checks |
| **Team-Scoped Role** | Role exists within a specific team |
| **Global Role** | Role with `team_id = null`, works across teams |
| **Team Switch** | Changing context changes visible permissions |

### Permission Resolution

1. System checks current team context (via `getPermissionsTeamId()`)
2. Queries roles where `team_id = current_team_id` OR `team_id = null`
3. User permissions are intersection of assigned roles in that team

## Team Context Management

### Setting Context

Team context must be set **early** in the request lifecycle, typically in middleware. All subsequent permission checks use this context.

### Context Priority

| Source | Priority | Use Case |
|--------|----------|----------|
| Route parameter | Highest | `/teams/{team}/dashboard` |
| Session | Medium | "Switch team" feature |
| User default | Lowest | `$user->current_team_id` |

## Global vs Team-Scoped Roles

### Global Roles

| Characteristic | Example |
|----------------|---------|
| `team_id = null` | Super-Admin |
| Works in ALL teams | Platform owner |
| Bypass team isolation | Support staff |

### Team-Scoped Roles

| Characteristic | Example |
|----------------|---------|
| `team_id = specific ID` | Team Admin |
| Only works in that team | Project manager |
| Isolated per organization | Department head |

## Common Patterns

### Team Creation

When creating a team, automatically assign the creator as team admin. Store/restore context to avoid affecting other code.

### Team Switching

When user switches teams:
1. Update session with new team ID
2. Call `setPermissionsTeamId()` with new ID
3. User's effective permissions change immediately

### Team Invitations

When inviting users:
1. Set team context to target team
2. Assign role to invited user
3. Restore previous context if needed

## Best Practices

1. **Set context in middleware** - Before any controller logic
2. **Use global roles sparingly** - Only for true cross-team access
3. **Store/restore context** - When temporarily switching teams
4. **Create default roles per team** - On team creation seeder
5. **Validate team membership** - Before setting context

## Migration Requirements

Enabling teams requires:

1. Set `'teams' => true` in config
2. Run `php artisan permission:upgrade-teams`
3. Migrate to add `team_id` columns

## Related Templates

| Template | Purpose |
|----------|---------|
| [TeamMiddleware.php.md](templates/TeamMiddleware.php.md) | Middleware for setting team context |
| [TeamSeeder.php.md](templates/TeamSeeder.php.md) | Seeding team roles |
| [TeamModel.php.md](templates/TeamModel.php.md) | Team model with boot example |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [cache.md](cache.md) - Cache with teams
