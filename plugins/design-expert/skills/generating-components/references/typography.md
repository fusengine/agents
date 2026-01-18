# Typography System

## FORBIDDEN FONTS (NEVER USE)

- Inter, Roboto, Arial, Open Sans, Lato
- System fonts, sans-serif defaults
- Helvetica, Verdana, Tahoma

## APPROVED FONTS

### Editorial

- Playfair Display
- Crimson Pro
- Fraunces
- Newsreader

### Code/Tech

- JetBrains Mono
- Fira Code
- Space Grotesk
- IBM Plex Mono

### Startup

- Clash Display
- Satoshi
- Cabinet Grotesk
- General Sans

### Technical

- IBM Plex Sans
- Source Sans 3
- Manrope

### Distinctive

- Bricolage Grotesque
- Obviously
- Syne
- Outfit

## PAIRING PRINCIPLE

High contrast = interesting:

- Display + Monospace (Clash Display + JetBrains Mono)
- Serif + Geometric Sans (Playfair + Bricolage)

## SCALE

Use extremes (100/200 vs 800/900), ratios 3x+ for headings.

## CSS IMPLEMENTATION

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --font-heading: 'Clash Display', sans-serif;
  --font-body: 'Satoshi', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* Tailwind config */
fontFamily: {
  heading: ['Clash Display', 'sans-serif'],
  body: ['Satoshi', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

## TYPOGRAPHY SCALE

```
Hero headline    → text-5xl/6xl font-bold (48-60px)
Section title    → text-3xl/4xl font-semibold (30-36px)
Card title       → text-xl/2xl font-medium (20-24px)
Body text        → text-base font-normal (16px)
Caption/meta     → text-sm text-muted-foreground (14px)
```
