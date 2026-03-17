---
name: crud-example-template
description: Full CRUD example combining Astro DB with Astro Actions for a comment system
type: template
---

# Full CRUD with Actions Template

## src/actions/index.ts

```ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { db, Comment, eq } from 'astro:db';

export const server = {
  // CREATE
  addComment: defineAction({
    input: z.object({
      postId: z.number(),
      author: z.string().min(1),
      email: z.string().email(),
      body: z.string().min(5),
    }),
    handler: async (input) => {
      return db.insert(Comment).values(input).returning();
    },
  }),

  // UPDATE
  approveComment: defineAction({
    input: z.object({ id: z.number() }),
    handler: async ({ id }) => {
      return db
        .update(Comment)
        .set({ approved: true })
        .where(eq(Comment.columns.id, id))
        .returning();
    },
  }),

  // DELETE
  deleteComment: defineAction({
    input: z.object({ id: z.number() }),
    handler: async ({ id }) => {
      await db.delete(Comment).where(eq(Comment.columns.id, id));
      return { success: true };
    },
  }),
};
```

## src/pages/posts/[slug].astro (READ + CREATE)

```astro
---
import { db, Comment, Post, eq, desc } from 'astro:db';
import { actions } from 'astro:actions';

const { slug } = Astro.params;
const [post] = await db.select().from(Post).where(eq(Post.columns.slug, slug));
if (!post) return Astro.redirect('/404');

const comments = await db
  .select()
  .from(Comment)
  .where(eq(Comment.columns.postId, post.id))
  .orderBy(desc(Comment.columns.createdAt));

const result = Astro.getActionResult(actions.addComment);
---

<h1>{post.title}</h1>

{comments.map((c) => (
  <div>
    <strong>{c.author}</strong>
    <p>{c.body}</p>
  </div>
))}

<form method="POST" action={actions.addComment}>
  <input type="hidden" name="postId" value={post.id} />
  <input name="author" placeholder="Name" required />
  <input name="email" type="email" placeholder="Email" required />
  <textarea name="body" placeholder="Comment..." required></textarea>
  <button>Submit</button>
</form>

{result?.error && <p>{result.error.message}</p>}
```
