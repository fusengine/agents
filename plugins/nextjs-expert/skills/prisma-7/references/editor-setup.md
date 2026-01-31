---
name: editor-setup
description: Complete editor configuration and formatting setup for Prisma development
when-to-use: Initial setup, environment configuration, formatter installation
keywords: editor, configuration, formatting, prettier, eslint, setup
priority: high
requires: /plugins/nextjs-expert/skills/prisma-7/references/installation.md
related: /plugins/nextjs-expert/skills/prisma-7/references/vscode.md
---

# Editor Setup & Formatting

Complete configuration for optimal Prisma development environment.

## VS Code Extensions

Essential extensions:

```bash
# Prisma support
code --install-extension Prisma.prisma

# TypeScript support
code --install-extension ms-vscode.vscode-typescript-next

# Code formatting
code --install-extension esbenp.prettier-vscode

# Linting
code --install-extension dbaeumer.vscode-eslint

# Git integration
code --install-extension eamodio.gitlens

# Database tools
code --install-extension ms-mssql.mssql
code --install-extension ckolkman.vscode-postgres
```

## Prettier Configuration

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### prisma/.prettierrc

Special formatting for Prisma schema:

```json
{
  "semi": false,
  "trailingComma": "none",
  "printWidth": 100
}
```

## ESLint Configuration

### .eslintrc.json

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/explicit-function-return-types": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": "warn"
  },
  "overrides": [
    {
      "files": ["**/*.prisma"],
      "parser": "prisma-eslint-parser"
    }
  ]
}
```

## VS Code Settings

### .vscode/settings.json

```json
{
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma",
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.detectIndentation": false
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[json]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.rulers": [80, 100],
  "files.exclude": {
    "**/.DS_Store": true,
    "**/*.tsbuildinfo": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true
  }
}
```

## Pre-commit Hooks

### .husky/pre-commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint:fix
npm run format
```

## Scripts in package.json

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{ts,tsx,json,prisma,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,prisma,md}\"",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "validate": "npm run lint && npm run type-check && npm run format:check"
  }
}
```

## Prisma-Specific Config

### prisma/package.json

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### tsconfig.json Extensions

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@prisma/*": ["./prisma/*"],
      "@db/*": ["./prisma/client/*"]
    }
  }
}
```

## Format on Save Setup

### Step 1: Install Dependencies

```bash
npm install -D prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Step 2: Create Configs

```bash
# Create .prettierrc
echo '{"semi": true, "singleQuote": true}' > .prettierrc

# Create .eslintrc.json
npx eslint --init
```

### Step 3: Configure VS Code

Settings → Search "Format on Save" → Check

## EditorConfig

### .editorconfig

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{ts,tsx,js,jsx}]
indent_style = space
indent_size = 2

[*.{md,json}]
indent_style = space
indent_size = 2

[*.prisma]
indent_style = space
indent_size = 2
```

## Troubleshooting

### Prettier Not Formatting Schema

```bash
# Reinstall Prisma extension
code --uninstall-extension Prisma.prisma
code --install-extension Prisma.prisma

# Ensure schema.prisma is in prisma/ folder
ls prisma/schema.prisma
```

### ESLint Errors on Save

```json
// .vscode/settings.json
{
  "[typescript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
}
```

### Format Conflicts

Disable Prettier and use ESLint only:

```json
{
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

## VS Code Commands

| Command | Shortcut |
|---------|----------|
| Format Document | Shift + Alt + F |
| Fix ESLint Issues | Ctrl + Shift + P → "Fix all auto-fixable" |
| Open Settings | Ctrl + , |
| Command Palette | Ctrl + Shift + P |

## CI/CD Integration

### GitHub Actions

```yaml
name: Lint & Format

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run format:check
      - run: npm run type-check
```

---
