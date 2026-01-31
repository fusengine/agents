---
name: icons-guide
description: Icon usage guide with types, sizing, and consistency rules
keywords: icons, lucide, favicons, interactive icons, scalability, line-width
priority: medium
---

# Icon Design Guide

## ICON TYPES

| Type | Purpose | Example |
|------|---------|---------|
| **Clarifying** | Enhance text understanding | 📋 Next to "Documents" |
| **Interactive** | Trigger actions | 🔍 Search button |
| **Decorative** | Visual embellishment | Illustrations |
| **Favicon** | Browser tab identification | Site logo 16x16/32x32 |

## ICON SIMPLICITY (CRITICAL)

```
✅ Simple icons = Universal recognition
❌ Complex icons = User confusion
```

### Common Icons (Never Over-Complicate)
- Home, Search, Settings, Favorites
- Profile, Menu, Close, Back
- These are universal - keep them standard!

## SCALABILITY REQUIREMENTS

Icons MUST remain readable at ALL sizes:

| Size | Use Case |
|------|----------|
| **16px** | Dense UI, tables |
| **20px** | Navigation, buttons |
| **24px** | Standard (most common) |
| **32px** | Feature highlights |
| **48px+** | Empty states, heroes |

```tsx
// Test at all sizes before finalizing
<Icon className="h-4 w-4" />  // 16px
<Icon className="h-5 w-5" />  // 20px
<Icon className="h-6 w-6" />  // 24px (default)
<Icon className="h-8 w-8" />  // 32px
```

**RULE**: If icon is unreadable at 16px, it's too complex.

## LINE WIDTH CONSISTENCY

All icons in a project MUST have same stroke width:

```tsx
// ✅ Consistent - All icons from same pack
<Lucide.Home strokeWidth={1.5} />
<Lucide.Search strokeWidth={1.5} />
<Lucide.Settings strokeWidth={1.5} />

// ❌ Inconsistent - Mixed packs/widths
<Lucide.Home strokeWidth={2} />
<OtherPack.Search strokeWidth={1} />
```

### Stroke Width + Font Weight Pairing

| Font Weight | Icon Stroke |
|-------------|-------------|
| Light (300) | 1px |
| Regular (400) | 1.5px |
| Medium (500) | 1.75px |
| Bold (700) | 2px |

```tsx
<div className="flex items-center gap-2">
  <User strokeWidth={1.5} className="h-4 w-4" />
  <span className="font-normal">Profile</span>
</div>
```

## CORNER ROUNDNESS CONSISTENCY

Pick ONE style and maintain throughout:

| Style | Appearance | Vibe |
|-------|------------|------|
| **Sharp** | Square corners | Serious, formal |
| **Rounded** | Soft corners | Friendly, universal |

```tsx
// ❌ FORBIDDEN - Mixing styles
<Lucide.Home />          // Rounded
<SomeOther.Settings />   // Sharp

// ✅ CORRECT - Same pack, same style
<Lucide.Home />
<Lucide.Settings />
```

## ICON LIBRARIES (RECOMMENDED)

### Lucide React (Default for shadcn)
```tsx
import { Home, Search, Settings } from 'lucide-react';

<Home className="h-5 w-5" />
```

### Heroicons (Alternative)
```tsx
import { HomeIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid } from '@heroicons/react/24/solid';
```

### Tabler Icons (1800+ icons)
```tsx
import { IconHome } from '@tabler/icons-react';

<IconHome size={24} stroke={1.5} />
```

## FILLED vs OUTLINE

| State | Style |
|-------|-------|
| **Inactive** | Outline |
| **Active/Selected** | Filled |

```tsx
// Tab navigation example
<nav className="flex gap-4">
  <button className={isActive ? "text-primary" : "text-muted-foreground"}>
    {isActive ? <HomeSolid /> : <HomeOutline />}
    Home
  </button>
</nav>
```

## ICON BUTTON PATTERNS

### With Label
```tsx
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

### Icon Only (Accessibility Required)
```tsx
<Button size="icon" aria-label="Delete item">
  <Trash className="h-4 w-4" />
  <span className="sr-only">Delete item</span>
</Button>
```

## COLOR USAGE

### Inherit Parent Color (Recommended)
```tsx
<Button className="text-primary">
  <Download className="h-4 w-4" /> {/* Inherits text-primary */}
</Button>
```

### Semantic Colors
```tsx
<AlertCircle className="text-destructive" />
<CheckCircle className="text-success" />
<AlertTriangle className="text-warning" />
<Info className="text-primary" />
```

## FAVICON REQUIREMENTS

| Size | Use Case |
|------|----------|
| 16x16 | Browser tab |
| 32x32 | Taskbar, shortcuts |
| 180x180 | Apple touch icon |
| 512x512 | PWA splash |

```html
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

## FORBIDDEN PATTERNS

- Mixing icon libraries in same project
- Inconsistent stroke widths
- Mixing sharp and rounded styles
- Complex icons for common actions
- Icon-only buttons without labels/aria
- Using emojis as icons (use real icons)

## ACCESSIBILITY CHECKLIST

- [ ] Interactive icons have labels
- [ ] Icon buttons have aria-label
- [ ] Decorative icons have aria-hidden
- [ ] Minimum touch target 44x44px
- [ ] Sufficient color contrast
