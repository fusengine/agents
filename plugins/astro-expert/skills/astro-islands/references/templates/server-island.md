---
name: server-island
description: Server Island pattern with server:defer and fallback slot for personalized content
when-to-use: rendering user-specific or dynamic server content after page load
keywords: server:defer, fallback, personalized, avatar, session, deferred
---

# Server Island Template

## User Avatar Server Island

```astro
---
// src/components/UserAvatar.astro
// Renders after page loads — has access to cookies/session
const sessionId = Astro.cookies.get('session')?.value;
let user = null;

if (sessionId) {
  user = await getUserFromSession(sessionId);
}
---
{user ? (
  <div class="user-menu">
    <img src={user.avatarUrl} alt={user.name} width="32" height="32" />
    <span>{user.name}</span>
  </div>
) : (
  <a href="/login" class="btn">Sign in</a>
)}
```

```astro
---
// src/components/GenericAvatar.astro — fallback component
---
<div class="user-menu skeleton">
  <div class="avatar-placeholder"></div>
  <div class="name-placeholder"></div>
</div>
```

## Page Usage

```astro
---
// src/layouts/BaseLayout.astro
import UserAvatar from '../components/UserAvatar.astro';
import GenericAvatar from '../components/GenericAvatar.astro';
---
<header>
  <nav>
    <a href="/">Home</a>
    <!-- Server island with skeleton fallback -->
    <UserAvatar server:defer>
      <GenericAvatar slot="fallback" />
    </UserAvatar>
  </nav>
</header>
```

## Product Price Server Island

```astro
---
// src/components/ProductPrice.astro
interface Props { productId: string; }
const { productId } = Astro.props;

const country = Astro.request.headers.get('CF-IPCountry') ?? 'US';
const price = await getPriceForCountry(productId, country);
---
<span class="price">{price.formatted}</span>
```

```astro
---
// Usage
import ProductPrice from '../components/ProductPrice.astro';
---
<ProductPrice productId="sku-123" server:defer>
  <span slot="fallback" class="price-skeleton">Loading...</span>
</ProductPrice>
```
