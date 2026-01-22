---
name: scroll
description: Scroll utilities for Tailwind CSS
---

# Scroll Utilities

Control scroll behavior, scroll snap, and overscroll behavior.

## Scroll Behavior

Enable smooth scrolling on the entire page or specific containers.

| Utility | CSS |
|---------|-----|
| scroll-smooth | scroll-behavior: smooth; |
| scroll-auto | scroll-behavior: auto; |

### Examples

Enable smooth scrolling for anchor links:
```html
<html class="scroll-smooth">
  <body>
    <a href="#section-2">Go to Section 2</a>
    <section id="section-2">Section 2 Content</section>
  </body>
</html>
```

Smooth scroll within a container:
```html
<div class="h-96 overflow-y-auto scroll-smooth">
  <!-- Scrollable content -->
</div>
```

## Scroll Snap

Define how snap points work in scrollable containers.

### Scroll Snap Type

Control snap behavior on containers:

| Utility | CSS |
|---------|-----|
| snap-none | scroll-snap-type: none; |
| snap-x | scroll-snap-type: x var(--tw-scroll-snap-strictness); |
| snap-y | scroll-snap-type: y var(--tw-scroll-snap-strictness); |
| snap-both | scroll-snap-type: both var(--tw-scroll-snap-strictness); |

### Scroll Snap Strictness

| Utility | CSS |
|---------|-----|
| snap-mandatory | --tw-scroll-snap-strictness: mandatory; |
| snap-proximity | --tw-scroll-snap-strictness: proximity; |

### Scroll Snap Align

Position snap points on child elements:

| Utility | CSS |
|---------|-----|
| snap-start | scroll-snap-align: start; |
| snap-center | scroll-snap-align: center; |
| snap-end | scroll-snap-align: end; |

### Scroll Snap Stop

Force snapping at specific points:

| Utility | CSS |
|---------|-----|
| snap-always | scroll-snap-stop: always; |
| snap-normal | scroll-snap-stop: normal; |

### Horizontal Snap Example

Create a carousel-like horizontal scroll with snapping:
```html
<div class="snap-x snap-mandatory overflow-x-auto flex">
  <div class="snap-center flex-shrink-0 w-full h-96 bg-blue-500">
    <img src="/img-1.jpg" alt="Image 1" />
  </div>
  <div class="snap-center flex-shrink-0 w-full h-96 bg-blue-600">
    <img src="/img-2.jpg" alt="Image 2" />
  </div>
  <div class="snap-center flex-shrink-0 w-full h-96 bg-blue-700">
    <img src="/img-3.jpg" alt="Image 3" />
  </div>
</div>
```

### Vertical Snap Example

Create a vertical snap gallery:
```html
<div class="snap-y snap-mandatory overflow-y-auto h-screen">
  <section class="snap-center h-screen flex items-center justify-center">
    <h2>Section 1</h2>
  </section>
  <section class="snap-center h-screen flex items-center justify-center">
    <h2>Section 2</h2>
  </section>
  <section class="snap-center h-screen flex items-center justify-center">
    <h2>Section 3</h2>
  </section>
</div>
```

### Proximity Snap

Use proximity snap for optional snapping:
```html
<div class="snap-x snap-proximity overflow-x-auto">
  <!-- Snap points are optional and only engage if near -->
</div>
```

## Overscroll Behavior

Control what happens when scrolling past the edges of a container.

| Utility | CSS |
|---------|-----|
| overscroll-auto | overscroll-behavior: auto; |
| overscroll-contain | overscroll-behavior: contain; |
| overscroll-none | overscroll-behavior: none; |
| overscroll-x-auto | overscroll-behavior-x: auto; |
| overscroll-x-contain | overscroll-behavior-x: contain; |
| overscroll-x-none | overscroll-behavior-x: none; |
| overscroll-y-auto | overscroll-behavior-y: auto; |
| overscroll-y-contain | overscroll-behavior-y: contain; |
| overscroll-y-none | overscroll-behavior-y: none; |

### Overscroll Examples

Prevent scroll from propagating to parent:
```html
<div class="h-96 overflow-y-auto overscroll-contain">
  <!-- Content won't cause parent to scroll -->
</div>
```

Completely disable overscroll effects:
```html
<div class="overflow-auto overscroll-none">
  <!-- No overscroll bounce or glow effect -->
</div>
```

## Responsive Design

Apply scroll utilities responsively:
```html
<!-- Snap horizontally on mobile, vertically on desktop -->
<div class="snap-y md:snap-x">
  <!-- Content -->
</div>

<!-- Different scroll behavior based on screen size -->
<div class="scroll-auto md:scroll-smooth">
  <!-- Content -->
</div>
```

## Use Cases

- **Carousels**: Horizontal snap for image galleries
- **Fullscreen Sections**: Vertical snap for page sections
- **Modals/Overlays**: `overscroll-contain` to isolate scrolling
- **Touch Devices**: Smooth scrolling for better UX
- **Stories/Feeds**: Snap behavior for sequential content
- **Nested Scrolling**: Prevent scroll chaining with `overscroll-none`
