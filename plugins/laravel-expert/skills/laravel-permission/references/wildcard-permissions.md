---
name: wildcard-permissions
description: Wildcard permission patterns for hierarchical permissions
when-to-use: Implementing hierarchical or grouped permissions with wildcards
keywords: wildcard, pattern, hierarchy, asterisk, glob
priority: medium
related: spatie-permission.md
---

# Wildcard Permissions

## Overview

Wildcards enable hierarchical permission structures. A single wildcard permission can grant access to multiple related permissions, reducing complexity.

## When to Use Wildcards

| Scenario | Wildcards Recommended |
|----------|----------------------|
| Module-based permissions | Yes |
| CRUD operations per resource | Yes |
| Deeply nested permissions | Yes (max 3 levels) |
| Simple flat permissions | No |

## Configuration

Wildcards are **disabled by default**. Enable in config with `'enable_wildcard_permission' => true`.

## Pattern Syntax

| Pattern | Matches | Example |
|---------|---------|---------|
| `articles.*` | All article actions | `articles.create`, `articles.edit` |
| `*.view` | View action on all resources | `articles.view`, `users.view` |
| `*` | Everything | All permissions |
| `blog.posts.*` | All blog post actions | `blog.posts.create`, `blog.posts.delete` |
| `blog.*` | All blog actions | `blog.posts.*`, `blog.comments.*` |

## Naming Convention

Use dot notation for hierarchy:

| Level | Example | Represents |
|-------|---------|------------|
| Resource | `articles` | The resource type |
| Action | `articles.edit` | Specific action on resource |
| Sub-resource | `articles.comments.create` | Nested resource action |

## Permission Resolution

When checking `articles.edit`:

1. Check if user has `articles.edit` directly
2. Check if user has `articles.*`
3. Check if user has `*`

If any match, permission is granted.

## Hierarchical Design

### Module-Based Structure

| Module | Wildcard | Covers |
|--------|----------|--------|
| CRM | `crm.*` | All CRM features |
| CRM Contacts | `crm.contacts.*` | Contact CRUD |
| CRM Deals | `crm.deals.*` | Deal CRUD |
| CRM Reports | `crm.reports.view` | View reports only |

### Role Assignment

| Role | Permissions | Access Level |
|------|-------------|--------------|
| Admin | `*` | Everything |
| Sales Manager | `crm.*` | All CRM |
| Sales Rep | `crm.contacts.*`, `crm.deals.*` | Contacts + Deals |
| Analyst | `crm.reports.view` | Reports only |

## Best Practices

1. **Consistent naming** - Always `resource.action` format
2. **Create specific permissions** - Even when using wildcards
3. **Max 3 levels** - Deeper nesting becomes confusing
4. **Document hierarchy** - Team should understand the structure
5. **Start specific** - Add wildcards as patterns emerge

## Common Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Only wildcards | Can't revoke specific | Create specific permissions too |
| Inconsistent naming | `editArticle` vs `articles.edit` | Standardize format |
| Too deep nesting | `crm.contacts.notes.attachments.download` | Flatten to 3 levels max |

## Checking Wildcards

When user has `articles.*`:

| Check | Result |
|-------|--------|
| `hasPermissionTo('articles.create')` | True |
| `hasPermissionTo('articles.edit')` | True |
| `hasPermissionTo('articles.*')` | True |
| `hasPermissionTo('users.view')` | False |

## Related Templates

| Template | Purpose |
|----------|---------|
| [WildcardSeeder.php.md](templates/WildcardSeeder.php.md) | Seeding hierarchical permissions |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [direct-permissions.md](direct-permissions.md) - Permission types
