---
name: Bento Grid
source: https://startify-template.webflow.io
sector: SaaS
---

## Bento Grid

### What it is
A SaaS startup page where the central "about" section uses an asymmetric bento grid mixing photos, stats, and text cards of varying sizes. Warm neutral palette (off-white, cream, warm gray) with dark accent cards. The page also features a hero with split layout, testimonial band, pricing cards, FAQ, and a dark CTA footer. Section headings use a serif italic accent on one word.

### When to use
- Startup "about us" or "why us" sections blending metrics, team, and features
- Pages needing visual variety without separate horizontal sections
- Dashboard-like mixed-content layouts (photos + stats + text)

### Full Visual Walkthrough (top to bottom)
1. **Nav**: logo left, links center, two CTAs right (ghost + primary). `padding: 16px 48px; height: ~60px; bg: oklch(0.99 0 0); border-bottom: 1px solid oklch(0.93 0 0)`. Logo: 0.9375rem weight 700 `oklch(0.13 0 0)`. Links: 0.8125rem weight 450 `oklch(0.40 0 0)`. Primary CTA: `bg: oklch(0.13 0 0); color: oklch(0.97 0 0); padding: 10px 20px; radius: 8px`
2. **Hero** (light `oklch(0.99 0 0)`): 2-col grid `3fr 2fr` gap 48px. Left: heading "Enabling Confident Systems for Driven Teams" at `clamp(2.5rem, 4.5vw, 3.75rem)` weight 700 tracking -0.03em `oklch(0.13 0 0)` line-height 1.1. One word in `serif italic weight 400`. Subtitle 1.0625rem `oklch(0.42 0 0)` max-width 480px. CTA row: two buttons. Right: product screenshot mockup `radius: 12px; box-shadow: 0 8px 32px oklch(0 0 0 / 0.08)`. Padding: 100px 72px
3. **Social proof band** (light): logo strip `display: flex; gap: 48px; justify-content: center; opacity: 0.4; filter: grayscale(1)`. Padding: 48px 0. Caption above: 0.75rem weight 500 `oklch(0.55 0 0)` uppercase tracking 0.12em
4. **Bento section** (light): centered heading "Meet the People Behind the Innovation" `clamp(1.75rem, 3vw, 2.5rem)` weight 600 `oklch(0.13 0 0)`, serif italic on "People". Margin-bottom 48px. **Grid**: `display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(180px, auto); gap: 14px; max-width: 1200px; margin: 0 auto`. Card sizes: 2x2 (hero photo), 2x1 (feature), 1x1 (stat). **Card base**: `radius: 14px; padding: 28px; bg: oklch(0.97 0.005 80); border: 1px solid oklch(0.91 0.005 80); overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease`. **Hover**: `translateY(-3px); box-shadow: 0 6px 20px oklch(0 0 0 / 0.05)`. **Dark card**: `bg: oklch(0.14 0 0); color: oklch(0.96 0 0); border: none`. **Cream card**: `bg: oklch(0.95 0.015 80)`. **Stat number**: `clamp(2.5rem, 4.5vw, 3.75rem)` weight 700 tracking -0.03em `oklch(0.13 0 0)`. **Stat label**: 0.8125rem weight 400 `oklch(0.48 0 0)` margin-top 8px. **Card title**: `clamp(1.125rem, 1.4vw, 1.375rem)` weight 600 `oklch(0.13 0 0)`. **Card body**: 0.875rem `oklch(0.45 0 0)` line-height 1.6. **Photo card**: `padding: 0; img: 100% cover`. **Team headshots**: 56px radius 50% border `2px solid oklch(0.97 0 0)`. **Pill tag**: `padding: 4px 12px; radius: 999px; bg: oklch(0.92 0 0); 0.75rem weight 500 oklch(0.35 0 0)`
5. **Features section** (light): "Your Startup's Dreams Work Starts Here" heading. Below: 3-col grid of icon+text cards. Each: icon container 48px `bg: oklch(0.95 0.01 80); radius: 12px`. Title 1rem weight 600. Desc 0.875rem `oklch(0.45 0 0)`. Padding 100px 72px
6. **Testimonials** (light): large centered quote `clamp(1.25rem, 2vw, 1.75rem)` weight 400 italic `oklch(0.25 0 0)`. Below: avatar 48px + name 0.9375rem weight 600 + company 0.8125rem `oklch(0.50 0 0)`. Navigation dots below
7. **Pricing** (light): "Flexible Plans for Every Stage of Growth" heading. 3 pricing cards: `padding: 36px; radius: 16px; bg: oklch(0.99 0 0); border: 1px solid oklch(0.90 0 0)`. Price: `clamp(2rem, 3vw, 2.5rem)` weight 700. Feature list: checkmark + text 0.875rem. CTA button full-width. Featured card: `border: 2px solid oklch(0.13 0 0)`, "Most Popular" badge `bg: oklch(0.13 0 0); color: oklch(0.97 0 0); radius: 999px; padding: 4px 14px; 0.75rem weight 500`
8. **FAQ** (light): heading + accordion. Items: `border-bottom: 1px solid oklch(0.90 0 0); padding: 20px 0`. Question 1rem weight 600. Chevron right. Open: answer 0.875rem `oklch(0.42 0 0)`
9. **CTA Footer** (dark `oklch(0.11 0 0)`): heading `clamp(2rem, 3.5vw, 3rem)` weight 700 `oklch(0.95 0 0)`. CTA button `oklch(0.97 0 0)` bg `oklch(0.11 0 0)` text. Below: 4-col link grid. Bottom: copyright + socials. Padding 80px 72px

