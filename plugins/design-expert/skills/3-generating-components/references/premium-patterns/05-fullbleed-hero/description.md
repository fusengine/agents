---
name: Full-Bleed Hero
source: https://villabliss-wbs.framer.website
sector: Luxury
---

## Full-Bleed Hero

### What it is
A luxury hospitality page with a full-viewport hero (90vh) featuring a background photograph, warm-brown gradient overlay, and massive semi-transparent watermark brand name in serif. The page uses warm earth tones throughout — browns, golds, creams. Below the hero: a features section on dark brown bg, a photo gallery, activity icons grid, a blog preview, and a warm footer with repeated watermark.

### When to use
- Luxury hospitality (hotels, villas, resorts, spas) landing pages
- High-end real estate or property showcase
- Brands where the hero photograph IS the product
- Pages prioritizing atmosphere and mood over information density

### Full Visual Walkthrough (top to bottom)
1. **Nav** (transparent over hero): `position: absolute; top: 0; width: 100%; padding: 28px 48px; z-index: 10; bg: transparent`. Logo left "VillaBliss" in serif `1.125rem weight 600 oklch(0.93 0.01 80) tracking 0.04em`. Links right: `0.8125rem weight 400 tracking 0.08em uppercase oklch(0.88 0.01 80); transition: color 0.2s`. Hover: `oklch(0.72 0.09 65)` gold. CTA pill right: `padding: 10px 24px; border: 1px solid oklch(0.88 0.01 80 / 0.50); radius: 6px; uppercase; 0.8125rem tracking 0.06em; bg: transparent`
2. **Hero** (90vh): `position: relative; height: 90vh; min-height: 640px; overflow: hidden`. BG image: `absolute; inset: 0; object-fit: cover; object-position: center 30%` — Mediterranean villa with terracotta walls, arched doorways, lush greenery. **Gradient overlay**: `absolute; inset: 0; background: linear-gradient(180deg, oklch(0.18 0.02 65 / 0.20) 0%, oklch(0.12 0.02 65 / 0.55) 60%, oklch(0.10 0.02 65 / 0.70) 100%)` — warm brown tint, NOT pure black. **Watermark**: `absolute; top: 48%; left: 50%; transform: translate(-50%, -50%); font-size: clamp(7rem, 18vw, 16rem); weight: 300; font-family: 'Playfair Display', Georgia, serif; color: oklch(0.95 0.01 80 / 0.07); tracking: 0.08em; pointer-events: none; white-space: nowrap`. **H1**: centered, `clamp(1.75rem, 3.8vw, 3.25rem)` weight 400 serif `oklch(0.95 0.01 80)` line-height 1.35 tracking 0.005em max-width 680px `text-shadow: 0 2px 16px oklch(0 0 0 / 0.20)`. Content wrapper: `relative; z-index: 2; flex; column; center; center; height: 100%; padding: 0 64px; text-align: center`
3. **Intro section** (warm brown `oklch(0.32 0.05 55)`): 2-col grid `1fr 1fr` gap 48px. Left: heading "Discover the exceptional" `clamp(1.5rem, 2.5vw, 2.25rem)` weight 500 serif `oklch(0.93 0.01 80)` + body text 0.9375rem `oklch(0.75 0.03 65)` line-height 1.7. Right: photograph `radius: 12px; overflow: hidden; object-fit: cover; aspect-ratio: 4/3`. Padding: 80px 72px
4. **Details grid** (warm brown): heading "Villa details at a glance". 3-col grid `repeat(3, 1fr)` gap 24px. Each card: `bg: oklch(0.28 0.04 55); radius: 12px; padding: 24px`. Icon 32px `oklch(0.72 0.09 65)` gold. Title 0.9375rem weight 600 `oklch(0.93 0.01 80)`. Value 0.8125rem `oklch(0.65 0.03 65)`
5. **Photo gallery** (warm brown): heading "Spacious and cozy". 3-col masonry-like grid `repeat(3, 1fr)` gap 12px. Photos `radius: 10px; object-fit: cover`. One photo spans 2 rows. Hover: `opacity: 0.85; transition: 0.3s ease`
6. **Activities section** (light cream `oklch(0.95 0.02 75)`): 3-col by 2-row grid of activity items. Each: icon left 24px `oklch(0.45 0.06 55)` + label right 0.875rem weight 500 `oklch(0.30 0.03 55)`. Activities: "Snorkeling & diving", "Outdoor adventures", "Wellness & spa", "Shopping & dining", "Cultural landmarks", "Sunset cruises". Padding: 64px 72px. Separator: `border-top: 1px solid oklch(0.85 0.02 75)`
7. **Blog/Stories** (light cream): heading "Insights and stories". 3-col card grid gap 24px. Cards: `radius: 12px; overflow: hidden; bg: oklch(0.99 0.005 75); border: 1px solid oklch(0.88 0.02 75)`. Image top, padding 20px below. Title 1rem weight 600 `oklch(0.20 0.03 55)`. Date 0.75rem `oklch(0.55 0.02 65)`. Hover: `translateY(-4px); box-shadow: 0 8px 24px oklch(0 0 0 / 0.06); transition: 0.3s`
8. **Footer** (dark brown `oklch(0.18 0.03 55)`): repeated watermark "VillaBliss" at `clamp(4rem, 10vw, 8rem)` weight 300 serif `oklch(0.95 0.01 80 / 0.05)`. Below: 3-col links grid. Links 0.8125rem `oklch(0.60 0.02 65)`. Bottom bar: copyright + social icons. Padding: 80px 72px

