---
name: optimistic-update-template
description: useOptimistic patterns for instant UI feedback
---

# Optimistic Updates with useOptimistic

## Todo List with Optimistic Add

```typescript
// modules/todos/components/TodoList.tsx
import { useOptimistic } from 'react'
import { useFormStatus } from 'react-dom'
import type { Todo } from '../src/interfaces/todo.interface'
import { todoService } from '../src/services/todo.service'

interface TodoListProps {
  todos: Todo[]
  onAdd: (todo: Todo) => void
}

function AddButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add'}
    </button>
  )
}

/**
 * Todo list with optimistic add.
 */
export function TodoList({ todos, onAdd }: TodoListProps) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (current, newTodo: Todo) => [...current, newTodo]
  )

  async function addTodo(formData: FormData) {
    const text = formData.get('text') as string

    // Optimistic update (immediate)
    const tempTodo: Todo = {
      id: `temp-${Date.now()}`,
      text,
      done: false,
      pending: true
    }
    addOptimistic(tempTodo)

    // Real API call
    const savedTodo = await todoService.create({ text })
    onAdd(savedTodo)
  }

  return (
    <div>
      <form action={addTodo}>
        <input name="text" placeholder="New todo" required />
        <AddButton />
      </form>

      <ul>
        {optimisticTodos.map((todo) => (
          <li
            key={todo.id}
            style={{ opacity: todo.pending ? 0.5 : 1 }}
          >
            {todo.text}
            {todo.pending && ' (saving...)'}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Toggle with Optimistic State

```typescript
// modules/likes/components/LikeButton.tsx
import { useOptimistic } from 'react'
import { likeService } from '../src/services/like.service'

interface LikeButtonProps {
  postId: string
  isLiked: boolean
  likeCount: number
}

/**
 * Like button with optimistic toggle.
 */
export function LikeButton({ postId, isLiked, likeCount }: LikeButtonProps) {
  const [optimistic, setOptimistic] = useOptimistic(
    { isLiked, likeCount },
    (current, newLiked: boolean) => ({
      isLiked: newLiked,
      likeCount: newLiked ? current.likeCount + 1 : current.likeCount - 1
    })
  )

  async function toggleLike() {
    const newLiked = !optimistic.isLiked
    setOptimistic(newLiked)

    if (newLiked) {
      await likeService.like(postId)
    } else {
      await likeService.unlike(postId)
    }
  }

  return (
    <form action={toggleLike}>
      <button type="submit">
        {optimistic.isLiked ? '❤️' : '🤍'} {optimistic.likeCount}
      </button>
    </form>
  )
}
```

---

## Chat with Optimistic Messages

```typescript
// modules/chat/components/ChatThread.tsx
import { useOptimistic, useRef } from 'react'
import type { Message } from '../src/interfaces/chat.interface'

interface ChatThreadProps {
  messages: Message[]
  sendMessage: (formData: FormData) => Promise<void>
}

/**
 * Chat with optimistic message sending.
 */
export function ChatThread({ messages, sendMessage }: ChatThreadProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current, newMessage: Message) => [...current, newMessage]
  )

  async function handleSend(formData: FormData) {
    const text = formData.get('message') as string

    // Optimistic add
    addOptimistic({
      id: `temp-${Date.now()}`,
      text,
      sender: 'me',
      pending: true
    })

    // Clear form
    formRef.current?.reset()

    // Send to server
    await sendMessage(formData)
  }

  return (
    <div>
      <div className="messages">
        {optimisticMessages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender === 'me' ? 'sent' : 'received'}
            style={{ opacity: msg.pending ? 0.6 : 1 }}
          >
            {msg.text}
            {msg.pending && <span> ✓</span>}
          </div>
        ))}
      </div>

      <form ref={formRef} action={handleSend}>
        <input name="message" placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

---

## Rules

- Optimistic state shows immediately
- Real state replaces optimistic when server responds
- Mark optimistic items with `pending: true` for visual feedback
- If server fails, optimistic state reverts automatically
