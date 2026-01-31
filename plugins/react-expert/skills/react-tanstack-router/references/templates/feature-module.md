---
name: feature-module
description: Complete feature module with routes, queries, and components
keywords: module, feature, posts, crud, solid
---

# Feature Module Template

Complete feature module following SOLID principles.

## Module Structure

```text
src/modules/posts/
├── src/
│   ├── interfaces/
│   │   ├── post.interface.ts      # Post types
│   │   └── api.interface.ts       # API response types
│   ├── queries/
│   │   ├── posts.queries.ts       # Query options
│   │   └── posts.mutations.ts     # Mutation hooks
│   ├── components/
│   │   ├── PostCard.tsx           # Single post card
│   │   ├── PostList.tsx           # Posts list
│   │   └── PostSkeleton.tsx       # Loading skeleton
│   ├── hooks/
│   │   └── usePosts.ts            # Custom hooks
│   └── utils/
│       └── formatters.ts          # Utility functions
└── index.ts                       # Public exports
```

---

## Interfaces

```typescript
// src/modules/posts/src/interfaces/post.interface.ts

/**
 * Post entity.
 */
export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  authorId: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

/**
 * Create post input.
 */
export interface CreatePostInput {
  title: string
  content: string
  tags: string[]
}

/**
 * Update post input.
 */
export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string
}

/**
 * Posts list params.
 */
export interface PostsParams {
  page: number
  pageSize: number
  sort: 'newest' | 'oldest' | 'popular'
  filter?: string
  tags?: string[]
}
```

```typescript
// src/modules/posts/src/interfaces/api.interface.ts
import type { Post } from './post.interface'

/**
 * Paginated posts response.
 */
export interface PostsResponse {
  data: Post[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
```

---

## Query Options

```typescript
// src/modules/posts/src/queries/posts.queries.ts
import { queryOptions } from '@tanstack/react-query'
import type { PostsParams, Post } from '../interfaces/post.interface'
import type { PostsResponse } from '../interfaces/api.interface'

const API_URL = import.meta.env.VITE_API_URL

/**
 * Fetch paginated posts.
 */
async function fetchPosts(params: PostsParams): Promise<PostsResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sort: params.sort,
  })

  if (params.filter) searchParams.set('filter', params.filter)
  if (params.tags?.length) searchParams.set('tags', params.tags.join(','))

  const res = await fetch(`${API_URL}/posts?${searchParams}`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

/**
 * Fetch single post by ID.
 */
async function fetchPost(postId: string): Promise<Post> {
  const res = await fetch(`${API_URL}/posts/${postId}`)
  if (!res.ok) throw new Error('Failed to fetch post')
  return res.json()
}

/**
 * Posts list query options.
 */
export const postsQueryOptions = (params: PostsParams) =>
  queryOptions({
    queryKey: ['posts', params],
    queryFn: () => fetchPosts(params),
    staleTime: 5 * 60 * 1000,
  })

/**
 * Single post query options.
 */
export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['posts', postId],
    queryFn: () => fetchPost(postId),
    staleTime: 5 * 60 * 1000,
  })
```

---

## Mutations

```typescript
// src/modules/posts/src/queries/posts.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreatePostInput, UpdatePostInput, Post } from '../interfaces/post.interface'

const API_URL = import.meta.env.VITE_API_URL

/**
 * Create new post.
 */
export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreatePostInput): Promise<Post> => {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to create post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * Update existing post.
 */
export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdatePostInput): Promise<Post> => {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to update post')
      return res.json()
    },
    onSuccess: (post) => {
      queryClient.setQueryData(['posts', post.id], post)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

/**
 * Delete post.
 */
export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string): Promise<void> => {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete post')
    },
    onSuccess: (_, postId) => {
      queryClient.removeQueries({ queryKey: ['posts', postId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
```

---

## Components

```typescript
// src/modules/posts/src/components/PostCard.tsx
import { Link } from '@tanstack/react-router'
import type { Post } from '../interfaces/post.interface'

interface PostCardProps {
  post: Post
}

/**
 * Single post card component.
 */
export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border rounded-lg p-4">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p className="text-gray-600 mt-2">{post.excerpt}</p>
      <div className="mt-4 flex gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="bg-gray-100 px-2 py-1 text-sm rounded">
            {tag}
          </span>
        ))}
      </div>
      <Link
        to="/posts/$postId"
        params={{ postId: post.id }}
        className="mt-4 inline-block text-blue-600"
        preload="intent"
      >
        Read more
      </Link>
    </article>
  )
}
```

```typescript
// src/modules/posts/src/components/PostList.tsx
import type { Post } from '../interfaces/post.interface'
import { PostCard } from './PostCard'

interface PostListProps {
  posts: Post[]
}

/**
 * List of post cards.
 */
export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p>No posts found.</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

```typescript
// src/modules/posts/src/components/PostSkeleton.tsx

/**
 * Loading skeleton for posts.
 */
export function PostSkeleton() {
  return (
    <div className="border rounded-lg p-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full mt-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mt-1" />
    </div>
  )
}

export function PostListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  )
}
```

---

## Public Exports

```typescript
// src/modules/posts/index.ts

// Interfaces
export type { Post, CreatePostInput, UpdatePostInput, PostsParams } from './src/interfaces/post.interface'
export type { PostsResponse } from './src/interfaces/api.interface'

// Queries
export { postsQueryOptions, postQueryOptions } from './src/queries/posts.queries'
export { useCreatePost, useUpdatePost, useDeletePost } from './src/queries/posts.mutations'

// Components
export { PostCard } from './src/components/PostCard'
export { PostList } from './src/components/PostList'
export { PostSkeleton, PostListSkeleton } from './src/components/PostSkeleton'
```

---

## Route Files

```typescript
// src/routes/posts/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { postsQueryOptions, PostList, PostListSkeleton } from '@/modules/posts'

const searchSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(10).max(50).default(20),
  sort: z.enum(['newest', 'oldest', 'popular']).default('newest'),
  filter: z.string().optional(),
})

export const Route = createFileRoute('/posts/')({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ context: { queryClient }, deps: { search } }) =>
    queryClient.ensureQueryData(postsQueryOptions(search)),
  pendingComponent: () => <PostListSkeleton />,
  component: PostsPage,
})

function PostsPage() {
  const { data: posts, meta } = Route.useLoaderData()
  const search = Route.useSearch()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      <PostList posts={posts} />
      <Pagination meta={meta} currentPage={search.page} />
    </div>
  )
}

function Pagination({ meta, currentPage }: { meta: any; currentPage: number }) {
  return (
    <div className="mt-8 flex gap-2">
      {currentPage > 1 && (
        <Link to="." search={(p) => ({ ...p, page: p.page - 1 })}>
          Previous
        </Link>
      )}
      {currentPage < meta.totalPages && (
        <Link to="." search={(p) => ({ ...p, page: p.page + 1 })}>
          Next
        </Link>
      )}
    </div>
  )
}
```

```typescript
// src/routes/posts/$postId.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { postQueryOptions } from '@/modules/posts'

export const Route = createFileRoute('/posts/$postId')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(postQueryOptions(params.postId)),
  component: PostPage,
  errorComponent: ({ error }) => (
    <div>
      <h1>Error loading post</h1>
      <p>{error.message}</p>
    </div>
  ),
})

function PostPage() {
  const post = Route.useLoaderData()

  return (
    <article className="container mx-auto px-4 py-8">
      <Link to="/posts" className="text-blue-600 mb-4 inline-block">
        ← Back to posts
      </Link>
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="prose mt-8">{post.content}</div>
    </article>
  )
}
```
