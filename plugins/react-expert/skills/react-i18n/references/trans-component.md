---
name: trans-component
description: Embed React components in translations - links, formatting, custom components
when-to-use: rich text translations, embedded links, styled text, custom elements
keywords: Trans, component, JSX, rich text, embedded, links
priority: medium
related: templates/trans-component-examples.md, interpolation.md
---

# Trans Component

## Purpose

**Embed React components within translation strings.**

### Purpose
- Links inside translated text
- Styled spans and formatting
- Custom components in messages
- Complex rich text

### When to Use
- Terms links in legal text
- Bold/italic formatting
- Icons within text
- Interactive elements

### Key Points
- Named component mapping
- Self-closing tags supported
- Nested components possible
- Falls back gracefully

---

## Component Mapping

**Map translation tags to React elements.**

### Purpose
- Define React element for each tag
- Type-safe component props
- Reusable across translations

### When to Use
- All Trans component usage
- Consistent link styling
- Custom element rendering

### Key Points
- Named tags: `<link>text</link>`
- Self-closing: `<icon/>`
- Props pass through
- Children from translation

---

## With Interpolation

**Combine components and variables.**

### Purpose
- Dynamic content with formatting
- Variable inside component
- Complex message composition

### When to Use
- "Hello <bold>{{name}}</bold>"
- Formatted dynamic values
- Count with styling

### Key Points
- Pass `values` prop
- Variables inside component tags
- Pluralization supported
- Full i18next features

---

## Configuration Options

| Option | Purpose |
|--------|---------|
| `transSupportBasicHtmlNodes` | Allow `<strong>`, `<em>` without mapping |
| `transKeepBasicHtmlNodesFor` | List of allowed HTML tags |
| `transEmptyNodeValue` | Value for empty nodes |

---

## Best Practices

| Practice | Reason |
|----------|--------|
| Named tags | `<terms>` not `<0>` for clarity |
| Self-closing | `<icon/>` for components without children |
| Minimal nesting | Avoid deep nesting for maintainability |
| Default content | Provide fallback in component |

---

→ See `templates/trans-component-examples.md` for complete examples
