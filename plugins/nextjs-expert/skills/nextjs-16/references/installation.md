# Next.js 16 Installation

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
