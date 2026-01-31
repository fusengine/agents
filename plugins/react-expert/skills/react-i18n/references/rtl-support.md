---
name: rtl-support
description: Right-to-left languages - Arabic, Hebrew, Persian support with CSS logical properties
when-to-use: supporting RTL languages, bidirectional apps, international apps
keywords: RTL, right-to-left, Arabic, Hebrew, dir, logical properties
priority: low
related: language-detection.md
---

# RTL (Right-to-Left) Support

## RTL Languages

**Languages requiring right-to-left text direction.**

### Purpose
- Proper text rendering
- Correct layout direction
- Cultural appropriateness

### When to Use
- Supporting Arabic users
- Hebrew localization
- Persian/Urdu audiences
- Global applications

### Key Points
- Arabic, Hebrew, Persian, Urdu
- Affects entire layout
- Text alignment flips
- UI mirrors horizontally

---

## Document Direction

**Set HTML dir attribute based on language.**

### Purpose
- Browser-level direction
- CSS logical properties work
- Proper text rendering

### When to Use
- On every language change
- App initialization
- SSR hydration

### Key Points
- Update `document.documentElement.dir`
- Set `lang` attribute too
- Effect on language change
- RTL language list check

---

## CSS Logical Properties

**Direction-agnostic CSS properties.**

### Purpose
- Single CSS for LTR/RTL
- No duplicate stylesheets
- Automatic flipping

### When to Use
- All new CSS
- Tailwind CSS v4+
- Modern browsers

### Key Points
- `margin-inline-start` not `margin-left`
- `padding-inline-end` not `padding-right`
- `text-align: start` not `text-align: left`
- Tailwind: `ms-4`, `me-4`, `ps-4`, `pe-4`

---

## Logical Property Mapping

| Physical | Logical |
|----------|---------|
| `left` | `inline-start` |
| `right` | `inline-end` |
| `margin-left` | `margin-inline-start` |
| `padding-right` | `padding-inline-end` |
| `text-align: left` | `text-align: start` |

---

## Icons and Images

**Handle directional visual elements.**

### Purpose
- Mirror directional icons
- Keep universal icons unchanged
- Correct visual flow

### When to Use
- Arrow icons
- Navigation icons
- Progress indicators

### Key Points
- Arrows should flip
- Checkmarks stay same
- Media controls stay same
- Use CSS transform or SVG

---

→ See templates for implementation examples
