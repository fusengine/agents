# Route Segment Config

## Export Options
```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'
export const revalidate = 60
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 30
export const fetchCache = 'default-cache'
export const dynamicParams = true
```

## dynamic
```typescript
export const dynamic = 'auto'          // Default - auto detect
export const dynamic = 'force-dynamic' // SSR every request
export const dynamic = 'force-static'  // SSG at build
export const dynamic = 'error'         // Error if dynamic used
```

## revalidate
```typescript
export const revalidate = false  // Never revalidate (static)
export const revalidate = 0      // Always revalidate (dynamic)
export const revalidate = 60     // Revalidate every 60 seconds (ISR)
```

## runtime
```typescript
export const runtime = 'nodejs'  // Default - full Node.js
export const runtime = 'edge'    // Edge runtime (limited APIs)
```

## dynamicParams
```typescript
// With generateStaticParams
export const dynamicParams = true   // Generate unlisted on-demand
export const dynamicParams = false  // Return 404 for unlisted
```

## fetchCache
```typescript
export const fetchCache = 'auto'           // Default
export const fetchCache = 'default-cache'  // Cache by default
export const fetchCache = 'only-cache'     // Error if no cache
export const fetchCache = 'force-cache'    // Force cache all
export const fetchCache = 'default-no-store' // No cache default
export const fetchCache = 'only-no-store'  // Error if cached
export const fetchCache = 'force-no-store' // No cache all
```

## preferredRegion
```typescript
export const preferredRegion = 'auto'       // Auto select
export const preferredRegion = 'global'     // All regions
export const preferredRegion = 'home'       // Home region
export const preferredRegion = ['iad1']     // Specific regions
```

## maxDuration
```typescript
export const maxDuration = 5   // 5 seconds (Hobby)
export const maxDuration = 60  // 60 seconds (Pro)
export const maxDuration = 300 // 300 seconds (Enterprise)
```
