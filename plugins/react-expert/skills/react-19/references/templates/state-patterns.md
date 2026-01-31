---
name: "State Patterns Template"
description: "useState patterns - local state, form inputs, toggles, arrays, objects with TypeScript"
tags: ["react", "hooks", "useState", "state", "typescript"]
difficulty: "beginner"
---

# State Patterns: Complete Examples

All examples use React 19 with TypeScript and follow SOLID principles (files < 100 lines, JSDoc on exports).

---

## Counter with Step

Complete TypeScript counter with increment/decrement/reset/step control.

```typescript
// Location: modules/features/components/Counter.tsx
import { useState } from 'react'

interface CounterProps {
  initialCount?: number
  step?: number
}

/**
 * Counter component with step control.
 *
 * @param initialCount - Starting count value (default: 0)
 * @param step - Increment/decrement step (default: 1)
 */
export function Counter({ initialCount = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState(initialCount)

  const increment = () => setCount(prev => prev + step)
  const decrement = () => setCount(prev => prev - step)
  const reset = () => setCount(initialCount)

  return (
    <div className="flex items-center gap-4">
      <button onClick={decrement} className="px-4 py-2 bg-red-500 text-white rounded">
        - {step}
      </button>
      <span className="text-2xl font-bold">{count}</span>
      <button onClick={increment} className="px-4 py-2 bg-green-500 text-white rounded">
        + {step}
      </button>
      <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded">
        Reset
      </button>
    </div>
  )
}
```

---

## Toggle State

Boolean toggle pattern for UI state management.

```typescript
// Location: modules/features/components/TogglePanel.tsx
import { useState } from 'react'

interface TogglePanelProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

/**
 * Collapsible panel with toggle state.
 *
 * @param title - Panel header text
 * @param children - Panel content
 * @param defaultOpen - Initial open state (default: false)
 */
export function TogglePanel({ title, children, defaultOpen = false }: TogglePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggle = () => setIsOpen(prev => !prev)

  return (
    <div className="border rounded-lg">
      <button
        onClick={toggle}
        className="w-full px-4 py-2 text-left font-semibold flex justify-between items-center"
      >
        {title}
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t">
          {children}
        </div>
      )}
    </div>
  )
}
```

---

## Form Input State

Controlled inputs with validation (text, checkbox, select).

```typescript
// Location: modules/features/components/UserForm.tsx
import { useState, FormEvent, ChangeEvent } from 'react'

interface FormData {
  name: string
  email: string
  subscribe: boolean
  country: string
}

interface UserFormProps {
  onSubmit: (data: FormData) => void
}

/**
 * User registration form with controlled inputs.
 *
 * @param onSubmit - Form submission handler
 */
export function UserForm({ onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subscribe: false,
    country: 'US',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block font-medium">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="subscribe"
          name="subscribe"
          type="checkbox"
          checked={formData.subscribe}
          onChange={handleChange}
        />
        <label htmlFor="subscribe">Subscribe to newsletter</label>
      </div>

      <div>
        <label htmlFor="country" className="block font-medium">Country</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="UK">United Kingdom</option>
          <option value="FR">France</option>
        </select>
      </div>

      <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  )
}
```

---

## Object State

Partial object updates with immutability.

