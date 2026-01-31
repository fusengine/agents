---
name: ssr-hydration
description: TanStack Form SSR & Hydration patterns - Server state merging, validation, and hydration with Next.js
when-to-use: server-side form rendering, form state reuse, initial data hydration, form validation
keywords: SSR, hydration, TanStack Form, form state, server validation, Next.js, TanStack Start
priority: medium
related: templates/ssr-form.md
---

# TanStack Form SSR & Hydration

## formOptions() for SSR Configuration

**Define form with server-aware configuration.**

### Purpose
- Configure forms to work across server and client
- Set default values from server-rendered state
- Handle serialization for hydration

### When to Use
- Initial form state comes from server
- Pre-filling forms with database values
- Server-rendered forms that need client interaction

### Key Points
- `formOptions` accepts `initialFormState` parameter
- State must be serializable (JSON-compatible)
- Server data flows into client form seamlessly
- Used as base configuration before client hydration

→ See `templates/ssr-form.md` for code examples

---

## mergeForm() for Client/Server State Merge

**Intelligently merge server and client form state.**

### Purpose
- Combine server-rendered initial state with client updates
- Prevent state duplication
- Handle partial updates gracefully

### When to Use
- Form starts with server data
- Need to update only changed fields
- Avoiding full state re-initialization

### Key Points
- Merges without losing client-side edits
- Preserves field touched/dirty status
- Works with complex nested objects
- Validates merged state before applying

→ See `templates/ssr-form.md` for code examples

---

## useTransform() for Hydration

**Transform server data during client hydration.**

### Purpose
- Normalize server-sent data to form shape
- Convert dates, numbers, or custom types
- Ensure type consistency

### When to Use
- Server sends non-serializable types
- Data format differs from form expectations
- Need to apply transformations during hydration

### Key Points
- Runs during hydration phase
- Transforms data before setting in form
- Prevents type mismatches
- Handles null/undefined gracefully

→ See `templates/ssr-form.md` for code examples

---

## createServerValidate() for Server Validation

**Define validation rules that run on both server and client.**

### Purpose
- Single source of truth for validation
- Validate server-side before client hydration
- Prevent invalid state from hydrating

### When to Use
- Validation logic used in Server Actions
- Complex rules needing server execution
- Database-dependent validation (unique checks)

### Key Points
- Runs on server during form submission
- Results hydrate into client form
- Errors display immediately after hydration
- Can access databases, APIs, external services

→ See `templates/ssr-form.md` for code examples

---

## getFormData() for Server-Side Data

**Extract form data on server before hydration.**

### Purpose
- Serialize form state to send to client
- Prepare data for transmission
- Ensure complete hydration payload

### When to Use
- Building initial state in Server Components
- Fetching form data in getServerSideProps
- Server Actions preprocessing

### Key Points
- Returns serializable form state object
- Strips internal form metadata
- Safe for JSON stringification
- Client receives clean, ready-to-use data

→ See `templates/ssr-form.md` for code examples

---

## initialFormState for Hydration

**Provide server-rendered initial state to client.**

### Purpose
- Pass server data directly into form
- Skip duplicate server calls on client
- Reduce time-to-interactive

### When to Use
- Always when form has pre-populated data
- Avoiding N+1 queries (server fetch + client fetch)
- Multi-step forms with persisted progress

### Key Points
- Passed via `formOptions.initialFormState`
- Must match form field structure exactly
- Hydrates before any user interaction
- Sets field values, touched, dirty states

→ See `templates/ssr-form.md` for code examples

---

## Next.js App Router Integration

**Seamless SSR/hydration with Next.js 16 patterns.**

### Purpose
- Leverage Server Components for form setup
- Use Server Actions for validation and submission
- Maintain type safety across boundary

### When to Use
- All new Next.js 16+ projects
- Server Components rendering forms
- Server Actions handling submissions

### Key Points
- Server Components fetch initial data
- Pass data to Client Component via props
- Client Component uses `initialFormState`
- Server Action validates and processes
- Type-safe props bridge server/client

→ See `templates/ssr-form.md` for code examples
