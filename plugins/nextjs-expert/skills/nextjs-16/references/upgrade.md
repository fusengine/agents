# Upgrade to Next.js 16

## Automatic Upgrade
```bash
bunx @next/codemod@canary upgrade latest
```

## Manual Upgrade
```bash
bun add next@latest react@latest react-dom@latest
```

## Breaking Changes

### middleware.ts → proxy.ts
```bash
bunx @next/codemod middleware-to-proxy .
```
- Rename `middleware.ts` → `proxy.ts`
- Rename `middleware()` → `proxy()`

### Async APIs
```typescript
// Before (v15)
const cookieStore = cookies()
const headersList = headers()
const { slug } = params

// After (v16)
const cookieStore = await cookies()
const headersList = await headers()
const { slug } = await params
```

### Turbopack Default
- Turbopack is now the only bundler
- Remove `--turbo` flags from scripts
- Migrate webpack config to `turbopack: {}`

### Removed Features
- `next lint` command removed → use `eslint .`
- AMP support removed
- `@next/font` removed → use `next/font`

## Codemods Available
```bash
# All codemods
bunx @next/codemod@canary upgrade latest

# Specific codemods
bunx @next/codemod middleware-to-proxy .
bunx @next/codemod async-apis .
```

## Requirements
| Requirement | Version |
|-------------|---------|
| Node.js | 20.9+ |
| TypeScript | 5.1.0+ |
| React | 19.0+ |

## Verify Upgrade
```bash
bun dev
# Check for deprecation warnings
# Test all routes and API endpoints
```

## React Compiler
```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: true,  // Enable auto-memoization
}
```

## Cache Components
```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,  // Enable use cache directive
}
```