### CSS Specifications Summary
- **Hero**: 90vh, warm-brown 3-stop gradient overlay (NOT pure black)
- **Warm brown bg**: `oklch(0.32 0.05 55)` — **Dark brown footer**: `oklch(0.18 0.03 55)`
- **Light cream**: `oklch(0.95 0.02 75)` — **Card dark bg**: `oklch(0.28 0.04 55)`
- **Text on dark**: `oklch(0.93 0.01 80)` — **Muted on dark**: `oklch(0.65-0.75 0.03 65)`
- **Gold accent**: `oklch(0.72 0.09 65)` — icons, hovers, decorative
- **All fonts serif**: `'Playfair Display', Georgia, serif` for headings — body can be `sans-serif`
- **Watermark**: 7% opacity, clamp(7rem, 18vw, 16rem), weight 300
- **All images**: radius 10-12px, object-fit cover
- **Container**: `max-width: 1200px; margin: 0 auto; padding: 0 72px` (desktop), `0 24px` (mobile)
- **Responsive**: hero 75vh mobile, 768px breakpoint grids stack, nav hamburger

### Gemini Context Prompt
Luxury villa landing page. Warm earth-tone palette throughout — NO cool grays or pure blacks.
Hero 90vh min-height 640px: bg image cover (Mediterranean villa), object-position center 30%. Warm-brown gradient overlay: linear-gradient(180deg, oklch(0.18 0.02 65 / 0.20) 0%, oklch(0.12 0.02 65 / 0.55) 60%, oklch(0.10 0.02 65 / 0.70) 100%). Watermark brand name centered: clamp(7rem, 18vw, 16rem) weight 300 serif oklch(0.95 0.01 80 / 0.07) tracking 0.08em. H1 centered serif clamp(1.75rem, 3.8vw, 3.25rem) weight 400 oklch(0.95 0.01 80) max-width 680px text-shadow 0 2px 16px 20% black.
Transparent nav: logo serif left, uppercase links 0.8125rem 0.08em spacing, outlined CTA pill 6px radius. Gold accent oklch(0.72 0.09 65).
Below hero: warm brown section oklch(0.32 0.05 55) with 2-col text+photo grid, detail cards oklch(0.28 0.04 55) 12px radius with gold icons, photo gallery 3-col 10px radius.
Activities: cream bg oklch(0.95 0.02 75), 3x2 icon+label grid.
Blog: 3-col cards 12px radius, hover lift.
Footer: dark brown oklch(0.18 0.03 55), faded watermark, 3-col links.
All headings serif. Max-width 1200px.

### Anti-patterns (what NOT to do)
- Do not use solid or pure-black overlay — warm brown gradient only (hue 55-65)
- Do not raise watermark above 10% opacity
- Do not use sans-serif for headings — serif is mandatory for luxury
- Do not add cards or CTAs on the hero — keep minimal and immersive
- Do not use hero under 80vh — viewport dominance is essential
- Do not introduce cool grays or blues — entire palette is warm (hue 55-80)
