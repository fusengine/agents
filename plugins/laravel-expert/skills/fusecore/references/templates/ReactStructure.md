---
name: ReactStructure
description: React module structure and examples
keywords: react, frontend, typescript, component
---

# React Module Structure

React frontend structure for FuseCore module.

## Directory Structure

```
FuseCore/{Module}/Resources/React/
├── pages/
│   ├── PostListPage.tsx
│   ├── PostDetailPage.tsx
│   └── PostCreatePage.tsx
├── components/
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostForm.tsx
│   │   └── PostList.tsx
│   └── common/
│       └── LoadingSpinner.tsx
├── hooks/
│   ├── usePosts.ts
│   └── usePostMutations.ts
├── stores/
│   └── postStore.ts
├── interfaces/
│   ├── Post.ts
│   └── ApiResponse.ts
├── schemas/
│   └── postSchema.ts
├── constants/
│   └── postConstants.ts
├── utils/
│   └── postHelpers.ts
└── i18n/locales/
    ├── fr/
    │   └── posts.json
    └── en/
        └── posts.json
```

## Page Component Example

### File: pages/PostListPage.tsx

```tsx
import { usePosts } from '../hooks/usePosts';
import { PostList } from '../components/posts/PostList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

export function PostListPage() {
  const { t } = useTranslation('posts');
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{t('errors.loadFailed')}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{t('list.title')}</h1>
      <PostList posts={posts?.data ?? []} />
    </div>
  );
}
```

## Hook Example

### File: hooks/usePosts.ts

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post, CreatePostData } from '../interfaces/Post';

const API_BASE = '/api/blog/posts';

async function fetchPosts(): Promise<{ data: Post[] }> {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}

async function createPost(data: CreatePostData): Promise<Post> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
}

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
```

## Interface Example

### File: interfaces/Post.ts

```tsx
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: Author;
  tags: Tag[];
}

export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface CreatePostData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published';
  tags?: number[];
}
```

## Store Example (Zustand)

### File: stores/postStore.ts

```tsx
import { create } from 'zustand';
import type { Post } from '../interfaces/Post';

interface PostStore {
  selectedPost: Post | null;
  isEditing: boolean;
  setSelectedPost: (post: Post | null) => void;
  setIsEditing: (editing: boolean) => void;
  reset: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
  selectedPost: null,
  isEditing: false,
  setSelectedPost: (post) => set({ selectedPost: post }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  reset: () => set({ selectedPost: null, isEditing: false }),
}));
```

## Schema Example (Zod)

### File: schemas/postSchema.ts

```tsx
import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(255),
  slug: z.string().max(255).optional(),
  content: z.string().min(1, 'Le contenu est requis'),
  excerpt: z.string().max(500).optional(),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.number()).optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
```

## i18n Example

### File: i18n/locales/fr/posts.json

```json
{
  "list": {
    "title": "Articles",
    "empty": "Aucun article trouvé",
    "create": "Nouvel article"
  },
  "form": {
    "title": "Titre",
    "content": "Contenu",
    "excerpt": "Extrait",
    "status": "Statut",
    "tags": "Tags",
    "submit": "Enregistrer",
    "cancel": "Annuler"
  },
  "status": {
    "draft": "Brouillon",
    "published": "Publié"
  },
  "errors": {
    "loadFailed": "Échec du chargement des articles",
    "saveFailed": "Échec de l'enregistrement"
  },
  "notifications": {
    "created": "Article créé avec succès",
    "updated": "Article mis à jour",
    "deleted": "Article supprimé"
  }
}
```
