# Best Practices

1. **Server Components default** - Add `'use client'` only when needed
2. **Colocate code** - Keep related code in feature modules
3. **Type everything** - Full TypeScript, no any
4. **Fetch where used** - No prop drilling for data
5. **Validate at boundary** - Zod schemas for all inputs
6. **Cache explicitly** - Use `use cache` directive
