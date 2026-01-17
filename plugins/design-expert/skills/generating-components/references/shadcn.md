# shadcn/ui Reference

## Overview

shadcn/ui is a collection of reusable components built with Radix UI and Tailwind CSS. Components are copy-paste, not installed via package manager.

## Available Tools

| Tool | Purpose |
|------|---------|
| `search_items_in_registries` | Find components by name |
| `view_items_in_registries` | Get component details and code |
| `get_item_examples_from_registries` | Find usage examples |
| `get_add_command_for_items` | Get CLI install command |

## Common Components

### Layout
- `card` - Container with header, content, footer
- `separator` - Visual divider
- `aspect-ratio` - Maintain aspect ratios

### Forms
- `button` - Primary action element
- `input` - Text input field
- `textarea` - Multi-line input
- `select` - Dropdown selection
- `checkbox` - Boolean selection
- `radio-group` - Single selection from options
- `switch` - Toggle control
- `slider` - Range selection
- `form` - Form wrapper with validation

### Feedback
- `alert` - Informational messages
- `alert-dialog` - Confirmation dialogs
- `toast` - Temporary notifications
- `progress` - Loading indicator
- `skeleton` - Loading placeholder

### Navigation
- `navigation-menu` - Site navigation
- `tabs` - Tabbed content
- `breadcrumb` - Location indicator
- `pagination` - Page navigation

### Overlay
- `dialog` - Modal dialogs
- `sheet` - Slide-out panels
- `popover` - Floating content
- `tooltip` - Hover information
- `dropdown-menu` - Context menus

### Data Display
- `table` - Data tables
- `avatar` - User images
- `badge` - Status indicators
- `carousel` - Image galleries

## Usage Patterns

### Search for Component
```typescript
// Use search_items_in_registries
registries: ["@shadcn"]
query: "button"
```

### Get Examples
```typescript
// Use get_item_examples_from_registries
registries: ["@shadcn"]
query: "button-demo"
```

### Install Component
```bash
# Use get_add_command_for_items
npx shadcn@latest add button
```

## Styling Conventions

### CSS Variables
```css
--background: oklch(100% 0 0);
--foreground: oklch(10% 0 0);
--primary: oklch(55% 0.25 260);
--secondary: oklch(95% 0.02 260);
--muted: oklch(95% 0.01 260);
--accent: oklch(95% 0.03 260);
```

### Dark Mode
Components automatically support dark mode via CSS variables and the `dark:` variant.

### Customization
Override styles using the `className` prop and Tailwind classes:

```tsx
<Button className="bg-gradient-to-r from-purple-500 to-pink-500">
  Custom Button
</Button>
```
