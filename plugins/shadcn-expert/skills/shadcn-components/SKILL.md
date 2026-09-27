---
name: shadcn-components
description: "Use when building or editing shadcn/ui components, mapping Base UI vs Radix vs React Aria APIs, or choosing a composition pattern (render vs asChild vs trigger wrapper)."
versions:
  shadcn-ui: "4.x"
  radix-ui: "1.x"
  base-ui: "1.x"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Task, mcp__shadcn__search_items_in_registries, mcp__shadcn__view_items_in_registries, mcp__shadcn__get_item_examples_from_registries, mcp__shadcn__get_add_command_for_items
references: references/radix-components.md, references/baseui-components.md, references/templates/dialog-example.md
related-skills: shadcn-detection, shadcn-registries
---

<objective>
Documents component patterns for shadcn/ui on its three bases — Base UI (default since July 2026), Radix and React Aria — API differences, mapping between primitives (Dialog/Select/Tooltip/Accordion/Popover/Menu/Combobox), per-base component availability, and the three composition patterns (`render` for Base UI, `asChild` for Radix, trigger-wrapper children for React Aria).

Requires detecting the project's primitive first (`shadcn-detection`) and consulting the shadcn MCP for registry source instead of hand-writing component internals.
</objective>

# shadcn Components

## Agent Workflow (MANDATORY)

Before component work, spawn agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Find existing components
2. **fuse-ai-pilot:research-expert** - Verify component APIs via Context7
3. **mcp__shadcn__search_items_in_registries** - Search available components

After: Run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Base UI primitives** | Default base for new projects since 2026-07-02 (`base-*` styles, `@base-ui/react`); `init --defaults` = Next.js template + `nova` preset on the `base` base = `base-nova` |
| **Radix primitives** | Original base (2023), still fully supported (`radix-*` styles, unified `radix-ui` package); `init -b radix` |
| **React Aria primitives** | Third base since 2026-07-17 (`aria-*` styles, `react-aria-components`); `init -b aria` |
| **Component mapping** | Same shadcn wrapper names for Base UI and Radix; React Aria wrappers differ (see below) |
| **API differences** | `render` vs `asChild` vs trigger wrapper, part naming, data attributes |
| **`cn` import** | Components import `cn` from the `cn` package (Sept 2026); `lib/utils.ts` is `export { cn } from "cn"` |

Get base-specific docs, examples and API links from the CLI: `{runner} shadcn@latest docs dialog --base aria` (`--base base|radix|aria`, defaults to the project base). Component pages: `/docs/components/{base|radix|aria}/<name>`, each with a Composition tree.

---

## Critical Rules

1. **ALWAYS detect primitive** before component work (shadcn-detection)
2. **ALWAYS consult MCP** before adding any component
3. **NEVER mix** Base UI, Radix and React Aria APIs in same component
4. **MATCH composition** pattern to detected primitive
5. **USE registry source** as truth, not manual code

---

## Architecture

```
components/ui/
├── dialog.tsx          # Adapted to detected primitive
├── select.tsx
├── accordion.tsx
└── ...
```

-> See [dialog-example.md](references/templates/dialog-example.md) for complete component

---

## MCP Usage (MANDATORY)

ALWAYS consult shadcn MCP before adding components:

```
mcp__shadcn__search_items_in_registries -> find component
mcp__shadcn__view_items_in_registries   -> view source
mcp__shadcn__get_add_command_for_items  -> get install command
```

---

## Component Mapping Table

Primitive parts used inside `components/ui/*.tsx` (registry `*-nova` sources, `ui.shadcn.com/r/styles/<style>/<name>.json`):

| Component | Radix Part | Base UI Part | React Aria Part |
|-----------|-----------|--------------|-----------------|
| Dialog content | `Dialog.Content` | `Dialog.Popup` | `Modal` > `Dialog` |
| Dialog overlay | `Dialog.Overlay` | `Dialog.Backdrop` | `ModalOverlay` |
| Select | `Select.Content` | `Select.Positioner` + `Select.Popup` (+ `Select.List`) | `Select` + `Popover` > `ListBox` |
| Tooltip | `Tooltip.Content` | `Tooltip.Positioner` + `Tooltip.Popup` | `TooltipTrigger` > `Tooltip` |
| Accordion | `Accordion.Content` | `Accordion.Panel` | `DisclosureGroup` > `Disclosure` > `DisclosurePanel` |
| Popover | `Popover.Content` | `Popover.Positioner` + `Popover.Popup` | `DialogTrigger` > `Popover` |
| Menu | `DropdownMenu.Content` | `Menu.Positioner` + `Menu.Popup` | `MenuTrigger` > `Popover` > `Menu` |
| Combobox | none (uses `@base-ui/react` Combobox) | `Combobox.*` | `ComboBox` + `Popover` > `ListBox` |

