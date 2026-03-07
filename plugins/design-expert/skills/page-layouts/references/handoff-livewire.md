---
name: handoff-livewire
description: Complete token-to-Livewire/Blade mapping for design handoff. Use when laravel-expert implements a design-system.md identity.
related: framework-integration.md, design-system-template.md
---

## Color Tokens → Blade/CSS

| Design Token | Implementation |
|---|---|
| `--color-primary` | `:root { --color-primary: oklch(65% 0.15 250); }` in `resources/css/app.css` |
| Dark mode | `.dark { --color-primary: oklch(75% 0.12 250); }` + Tailwind `dark:` variant |
| Usage in Blade | `class="bg-[--color-primary]"` or `@theme { --color-primary: ... }` in Tailwind v4 |

## Spacing Tokens → Tailwind

| Token | Value | Tailwind Classes |
|---|---|---|
| `--space-xs` | 4px | `p-1`, `gap-1` |
| `--space-sm` | 8px | `p-2`, `gap-2` |
| `--space-md` | 16px | `p-4`, `gap-4` |
| `--space-lg` | 24px | `p-6`, `gap-6` |
| `--space-xl` | 32px | `p-8`, `gap-8` |

## Typography → Blade

- Custom fonts: `@font-face` in `app.css`, Tailwind `font-[family-name]`
- Tailwind v4: `@theme { --font-display: "Clash Display", sans-serif; }`

## Motion → Alpine.js x-transition

| Framer Motion | Alpine.js equivalent |
|---|---|
| `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` | `x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"` |
| `exit={{ opacity: 0 }}` | `x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"` |
| Scale effect | Add `scale-95` to `enter-start` and `leave-end` |
| Slide effect | Add `translate-y-2` (up) or `translate-x-full` (right) to `enter-start`/`leave-end` |
| Stagger | Not native — use `x-intersect` with progressive `animation-delay` or CSS `animation-delay` |

**Presets:**

| Name | Duration | Use case |
|---|---|---|
| micro | 150ms | Tooltips, badges |
| standard | 200ms | Dropdowns, modals |
| slow | 300ms | Page transitions |

## Component Mapping (Flux v2.13.0)

| shadcn | Flux equivalent | Notes |
|---|---|---|
| Button | `<flux:button>` | `variant="primary\|outline\|danger\|ghost"` |
| Card | `<flux:card>` | FREE |
| Dialog | `<flux:modal>` | 3 modes: `wire:click`, `Flux::modal()->close()`, Alpine `$flux.modal().show()` |
| Input | `<flux:input wire:model="...">` | PRO |
| Select | `<flux:select>` | PRO |
| Toast | `<flux:toast>` | PRO — trigger via `Flux::toast()` |
| DataTable | `<flux:table>` + `<flux:table.row>` | PRO |
| Tabs | `<flux:tabs>` + `<flux:tab>` | PRO |
| Command | `<flux:command>` | PRO |
| Accordion | `<flux:accordion>` | PRO |

**FREE:** button, dropdown, icon, separator, tooltip
**PRO required:** input, modal, table, tabs, accordion, command, toast

## Responsive → Blade

- Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:` (1536px)
- Pattern (mobile-first): `<div class="flex flex-col md:flex-row">`
