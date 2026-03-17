---
name: actions-integration
description: Combining Astro DB with Astro Actions for type-safe form → database flows
when-to-use: Any form submission that writes to the database
keywords: Actions, defineAction, Zod, db.insert, db.update, type-safe
priority: high
requires: crud-operations.md
related: astro-actions
---

# Actions + DB Integration

## When to Use

- Comment forms writing to DB
- Contact forms storing submissions
- User-generated content creation

## Pattern: Action → DB Insert

```ts
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { db, Comment } from 'astro:db';

export const server = {
  addComment: defineAction({
    input: z.object({
      postId: z.number(),
      author: z.string().min(1).max(100),
      email: z.string().email(),
      body: z.string().min(10).max(1000),
    }),
    handler: async (input) => {
      const created = await db
        .insert(Comment)
        .values({
          postId: input.postId,
          author: input.author,
          email: input.email,
          body: input.body,
        })
        .returning();

      return created[0];
    },
  }),
};
```

## Use in .astro Page

```astro
---
import { actions } from 'astro:actions';

const result = Astro.getActionResult(actions.addComment);
if (result?.error) {
  // Handle validation or DB error
}
---
<form method="POST" action={actions.addComment}>
  <input type="hidden" name="postId" value={post.id} />
  <input name="author" placeholder="Name" required />
  <input name="email" type="email" placeholder="Email" required />
  <textarea name="body" placeholder="Comment" required></textarea>
  <button type="submit">Post Comment</button>
</form>

{result?.error && <p class="error">{result.error.message}</p>}
{result?.data && <p class="success">Comment posted!</p>}
```

## Action → DB Update Pattern

```ts
updatePost: defineAction({
  input: z.object({
    id: z.number(),
    published: z.boolean(),
  }),
  handler: async ({ id, published }) => {
    const { eq } = await import('astro:db');
    return db
      .update(Post)
      .set({ published })
      .where(eq(Post.columns.id, id))
      .returning();
  },
}),
```

## Benefits of This Pattern

| Benefit | Detail |
|---------|--------|
| Type safety | Zod validates input, DB returns typed rows |
| Progressive enhancement | Works without JS, enhanced with JS |
| Error handling | Structured errors from Zod + DB |
| No API routes needed | Actions replace REST endpoints |
