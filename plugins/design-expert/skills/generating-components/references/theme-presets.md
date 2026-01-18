# Theme Presets

## Brutalist

**Characteristics:**

- Monochrome or stark contrast (black/white + neon accent)
- Heavy typography (900 weight, uppercase)
- Sharp edges, NO rounded corners
- Grid-based rigid layouts
- Raw, exposed structure

**Implementation:**

```tsx
// Brutalist card
<div className="border-2 border-black bg-white p-8">
  <h2 className="text-4xl font-black uppercase tracking-tight">
    BRUTAL HEADING
  </h2>
  <p className="mt-4 font-mono text-sm">Content here.</p>
</div>
```

---

## Solarpunk

**Characteristics:**

- Warm optimistic palette (greens #22c55e, golds #eab308, earth tones)
- Organic shapes mixed with technical elements
- Nature-inspired patterns and textures
- Retro-futuristic fonts (Syne, Space Grotesk)

**Implementation:**

```tsx
<div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-amber-50 p-8">
  <h2 className="font-['Syne'] text-3xl font-bold text-emerald-900">
    Sustainable Future
  </h2>
  <p className="mt-4 text-emerald-700">Optimistic content.</p>
</div>
```

---

## Editorial

**Characteristics:**

- Serif headlines (Playfair Display, Crimson Pro)
- Generous whitespace (py-24, py-32)
- Magazine-style layouts, asymmetry
- Sophisticated colors (slate, stone, zinc)

**Implementation:**

```tsx
<article className="max-w-prose mx-auto py-24">
  <h1 className="font-['Playfair_Display'] text-5xl font-bold text-slate-900">
    The Art of Design
  </h1>
  <p className="mt-8 text-lg leading-relaxed text-slate-600">
    Long-form content with generous spacing.
  </p>
</article>
```

---

## Cyberpunk

**Characteristics:**

- Neon accents on dark (#00ff41, #ff00ff, #00ffff)
- Glitch effects, scanlines
- Monospace typography (JetBrains Mono)
- Grid overlays, tech patterns

**Implementation:**

```tsx
<div className="bg-black p-8 relative overflow-hidden">
  {/* Scanlines overlay */}
  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,65,0.03)_2px,rgba(0,255,65,0.03)_4px)]" />

  <h2 className="font-mono text-2xl font-bold text-[#00ff41] relative z-10">
    SYSTEM_ONLINE
  </h2>
</div>
```

---

## Luxury

**Characteristics:**

- Gold/champagne accents (#d4af37)
- Serif typography (Playfair, Cormorant)
- Subtle animations, refined hover states
- Dark backgrounds, high contrast text

**Implementation:**

```tsx
<div className="bg-zinc-950 p-12">
  <h2 className="font-['Cormorant'] text-4xl font-light tracking-wide text-[#d4af37]">
    Exclusive Collection
  </h2>
  <p className="mt-6 text-zinc-400">Refined elegance.</p>
</div>
```

---

## Glassmorphism

**Characteristics:**

- Frosted glass effect (backdrop-blur)
- Semi-transparent backgrounds
- Subtle borders
- Works on gradient backgrounds

**Implementation:**

```tsx
<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
  {children}
</div>
```
