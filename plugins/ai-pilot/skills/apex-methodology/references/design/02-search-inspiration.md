---
name: 02-search-inspiration
description: Search for design inspiration on 21st.dev and shadcn/ui
prev_step: references/design/01-analyze-design.md
next_step: references/design/03-plan-component.md
---

# 02 - Search Inspiration

**Find inspiration that fits existing design system.**

## When to Use

- After analyzing existing design (01-analyze-design)
- When creating new components
- When looking for better patterns

---

## 21st.dev Search

### MCP Tool

```text
mcp__magic__21st_magic_component_inspiration

Query examples:
- "hero section glassmorphism"
- "pricing cards dark mode"
- "dashboard sidebar"
- "auth form minimal"
```

### Selection Criteria

```text
[ ] Matches existing color scheme (or adaptable)
[ ] Compatible with existing typography
[ ] Fits spacing patterns
[ ] Has appropriate animation level
[ ] NOT generic AI slop (no purple gradients)
```

---

## shadcn/ui Search

### MCP Tool

```text
mcp__shadcn__search_items_in_registries

Query examples:
- "button"
- "card"
- "dialog"
- "form"
```

### Check Examples

```text
mcp__shadcn__get_item_examples_from_registries

Query: "[component]-demo" or "example-[component]"
```

---

## Anti-AI Slop Filter

### REJECT if contains

```text
- Inter, Roboto, Arial fonts
- Purple/pink gradients on white
- Cookie-cutter 3-card grids
- Border-left colored indicators
- Flat solid backgrounds
- Missing hover states
```

### ACCEPT if shows

```text
- Distinctive typography
- Thoughtful color palette
- Orchestrated animations
- Glassmorphism / depth
- Purposeful whitespace
```

---

## Output Requirements

### Inspiration Report

```markdown
## Selected Inspiration

### Source
- 21st.dev: [component name/link]
- shadcn: [component name]

### Why Selected
- Matches existing: [colors/typography/spacing]
- Adds value: [specific improvement]

### Adaptation Needed
- Change colors to: var(--primary)
- Adjust font to: font-display
- Match spacing: gap-4 instead of gap-6
```

---

## Validation Checklist

```text
[ ] 21st.dev searched
[ ] shadcn/ui searched
[ ] Inspiration fits existing design
[ ] No AI slop patterns
[ ] Adaptation plan noted
```

---

## Next Phase

-> Proceed to `03-plan-component.md`
