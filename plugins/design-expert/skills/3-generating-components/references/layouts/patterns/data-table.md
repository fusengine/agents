---
name: data-table
description: Advanced data table with TanStack Table, sorting, filtering, and skeleton loading
when-to-use: Displaying tabular data, admin tables, list views with actions
keywords: table, data, tanstack, sort, filter, pagination, skeleton, bulk-actions
priority: high
related: dashboard.md, command-palette.md
---

# Data Table Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Toolbar | Search + filter + bulk actions | Stack on mobile |
| Header | Column headers with sort indicators | Horizontal scroll on mobile |
| Body | Data rows with selection | Horizontal scroll on mobile |
| Footer | Pagination + row count | Simplified on mobile |

**Research:** Skeleton loading is perceived as 9-12% faster than spinners (NNG research). Always use skeleton rows instead of spinner overlays.

## Components (shadcn/ui)

- `Table` - Base table structure
- `Input` - Search/filter field
- `Button` - Actions, pagination
- `Checkbox` - Row selection
- `DropdownMenu` - Row actions, column visibility
- `Select` - Page size selector
- `Badge` - Status indicators
- `Skeleton` - Loading state rows

## Features

| Feature | Implementation |
|---------|---------------|
| Sorting | Click column header, toggle asc/desc/none |
| Filtering | Text search + column-specific filters |
| Pagination | Page numbers + prev/next + page size |
| Row selection | Checkbox column + bulk action toolbar |
| Column visibility | Toggle menu for showing/hiding columns |
| Row actions | Dropdown menu per row (edit, delete, etc.) |

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --table-row-height | 48px (standard) / 36px (dense) | Row height |
| --table-header-bg | var(--muted) | Header background |
| --table-hover-bg | var(--muted)/50 | Row hover |
| --table-selected-bg | var(--primary)/5 | Selected row |
| --table-border | var(--border) | Cell borders |

## Loading State

```
+--------------------------------------------------+
| [Skeleton ████████] | [Skeleton ████] | [██████] |
| [Skeleton ██████]   | [Skeleton ██]   | [████]   |
| [Skeleton ████████] | [Skeleton ████] | [██████] |
+--------------------------------------------------+
```

- Show 5-10 skeleton rows matching column widths
- Shimmer animation (pulse or wave)
- Maintain table structure during loading

## Animation (Framer Motion)

- Row entrance: stagger fade-in (0.02s delay)
- Sort change: layout animation on reorder
- Selection: subtle background color transition
- Skeleton: shimmer pulse animation

## Gemini Design Prompt

```
Create a data table with search toolbar, sortable columns, row selection checkboxes,
pagination footer, and row action dropdowns. Include skeleton loading state.
Use TanStack Table for logic. shadcn/ui Table for rendering.
Dense variant with 36px rows. Use design-system.md tokens.
```

## Multi-Stack Adaptation

| Stack | Data Fetching | Server-Side |
|-------|--------------|-------------|
| Next.js | TanStack Query + Server Components | URL search params for sort/filter |
| React SPA | TanStack Query | API query params |
| Laravel | Eloquent + pagination | Blade or Inertia |

## Validation Checklist

- [ ] Sorting works on all sortable columns
- [ ] Filter/search updates table in real-time
- [ ] Pagination shows correct page count
- [ ] Skeleton loading state (no spinner)
- [ ] Row selection with bulk actions
- [ ] Mobile: horizontal scroll with sticky first column
- [ ] Empty state when no results match filter
- [ ] Accessible: table has proper ARIA attributes
