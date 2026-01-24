---
name: solid-nextjs
description: SOLID principles for Next.js 16 with modular architecture. Files < 150 lines, interfaces separated, JSDoc mandatory.
user-invocable: false
references:
  - path: references/solid-principles.md
    title: SOLID Principles
  - path: references/architecture-patterns.md
    title: Architecture Patterns
  - path: references/code-templates.md
    title: Code Templates
---

# SOLID Next.js - Modular Architecture

## Current Date (CRITICAL)

**Today: January 2026** - ALWAYS use the current year for your searches.
Search with "2025" or "2026", NEVER with past years.

## MANDATORY: Research Before Coding

**CRITICAL: Check today's date first, then search documentation and web BEFORE writing any code.**

1. **Use Context7** to query Next.js/React official documentation
2. **Use Exa web search** with current year for latest trends
3. **Check Vercel Blog** of current year for new features
4. **Verify package versions** for Next.js 16 compatibility

**Search queries (replace YYYY with current year):**
- `Next.js [feature] YYYY best practices`
- `React 19 [component] YYYY`
- `TypeScript [pattern] YYYY`
- `Prisma 7 [feature] YYYY`

---

## Codebase Analysis (MANDATORY)

**Before ANY implementation:**
1. Explore project structure to understand architecture
2. Read existing related files to follow established patterns
3. Identify naming conventions, coding style, and patterns used
4. Understand data flow and dependencies

## DRY - Reuse Before Creating (MANDATORY)

**Before writing ANY new code:**
1. Search existing codebase for similar functionality
2. Check shared locations: `modules/cores/lib/`, `modules/cores/components/`
3. If similar code exists → extend/reuse instead of duplicate

---

## Absolute Rules (MANDATORY)

### 1. Files < 150 lines

- **Split at 90 lines** - Never exceed 150
- Page components < 50 lines (use composition)
- Server Components < 80 lines
- Client Components < 60 lines
- Server Actions < 30 lines each

### 2. Modular Architecture

See `references/architecture-patterns.md` for complete structure with feature modules and cores directory.

### 3. JSDoc Mandatory

```typescript
/**
 * Fetch user by ID from database.
 *
 * @param id - User unique identifier
 * @returns User object or null if not found
 * @throws DatabaseError on connection failure
 */
export async function getUserById(id: string): Promise<User | null>
```

### 4. Interfaces Separated

```text
modules/auth/src/
├── interfaces/          # Types ONLY
│   ├── user.interface.ts
│   └── session.interface.ts
├── services/            # NO types here
└── components/          # NO types here
```

---

## SOLID Principles

See `references/solid-principles.md` for detailed S-O-L-I-D principles with examples.

---

## Code Templates

See `references/code-templates.md` for Server Components, Client Components, Services, Hooks, and Interfaces.

---

## Response Guidelines

1. **Research first** - MANDATORY: Search Context7 + Exa before ANY code
2. **Show complete code** - Working examples, not snippets
3. **Explain decisions** - Why this pattern over alternatives
4. **Include tests** - Always suggest test cases
5. **Handle errors** - Never ignore, use error boundaries
6. **Type everything** - Full TypeScript, no `any`
7. **Document code** - JSDoc for complex functions

---

## Forbidden

- ❌ Coding without researching docs first (ALWAYS research)
- ❌ Using outdated APIs without checking current year docs
- ❌ Files > 150 lines
- ❌ Interfaces in component files
- ❌ Business logic in `app/` pages
- ❌ Direct DB calls in components
- ❌ Module importing another module (except cores)
- ❌ `'use client'` by default
- ❌ `useEffect` for data fetching
- ❌ Missing JSDoc on exports
- ❌ `any` type
- ❌ Barrel exports
