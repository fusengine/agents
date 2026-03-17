---
name: server-islands
description: server:defer directive — deferred server rendering, fallback slots, dynamic personalized content
when-to-use: rendering personalized or auth-gated content without blocking page load
keywords: server:defer, server islands, fallback, deferred, personalized, dynamic
priority: high
---

# Server Islands (server:defer)

## When to Use

- User-specific content (avatar, cart count, preferences)
- Region/price localization
- Auth-gated sections
- Any dynamic content that shouldn't block initial render

## How It Works

1. Page renders immediately with fallback content
2. After page loads, component is fetched from server
3. Fallback is replaced with actual server-rendered content

## Requirements

- Server adapter installed (Node, Cloudflare, Netlify, Vercel)
- Works with `.astro` components only (not framework components)

## Basic Usage

```astro
---
// src/pages/dashboard.astro
import UserAvatar from '../components/UserAvatar.astro';
import GenericAvatar from '../components/GenericAvatar.astro';
---
<UserAvatar server:defer>
  <GenericAvatar slot="fallback" />
</UserAvatar>
```

## The Server Island Component

```astro
---
// src/components/UserAvatar.astro
// This runs on the server AFTER page loads
const session = Astro.cookies.get('session');
const user = session ? await getUser(session.value) : null;
---
{user ? (
  <img src={user.avatar} alt={user.name} />
) : (
  <a href="/login">Sign in</a>
)}
```

## Passing Props

```astro
---
import ProductPrice from '../components/ProductPrice.astro';
---
<ProductPrice productId="abc-123" server:defer>
  <span slot="fallback">Loading price...</span>
</ProductPrice>
```

## When NOT to Use

- Static content that never changes — use regular rendering
- Content that needs to be in the initial HTML for SEO
- Simple content that can be prerendered
