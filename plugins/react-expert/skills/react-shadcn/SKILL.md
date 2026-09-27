---
name: react-shadcn
description: shadcn/ui for React with TanStack Form. Use when building UI components, forms, dialogs, tables, toasts, or accessible components.
versions:
  shadcn-ui: 4.21.0
  react: 19
  tailwindcss: 4
user-invocable: true
references: references/installation.md, references/configuration.md, references/theming.md, references/button.md, references/input.md, references/label.md, references/textarea.md, references/card.md, references/select.md, references/checkbox.md, references/switch.md, references/radio-group.md, references/slider.md, references/toggle.md, references/toggle-group.md, references/input-otp.md, references/dialog.md, references/alert-dialog.md, references/sheet.md, references/drawer.md, references/popover.md, references/tooltip.md, references/hover-card.md, references/context-menu.md, references/collapsible.md, references/toast.md, references/alert.md, references/skeleton.md, references/progress.md, references/spinner.md, references/table.md, references/tabs.md, references/accordion.md, references/badge.md, references/avatar.md, references/separator.md, references/scroll-area.md, references/aspect-ratio.md, references/resizable.md, references/carousel.md, references/chart.md, references/dropdown.md, references/command.md, references/breadcrumb.md, references/navigation-menu.md, references/menubar.md, references/sidebar.md, references/pagination.md, references/calendar.md, references/field-patterns.md, references/form-examples.md
related-skills: react-19, react-forms, tailwindcss-core, solid-react
---

<objective>
Builds UI components for a React SPA (Vite) with shadcn/ui (CLI 4.21.0) and Tailwind CSS v4 on whichever component base the project uses — Base UI (default for new projects since July 2026), Radix UI (unified `radix-ui` package, fully supported) or React Aria (added July 2026): forms (Field/FieldLabel/FieldError pattern with TanStack Form, never React Hook Form), overlays (Dialog, Sheet, Drawer, Popover, Tooltip), feedback (Alert, Toast on Base UI / Sonner on Radix and Aria, Progress, Skeleton), data display (Table, Badge, Calendar, Chart), and navigation (Sidebar, Command, DropdownMenu).

Requires detecting the base from `components.json` before writing any component code, installing components via `bunx --bun shadcn@latest add` (never hand-written) to `@/modules/cores/shadcn/components/ui/`, and covers MCP registry tools (`mcp__shadcn__*`) for discovering components before implementing. This is the plain-React variant of shadcn/ui — for Next.js App Router see nextjs-shadcn instead.
</objective>

# shadcn/ui for React

Accessible, copy-in components on Base UI, Radix UI or React Aria primitives, styled with Tailwind CSS v4.

## Agent Workflow (MANDATORY)

Before ANY implementation, spawn 3 agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing components and patterns
2. **fuse-ai-pilot:research-expert** - Verify latest shadcn/ui docs via Context7/Exa
3. **mcp__shadcn__*** - Search registry for component availability

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Building UI components for React applications (Vite)
- Need accessible, customizable form components (inputs, selects, checkboxes)
- Implementing dialogs, sheets, drawers, or overlay patterns
- Creating data tables with sorting, filtering, and pagination
- Building navigation menus, sidebars, or command palettes
- Need toast notifications or alert feedback components

### Why shadcn/ui

| Feature | Benefit |
|---------|---------|
| Copy/paste model | Components copied to your project, full ownership |
| Choice of base | Base UI (default), Radix UI or React Aria — same component names |
| Tailwind CSS v4 styling | CSS-first theme (`@theme inline`, OKLCH tokens) |
| TanStack Form ready | Field + FieldError accept Standard Schema issues |
| Lucide icons (default) | `iconLibrary` in `components.json`, switchable via `migrate icons` |

---

## Critical Rules

