---
name: transition
description: Transition utilities for Tailwind CSS v4.1
---

# Transition Utilities - Tailwind CSS v4.1

Complete reference for CSS transitions: properties, duration, timing functions, and delays.

## Transition Property

Define which CSS properties should be animated during transitions.

### Class Reference
```
transition-none       transition-property: none
transition            transition-property: color, background-color, border-color, text-decoration-color, fill, stroke (default)
transition-all        transition-property: all
transition-colors     transition-property: color, background-color, border-color, text-decoration-color, fill, stroke
transition-opacity    transition-property: opacity
transition-shadow     transition-property: box-shadow
transition-transform  transition-property: transform
transition-[property] Custom property transition
```

### Usage Examples

```html
<!-- Default transitions (colors, shadows) -->
<button class="transition">
  Default transition
</button>

<!-- All properties transition -->
<div class="transition-all">
  Changes size, position, color
</div>

<!-- Only color transitions -->
<link class="transition-colors text-gray-600 hover:text-blue-600">
  Link color transition
</link>

<!-- Only opacity fades -->
<div class="transition-opacity opacity-0 hover:opacity-100">
  Fade in on hover
</div>

<!-- Only transform moves -->
<div class="transition-transform translate-x-0 hover:translate-x-4">
  Slide on hover
</div>

<!-- Only shadow changes -->
<div class="transition-shadow shadow-sm hover:shadow-lg">
  Shadow depth transition
</div>

<!-- No transition -->
<div class="transition-none">
  Instant change
</div>

<!-- Responsive transitions -->
<div class="transition-none sm:transition-colors md:transition-all">
  Transition varies by screen
</div>

<!-- Multiple transitions can be layered -->
<button class="transition-colors duration-200 hover:bg-blue-500 focus:ring-2 transition-shadow">
  Compound transitions
</button>
```

### Performance Tips

```html
<!-- GOOD: Transition only what changes -->
<button class="transition-colors duration-200 hover:bg-blue-500">
  Better performance
</button>

<!-- GOOD: Use transform for movement (GPU accelerated) -->
<div class="transition-transform duration-300 hover:translate-x-2">
  Hardware accelerated
</div>

<!-- AVOID: Transition too many properties -->
<div class="transition-all duration-200">
  May impact performance
</div>

<!-- AVOID: Animate position (use transform instead) -->
<div class="transition-all duration-200 hover:left-4">
  Less performant
</div>
```

---

## Duration

Set the length of time a transition or animation takes.

### Class Reference
```
duration-0     0ms
duration-75    75ms
duration-100   100ms
duration-150   150ms
duration-200   200ms
duration-300   300ms
duration-500   500ms
duration-700   700ms
duration-1000  1000ms
```

### Usage Examples

```html
<!-- Quick transitions (UI feedback) -->
<button class="transition-colors duration-100 hover:bg-gray-100">
  Instant feedback
</button>

<!-- Medium transitions (standard interactions) -->
<div class="transition-all duration-300 hover:scale-105">
  Comfortable motion
</div>

<!-- Slow transitions (elegant animations) -->
<div class="transition-opacity duration-500 opacity-0 hover:opacity-100">
  Slow fade
</div>

<!-- Very slow (drawer opening) -->
<div class="transition-transform duration-700 -translate-x-full data-open:translate-x-0">
  Drawer animation
</div>

<!-- Responsive duration -->
<button class="transition-colors duration-200 sm:duration-300 md:duration-500">
  Duration increases on larger screens
</button>

<!-- Staggered animations -->
<div class="space-y-2">
  <div class="transition-opacity duration-200 opacity-0 group-open:opacity-100">Item 1</div>
  <div class="transition-opacity duration-200 opacity-0 delay-100 group-open:opacity-100">Item 2</div>
  <div class="transition-opacity duration-200 opacity-0 delay-200 group-open:opacity-100">Item 3</div>
</div>

<!-- Interactive duration control -->
<input type="range" min="100" max="1000" class="duration-[var(--duration)]"
       onchange="this.style.setProperty('--duration', this.value + 'ms')" />

<!-- Page transition -->
<div class="transition-opacity duration-300 opacity-100 page-exiting:opacity-0">
  Page content
</div>
```

### Common Duration Patterns

