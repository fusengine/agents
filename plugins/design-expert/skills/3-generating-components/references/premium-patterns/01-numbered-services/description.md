---
name: Numbered Services
source: https://crevo-wbs.framer.website
sector: Agency
---

## Numbered Services

### What it is
A full dark-mode agency page. The services section uses a vertically stacked list with bracketed zero-padded indices, titles, and descriptions. On hover each row reveals a photograph. The page also features a portfolio grid ("Selected Work"), a testimonials section, a team section, and a CTA footer.

### When to use
- Agency/studio portfolio pages listing 4-6 services
- Dark-mode sites with editorial, text-first layouts and progressive disclosure via hover
- Creative studios targeting tech or design audiences

### Full Visual Walkthrough (top to bottom)
1. **Nav** (sticky): logo "CREVO" left (stylized E = 3 bars), minimal links right, on `oklch(0.10 0 0)` bg. Height ~64px, `padding: 16px 48px`, `z-index: 50`, no border, no blur
2. **Hero**: full-width dark image (mountain landscape), text overlay right-aligned. Tagline "Transforming ideas into visual masterpieces" in `oklch(0.95 0 0)` at `clamp(1rem, 1.3vw, 1.25rem)` weight 400. Logo "CREVO" large left at `clamp(4rem, 10vw, 8rem)` weight 700 tracking -0.04em
3. **Stats + Intro** (dark): two-column grid `1fr 1fr` gap 48px. Left: two stat numbers "12" "25" at `clamp(4rem, 8vw, 7rem)` weight 300 `oklch(0.95 0 0)` tracking -0.04em line-height 0.9. Right: paragraph `oklch(0.50 0 0)` 0.9375rem/1.7 max-width 440px
4. **Services list** (dark): vertical stack on `oklch(0.10 0 0)`. Each row: `display: flex; align-items: center; padding: 28px 0; gap: 32px; border-bottom: 1px solid oklch(0.22 0 0); cursor: pointer`. Index `[01]`: monospace 0.8125rem `oklch(0.42 0 0)` tracking 0.06em. Title: `clamp(1.25rem, 2vw, 1.75rem)` weight 500 `oklch(0.95 0 0)` tracking -0.01em. Desc: 0.875rem `oklch(0.42 0 0)` line-height 1.6 margin-left auto max-width 320px. **Hover**: bg transitions to `oklch(0.13 0 0)` 0.3s ease; image appears absolute right 40px, 260x180px, radius 6px, object-fit cover, `opacity: 0→1 transform: translateY(-50%) translateX(0→-20px)` transition 0.4s ease
5. **Selected Work** (dark): heading "SELECTED WORK" at `clamp(2.5rem, 5vw, 4.5rem)` weight 700 `oklch(0.95 0 0)` tracking -0.03em. Below: 2-column grid gap 16px of portfolio images, radius 10px, aspect-ratio 4/3, object-fit cover, hover `scale(1.03)` transition 0.4s
6. **Client's Word** (dark): testimonial card — large quote `clamp(1.25rem, 2vw, 1.75rem)` weight 400 `oklch(0.85 0 0)` italic, client name 0.875rem `oklch(0.50 0 0)`, round avatar 48px
7. **Our Experts** (dark): heading + team grid `repeat(3, 1fr)` gap 16px. Each: photo radius 10px, name 1rem weight 500 `oklch(0.95 0 0)`, role 0.8125rem `oklch(0.42 0 0)`
8. **CTA Footer** (dark): "LET'S WORK TOGETHER" at `clamp(2.5rem, 6vw, 5rem)` weight 700 `oklch(0.95 0 0)` tracking -0.03em. The "O" in "TOGETHER" replaced by a circular image (radius 50%, 60px). Below: social links row, copyright 0.75rem `oklch(0.35 0 0)`

### CSS Specifications Summary
- **All backgrounds**: `oklch(0.10 0 0)` uniform throughout
- **Container**: `max-width: 1280px; margin: 0 auto; padding: 0 80px` (desktop), `0 20px` (mobile)
- **Section spacing**: `padding-top: 100px; padding-bottom: 100px` per section
- **Primary text**: `oklch(0.95 0 0)` — **Secondary text**: `oklch(0.42 0 0)` — **Muted text**: `oklch(0.50 0 0)`
- **Borders**: `oklch(0.22 0 0)` 1px throughout
- **All images**: `border-radius: 6px–10px; object-fit: cover`
- **Transitions**: all 0.3s–0.4s ease
- **Responsive**: single column below 768px, hover images disabled on touch, stats stack

### Gemini Context Prompt
Build a dark agency page on oklch(0.10 0 0) background, max-width 1280px centered.
Nav: 64px height, logo left, links right, no bg blur, padding 16px 48px.
Hero: full-width dark photo with right-aligned tagline at 1.25rem oklch(0.95 0 0), large logo left at clamp(4rem, 10vw, 8rem) weight 700.
Stats section: 2-col grid — two numbers at clamp(4rem, 8vw, 7rem) weight 300, paragraph at 0.9375rem oklch(0.50 0 0).
Services list: vertical rows with 1px border oklch(0.22 0 0), each row flex — [01] index monospace 0.8125rem oklch(0.42 0 0), title clamp(1.25rem, 2vw, 1.75rem) weight 500 oklch(0.95 0 0), description 0.875rem oklch(0.42 0 0) pushed right. Hover: 260x180px image fades in 0.4s right side, 6px radius.
Selected Work: 2-col image grid, 10px radius, hover scale 1.03.
Testimonial: italic quote 1.75rem, 48px round avatar.
Team: 3-col grid, photos 10px radius, name+role below.
CTA footer: "LET'S WORK TOGETHER" at clamp(2.5rem, 6vw, 5rem) weight 700, circular image in "O".
All text oklch(0.95/0.42/0.50 0 0). No accent color — pure monochrome dark theme.

### Anti-patterns (what NOT to do)
- Do not show hover images by default — progressive reveal is the hook
- Do not add color accents — this is a monochrome dark design
- Do not use card layouts with shadows — flat, border-separated list only
- Do not center-align the services — left-aligned with descriptions pushed right
- Do not use a light section anywhere — entire page is dark
