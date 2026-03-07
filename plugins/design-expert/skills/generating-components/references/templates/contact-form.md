---
name: contact-form
description: Single-column contact form with inline validation and success state
when-to-use: Contact pages, support forms, lead capture
keywords: form, contact, validation, single-column, accessible
priority: high
related: faq-accordion.md
---

# Contact Form Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Row 1 | First name + Last name (ONLY 2-col exception) | Stack on mobile |
| Row 2 | Email (full width) | Full width |
| Row 3 | Subject or topic (full width) | Full width |
| Row 4 | Message textarea (full width, 5 rows) | Full width |
| Row 5 | Submit button (full width) | Full width |
| Success | Checkmark icon + confirmation message | Centered |

**CRITICAL: Single column layout only. Never use grid-cols-2 for the form. Exception: first name + last name share one row. Research: single column = +25% completion rate (Baymard Institute).**

## Components (shadcn/ui)

- Input: text fields with Label
- Textarea: message field, 5 rows minimum
- Button: submit with loading state (Loader2 spinner)
- Label: accessible labels for each field

## Design Tokens

| Token | Value | Notes |
|-------|-------|-------|
| spacing | space-y-6 | Consistent vertical gap |
| input-radius | rounded-lg | From design system |
| success-color | green-600 | Confirmation state |
| error-color | destructive | Inline validation |

## Animation (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Success state | opacity 0->1, scale 0.95->1 | 0.3s |
| Error messages | opacity 0->1, y -4->0 | 0.2s |
| Submit button | Loading spinner on submit | Until response |

## Gemini Design Prompt

> "Create a single-column contact form with first+last name on one row (only exception to single-column), email field, message textarea, and full-width submit button with loading state. Include inline validation on blur and animated success state with checkmark. Use design-system.md tokens. OKLCH colors, no Inter/Roboto. Accessible labels and focus states."

## Multi-Stack Adaptation

| Stack | Implementation |
|-------|---------------|
| React + shadcn | Gemini Design MCP with Input, Textarea, Button, Label |
| Laravel Blade | Visual spec -> Livewire Flux form with wire:submit |
| Swift/SwiftUI | Visual spec -> Form with TextField and TextEditor |

## Validation Checklist

- [ ] SINGLE column layout (never grid-cols-2 except name row)
- [ ] Inline validation on blur, not on submit only
- [ ] Loading state with spinner on submit button
- [ ] Animated success state after submission
- [ ] Accessible: all inputs have associated Labels