### CSS Specifications Summary
- **Light bg**: `oklch(0.99 0 0)` — **Dark bg** (footer + accent cards): `oklch(0.11-0.14 0 0)`
- **Cream**: `oklch(0.95 0.015 80)` — **Borders**: `oklch(0.90-0.91 0 0)` 1px
- **Container**: `max-width: 1200px; margin: 0 auto`
- **Grid gap**: 14px (bento), 32px (features), 16px (pricing)
- **All cards**: radius 14-16px, padding 28-36px
- **Shadows**: sm `0 2px 8px 3%`, md `0 6px 20px 5%`, lg `0 8px 32px 8%` — all `oklch(0 0 0 / N)`
- **Responsive**: 768px: 2-col, 480px: 1-col, all spans reset to 1

### Gemini Context Prompt
SaaS startup page on oklch(0.99 0 0) background, max-width 1200px.
Nav: 60px, border-bottom 1px oklch(0.93 0 0), logo left weight 700, dark CTA right.
Hero: 2-col (3fr 2fr) — heading clamp(2.5rem, 4.5vw, 3.75rem) weight 700 tracking -0.03em with serif italic accent word, subtitle 1.0625rem oklch(0.42 0 0). Right: product screenshot 12px radius box-shadow 0 8px 32px 8% black.
Logo strip: grayscale, 40% opacity, centered.
Bento grid: repeat(4, 1fr), 14px gap, auto-rows minmax(180px, auto). Card base: 14px radius, 28px padding, oklch(0.97 0.005 80) bg, 1px border oklch(0.91 0.005 80). Dark cards oklch(0.14 0 0). Cream oklch(0.95 0.015 80). Stats clamp(2.5rem, 4.5vw, 3.75rem) weight 700. Photo cards no padding object-fit cover. Hover translateY(-3px) shadow 0 6px 20px 5%. Mix 2x2, 2x1, 1x1 spans — asymmetry mandatory.
Features: 3-col icon cards with 48px icon containers.
Testimonial: italic quote centered, avatar + name.
Pricing: 3 cards 16px radius, featured has 2px dark border + "Popular" pill.
FAQ: accordion, 1px separators.
Dark footer oklch(0.11 0 0): CTA + 4-col links.

### Anti-patterns (what NOT to do)
- Do not make all bento cards same size — asymmetry is the point
- Do not exceed 4 columns on desktop
- Do not use more than 3 card bg variants (light + cream + dark)
- Do not add heavy shadows — max 20px blur, 5% opacity on hover
- Do not put paragraphs in 1x1 cells — stats/icons/headshots only
