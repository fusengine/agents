---
name: contact-form
description: Single-column contact form with inline validation and success state
when-to-use: Contact pages, support forms, lead capture
keywords: form, contact, validation, single-column, accessible
priority: high
related: faq-accordion.md
---

# Contact Form Template

## MCP Call

```
Tool: mcp__gemini-design__create_frontend
Parameters:
  request: |
    <component>Contact form — single-column, inline validation, animated success state</component>
    <aesthetics>Functional precision — form is the hero of this page, no decorative chrome. Generous spacing between fields, clear visual separation between label + input + error. Success state feels rewarding, not clinical</aesthetics>
    <typography>
      - Section title: var(--font-display), 2rem, font-weight 700
      - Labels: var(--font-body), 0.875rem, font-weight 500, color oklch(var(--foreground))
      - Input text: var(--font-body), 1rem, color oklch(var(--foreground))
      - Placeholder: color oklch(var(--muted-foreground))
      - Error messages: var(--font-body), 0.8125rem, color oklch(var(--destructive))
      - Success message: var(--font-display), 1.25rem, font-weight 600
    </typography>
    <color_system>
      - Input default border: oklch(var(--border))
      - Input focus border: oklch(var(--ring)), outline ring-2 ring-ring/20
      - Input error border: oklch(var(--destructive))
      - Submit bg: oklch(var(--primary))
      - Submit text: oklch(var(--primary-foreground))
      - Submit hover: oklch(var(--primary) / 0.9)
      - Success icon: oklch(var(--primary)) or green-600
    </color_system>
    <spacing>Fields space-y-6. Label to input gap: mb-2. Error message: mt-1.5. Submit button: mt-8, h-12, w-full. Form max-w-lg mx-auto. Section py-20</spacing>
    <states>
      - Default: all fields empty, submit enabled
      - Field focus: border-ring, ring visible
      - Field valid (blur): no indicator — do NOT add green checkmarks
      - Field error (blur): border-destructive, error message visible below with opacity/y animation
      - Submit loading: spinner replaces submit text, button disabled, opacity-80
      - Submit error (API fail): inline banner above submit "Something went wrong, try again"
      - Success: form fades out, success card fades in with checkmark + confirmation text
      - Success card: not a toast — replaces entire form area
    </states>
    <animations>Framer Motion: error messages opacity 0→1, y -4→0, 0.2s. Success card: opacity 0→1, scale 0.96→1, 0.3s easeOut. Form exit on success: opacity 1→0, 0.2s. Spinner: rotate 0→360, 1s linear infinite</animations>
    <forbidden>
      - No grid-cols-2 layout except first name + last name sharing one row
      - No validation on every keystroke (use onBlur only)
      - No green checkmarks on valid fields
      - No toast for success — replace the form, do not overlay
      - No floating labels (label disappears, accessibility nightmare)
      - No Inter/Roboto/Arial
      - No hard-coded hex
    </forbidden>
  techStack: "React + Tailwind CSS + shadcn/ui + Framer Motion"
  context: "<inject full design-system.md content here>"
```

## Field Order

| Row | Field | Width |
|-----|-------|-------|
| 1 | First name + Last name | 2-col (only exception) |
| 2 | Email | Full |
| 3 | Subject | Full |
| 4 | Message textarea (5 rows min) | Full |
| 5 | Submit button | Full |

## Validation Checklist

- [ ] Single column (exception: name row)
- [ ] onBlur validation only, NOT onKeyUp
- [ ] Loading spinner on submit, button disabled
- [ ] Success state replaces form (no toast)
- [ ] All states handled: default, focus, error, loading, API fail, success
- [ ] All inputs have associated `<Label>` (accessibility)
