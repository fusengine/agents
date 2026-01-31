---
name: studio
description: Prisma Studio for visual database management
when-to-use: Visual data browsing, quick edits, debugging
keywords: studio, GUI, visual, browse, edit, database
priority: low
requires: installation.md
related: prisma-config.md
---

# Prisma Studio

Visual database browser and editor.

## Launch Studio

```bash
# Open Studio on default port 5555
bunx prisma studio

# Custom port
bunx prisma studio --port 5556

# Specific schema
bunx prisma studio --schema ./prisma/schema.prisma
```

---

## Features

- Browse all tables/models
- View and edit records
- Filter and sort data
- Create new records
- Delete records
- View relations

---

## VS Code Extension

```json
// .vscode/settings.json
{
  "prisma.showPrismaDataPlatformNotification": false
}
```

Install "Prisma" extension for enhanced development experience:
- Schema syntax highlighting and validation
- Auto-completion for schema directives
- Format on save for consistent schema formatting
- Inline Studio preview for quick data browsing

---

## Studio in Production

```typescript
// Embedding Studio (Prisma Postgres only)
// See Prisma Postgres documentation
```

---

## Alternatives

| Tool | Use Case |
|------|----------|
| Prisma Studio | Quick browsing, simple edits |
| pgAdmin | Full PostgreSQL admin |
| DBeaver | Multi-database GUI |
| TablePlus | Fast native client |
| psql | Command-line queries |

---

## Best Practices

1. **Development only** - Don't expose in production
2. **Quick debugging** - Verify data visually
3. **Seed verification** - Check seed results
4. **Relation browsing** - Navigate linked records
5. **Use filters** - Large tables need filtering
