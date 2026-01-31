---
name: vscode
description: Prisma VS Code extension with IntelliSense and formatting
when-to-use: Schema editing, autocomplete, syntax highlighting, format-on-save
keywords: vscode, extension, intellisense, formatting, syntax, autocomplete
priority: high
requires: /plugins/nextjs-expert/skills/prisma-7/references/installation.md
related: /plugins/nextjs-expert/skills/prisma-7/references/editor-setup.md
---

# Prisma VS Code Extension

Official extension for Prisma schema editing with advanced IDE features.

## Installation

Install via VS Code Marketplace:
- Extension ID: `Prisma.prisma`
- Or search "Prisma" in Extensions tab

```bash
# Via CLI
code --install-extension Prisma.prisma
```

## Features

- **Syntax highlighting** - Full schema syntax support
- **IntelliSense** - Models, fields, attributes autocomplete
- **Format on save** - Auto-format with Prettier
- **Error diagnostics** - Real-time validation
- **Hover information** - Type hints, documentation
- **Go to definition** - Jump to model/field definitions
- **Snippets** - Quick model/relation templates

## Configuration

```json
// .vscode/settings.json
{
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  },
  "prisma.showPrismaDataPlatformNotification": false,
  "prisma.enableDebugLogs": false
}
```

## Autocomplete Examples

### Model Definition

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
```

**Triggers:**
- `@id`, `@unique`, `@default`, `@relation` - attribute suggestions
- Relation field types - auto-suggested related models

### Relation Shortcuts

Type `@relation` and extension suggests:
- Foreign key fields
- Relation names
- Back-reference syntax

```prisma
posts Post[] @relation("UserPosts")
author User @relation("UserPosts", fields: [authorId], references: [id])
```

## Formatting

```bash
# Manual format
Shift + Alt + F (Windows/Linux)
Shift + Option + F (Mac)

# Command palette
Ctrl + Shift + P → Format Document
```

**Prettier config applied automatically** if `.prettierrc` exists.

## Debugging

```json
// Enable debug logs
{
  "prisma.enableDebugLogs": true
}
```

Check output in VS Code:
- Command Palette → "Output" → Select "Prisma Language Server"

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Format | Shift + Alt + F |
| Go to Definition | F12 |
| Peek Definition | Alt + F12 |
| Rename Symbol | F2 |
| Find References | Shift + F12 |
| Comment Line | Ctrl + / |

## Troubleshooting

### Extension Not Working

```bash
# Reinstall extension
code --uninstall-extension Prisma.prisma
code --install-extension Prisma.prisma
```

### Formatting Issues

```bash
# Ensure schema file recognized
# File must be named: schema.prisma
# And in prisma/ directory
```

### Performance

```json
// Disable if large schema
{
  "prisma.enableDebugLogs": false,
  "[prisma]": {
    "editor.formatOnSave": false
  }
}
```

Then format manually with shortcut.

---
