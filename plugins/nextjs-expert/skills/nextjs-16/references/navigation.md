# Navigation

## next/link
```typescript
import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about" replace scroll={false} prefetch={false}>About</Link>
      <Link href={{ pathname: '/blog', query: { sort: 'date' } }}>Blog</Link>
    </nav>
  )
}
```

## useRouter (Client Components)
```typescript
'use client'
import { useRouter } from 'next/navigation'

export default function LoginButton() {
  const router = useRouter()

  function handleLogin() {
    router.push('/dashboard')    // Navigate
    router.replace('/home')      // No history entry
    router.back()                // Go back
    router.refresh()             // Refresh Server Component
    router.prefetch('/settings') // Prefetch
  }

  return <button onClick={handleLogin}>Login</button>
}
```

## redirect (Server Components)
```typescript
import { redirect, permanentRedirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')           // 307
  // permanentRedirect('/new-page')          // 308
  return <div>Welcome {session.user.name}</div>
}
```

## usePathname & useSearchParams
```typescript
'use client'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Breadcrumb() {
  const pathname = usePathname()           // /blog/hello
  const searchParams = useSearchParams()   // ?sort=date
  const sort = searchParams.get('sort')    // 'date'
  return <div>Current: {pathname}</div>
}
```

## notFound
```typescript
import { notFound } from 'next/navigation'

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()  // Triggers not-found.tsx
  return <article>{post.content}</article>
}
```