Wrapper API at call sites (`@/components/ui/*`):

| Wrapper usage | Base UI | Radix | React Aria |
|---------------|---------|-------|------------|
| Dialog | `Dialog > DialogTrigger + DialogContent` | same as Base UI | `DialogTrigger > Button + Dialog` (no `DialogContent`) |
| Popover / Tooltip / DropdownMenu | `X > XTrigger + XContent` | same | `XTrigger > Button + X` (e.g. `DropdownMenuTrigger > Button + DropdownMenu`) |
| Accordion | `defaultValue={["a"]}`, `multiple` | `type="single" collapsible defaultValue="a"`, `type="multiple"` | `defaultExpandedKeys={["a"]}`, `allowsMultipleExpanded`, items use `id` |
| Select | `items` prop on `Select`, `SelectItem value` | `SelectItem value` | `placeholder` on `Select`, `SelectItem id` |
| Combobox | `items` + `ComboboxList` render function | same as Base UI | `ComboboxList` children, `renderEmptyState`, `ComboboxItem id` |
| Events / state | `onClick`, `disabled`, `open`/`onOpenChange` | same | `onPress`, `isDisabled`, `isOpen`/`onOpenChange` |
| Raw data attrs | `data-open`, `data-starting-style`, `data-side` | `data-state="open"`, `data-side` | `data-entering`/`data-exiting`, `data-placement`, `data-focused`, `data-pressed` |

Shared `data-open:` / `data-closed:` / `data-checked:` Tailwind variants (from `shadcn/tailwind.css`) match both `[data-state=...]` and `[data-open]`.

## Component Availability per Base

| Component | Base UI | Radix | React Aria |
|-----------|---------|-------|------------|
| Toast (`@base-ui/react/toast`, `toast.add()`) | yes (July 2026) | no: use Sonner | no: use Sonner |
| Sonner | registry item exists; docs route to Toast | yes | yes |
| Menubar, Navigation Menu | yes | yes | no (`r/styles/aria-nova/{menubar,navigation-menu}.json` → 404) |
| Questionnaire (styled over `@shadcn/react/questionnaire`) | yes | yes | yes |
| MessageScroller, Message, Bubble, Attachment, Marker (chat, June 2026) | yes | yes | yes (docs pages exist) |
| Blocks (`login-01`, sidebar, dashboard...) | yes | yes | yes (e.g. `r/styles/aria-nova/login-01.json`); `add` picks the project base |

Forms (/docs/forms): every guide builds on `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup` with `data-invalid` on `Field` and `aria-invalid` on the control — React Hook Form (`Controller` + Zod `zodResolver`), TanStack Form (`form.Field` render prop + Zod), Formisch (`Form` + `Field`, Valibot schema), Next.js (Server Action + `useActionState`, server-side Zod).

`@shadcn/react` = unstyled headless primitives (`@shadcn/react/questionnaire`, `@shadcn/react/message-scroller`); `@shadcn/helpers` (`/ai-sdk`, `/tanstack-ai`) = scripted `useChat` conversations for demos/tests, not UI. Typography for rendered markdown: shadcn/typeset (one `typeset.css`, `className="typeset"`).

---

## Composition Patterns

### Radix: `asChild`

```tsx
<Dialog.Trigger asChild>
  <Button variant="outline">Open</Button>
</Dialog.Trigger>
```

### Base UI: `render`

```tsx
<Dialog.Trigger render={<Button variant="outline" />}>
  Open
</Dialog.Trigger>
```

### React Aria: trigger wrapper (no `asChild`, no `render`)

```tsx
<DialogTrigger>
  <Button variant="outline">Open</Button>
  <Dialog>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </Dialog>
</DialogTrigger>
```

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Radix APIs** | [radix-components.md](references/radix-components.md) | Building with Radix primitives |
| **Base UI APIs** | [baseui-components.md](references/baseui-components.md) | Building with Base UI primitives |
| **React Aria APIs** | Tables above + [dialog-example.md](references/templates/dialog-example.md) | Building with React Aria primitives |

### Templates

| Template | When to Use |
|----------|-------------|
| [dialog-example.md](references/templates/dialog-example.md) | Creating Dialog components |

---

## Best Practices

### DO
- Detect primitive FIRST (use shadcn-detection)
- Consult MCP for component source before editing
- Follow existing naming conventions in project
- Use correct composition pattern for detected primitive

### DON'T
- Mix asChild, render and React Aria trigger wrappers in same component
- Assume Radix (or the new Base UI default) without detection
- Manually write component internals (use MCP)
- Skip registry check before adding new components