1. **Detect the base first** - Read `components.json` `style`: `base-*` = Base UI, `radix-*` / `new-york` = Radix, `aria-*` = React Aria. Never mix bases in one component
2. **New projects default to Base UI** - `init` picks Base UI unless `-b radix` / `-b aria` is passed
3. **Composition follows the base** - Base UI uses `render={<Button />}`; Radix uses `asChild`. Reference examples marked Radix must be translated on Base UI projects
4. **NEVER create components manually** - Always install with `bunx --bun shadcn@latest add` (the registry serves the variant for the project's base)
5. **TanStack Form only** - NOT React Hook Form; wire errors with `data-invalid` on `Field` + `aria-invalid` on the control
6. **SOLID paths** - Components at `@/modules/cores/shadcn/components/ui/`

---

## Base Differences That Change Code

| Concern | Base UI (default) | Radix UI |
|---------|-------------------|----------|
| Package | `@base-ui/react` | `radix-ui` (unified; `migrate radix` from `@radix-ui/react-*`) |
| Trigger as custom element | `<DialogTrigger render={<Button />}>Open</DialogTrigger>` | `<DialogTrigger asChild><Button>Open</Button></DialogTrigger>` |
| Select | `<Select items={items}>`, `SelectContent alignItemWithTrigger` | `SelectContent position="item-aligned" \| "popper"` |
| Accordion | `multiple`, `defaultValue={["item-1"]}` | `type="single" collapsible` / `type="multiple"` |
| Toggle group value | array (`defaultValue={["bold"]}`), `multiple` | `type="single" \| "multiple"` |
| Checkbox indeterminate | `indeterminate` prop | `checked="indeterminate"` |
| Drawer | Base UI Drawer (`swipeDirection`) | Vaul (`direction`) |
| Toasts | `add toast` → `toast.add({ title })` | `add sonner` → `toast("…")` from `sonner` |
| Open-state styling | `data-open` / `data-closed` | `data-state="open"` (both covered by `data-open:` variant from `shadcn/tailwind.css`) |

Shared across bases: component names, `showCloseButton` on `DialogContent`/`SheetContent`,
the `Field` family, theme tokens.

---

## Architecture

### Component Foundation

- **Primitives** - Base UI / Radix UI / React Aria (per `components.json`)
- **Tailwind CSS v4** - CSS-first config: `@import "tailwindcss"`, `@import "shadcn/tailwind.css"`, `@custom-variant dark`, `@theme inline`
- **class-variance-authority** - Variant management for component styles
- **`cn` package** - Registry components `import { cn } from "cn"` (Sept 2026, drop-in for `twMerge(clsx(...))`); `lib/utils.ts` re-exports it; migrate old projects with `shadcn migrate cn`

### Project Structure

Components installed to `@/modules/cores/shadcn/components/ui/` following SOLID architecture. Utils at `@/modules/cores/lib/utils.ts` (`export { cn } from "cn"`).

---

## MCP Server Integration

Run `bunx --bun shadcn@latest mcp init --client claude` (or create `.mcp.json`) for Claude Code integration with the shadcn registry.

### Available MCP Tools

- `mcp__shadcn__search_items_in_registries` - Search available components
- `mcp__shadcn__view_items_in_registries` - View component source code
- `mcp__shadcn__get_item_examples_from_registries` - Get usage examples
- `mcp__shadcn__get_add_command_for_items` - Get installation commands

CLI helpers for agents: `shadcn info` (framework, base, installed components) and `shadcn docs <component> -b <base|radix|aria>`.

See [installation.md](references/installation.md) for complete setup.

---

## Component Categories

| Category | Components | Primary Reference |
|----------|------------|-------------------|
| Setup | Init, configuration, theming, icons | [installation.md](references/installation.md) |
| Forms | Button, Input, Field, Select, Checkbox, Switch, Slider | [field-patterns.md](references/field-patterns.md) |
| Overlay | Dialog, Sheet, Drawer, Popover, Tooltip, HoverCard | [dialog.md](references/dialog.md) |
| Feedback | Alert, Toast (Base UI) / Sonner (Radix, Aria), Progress, Skeleton, Spinner | [toast.md](references/toast.md) |
| Data Display | Table, Badge, Avatar, Calendar, Chart, Carousel | [table.md](references/table.md) |
| Navigation | Breadcrumb, DropdownMenu, Command, Sidebar, Tabs | [sidebar.md](references/sidebar.md) |
| Layout | Card, Accordion, Separator, ScrollArea, Resizable | [card.md](references/card.md) |

Component references show the Radix API unless marked otherwise; each one lists the Base UI
differences at the top.

---

## Best Practices

1. **Field components** - `Field` + `FieldLabel` + `FieldError errors={field.state.meta.errors}`
2. **Client Components** - React apps are client-side by default (`"rsc": false`)
3. **Toasts per base** - Base UI Toast on Base UI; Sonner on Radix/Aria (the Radix Toast is deprecated)
4. **MCP tools first** - Use `mcp__shadcn__*` to explore before implementing
5. **Theming via CSS variables** - OKLCH tokens in `src/index.css` `:root` / `.dark`, exposed with `@theme inline`
6. **Accessibility** - Rely on the primitives' keyboard navigation and ARIA; keep `aria-invalid` on invalid controls

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Initial setup | [installation.md](references/installation.md), [configuration.md](references/configuration.md) |
| Form patterns | [field-patterns.md](references/field-patterns.md), [form-examples.md](references/form-examples.md) |
| Theme customization | [theming.md](references/theming.md) |
| Data tables | [table.md](references/table.md) |
| Modal dialogs | [dialog.md](references/dialog.md), [alert-dialog.md](references/alert-dialog.md) |
| Navigation | [sidebar.md](references/sidebar.md), [navigation-menu.md](references/navigation-menu.md) |
