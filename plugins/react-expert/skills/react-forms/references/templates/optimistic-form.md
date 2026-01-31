---
title: "React 19 Optimistic Form"
description: "Complete form with useOptimistic hook for instant UI updates with rollback on error"
tags: ["react-19", "optimistic-updates", "useOptimistic", "forms", "tanstack-form", "server-actions"]
category: "forms"
difficulty: "advanced"
version: "1.0.0"
date: 2025-01-31
---

# React 19 Optimistic Form Template

Complete template combining React 19's `useOptimistic` hook with TanStack Form for instant UI updates while server processes requests. Includes automatic rollback on errors and pending state indicators.

## Architecture Overview

- **useOptimistic Hook**: Optimistically updates UI state before server confirms
- **Server Actions**: Process requests and validate on server side
- **TanStack Form**: Client-side form management and validation
- **Error Rollback**: Automatically revert optimistic changes if server returns error
- **Pending States**: Show loading indicators on optimistic items
- **Error Recovery**: Display specific field errors and allow retry

## Files Structure

```
src/
├── actions/
│   └── todos.ts                 # Server actions for todo operations
├── lib/
│   ├── validators.ts            # Zod validation schemas
│   └── optimistic-utils.ts      # Optimistic update helpers
├── components/
│   └── OptimisticTodoForm.tsx   # Form component with optimistic updates
├── interfaces/
│   └── todo.ts                  # Type definitions
└── app/
    └── page.tsx                 # Usage example
```

---

## 1. Type Definitions

**File: `src/interfaces/todo.ts`**

```typescript
/**
 * Todo item data structure
 * @property id - Unique identifier
 * @property title - Todo title/description
 * @property completed - Completion status
 * @property createdAt - Timestamp of creation
 * @property optimistic - Whether this is optimistic state
 */
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  optimistic?: boolean;
}

/**
 * Form submission response from server
 */
export interface TodoActionResponse {
  success: boolean;
  data?: Todo;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Optimistic form state
 */
export interface OptimisticFormState {
  action: 'add' | 'update' | 'delete';
  payload: Partial<Todo>;
}
```

---

## 2. Validation Schema

**File: `src/lib/validators.ts`**

```typescript
import { z } from 'zod';

/**
 * Todo form validation schema
 * Validates title is non-empty and within length limits
 */
export const todoSchema = z.object({
  title: z
    .string()
    .min(1, 'Todo title is required')
    .max(255, 'Title must be 255 characters or less')
    .trim(),
  completed: z.boolean().optional().default(false),
});

export type TodoFormData = z.infer<typeof todoSchema>;

/**
 * Edit todo validation schema (includes id)
 */
export const editTodoSchema = todoSchema.extend({
  id: z.string().uuid('Invalid todo ID'),
});

export type EditTodoFormData = z.infer<typeof editTodoSchema>;
```

---

## 3. Optimistic Utility Functions

**File: `src/lib/optimistic-utils.ts`**

```typescript
import { Todo, OptimisticFormState } from '@/interfaces/todo';

/**
 * Create optimistic todo item before server confirmation
 * @param title - Todo title
 * @returns Optimistic todo object with temporary ID
 *
 * @example
 * ```ts
 * const optimisticTodo = createOptimisticTodo('Buy groceries');
 * ```
 */
export function createOptimisticTodo(title: string): Todo {
  return {
    id: `optimistic-${Date.now()}`,
    title,
    completed: false,
    createdAt: new Date(),
    optimistic: true,
  };
}

/**
 * Update optimistic todo with new values
 * @param todos - Current todo list
 * @param id - Todo ID to update
 * @param updates - Partial updates to apply
 * @returns Updated todo list
 */
export function updateOptimisticTodo(
  todos: Todo[],
  id: string,
  updates: Partial<Todo>
): Todo[] {
  return todos.map((todo) =>
    todo.id === id
      ? { ...todo, ...updates, optimistic: true }
      : todo
  );
}

/**
 * Remove optimistic todo from list
 * @param todos - Current todo list
 * @param id - Todo ID to remove
 * @returns Filtered todo list
 */
export function removeOptimisticTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}

/**
 * Merge optimistic update with server response
 * Replaces temporary optimistic ID with server ID
 * @param todos - Current todos with optimistic items
 * @param optimisticId - Temporary ID assigned to optimistic todo
 * @param serverTodo - Confirmed todo from server
 * @returns Updated list with merged server data
 */
export function mergeOptimisticWithServer(
  todos: Todo[],
  optimisticId: string,
  serverTodo: Todo
): Todo[] {
  return todos.map((todo) =>
    todo.id === optimisticId
      ? { ...serverTodo, optimistic: false }
      : todo
  );
}
```

