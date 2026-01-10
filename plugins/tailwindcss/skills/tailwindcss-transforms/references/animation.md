# Animation Utilities - Tailwind CSS v4.1

Complete reference for CSS animations: built-in animations and custom @keyframes.

## Built-in Animations

Apply predefined animation sequences with the `animate-*` utilities.

### Class Reference
```
animate-none       animation: none
animate-spin       Rotating 360° (1s, infinite)
animate-ping       Pulsing beacon (1s, infinite)
animate-pulse      Fading pulse (2s, infinite)
animate-bounce     Bouncing up/down (1s, infinite)
animate-wiggle     Side-to-side movement
animate-wave       Wave-like motion
```

### Built-in Animation Details

#### animate-spin
Rotates element 360 degrees continuously.
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
/* animation: spin 1s linear infinite; */
```

```html
<!-- Loading spinner -->
<div class="animate-spin">
  <svg class="w-8 h-8" fill="currentColor">
    <!-- spinner icon -->
  </svg>
</div>

<!-- Loading with text -->
<div class="flex items-center gap-2">
  <div class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
  <span>Loading...</span>
</div>

<!-- Rotating decoration -->
<div class="animate-spin slow">
  <!-- gradient border or pattern -->
</div>

<!-- Responsive spin speed -->
<div class="animate-spin sm:delay-100 md:delay-200">
  Staggered spinners
</div>
```

#### animate-ping
Creates a pinging/fading echo effect.
```css
@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}
/* animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; */
```

```html
<!-- Notification badge -->
<div class="relative inline-block">
  <span class="inline-flex items-center justify-center">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
    <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
  </span>
</div>

<!-- Ping alert -->
<div class="flex gap-2">
  <div class="animate-ping w-2 h-2 bg-green-500 rounded-full" />
  <span>Online</span>
</div>

<!-- Server status indicator -->
<div class="flex items-center">
  <div class="relative w-4 h-4">
    <div class="animate-ping absolute inset-0 bg-yellow-400 rounded-full" />
    <div class="absolute inset-0 bg-yellow-600 rounded-full" />
  </div>
  <span class="ml-2">Ready</span>
</div>

<!-- Message notification -->
<div class="animate-ping p-2 bg-blue-100 text-blue-700 rounded">
  New message
</div>
```

#### animate-pulse
Fades in and out subtly (opacity only).
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
/* animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; */
```

```html
<!-- Skeleton loader -->
<div class="space-y-4">
  <div class="h-12 bg-gray-200 rounded animate-pulse" />
  <div class="h-12 bg-gray-200 rounded animate-pulse" />
  <div class="h-12 bg-gray-200 rounded animate-pulse" />
</div>

<!-- Pulsing button -->
<button class="animate-pulse bg-blue-500 text-white px-4 py-2 rounded">
  Attention needed
</button>

<!-- Fading text emphasis -->
<p class="animate-pulse font-bold text-red-500">
  Important notice
</p>

<!-- Breathing effect -->
<div class="animate-pulse text-2xl">
  Pulse
</div>

<!-- Multiple pulse items -->
<div class="grid grid-cols-3 gap-4">
  <div class="h-40 bg-gray-300 rounded animate-pulse" />
  <div class="h-40 bg-gray-300 rounded animate-pulse" />
  <div class="h-40 bg-gray-300 rounded animate-pulse" />
</div>
```

#### animate-bounce
Bounces element up and down.
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}
/* animation: bounce 1s infinite; */
```

```html
<!-- Scroll indicator -->
<button class="animate-bounce">
  <svg class="w-6 h-6"><!-- down arrow --></svg>
</button>

<!-- Floating card -->
<div class="animate-bounce bg-white rounded-lg shadow-lg p-4">
  Floating card
</div>

<!-- Bouncing balls -->
<div class="flex gap-2">
  <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
  <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100" />
  <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200" />
</div>

<!-- Call-to-action bounce -->
<button class="animate-bounce font-bold text-lg">
  Click me!
</button>

<!-- Staggered bounces -->
<div class="space-y-4">
  {items.map((item, i) => (
    <div key={i} class="animate-bounce delay-[${i * 150}ms]">
      {item}
    </div>
  ))}
</div>
```

---

## Custom Animations with @keyframes

Define custom animations for more complex effects.

### Basic Custom Animation

```css
/* In your CSS or tailwind config */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes rotateFade {
  from {
    transform: rotate(0deg);
    opacity: 0;
  }
  to {
    transform: rotate(360deg);
    opacity: 1;
  }
}

