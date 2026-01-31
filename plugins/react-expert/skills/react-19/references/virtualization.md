---
name: virtualization
description: Render only visible items in long lists - TanStack Virtual, windowing, performance
when-to-use: long lists, large datasets, table performance, infinite scroll
keywords: virtual, windowing, tanstack, list, table, scroll
priority: medium
related: templates/virtual-list.md, lazy-loading.md
---

# Virtualization

## Purpose

**Render only visible items instead of entire list.**

### Why Virtualize
- DOM nodes are expensive
- Thousands of elements = slow render
- Browser memory limits
- Scroll performance degrades

### When to Use
- Lists with 100+ items
- Tables with many rows
- Infinite scroll feeds
- Large data grids

### Key Points
- Only visible items in DOM
- Placeholder maintains scroll height
- Items recycled on scroll
- Overscan for smooth scrolling

---

## TanStack Virtual

**Headless virtualization library.**

### Purpose
- Framework agnostic core
- React bindings included
- Flexible styling
- Small bundle (~3KB)

### Key Concepts
- `useVirtualizer` hook
- Scroll container ref
- Item size estimation
- Virtual items array

### When to Use
- Custom list designs
- Complex item layouts
- Variable height items
- Horizontal scrolling

---

## Virtualization Types

| Type | Use Case |
|------|----------|
| Vertical list | Standard scrolling lists |
| Horizontal list | Carousels, timelines |
| Grid | Image galleries, dashboards |
| Table | Data-heavy applications |
| Window | Full page virtualization |

---

## Key Configuration

| Option | Purpose |
|--------|---------|
| `count` | Total number of items |
| `getScrollElement` | Scroll container ref |
| `estimateSize` | Item height estimate |
| `overscan` | Extra items outside viewport |
| `getItemKey` | Stable keys for items |

---

## Variable Height Items

**Handle items with different sizes.**

### Purpose
- Dynamic content
- Expandable rows
- Rich content items

### Key Points
- `measureElement` callback
- Dynamic size calculation
- Cache measured sizes
- Re-measure on content change

---

## Performance Considerations

| Factor | Recommendation |
|--------|----------------|
| Overscan | 3-5 items for smooth scroll |
| Item complexity | Simpler items = better perf |
| Re-renders | Memoize item components |
| Scroll handler | Throttled by library |

---

→ See `templates/virtual-list.md` for code examples
