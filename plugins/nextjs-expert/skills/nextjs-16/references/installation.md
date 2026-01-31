---
name: installation
description: Setup and installation guide for Next.js 16 projects with TypeScript and Turbopack
when-to-use: starting new project, upgrading from v14/v15, setting up TypeScript
keywords: setup, init, project creation, environment variables, requirements
priority: high
---

# Next.js 16 Installation

## When to Use

- Starting a new Next.js 16 project
- Upgrading from Next.js 14/15
- Setting up TypeScript configuration
- Configuring environment variables

## Why Next.js 16

| Feature | Improvement |
|---------|-------------|
| Turbopack | Default bundler, 2-5x faster builds |
| Cache Components | Explicit caching with `use cache` |
| React Compiler | Automatic memoization |
| proxy.ts | Clearer route protection |

## New Project

```bash
bunx create-next-app@latest my-app
cd my-app
bun dev
```

## Upgrade Existing Project

```bash
# Automatic with codemod (recommended)
bunx @next/codemod@canary upgrade latest

# Manual upgrade
bun add next@latest react@latest react-dom@latest
bun add -D @types/react @types/react-dom
```

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 20.9+ (LTS) |
| TypeScript | 5.1.0+ |
| Chrome/Edge | 111+ |
| Firefox | 111+ |
| Safari | 16.4+ |

## package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turbopack is default, no config needed
  reactCompiler: true,      // Enable React Compiler
  cacheComponents: true     // Enable Cache Components
}

export default nextConfig
```

## Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com
```

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Verify Installation

```bash
bun dev
# Open http://localhost:3000
```