@keyframes wiggle {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes wave {
  0%, 100% { transform: rotateZ(0deg); }
  10%, 30% { transform: rotateZ(2deg); }
  20%, 50%, 100% { transform: rotateZ(-2deg); }
  40%, 60% { transform: rotateZ(2.4deg); }
  50% { transform: rotateZ(2.4deg); }
  100% { transform: rotateZ(0deg); }
}

@keyframes flip {
  from {
    transform: perspective(400px) rotateY(0);
  }
  to {
    transform: perspective(400px) rotateY(360deg);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  56% { transform: scale(1); }
  70% { transform: scale(1.3); }
  85%, 100% { transform: scale(1); }
}
```

### Configuring Custom Animations in Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideInUp: 'slideInUp 0.5s ease-out',
        slideInDown: 'slideInDown 0.5s ease-out',
        slideInLeft: 'slideInLeft 0.5s ease-out',
        slideInRight: 'slideInRight 0.5s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        rotateFade: 'rotateFade 1s ease-in-out',
        wiggle: 'wiggle 0.7s ease-in-out infinite',
        wave: 'wave 0.5s ease-in-out',
        flip: 'flip 0.6s ease-in-out',
        zoomIn: 'zoomIn 0.5s ease-out',
        shake: 'shake 0.5s ease-in-out',
        heartbeat: 'heartbeat 1.3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideInUp: {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          'from': { transform: 'translateY(-20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          'from': { transform: 'translateX(-20px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          'from': { transform: 'translateX(20px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          'from': { transform: 'scale(0.9)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        rotateFade: {
          'from': { transform: 'rotate(0deg)', opacity: '0' },
          'to': { transform: 'rotate(360deg)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotateZ(0deg)' },
          '10%, 30%': { transform: 'rotateZ(2deg)' },
          '20%, 50%, 100%': { transform: 'rotateZ(-2deg)' },
        },
        flip: {
          'from': { transform: 'perspective(400px) rotateY(0)' },
          'to': { transform: 'perspective(400px) rotateY(360deg)' },
        },
        zoomIn: {
          'from': { opacity: '0', transform: 'scale3d(0.3, 0.3, 0.3)' },
          'to': { opacity: '1', transform: 'scale3d(1, 1, 1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '56%': { transform: 'scale(1)' },
          '70%': { transform: 'scale(1.3)' },
          '85%, 100%': { transform: 'scale(1)' },
        },
      },
    },
  },
}
```

### Usage Examples

```html
<!-- Page entrance fade-in -->
<main class="animate-fadeIn">
  Content fades in
</main>

<!-- Modal slide-in from top -->
<div class="animate-slideInDown">
  Modal appears from top
</div>

<!-- Drawer slide-in from left -->
<aside class="animate-slideInLeft">
  Sidebar slides in
</aside>

<!-- Card entrance with zoom -->
<div class="animate-scaleIn">
  Card zooms in
</div>

<!-- Wiggling attention seeker -->
<div class="animate-wiggle">
  Wiggle this!
</div>

<!-- Wave animation -->
<div class="animate-wave">
  Wave hello
</div>

<!-- Flip card -->
<div class="animate-flip">
  Flipping card
</div>

<!-- Zoom entrance -->
<img src="image.jpg" class="animate-zoomIn" />

<!-- Shaking error state -->
<input class="animate-shake border-2 border-red-500" />

<!-- Heartbeat emphasis -->
<div class="animate-heartbeat text-2xl text-red-500">
  ❤️
</div>

<!-- Staggered list reveal -->
<ul class="space-y-4">
  <li class="animate-slideInUp">Item 1</li>
  <li class="animate-slideInUp delay-100">Item 2</li>
  <li class="animate-slideInUp delay-200">Item 3</li>
</ul>
```

---

## Advanced Animation Patterns

### Looping Animations with Delays

```html
<!-- Bounce cascade -->
<div class="space-y-2">
  <div class="animate-bounce">Bounce 1</div>
  <div class="animate-bounce delay-100">Bounce 2</div>
  <div class="animate-bounce delay-200">Bounce 3</div>
</div>

<!-- Fade in sequence -->
<div class="space-y-4">
  {items.map((item, i) => (
    <div
      key={i}
      class="animate-fadeIn"
      style={{
        animationDelay: `${i * 0.1}s`,
      }}
    >
      {item}
    </div>
  ))}
</div>

<!-- Rotating orbit -->
<div class="relative w-32 h-32">
  <div class="animate-spin absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full" />
  <div class="absolute inset-2 flex items-center justify-center">
    Center item
  </div>
</div>
```

### Conditional Animations

```html
<!-- Animation on hover -->
<button class="hover:animate-bounce">
  Hover to bounce
</button>

<!-- Animation on focus -->
<input class="focus:animate-pulse border-2" />

<!-- Responsive animation -->
<div class="animate-none sm:animate-pulse md:animate-bounce">
  Animation varies by screen
</div>

<!-- Data-driven animation -->
<div class="data-loading:animate-spin data-loaded:animate-none">
  Loading state animation
</div>
```

### Performance Optimization

```html
<!-- Use GPU-accelerated properties -->
<div class="animate-spin"><!-- Rotate is GPU accelerated --></div>
<div class="animate-bounce"><!-- Transform is GPU accelerated --></div>

<!-- Avoid animating layout properties -->
<!-- ❌ AVOID -->
<div class="animate-width"><!-- Animating width causes reflow --></div>

<!-- ✅ PREFER -->
<div class="animate-scaleIn"><!-- Transform doesn't cause reflow --></div>
```

---

## Animation Utilities Combined

### Complete Loading Example
```html
<div class="flex items-center justify-center gap-4">
  <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
  <div class="animate-pulse text-gray-600">Loading...</div>
</div>
```

### Complete Entry Animation
```html
<div class="space-y-4">
  <h1 class="animate-slideInDown text-3xl font-bold">
    Welcome
  </h1>
  <p class="animate-slideInUp delay-100">
    This page is fading in
  </p>
  <button class="animate-pulse delay-200 bg-blue-500 text-white px-4 py-2 rounded">
    Get Started
  </button>
</div>
```

### Complete Interactive Example
```html
<div class="group cursor-pointer">
  <div class="animate-none group-hover:animate-wiggle">
    Click me
  </div>
  <div class="animate-none group-hover:animate-bounce delay-100">
    👇
  </div>
</div>
```

---

## Best Practices

1. **Use appropriate timing**: Fast animations for micro-interactions, slower for page transitions
2. **Combine with transitions**: Use both for smooth, layered effects
3. **Test performance**: Ensure smooth 60fps on mobile devices
4. **Consider accessibility**: Respect `prefers-reduced-motion`
5. **Use meaningful animations**: Support UX, don't distract
6. **Layer effects**: Combine rotation, scale, opacity for depth

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
- **Transition**: `transition-*`, `duration-*`, `ease-*`
- **Opacity**: `opacity-*`
- **Delay**: `delay-*`
