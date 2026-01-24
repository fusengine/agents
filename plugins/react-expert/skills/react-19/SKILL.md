---
name: react-19
description: React 19 core features - use() hook, useOptimistic, useActionState, Actions, Transitions, Server Components. Use when implementing React 19 patterns.
user-invocable: false
---

# React 19 Core Features

## New Hooks

### use() Hook

Read resources (promises, context) in render.

```typescript
import { use, Suspense } from 'react'

function Comments({ commentsPromise }: { commentsPromise: Promise<Comment[]> }) {
  // Suspends until promise resolves
  const comments = use(commentsPromise)

  return comments.map(comment => <p key={comment.id}>{comment.text}</p>)
}

// Usage with Suspense
function Page() {
  const commentsPromise = fetchComments()
  return (
    <Suspense fallback={<Loading />}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

### useOptimistic

Optimistic UI updates during async operations.

```typescript
import { useOptimistic } from 'react'

function ChangeName({ currentName, onUpdateName }: Props) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName)

  const submitAction = async (formData: FormData) => {
    const newName = formData.get('name') as string
    setOptimisticName(newName) // Immediate UI update
    const updatedName = await updateName(newName)
    onUpdateName(updatedName)
  }

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <input type="text" name="name" />
      <button type="submit">Update</button>
    </form>
  )
}
```

### useActionState

Handle form Actions with state management.

```typescript
import { useActionState } from 'react'

function UpdateNameForm() {
  const [error, submitAction, isPending] = useActionState(
    async (previousState: string | null, formData: FormData) => {
      const error = await updateName(formData.get('name') as string)
      if (error) return error
      redirect('/success')
      return null
    },
    null
  )

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
```

---

## Form Actions

Native form handling with Actions.

```typescript
// Form with action prop
function ContactForm() {
  async function submitForm(formData: FormData) {
    'use server' // Server Action (if using RSC)
    const email = formData.get('email')
    await sendEmail(email)
  }

  return (
    <form action={submitForm}>
      <input type="email" name="email" required />
      <button type="submit">Send</button>
    </form>
  )
}
```

---

## Transitions

Concurrent rendering for better UX.

```typescript
import { useTransition } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Immediate update for input
    setQuery(e.target.value)

    // Deferred update for expensive operation
    startTransition(() => {
      searchDatabase(e.target.value)
    })
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <Results />
    </div>
  )
}
```

---

## ref as Prop

No more forwardRef needed.

```typescript
// React 19 - ref is a regular prop
function Input({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}

// Usage
function Form() {
  const inputRef = useRef<HTMLInputElement>(null)
  return <Input ref={inputRef} placeholder="Enter text" />
}
```

---

## Context as Provider

Simplified Context API.

```typescript
// React 19 - Context is the provider
const ThemeContext = createContext<Theme>('light')

function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  )
}
```

---

## Best Practices

1. **Use `use()` for async data** - Replace useEffect data fetching
2. **Use Actions for forms** - Native form handling
3. **Use useOptimistic** - Better perceived performance
4. **Use Transitions** - Keep UI responsive during heavy updates
5. **Skip forwardRef** - Use ref as prop directly
