---
name: prop-serialization
description: Prop serialization rules for Astro Islands — what can be passed as props
when-to-use: passing data from server to client components
keywords: props, serialization, JSON, Date, Uint8Array, Map, Set
priority: medium
---

# Prop Serialization

## When to Use

- Understanding what can be passed as props to hydrated components
- Debugging prop-related errors in Islands

## What Can Be Serialized

Astro serializes props passed to client-side components. Supported types:

| Type | Example |
|------|---------|
| Primitives | `string`, `number`, `boolean`, `null`, `undefined` |
| Arrays | `[1, 2, 3]`, `['a', 'b']` |
| Plain objects | `{ name: 'Alice', age: 30 }` |
| `Date` | `new Date()` |
| `Uint8Array` | Binary data |
| `Map` | `new Map([['key', 'val']])` |
| `Set` | `new Set([1, 2, 3])` |
| `URL` | `new URL('https://...')` |
| `RegExp` | `/pattern/flags` |

## What CANNOT Be Serialized

```astro
<!-- These will error or be lost -->
<Counter
  fn={someFunction}      // Functions — NOT serializable
  stream={readableStream} // Streams — NOT serializable
  component={MyComp}     // React components — NOT serializable
  client:load
/>
```

## Passing Complex Data

```astro
---
// Fetch server-side, serialize to plain object
const user = await db.users.findOne(userId);
const plainUser = {
  id: user.id,
  name: user.name,
  avatar: user.avatar,
};
---
<UserProfile user={plainUser} client:load />
```

## Passing Dates

```astro
---
const post = await getPost(slug);
---
<!-- Date is serialized correctly -->
<PostHeader
  title={post.title}
  publishedAt={post.publishedAt}
  client:load
/>
```