```typescript
// Location: modules/features/components/UserProfile.tsx
import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
    language: string
  }
}

interface UserProfileProps {
  initialUser: User
}

/**
 * User profile editor with nested object state.
 *
 * @param initialUser - Initial user data
 */
export function UserProfile({ initialUser }: UserProfileProps) {
  const [user, setUser] = useState<User>(initialUser)

  const updateName = (name: string) => {
    setUser(prev => ({ ...prev, name }))
  }

  const updateEmail = (email: string) => {
    setUser(prev => ({ ...prev, email }))
  }

  const updateTheme = (theme: 'light' | 'dark') => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings, theme },
    }))
  }

  const toggleNotifications = () => {
    setUser(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        notifications: !prev.settings.notifications,
      },
    }))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Name</label>
        <input
          value={user.name}
          onChange={(e) => updateName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          value={user.email}
          onChange={(e) => updateEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => updateTheme('light')}
          className={`px-4 py-2 rounded ${user.settings.theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Light
        </button>
        <button
          onClick={() => updateTheme('dark')}
          className={`px-4 py-2 rounded ${user.settings.theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Dark
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={user.settings.notifications}
          onChange={toggleNotifications}
        />
        <label>Enable notifications</label>
      </div>
    </div>
  )
}
```

---

## Array State

Add, remove, update items with immutability.

```typescript
// Location: modules/features/components/TodoList.tsx
import { useState } from 'react'

interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoListProps {
  initialTodos?: Todo[]
}

/**
 * Todo list with array state management.
 *
 * @param initialTodos - Initial todo items (default: [])
 */
export function TodoList({ initialTodos = [] }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (!inputValue.trim()) return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
    }

    setTodos(prev => [...prev, newTodo])
    setInputValue('')
  }

  const removeTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const updateTodoText = (id: string, text: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text } : todo
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add new todo..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={addTodo} className="px-4 py-2 bg-blue-500 text-white rounded">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2 p-2 border rounded">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <input
              value={todo.text}
              onChange={(e) => updateTodoText(todo.id, e.target.value)}
              className={`flex-1 border-none outline-none ${todo.completed ? 'line-through text-gray-400' : ''}`}
            />
            <button
              onClick={() => removeTodo(todo.id)}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-gray-400 text-center">No todos yet. Add one above!</p>
      )}
    </div>
  )
}
```

---

## Lazy Initialization

Initialize state from localStorage or expensive computation.

```typescript
// Location: modules/features/components/SettingsPanel.tsx
import { useState } from 'react'

interface Settings {
  volume: number
  quality: 'low' | 'medium' | 'high'
  autoplay: boolean
}

const SETTINGS_KEY = 'app_settings'

const DEFAULT_SETTINGS: Settings = {
  volume: 50,
  quality: 'medium',
  autoplay: true,
}

/**
 * Load settings from localStorage with validation.
 *
 * @returns Parsed settings or defaults
 */
function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (!stored) return DEFAULT_SETTINGS

    const parsed = JSON.parse(stored)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

/**
 * Settings panel with lazy initialization from localStorage.
 */
export function SettingsPanel() {
  // Lazy initialization - loadSettings() called only on mount
  const [settings, setSettings] = useState<Settings>(loadSettings)

  const updateVolume = (volume: number) => {
    const newSettings = { ...settings, volume }
    setSettings(newSettings)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
  }

  const updateQuality = (quality: Settings['quality']) => {
    const newSettings = { ...settings, quality }
    setSettings(newSettings)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
  }

  const toggleAutoplay = () => {
    const newSettings = { ...settings, autoplay: !settings.autoplay }
    setSettings(newSettings)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem(SETTINGS_KEY)
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Settings</h2>

      <div>
        <label className="block font-medium mb-2">Volume: {settings.volume}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.volume}
          onChange={(e) => updateVolume(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Quality</label>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((quality) => (
            <button
              key={quality}
              onClick={() => updateQuality(quality)}
              className={`px-4 py-2 rounded ${settings.quality === quality ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {quality}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.autoplay}
          onChange={toggleAutoplay}
          id="autoplay"
        />
        <label htmlFor="autoplay">Enable autoplay</label>
      </div>

      <button
        onClick={resetSettings}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Reset to defaults
      </button>
    </div>
  )
}
```

---

## Best Practices

1. **Functional updates** - Use `prev => ...` for derived state
2. **Immutability** - Never mutate objects/arrays directly
3. **Type safety** - Always define interfaces for state shape
4. **Lazy initialization** - Use function form for expensive initial state
5. **Single responsibility** - One useState per concern
6. **Document with JSDoc** - Explain complex state logic
