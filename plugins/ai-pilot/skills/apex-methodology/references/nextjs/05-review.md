---
name: 05-review
description: Self-review checklist for Next.js code quality
prev_step: references/nextjs/04-validation.md
next_step: references/nextjs/06-fix-issue.md
---

# 05 - Review (Next.js)

**Self-review checklist for Next.js code quality.**

## When to Use

- After validation passes
- Before creating PR
- Final quality check

---

## Server Components Review

### Correct Usage

```text
[ ] No 'use client' unless necessary
[ ] Async data fetching at component level
[ ] No React hooks (useState, useEffect)
[ ] Database calls in services, not components
[ ] Props passed to Client Components are serializable
```

### Example Check

```typescript
// CORRECT - Server Component
export default async function Page() {
  const data = await getData()
  return <ClientComponent data={data} />
}

// WRONG - Unnecessary 'use client'
'use client'
export default function Page() {
  const [data, setData] = useState([])
  useEffect(() => { fetchData().then(setData) }, [])
  return <div>{data}</div>
}
```

---

## Client Components Review

### Correct Usage

```text
[ ] 'use client' at top of file
[ ] Minimal client-side logic
[ ] Event handlers (onClick, onChange)
[ ] Browser APIs (localStorage, window)
[ ] React hooks when needed
```

### Props Serialization

```typescript
// CORRECT - Serializable props
<ClientComponent
  name="John"              // string OK
  count={5}                // number OK
  active={true}            // boolean OK
  items={['a', 'b']}       // array OK
  data={{ id: 1 }}         // plain object OK
/>

// WRONG - Non-serializable
<ClientComponent
  onClick={() => {}}       // function NOT OK (use Server Action)
  date={new Date()}        // Date NOT OK (pass ISO string)
  regex={/pattern/}        // RegExp NOT OK
/>
```

---

## Server Actions Review

### Correct Pattern

```text
[ ] 'use server' directive present
[ ] Async function
[ ] Input validation with Zod
[ ] Proper error handling
[ ] revalidatePath/revalidateTag used
[ ] redirect() for navigation
```

### Security Check

```typescript
// REQUIRED - Always validate input
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function action(formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  // Safe to use parsed.data
}
```

---

## Module Structure Review

### SOLID Compliance

```text
[ ] Interfaces in modules/[feature]/src/interfaces/
[ ] Services in modules/[feature]/src/services/
[ ] Components in modules/[feature]/components/
[ ] No business logic in app/ pages
[ ] Cores module for shared utilities
```

### Import Pattern

```typescript
// CORRECT - Module imports
import { UserList } from '@/modules/users/components/UserList'
import { getUsers } from '@/modules/users/src/services/user.service'
import type { User } from '@/modules/users/src/interfaces/user.interface'

// WRONG - Direct imports bypassing module
import { UserList } from '@/components/UserList'
import { prisma } from '@prisma/client'
```

---

## Performance Review

### Image Optimization

```typescript
// CORRECT - next/image
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={400}
  priority  // For above-the-fold images
/>

// WRONG - Regular img tag
<img src="/hero.jpg" alt="Hero" />
```

### Dynamic Imports

```typescript
// For large components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

---

## Accessibility Review

### Basic Checks

```text
[ ] All images have alt text
[ ] Form inputs have labels
[ ] Buttons have accessible names
[ ] Links are descriptive (not "click here")
[ ] Color contrast sufficient
[ ] Keyboard navigation works
```

### Example

```typescript
// CORRECT - Accessible form
<form>
  <label htmlFor="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Submit</button>
</form>

// WRONG - Missing labels
<form>
  <input name="email" placeholder="Email" />
  <button>Submit</button>
</form>
```

---

## Documentation Review

### JSDoc Requirements

```text
[ ] All exported functions have JSDoc
[ ] Complex logic has inline comments
[ ] Component props documented
[ ] Return types clear
```

### Example

```typescript
/**
 * Fetch users from database with pagination.
 *
 * @param page - Page number (1-indexed)
 * @param limit - Items per page (max 100)
 * @returns Paginated user list
 */
export async function getUsers(page: number, limit: number): Promise<User[]> {
  // ...
}
```

---

## Review Checklist

```text
Server Components:
[ ] No unnecessary 'use client'
[ ] Async data fetching correct
[ ] Props are serializable

Client Components:
[ ] 'use client' when needed only
[ ] Minimal client logic
[ ] Proper event handling

Server Actions:
[ ] Input validation
[ ] Error handling
[ ] Revalidation used

Structure:
[ ] SOLID principles followed
[ ] Files <100 lines
[ ] Interfaces separated

Quality:
[ ] Performance optimized
[ ] Accessibility checked
[ ] Documentation complete
```

---

## Next Phase

Proceed to `06-fix-issue.md` (if issues found)
OR proceed to `07-add-test.md`