---

## 4. Server Actions

**File: `src/actions/todos.ts`**

```typescript
'use server';

import { todoSchema, editTodoSchema } from '@/lib/validators';
import { Todo, TodoActionResponse } from '@/interfaces/todo';

/**
 * Add new todo item on server
 * Validates input and persists to database
 *
 * @param formData - Form submission data with title
 * @returns Success/error response with created todo
 *
 * @throws Field validation errors displayed in form
 *
 * @example
 * ```ts
 * const response = await addTodoAction({ title: 'Buy groceries', completed: false });
 * if (response.success) {
 *   // Update UI with new todo
 * }
 * ```
 */
export async function addTodoAction(
  formData: unknown
): Promise<TodoActionResponse> {
  try {
    // Validate input
    const validated = todoSchema.parse(formData);

    // Simulate network delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Here: Save to database
    const todo: Todo = {
      id: `todo-${Date.now()}`,
      title: validated.title,
      completed: validated.completed || false,
      createdAt: new Date(),
      optimistic: false,
    };

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    if (error instanceof Error && 'fieldErrors' in error) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: (error as any).fieldErrors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add todo',
    };
  }
}

/**
 * Update existing todo item
 *
 * @param formData - Form data with id, title, and completed status
 * @returns Success/error response with updated todo
 */
export async function updateTodoAction(
  formData: unknown
): Promise<TodoActionResponse> {
  try {
    const validated = editTodoSchema.parse(formData);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Here: Update in database
    const todo: Todo = {
      id: validated.id,
      title: validated.title,
      completed: validated.completed || false,
      createdAt: new Date(),
      optimistic: false,
    };

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update todo',
    };
  }
}

/**
 * Delete todo item
 *
 * @param id - Todo ID to delete
 * @returns Success/error response
 */
export async function deleteTodoAction(id: string): Promise<TodoActionResponse> {
  try {
    // Validate ID format
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        error: 'Invalid todo ID',
      };
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Here: Delete from database
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete todo',
    };
  }
}
```

---

## 5. Form Component with Optimistic Updates

**File: `src/components/OptimisticTodoForm.tsx`**

