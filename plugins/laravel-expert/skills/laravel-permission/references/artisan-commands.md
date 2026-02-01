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

Spatie provides artisan commands for managing roles and permissions from the CLI. Useful for quick setup, debugging, and CI/CD scripts.

## Available Commands

| Command | Purpose |
|---------|---------|
| `permission:create-permission` | Create a new permission |
| `permission:create-role` | Create a new role |
| `permission:show` | Display all roles and permissions |
| `permission:cache-reset` | Clear permission cache |
| `permission:upgrade-teams` | Add team support to existing tables |

## Command: create-permission

### Syntax

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Permission name |
| `guard` | No | Guard name (default: config default) |

### Usage Scenarios

| Scenario | Arguments |
|----------|-----------|
| Basic permission | `"edit articles"` |
| Specific guard | `"edit articles" api` |
| Kebab-case naming | `"edit-articles"` |

## Command: create-role

### Syntax

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Role name |
| `guard` | No | Guard name |
| `permissions` | No | Pipe-separated permissions |
| `--team-id` | No | Team ID for multi-tenant |

### Usage Scenarios

| Scenario | Arguments |
|----------|-----------|
| Basic role | `editor` |
| With guard | `editor web` |
| With permissions | `editor web "edit articles\|delete articles"` |
| With team | `editor --team-id=1` |

## Command: show

Displays a formatted table of all roles and permissions grouped by guard.

### Output Sections

| Section | Shows |
|---------|-------|
| Permissions | All permissions grouped by guard |
| Roles | All roles grouped by guard |

## Command: cache-reset

### When to Use

| Scenario | Needed |
|----------|--------|
| After direct DB changes | Yes |
| After deployment | Yes |
| After seeder | Automatic |
| After using Spatie methods | Automatic |

### Deployment Integration

Include in deployment scripts:

| Position | Reason |
|----------|--------|
| After migrations | Tables might have changed |
| After seeders | Permissions might have changed |
| Before app restart | Ensure fresh cache |

## Command: upgrade-teams

### Purpose

Adds `team_id` column to permission tables when enabling teams feature.

### Prerequisites

1. Set `'teams' => true` in config
2. Run this command
3. Run `migrate`

## Custom Commands

### Creating Setup Commands

For reproducible permission setup, create custom artisan commands that:

1. Reset cache at start
2. Create all permissions
3. Create all roles
4. Assign permissions to roles
5. Optionally create default users

### Benefits

| Benefit | Description |
|---------|-------------|
| Reproducible | Same result every time |
| Documented | Code shows permission structure |
| CI/CD friendly | Easy to automate |
| Environment-specific | Can vary by environment |

## CI/CD Integration

### Deployment Script Steps

| Step | Command |
|------|---------|
| 1 | Run migrations |
| 2 | Run permission setup command |
| 3 | Reset permission cache |
| 4 | Verify with `permission:show` |

## Best Practices

1. **Script, don't type** - Use custom commands over manual CLI
2. **Reset cache** - Always after permission changes
3. **Verify with show** - Check result after changes
4. **Version control** - Keep setup commands in repository
5. **Idempotent** - Use `firstOrCreate` not `create`

## Related Templates

| Template | Purpose |
|----------|---------|
| [SetupPermissions.php.md](templates/SetupPermissions.php.md) | Custom artisan command |
| [DeployScript.sh.md](templates/DeployScript.sh.md) | CI/CD deployment script |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [cache.md](cache.md) - Cache management