```html
<!-- Micro-interactions: 100-200ms -->
<button class="duration-150">Quick button click</button>

<!-- UI elements: 200-300ms -->
<menu class="duration-300">Dropdown menu</menu>

<!-- Page transitions: 300-500ms -->
<section class="duration-500">Section fade</section>

<!-- Modals/Drawers: 500-700ms -->
<div class="duration-700">Large modal</div>

<!-- Page-level: 700-1000ms -->
<html class="duration-1000">Full page transition</html>
```

---

## Timing Function (Easing)

Control the acceleration curve of a transition.

### Class Reference
```
ease-linear     cubic-bezier(0, 0, 1, 1)       Constant speed
ease-in         cubic-bezier(0.4, 0, 1, 1)     Starts slow, accelerates
ease-out        cubic-bezier(0, 0, 0.2, 1)     Starts fast, decelerates
ease-in-out     cubic-bezier(0.4, 0, 0.2, 1)   Slow start and end
```

### Visual Behavior

```
ease-linear:     ___________
                /

ease-in:        ___
                  /
                 /
               /

ease-out:      /
              /
             /
            ___

ease-in-out:    __
                 /
                /
               __
```

### Usage Examples

```html
<!-- Linear: Constant speed (spinners, loaders) -->
<div class="animate-spin ease-linear">
  Loading spinner
</div>

<!-- Ease-in: Object accelerating from rest -->
<div class="transition-all duration-500 ease-in hover:translate-x-10">
  Accelerating motion
</div>

<!-- Ease-out: Object slowing to stop (most natural) -->
<button class="transition-colors duration-300 ease-out hover:bg-blue-500">
  Natural button press
</button>

<!-- Ease-in-out: Smooth, controlled motion -->
<div class="transition-all duration-700 ease-in-out">
  Modal animation
</div>

<!-- Responsive easing -->
<div class="transition-transform duration-300 ease-linear sm:ease-out md:ease-in-out">
  Easing varies by screen
</div>

<!-- Tooltip appearance -->
<div class="opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
  Tooltip
</div>

<!-- Dropdown menu -->
<menu class="transition-all duration-300 ease-out scale-95 opacity-0 group-open:scale-100 group-open:opacity-100">
  Dropdown
</menu>

<!-- Page transition entry -->
<main class="transition-opacity duration-500 ease-out opacity-0 page-loaded:opacity-100">
  Page content
</main>
```

### Advanced Patterns

```html
<!-- Bounce effect (requires custom keyframes) -->
<div class="animate-bounce ease-in-out">
  Bouncing ball
</div>

<!-- Elastic effect (custom keyframes) -->
<div class="animate-elastic ease-in-out">
  Elastic motion
</div>

<!-- Combination: ease-out for entrance, ease-in for exit -->
<div class="transition-opacity duration-300 ease-out group-open:opacity-100 group-closed:ease-in">
  Smart easing
</div>

<!-- Spring-like motion -->
<button class="transition-transform duration-500 ease-out hover:scale-110 active:ease-in active:scale-95">
  Button with spring
</button>
```

---

## Delay

Add a delay before a transition or animation starts.

### Class Reference
```
delay-0       0ms
delay-75      75ms
delay-100     100ms
delay-150     150ms
delay-200     200ms
delay-300     300ms
delay-500     500ms
delay-700     700ms
delay-1000    1000ms
```

### Usage Examples

