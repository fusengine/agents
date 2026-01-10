# Shadows Reference - Tailwind CSS v4.1

Comprehensive guide for shadow utilities in Tailwind CSS v4.1.

## Box Shadow Preset Values

### Default Shadow Scale

| Class | CSS Value | Use Case |
|-------|-----------|----------|
| `shadow-none` | `none` | Remove shadow |
| `shadow-xs` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Very subtle, minimal lift |
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle, close elements |
| `shadow` | `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)` | Base/default shadow |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` | Standard elevation |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` | Medium elevation |
| `shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` | Strong elevation |
| `shadow-2xl` | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` | Maximum elevation |

## v3 → v4 Shadow Changes

| v3 | v4 | Notes |
|----|----|----|
| `shadow-sm` | `shadow-xs` | Renamed for consistency |
| `shadow` | `shadow-sm` | Renamed (sm now is base) |
| No base | `shadow` | New base shadow value |

## Shadow Color (v4.1 NEW)

Apply color tints to shadows.

### Syntax
```html
<div class="shadow-{size} shadow-{color}">
```

### Examples

```html
<!-- Basic color -->
<div class="shadow-lg shadow-red-500">Red shadow</div>
<div class="shadow-lg shadow-blue-400">Blue shadow</div>
<div class="shadow-lg shadow-purple-600">Purple shadow</div>

<!-- With opacity -->
<div class="shadow-lg shadow-black/30">Black shadow 30% opacity</div>
<div class="shadow-lg shadow-red-500/50">Red shadow 50% opacity</div>
<div class="shadow-lg shadow-cyan-400/75">Cyan shadow 75% opacity</div>

<!-- Combined -->
<div class="shadow-md shadow-emerald-500/40">
  Medium emerald shadow at 40% opacity
</div>
```

### Available Shadow Colors

All theme colors supported:
- `slate`, `gray`, `zinc`, `neutral`, `stone`
- `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

Each with opacity variants: `/10`, `/20`, `/30`, `/40`, `/50`, `/60`, `/70`, `/80`, `/90`

## Inset Shadow (v4.1 NEW)

Create inner shadows for pressed/carved effects.

### Preset Values

| Class | CSS Value |
|-------|-----------|
| `inset-shadow-none` | `none` |
| `inset-shadow-xs` | `inset 0 1px 1px 0 rgba(0, 0, 0, 0.05)` |
| `inset-shadow-sm` | `inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)` |
| `inset-shadow` | `inset 0 1px 3px 0 rgba(0, 0, 0, 0.1)` |
| `inset-shadow-md` | `inset 0 4px 6px -1px rgba(0, 0, 0, 0.1)` |
| `inset-shadow-lg` | `inset 0 10px 15px -3px rgba(0, 0, 0, 0.1)` |
| `inset-shadow-xl` | `inset 0 20px 25px -5px rgba(0, 0, 0, 0.1)` |

### Examples

```html
<!-- Basic inset shadow -->
<div class="inset-shadow-sm">Subtle inner shadow</div>
<div class="inset-shadow-lg">Strong inner shadow</div>

<!-- With color -->
<div class="inset-shadow inset-shadow-blue-500">Blue inner shadow</div>
<div class="inset-shadow-lg inset-shadow-red-500/30">
  Large red inner shadow at 30% opacity
</div>

<!-- Pressed button effect -->
<button class="bg-blue-500 hover:inset-shadow-md active:inset-shadow-lg">
  Press to see effect
</button>

<!-- Carved input -->
<input class="border inset-shadow-sm inset-shadow-black/5" />
```

## Combining Shadows

### Layering Shadows

```html
<!-- Outer + Inset combination -->
<div class="shadow-lg inset-shadow-sm">
  Elevated with carved edge
</div>

<!-- Multiple shadow colors -->
<div class="shadow-xl shadow-blue-500/20">
  Blue-tinted elevation
</div>
```

### Stacking Effects

```html
<!-- Neumorphic style -->
<div class="shadow-lg shadow-gray-400 inset-shadow-md inset-shadow-white/50">
  Neumorphic card
</div>

<!-- Glass effect with shadow -->
<div class="backdrop-blur-lg shadow-lg shadow-black/10 inset-shadow-sm inset-shadow-white/20">
  Frosted glass with depth
</div>
```

## Arbitrary Shadow Values

### Custom Box Shadow

