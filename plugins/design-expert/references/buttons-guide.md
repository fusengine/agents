---
name: buttons-guide
description: Complete button design guide with states, sizes, and best practices
keywords: buttons, CTA, states, hover, disabled, sizing, accessibility
priority: high
---

# Button Design Guide

## BUTTON ANATOMY

```
┌─────────────────────────────────────┐
│  [Icon]  Label Text  [Icon]         │
│          ↑                          │
│    padding-x: 16-32px               │
│    height: 40-60px                  │
└─────────────────────────────────────┘
```

## BUTTON STYLES

### Filled Button (Primary Actions)
```tsx
<Button className="bg-primary text-primary-foreground shadow-sm">
  Primary Action
</Button>
```

### Ghost/Clear Button (Tertiary Actions)
```tsx
<Button variant="ghost" className="bg-primary/10 text-primary">
  Secondary Action
</Button>
```

### Line/Outline Button (Secondary Actions)
```tsx
<Button variant="outline" className="border-primary text-primary">
  Outline Action
</Button>
```

## BUTTON STATES (MANDATORY)

| State | Visual Treatment |
|-------|-----------------|
| **Default** | Base appearance |
| **Hover** | Slight darken/lighten, cursor pointer |
| **Pressed/Active** | Scale down slightly (0.98) |
| **Disabled** | opacity-50, cursor-not-allowed |
| **Loading** | Spinner icon, disabled interaction |

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="transition-colors"
>
  Button Text
</motion.button>
```

## BUTTON SIZING

| Size | Height | Padding X | Font Size | Use Case |
|------|--------|-----------|-----------|----------|
| **sm** | 32px | 12px | 14px | Compact UI, cards |
| **default** | 40px | 16px | 16px | Standard actions |
| **lg** | 48px | 24px | 18px | Primary CTAs |
| **xl** | 56px | 32px | 18px | Hero sections |

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

## TEXT SIZE RULES

- **Minimum**: 13pt (accessibility)
- **Recommended**: 16pt (optimal readability)
- **Maximum**: 20pt (avoid button bloat)

## CORNER RADIUS CONSISTENCY

**RULE**: All buttons in design MUST have same corner radius.

```css
/* Pick ONE and stick to it */
--button-radius: 8px;   /* Modern */
--button-radius: 12px;  /* Rounded */
--button-radius: 9999px; /* Pill */
```

## BUTTON WIDTH

### Fixed Padding (Web)
```tsx
<Button className="px-8">Download</Button>
```

### Full Width (Mobile/Forms)
```tsx
<Button className="w-full">Continue</Button>
```

### Aligned with Form (Recommended)
```tsx
<form className="space-y-4">
  <Input />
  <Button className="w-full">Submit</Button>
</form>
```

## SHADOW USAGE

- **Filled buttons**: Add subtle shadow for depth
- **Ghost/Outline buttons**: No shadow

```tsx
<Button className="shadow-sm hover:shadow-md">
  Primary Action
</Button>
```

## VERY IMPORTANT BUTTONS (VIB)

For irreversible actions (payment, deletion):

1. **Clear label** (NOT "Continue" → "Complete Purchase")
2. **Confirmation text** below button
3. **Distinct color** if destructive

```tsx
<div className="text-center">
  <Button className="bg-destructive">Delete Account</Button>
  <p className="mt-2 text-sm text-muted-foreground">
    This action cannot be undone.
  </p>
</div>
```

## ICON BUTTONS

### With Label
```tsx
<Button>
  <Download className="mr-2 h-4 w-4" />
  Download
</Button>
```

### Icon Only (Accessibility Required)
```tsx
<Button size="icon" variant="ghost" aria-label="Settings">
  <Settings className="h-4 w-4" />
</Button>
```

## FORBIDDEN PATTERNS

- Inconsistent corner radius across buttons
- Font size below 13px
- Missing hover/disabled states
- "Continue" for irreversible actions
- Buttons without clear hierarchy
- Icon-only without aria-label

## ACCESSIBILITY CHECKLIST

- [ ] Minimum touch target: 44x44px
- [ ] Color contrast: 4.5:1 for text
- [ ] Focus ring visible
- [ ] Disabled state communicated
- [ ] Loading state with spinner
- [ ] aria-label for icon-only buttons