```html
<!-- No delay (instant) -->
<div class="transition-all duration-300 delay-0">
  Starts immediately
</div>

<!-- Short delay (stagger effect) -->
<div class="space-y-2">
  <div class="transition-opacity duration-300 opacity-0 group-open:opacity-100 delay-0">
    Item 1
  </div>
  <div class="transition-opacity duration-300 opacity-0 group-open:opacity-100 delay-100">
    Item 2
  </div>
  <div class="transition-opacity duration-300 opacity-0 group-open:opacity-100 delay-200">
    Item 3
  </div>
</div>

<!-- Choreographed animation -->
<div class="delay-0 transition-transform" />
<div class="delay-100 transition-transform" />
<div class="delay-200 transition-transform" />
<div class="delay-300 transition-transform" />

<!-- Menu fade-in stagger -->
<nav>
  <a class="opacity-0 group-open:opacity-100 transition-opacity delay-0">Home</a>
  <a class="opacity-0 group-open:opacity-100 transition-opacity delay-100">About</a>
  <a class="opacity-0 group-open:opacity-100 transition-opacity delay-200">Services</a>
  <a class="opacity-0 group-open:opacity-100 transition-opacity delay-300">Contact</a>
</nav>

<!-- Sequential reveal -->
<div class="space-y-4">
  <section class="transition-all duration-500 translate-y-4 opacity-0 delay-0 data-visible:translate-y-0 data-visible:opacity-100">
    Section 1
  </section>
  <section class="transition-all duration-500 translate-y-4 opacity-0 delay-150 data-visible:translate-y-0 data-visible:opacity-100">
    Section 2
  </section>
  <section class="transition-all duration-500 translate-y-4 opacity-0 delay-300 data-visible:translate-y-0 data-visible:opacity-100">
    Section 3
  </section>
</div>

<!-- Cascading button effect -->
<div class="grid grid-cols-3 gap-2">
  {[...Array(9)].map((_, i) => (
    <button
      key={i}
      class={`transition-all duration-300 scale-100 hover:scale-110 delay-[${i * 50}ms]`}
    >
      {i}
    </button>
  ))}
</div>

<!-- Responsive delay -->
<div class="transition-opacity duration-300 delay-0 sm:delay-100 md:delay-200">
  Delay increases on larger screens
</div>
```

### Stagger Calculation

```html
<!-- Linear stagger: 100ms between each item -->
<div class="delay-0">Item 0 (0ms)</div>
<div class="delay-100">Item 1 (100ms)</div>
<div class="delay-200">Item 2 (200ms)</div>
<div class="delay-300">Item 3 (300ms)</div>

<!-- Exponential stagger: Each faster than previous -->
<div class="delay-700">Item 0</div>
<div class="delay-500">Item 1</div>
<div class="delay-300">Item 2</div>
<div class="delay-100">Item 3</div>

<!-- Variable stagger: Custom pattern -->
<div class="delay-150">Item 0</div>
<div class="delay-300">Item 1</div>
<div class="delay-200">Item 2</div>
<div class="delay-500">Item 3</div>
```

---

## Complete Transition Examples

### Example 1: Button with Full Transition
```html
<button class="
  px-4 py-2 rounded bg-blue-500 text-white
  transition-all duration-300 ease-out
  hover:bg-blue-600 hover:shadow-lg hover:scale-105
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  active:scale-95
">
  Complete transition
</button>
```

### Example 2: Dropdown Menu
```html
<div class="relative group">
  <button class="px-4 py-2">Menu</button>
  <menu class="
    absolute top-full left-0 mt-0
    transition-all duration-300 ease-out
    scale-95 opacity-0 pointer-events-none
    group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto
    bg-white shadow-lg rounded
  ">
    <a href="#" class="block px-4 py-2 hover:bg-gray-100 transition-colors">Item 1</a>
    <a href="#" class="block px-4 py-2 hover:bg-gray-100 transition-colors">Item 2</a>
  </menu>
</div>
```

### Example 3: Staggered List Reveal
```html
<ul class="space-y-2 group">
  {items.map((item, i) => (
    <li
      key={i}
      class={`
        transition-all duration-500 ease-out
        transform translate-y-4 opacity-0
        group-data-visible:translate-y-0 group-data-visible:opacity-100
        delay-[${i * 100}ms]
      `}
    >
      {item}
    </li>
  ))}
</ul>
```

### Example 4: Modal Transition
```html
<div class={`
  fixed inset-0 bg-black/50
  transition-opacity duration-300
  ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
`}>
  <div class={`
    bg-white rounded-lg shadow-xl
    transition-all duration-300 ease-out
    scale-95 ${isOpen ? 'scale-100' : ''}
  `}>
    Modal content
  </div>
</div>
```

---

## Performance & Best Practices

1. **Use transform for movement**: GPU-accelerated (faster)
2. **Avoid width/height changes**: Triggers layout recalculation
3. **Pair transition with duration**: Always specify `duration-*`
4. **Use ease-out for most interactions**: Feels most natural
5. **Keep delays under 500ms**: Prevents perceived unresponsiveness
6. **Test on low-end devices**: Ensure smooth performance

## Accessibility Considerations

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Related Utilities

- **Transform**: `scale-*`, `rotate-*`, `translate-*`
- **Opacity**: `opacity-*`
- **Colors**: `bg-*`, `text-*`, `border-*`
- **Shadows**: `shadow-*`
- **Animation**: `animate-*` (for keyframe animations)