```typescript
'use client';

import React, { useState, useOptimistic, useCallback } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import {
  addTodoAction,
  updateTodoAction,
  deleteTodoAction,
} from '@/actions/todos';
import {
  createOptimisticTodo,
  updateOptimisticTodo,
  removeOptimisticTodo,
  mergeOptimisticWithServer,
} from '@/lib/optimistic-utils';
import { todoSchema, editTodoSchema } from '@/lib/validators';
import { Todo, TodoFormData, EditTodoFormData } from '@/interfaces/todo';

interface OptimisticTodoFormProps {
  /** Initial list of todos from server */
  initialTodos: Todo[];
  /** Callback when todos list changes */
  onTodosChange?: (todos: Todo[]) => void;
}

/**
 * OptimisticTodoForm Component
 *
 * Complete form demonstrating:
 * - Optimistic UI updates with useOptimistic
 * - Inline editing of todo items
 * - Automatic rollback on server errors
 * - Real-time pending state indicators
 * - Field-level error display
 *
 * @param initialTodos - List of todos to display
 * @param onTodosChange - Callback fired when todo list updates
 *
 * @example
 * ```tsx
 * export default function TodosPage() {
 *   const [todos, setTodos] = useState<Todo[]>([]);
 *
 *   return (
 *     <OptimisticTodoForm
 *       initialTodos={todos}
 *       onTodosChange={setTodos}
 *     />
 *   );
 * }
 * ```
 */
export function OptimisticTodoForm({
  initialTodos,
  onTodosChange,
}: OptimisticTodoFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // useOptimistic manages todo list with rollback capability
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    initialTodos,
    (state: Todo[], payload: { action: string; data: Todo; rollback?: boolean }) => {
      if (payload.rollback) {
        return initialTodos;
      }

      switch (payload.action) {
        case 'add':
          return [...state, payload.data];
        case 'update':
          return updateOptimisticTodo(state, payload.data.id, payload.data);
        case 'delete':
          return removeOptimisticTodo(state, payload.data.id);
        default:
          return state;
      }
    }
  );

  // Form for adding new todos
  const addForm = useForm<TodoFormData>({
    defaultValues: {
      title: '',
      completed: false,
    },
    onSubmit: async (values) => {
      try {
        setSubmitError(null);
        setErrors({});

        // Create optimistic todo immediately
        const optimisticTodo = createOptimisticTodo(values.value.title);
        addOptimisticTodo({ action: 'add', data: optimisticTodo });

        // Submit to server
        const response = await addTodoAction(values.value);

        if (!response.success) {
          // Rollback on error
          addOptimisticTodo({
            action: 'add',
            data: optimisticTodo,
            rollback: true,
          });

          if (response.fieldErrors) {
            setErrors(response.fieldErrors);
          } else {
            setSubmitError(response.error || 'Failed to add todo');
          }
          return;
        }

        // Merge optimistic with server response
        const merged = mergeOptimisticWithServer(
          optimisticTodos,
          optimisticTodo.id,
          response.data!
        );
        onTodosChange?.(merged);

        // Reset form
        addForm.reset();
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: todoSchema,
      onBlur: todoSchema,
      onSubmit: todoSchema,
    },
  });

  /**
   * Handle toggle todo completion status
   * Optimistically updates UI, rolls back on error
   */
  const handleToggleTodo = useCallback(
    async (todo: Todo) => {
      try {
        setSubmitError(null);

        // Optimistic update
        const updated = { ...todo, completed: !todo.completed };
        addOptimisticTodo({ action: 'update', data: updated });

        // Server confirmation
        const response = await updateTodoAction(updated);

        if (!response.success) {
          // Rollback
          addOptimisticTodo({
            action: 'update',
            data: todo,
            rollback: true,
          });
          setSubmitError(response.error || 'Failed to update todo');
        }
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      }
    },
    [addOptimisticTodo, onTodosChange]
  );

  /**
   * Handle inline edit of todo title
   */
  const handleSaveEdit = useCallback(
    async (id: string, newTitle: string) => {
      try {
        setSubmitError(null);
        setErrors({});

        const todo = optimisticTodos.find((t) => t.id === id);
        if (!todo) return;

        // Optimistic update
        const updated = { ...todo, title: newTitle };
        addOptimisticTodo({ action: 'update', data: updated });

        // Server confirmation
        const response = await updateTodoAction({
          id,
          title: newTitle,
          completed: todo.completed,
        });

        if (!response.success) {
          // Rollback
          addOptimisticTodo({
            action: 'update',
            data: todo,
            rollback: true,
          });
          setErrors({ [id]: response.error || 'Failed to save changes' });
        }

        setEditingId(null);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      }
    },
    [optimisticTodos, addOptimisticTodo]
  );

  /**
   * Handle delete todo
   */
  const handleDeleteTodo = useCallback(
    async (todo: Todo) => {
      try {
        setSubmitError(null);

        // Optimistic delete
        addOptimisticTodo({ action: 'delete', data: todo });

        // Server confirmation
        const response = await deleteTodoAction(todo.id);

        if (!response.success) {
          // Rollback
          addOptimisticTodo({
            action: 'add',
            data: todo,
            rollback: true,
          });
          setSubmitError(response.error || 'Failed to delete todo');
        }
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      }
    },
    [addOptimisticTodo]
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
        <p className="text-gray-600 mt-1">
          Updates happen instantly with automatic sync to server
        </p>
      </div>

      {/* Submit Error Alert */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 font-medium">{submitError}</p>
          <button
            onClick={() => setSubmitError(null)}
            className="text-xs text-red-600 hover:text-red-700 mt-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add Todo Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addForm.handleSubmit();
        }}
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
      >
        <div className="flex gap-3">
          <addForm.Field
            name="title"
            children={(field) => (
              <div className="flex-1">
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Add a new todo..."
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]?.toString()}
                  </p>
                )}
              </div>
            )}
          />

          <button
            type="submit"
            disabled={!addForm.state.isFormValid}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      {/* Todo List */}
      <div className="space-y-2">
        {optimisticTodos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No todos yet. Add one to get started!</p>
          </div>
        ) : (
          optimisticTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg transition-all ${
                todo.optimistic ? 'opacity-70 bg-blue-50' : ''
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                aria-label={`Toggle ${todo.title}`}
              />

              {/* Todo Title (Editable) */}
              {editingId === todo.id ? (
                <input
                  type="text"
                  autoFocus
                  defaultValue={todo.title}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      handleSaveEdit(todo.id, e.target.value);
                    } else {
                      setEditingId(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(todo.id, e.currentTarget.value);
                    } else if (e.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                  className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span
                  onClick={() => setEditingId(todo.id)}
                  className={`flex-1 cursor-pointer hover:text-blue-600 transition-colors ${
                    todo.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-900'
                  }`}
                >
                  {todo.title}
                </span>
              )}

              {/* Optimistic Indicator */}
              {todo.optimistic && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Syncing...
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteTodo(todo)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                aria-label={`Delete ${todo.title}`}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-sm text-gray-600">
        <div>
          Total: <span className="font-medium">{optimisticTodos.length}</span>
        </div>
        <div>
          Completed:{' '}
          <span className="font-medium">
            {optimisticTodos.filter((t) => t.completed).length}
          </span>
        </div>
        <div>
          Pending:{' '}
          <span className="font-medium">
            {optimisticTodos.filter((t) => t.optimistic).length}
          </span>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Usage Example

**File: `src/app/page.tsx`**

```typescript
import { OptimisticTodoForm } from '@/components/OptimisticTodoForm';
import { Todo } from '@/interfaces/todo';

