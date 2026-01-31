---
name: server-actions
description: Server Actions integration with forms - useActionState, progressive enhancement, server validation, error handling, TanStack Form combination
when-to-use: form submissions, server validation, progressive enhancement, error handling patterns
keywords: server-actions, useActionState, progressive-enhancement, server-validation, error-handling
priority: high
related: templates/server-action-form.md, templates/optimistic-form.md
---

# React 19 Server Actions for Forms

**Handle form submissions with server-side processing and validation.**

## Purpose

Server Actions enable secure form handling by executing server-side logic directly from client components. Combine with `useActionState` to manage submission state and validation errors.

## When to Use

- Forms requiring server-side validation before saving
- Operations that must stay secure on server (database writes, API calls)
- Progressive enhancement for forms that work without JavaScript
- Complex validation rules that need database access
- Forms with file uploads or large data processing

## Key Points

- Server Actions marked with `'use server'` execute only on server
- `useActionState` hook manages form state, pending state, and server responses
- FormData provides native form serialization without client state
- Server returns error objects (never throws) for client-side error display
- Progressive enhancement: forms work without JavaScript via standard POST

## Progressive Enhancement

Forms using Server Actions work without JavaScript because they use standard HTML form submission. The `action` prop directly calls the server function, and results are sent back to update UI state.

## useActionState Integration

The hook accepts an async Server Action function and initial state, returning `[state, formAction, isPending]`. Use `formAction` in the form's `action` prop to bind the submission handler.

## Server Validation Pattern

Validate input with schemas (Zod, Valibot) on server before database operations. Return validation errors as field-level objects mapped by field name, enabling targeted error display.

## Error Return Format

Return typed response objects with `{ success: boolean, error?: string, fieldErrors?: Record<string, string> }`. Never throw errors; always return them for consistent error handling in components.

## TanStack Form + Server Actions

Combine TanStack Form for client-side state management and validation with Server Actions for server-side processing. TanStack handles UI responsiveness while Server Actions ensure security.

→ See `templates/server-action-form.md` for code examples
