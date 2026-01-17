# 21st.dev Reference

## Overview

21st.dev is a component library and inspiration platform for React/Next.js. It provides production-ready components with modern design patterns.

## Available Tools

| Tool | Purpose |
|------|---------|
| `21st_magic_component_inspiration` | Search for design examples and previews |
| `21st_magic_component_builder` | Generate components from prompts |
| `21st_magic_component_refiner` | Improve existing components |
| `logo_search` | Find company logos (JSX, TSX, SVG) |

## Component Inspiration

### Search Examples

Use `21st_magic_component_inspiration` to find design inspiration:

```typescript
{
  message: "User's full message about what they want",
  searchQuery: "hero section saas" // 2-4 words max
}
```

### Common Search Queries

| Category | Search Terms |
|----------|--------------|
| **Hero** | "hero section", "hero saas", "hero landing" |
| **Pricing** | "pricing table", "pricing cards", "subscription" |
| **Features** | "feature grid", "feature cards", "benefits" |
| **Testimonials** | "testimonials", "reviews", "social proof" |
| **CTA** | "call to action", "cta section", "signup" |
| **Footer** | "footer", "footer links", "footer newsletter" |
| **Navigation** | "navbar", "header", "navigation menu" |
| **Forms** | "login form", "signup form", "contact form" |
| **Cards** | "card grid", "product card", "team card" |

## Component Builder

### Generate from Prompt

Use `21st_magic_component_builder` for custom generation:

```typescript
{
  message: "Full user message",
  searchQuery: "pricing table", // 2-4 words
  absolutePathToCurrentFile: "/path/to/file.tsx",
  absolutePathToProjectDirectory: "/path/to/project",
  standaloneRequestQuery: "Create a pricing table with 3 tiers showing monthly and yearly pricing with a toggle switch"
}
```

### Best Practices

1. **Be Specific**: Include details about layout, features, and styling
2. **Mention Interactions**: Specify hover states, animations, transitions
3. **Define Data**: Describe the content structure and variants
4. **Reference Style**: Mention design systems or existing patterns

## Component Refiner

### Improve Existing UI

Use `21st_magic_component_refiner` to enhance components:

```typescript
{
  userMessage: "Improve the visual design and add hover effects",
  absolutePathToRefiningFile: "/path/to/component.tsx",
  context: "Add subtle shadows, smooth transitions, and modern styling"
}
```

### Refinement Areas

- Visual polish (shadows, gradients, spacing)
- Micro-interactions (hover, focus, active states)
- Responsive adjustments
- Accessibility improvements
- Performance optimizations

## Logo Search

### Find Company Logos

Use `logo_search` to find brand logos:

```typescript
{
  queries: ["github", "discord", "slack"],
  format: "TSX" // JSX, TSX, or SVG
}
```

### Output Formats

| Format | Use Case |
|--------|----------|
| **TSX** | TypeScript React components |
| **JSX** | JavaScript React components |
| **SVG** | Raw SVG markup |

## Response Handling

### Component Code Structure

21st.dev returns components with:
- `componentCode`: Main component implementation
- `demoCode`: Usage example
- `registryDependencies`: Required shadcn components
- `npmDependencies`: Required packages (use `bun add`)

### Integration Steps

1. Install dependencies from `npmDependencies` with `bun add`
2. Add shadcn components from `registryDependencies`
3. Copy `componentCode` to your project
4. Customize styles and content as needed