```html
<!-- Single value -->
<div class="shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
  Custom shadow
</div>

<!-- Inset custom -->
<div class="shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
  Custom inset shadow
</div>

<!-- Multiple shadows -->
<div class="shadow-[0_1px_3px_rgba(0,0,0,0.1),0_0_0_3px_rgba(59,130,246,0.1)]">
  Shadow with outline effect
</div>

<!-- Directional custom -->
<div class="shadow-[0_-4px_12px_rgba(0,0,0,0.2)]">
  Shadow pointing up
</div>
```

## Responsive Shadows

```html
<!-- Mobile: subtle, Desktop: strong -->
<div class="shadow-sm md:shadow-lg lg:shadow-xl">
  Responsive shadow elevation
</div>

<!-- Shadow color changes -->
<div class="shadow-md shadow-gray-400 lg:shadow-blue-500">
  Shadow color at breakpoint
</div>

<!-- Inset on interaction -->
<div class="shadow-lg hover:inset-shadow-md hover:shadow-none">
  Toggle effect on hover
</div>
```

## Dark Mode

```html
<!-- Different shadow in dark mode -->
<div class="shadow-lg shadow-black/25 dark:shadow-black/50">
  Darker shadow in dark mode
</div>

<!-- Invert shadow color -->
<div class="shadow-lg shadow-white/0 dark:shadow-white/20">
  White tint in dark mode
</div>

<!-- Remove shadow in dark -->
<div class="shadow-xl dark:shadow-none dark:inset-shadow-md">
  Elevation becomes carved
</div>
```

## Use Cases

### Elevation Levels

```html
<!-- Level 1: Cards, small elevation -->
<div class="shadow-sm">Low elevation</div>

<!-- Level 2: Default interactive elements -->
<div class="shadow-md">Standard elevation</div>

<!-- Level 3: Dropdowns, popovers -->
<div class="shadow-lg">High elevation</div>

<!-- Level 4: Modals, top-most elements -->
<div class="shadow-xl">Maximum elevation</div>
```

### Interactive States

```html
<!-- Default -->
<button class="shadow-md">Default button</button>

<!-- Hover: more shadow -->
<button class="shadow-md hover:shadow-lg">Hover button</button>

<!-- Active: inset shadow -->
<button class="shadow-md active:inset-shadow-md active:shadow-none">
  Active button
</button>

<!-- Disabled: no shadow -->
<button class="shadow-md disabled:shadow-none opacity-50">
  Disabled button
</button>
```

### Depth Stacking

```html
<!-- Card stack effect -->
<div class="shadow-sm">First card</div>
<div class="shadow-md -mt-2">Second card</div>
<div class="shadow-lg -mt-2">Third card</div>
```

### Design Patterns

```html
<!-- Glassmorphism with shadow -->
<div class="bg-white/20 backdrop-blur-xl shadow-xl shadow-black/10">
  Glass card
</div>

<!-- Soft shadow (light color) -->
<div class="shadow-xl shadow-gray-200">
  Soft, subtle depth
</div>

<!-- Neumorphic button -->
<button class="rounded-xl bg-gray-100 shadow-lg shadow-gray-400/50 inset-shadow-sm inset-shadow-white">
  Neumorphic
</button>

<!-- Floating action button -->
<button class="rounded-full shadow-2xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/50">
  FAB
</button>
```

## Performance Considerations

1. **Avoid excessive shadows** - Multiple shadows impact rendering
2. **Use inset-shadow for layering** - More efficient than multiple box-shadows
3. **Prefer color tints** - `shadow-{color}` is more performant than custom rgba
4. **Test on low-end devices** - Large shadows can cause jank
5. **Combine with opacity** - Subtle shadows perform better

## Configuration

### Custom Shadow Scale

```css
@import "tailwindcss";

@theme {
  --shadow-custom: 0 8px 16px rgba(0, 0, 0, 0.15);
  --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.5);
}
```

Usage:
```html
<div class="shadow-[var(--shadow-custom)]">Custom shadow</div>
<div class="shadow-[var(--shadow-glow)]">Glow effect</div>
```

## Browser Support

- **Box Shadow**: All browsers (IE8+)
- **Shadow Color (v4.1)**: Modern browsers (Chrome 88+, Firefox 87+, Safari 14+)
- **Inset Shadow (v4.1)**: Modern browsers
- **Arbitrary Values**: Modern browsers with CSS variable support
