---
name: document-metadata-template
description: Document Metadata patterns - title, meta, link in components
---

# Document Metadata Patterns

## Page Title

```typescript
// modules/users/components/UserProfile.tsx
export function UserProfile({ user }: { user: User }) {
  return (
    <>
      <title>{user.name} - Profile</title>
      <meta name="description" content={`Profile of ${user.name}`} />

      <div>
        <h1>{user.name}</h1>
      </div>
    </>
  )
}
```

---

## SEO Meta Tags

```typescript
// modules/blog/components/BlogPost.tsx
export function BlogPost({ post }: { post: Post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <meta name="author" content={post.author.name} />
      <link rel="canonical" href={`https://example.com/blog/${post.slug}`} />

      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  )
}
```

---

## Open Graph / Twitter Cards

```typescript
// modules/products/components/ProductPage.tsx
export function ProductPage({ product }: { product: Product }) {
  const url = `https://example.com/products/${product.id}`

  return (
    <>
      <title>{product.name} - Shop</title>
      <meta name="description" content={product.description} />

      {/* Open Graph */}
      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={product.description} />
      <meta property="og:image" content={product.image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="product" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={product.name} />
      <meta name="twitter:description" content={product.description} />
      <meta name="twitter:image" content={product.image} />

      <div>
        <h1>{product.name}</h1>
      </div>
    </>
  )
}
```

---

## Stylesheets with Precedence

```typescript
// modules/cores/components/Layout.tsx
export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* precedence controls loading order */}
      <link rel="stylesheet" href="/reset.css" precedence="reset" />
      <link rel="stylesheet" href="/base.css" precedence="base" />
      <link rel="stylesheet" href="/theme.css" precedence="theme" />

      <div className="layout">
        {children}
      </div>
    </>
  )
}

// Component-specific styles load after layout
function FeatureCard() {
  return (
    <>
      <link rel="stylesheet" href="/feature-card.css" precedence="component" />
      <div className="feature-card">...</div>
    </>
  )
}
```

---

## Async Scripts

```typescript
// modules/analytics/components/Analytics.tsx
export function Analytics({ trackingId }: { trackingId: string }) {
  return (
    <>
      <script
        async
        src={`https://analytics.example.com/script.js?id=${trackingId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.analyticsId = "${trackingId}";`
        }}
      />
    </>
  )
}
```

---

## Dynamic Title Updates

```typescript
// modules/chat/components/ChatWindow.tsx
export function ChatWindow({ unreadCount }: { unreadCount: number }) {
  const title = unreadCount > 0
    ? `(${unreadCount}) Messages - Chat`
    : 'Messages - Chat'

  return (
    <>
      <title>{title}</title>
      <div className="chat-window">...</div>
    </>
  )
}
```

---

## Rules

- Render metadata anywhere in component tree
- React hoists to `<head>` automatically
- Last `<title>` wins (deepest component)
- Use `precedence` for stylesheet ordering
- Works with SSR and streaming
