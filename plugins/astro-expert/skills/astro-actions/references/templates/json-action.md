---
name: json-action
description: JSON action with auth check — type-safe client call from React/JS
when-to-use: calling actions from React components or client-side scripts
keywords: JSON action, client, React, type-safe, fetch
---

# JSON Action Template

## src/actions/index.ts

```typescript
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  posts: {
    like: defineAction({
      input: z.object({
        postId: z.string().uuid(),
      }),
      handler: async (input, ctx) => {
        if (!ctx.cookies.has('user-session')) {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to like posts.',
          });
        }

        const likes = await db.posts.like(input.postId);
        return { postId: input.postId, likes };
      },
    }),
  },
};
```

## React Component Client Call

```tsx
// src/components/LikeButton.tsx
import { useState } from 'react';
import { actions, isActionError } from 'astro:actions';

interface Props {
  postId: string;
  initialLikes: number;
}

export function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    setLoading(true);
    const result = await actions.posts.like({ postId });

    if (result.error) {
      if (isActionError(result.error, 'UNAUTHORIZED')) {
        alert('Please log in first');
      }
    } else {
      setLikes(result.data.likes);
    }
    setLoading(false);
  }

  return (
    <button onClick={handleLike} disabled={loading}>
      ♥ {likes}
    </button>
  );
}
```

## Astro Page Usage

```astro
---
import { LikeButton } from '../components/LikeButton.tsx';
---
<LikeButton client:load postId="abc-123" initialLikes={42} />
```