/**
 * Home page with optimistic todo form
 * Demonstrates server-to-client integration
 */
export default function Home() {
  // In production: Fetch initial todos from database
  const initialTodos: Todo[] = [
    {
      id: 'todo-1',
      title: 'Learn React 19 useOptimistic',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: 'todo-2',
      title: 'Build optimistic UI patterns',
      completed: true,
      createdAt: new Date(),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <OptimisticTodoForm
        initialTodos={initialTodos}
        onTodosChange={(todos) => {
          console.log('Todos updated:', todos);
          // Here: Persist updated todos if needed
        }}
      />
    </main>
  );
}
```

---

## Key Features

### Optimistic Updates
- **Instant UI Feedback**: Users see changes immediately without waiting for server
- **useOptimistic Hook**: Manages optimistic state with built-in rollback capability
- **Temporary IDs**: New items get optimistic IDs until server confirms with real ID
- **Pending Indicators**: Visual feedback showing which items are being synced

### Error Handling
- **Automatic Rollback**: Failed operations revert to previous state
- **Field Errors**: Validation errors displayed inline
- **Server Errors**: Alert banner for general errors with dismiss option
- **Error Recovery**: Users can retry operations without losing state

### Form Features
- **Inline Editing**: Click todo title to edit directly
- **Keyboard Navigation**: Enter to save, Escape to cancel
- **Validation**: TanStack Form with Zod schema validation
- **Real-time Feedback**: Error indicators and loading states

### Performance
- **No Full Re-renders**: useOptimistic manages efficient updates
- **Minimal Server Calls**: Only changed data sent to server
- **Batch Operations**: Ready for multi-item updates

---

## Customization

### Custom Optimistic States
```typescript
// Add loading spinner
{todo.optimistic && <Spinner size="sm" />}

// Add different styling
const statusClass = todo.optimistic ? 'opacity-50' : '';
```

### Error Recovery Strategies
```typescript
// Retry specific failed item
const handleRetry = async (todo: Todo) => {
  const response = await updateTodoAction(todo);
  if (response.success) {
    // Success
  }
};
```

### Batch Operations
```typescript
// Complete all todos optimistically
const handleCompleteAll = async () => {
  optimisticTodos.forEach((todo) => {
    if (!todo.completed) {
      handleToggleTodo(todo);
    }
  });
};
```

---

## Best Practices

1. **Always provide rollback**: Revert to previous state on server error
2. **Show pending state**: Users need to know when operations are in progress
3. **Temporary IDs**: Use consistent format for optimistic IDs (`optimistic-${timestamp}`)
4. **Error messages**: Clear, actionable messages for failures
5. **Limit optimism**: Only use for fast operations (< 1 second)
6. **Server validation**: Always validate on server, never trust client
7. **Conflict handling**: If concurrent edits occur, server state wins

---

## Browser Support

- **React 19+**: Required for `useOptimistic` hook
- **Chrome/Firefox/Safari**: All modern versions supported
- **Progressive Enhancement**: Works without JavaScript via form fallback

---

## Related Templates

- [Server Action Form](./server-action-form.md) - Basic server actions setup
- [Dynamic Fields](./dynamic-fields.md) - Complex form structures
- [Nested Form](./nested-form.md) - Multi-level form data
