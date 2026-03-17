# DRY Enforcement in Astro

## Pre-Code Checklist (MANDATORY)

Before writing ANY new function, component, or utility:

1. **Grep for similar names**
   ```bash
   grep -r "functionName\|ComponentName" src/
   ```

2. **Check shared locations**
   - `src/lib/` — utility functions and services
   - `src/components/common/` — reusable UI components
   - `src/interfaces/` — type definitions

3. **If similar exists** → extend or reuse
4. **If needed in 2+ places** → create in `src/lib/` immediately

## Duplication Triggers

### 3+ Occurrences Rule

If the same logic appears in 3+ places, extract to `src/lib/`:

```typescript
// BEFORE: Same date formatting in 3 components
new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

// AFTER: Single source of truth in src/lib/utils.ts
/**
 * Format a date for display.
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```

### Component Prop Repetition

If 3+ components share the same prop structure → extract to interface:

```typescript
// src/interfaces/component.interface.ts
export interface WithLocaleProps {
  locale: string;
}

export interface WithDateProps {
  pubDate: Date;
  updatedDate?: Date;
}
```

## Detection Tools

```bash
# Find duplicated code blocks (jscpd)
npx jscpd ./src --threshold 3 --min-lines 5

# Find similar function signatures
grep -rn "export (async )?function" src/lib/

# Find repeated class names in templates
grep -rn "class=\"" src/components/ | sort | uniq -d
```

## Common DRY Violations in Astro

| Violation | Fix |
|-----------|-----|
| Same `getCollection` query in multiple pages | Extract to `src/lib/[type].ts` |
| Repeated frontmatter imports | Create import aliases |
| Duplicate prop interfaces | Merge into `src/interfaces/` |
| Same `<meta>` tags across layouts | Centralize in BaseLayout |
| Repeated error handling | Create error boundary component |
