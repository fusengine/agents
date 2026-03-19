---
name: Radical Alternation
source: https://ignitex-wbs.framer.website
sector: Agency
---

## Radical Alternation

### Visual Walkthrough (top to bottom)
**Nav**: Transparent on dark hero, padding 20px 80px. Logo left. Links 0.875rem weight 500
oklch(0.7 0 0), gap 36px. Right: ghost pill button 1px border oklch(0.7 0 0).
**Hero (BLACK section)**: bg oklch(0.07 0 0), padding 160px 80px 140px.
Label "// Strategy //" — monospace 0.6875rem weight 500 letter-spacing 0.25em uppercase oklch(0.45 0 0).
Heading "Design & Strategy" — "Design"/"Strategy" in Inter sans-serif, clamp(3rem, 9vw, 7rem),
weight 600, line-height 1.0, letter-spacing -0.03em, oklch(0.95 0 0).
"&" in Playfair Display italic weight 400, 1.15em, letter-spacing 0.02em — flowing calligraphic.
**Section 2 (WHITE)**: bg oklch(0.99 0 0), padding 140px 80px.
2-column grid (gap 80px, align-items center). Left: 2 editorial photos stacked,
radius 8px, 16/10, filter saturate(0.85) contrast(1.05), warm desaturated tones.
Right: label "// About //", body text 1.0625rem line-height 1.75 oklch(0.4 0 0), max-width 520px.
**Section 3 (BLACK)**: "Solutions that truly matter" — "that" in italic serif.
Label "// Solutions //". 2-column: left text, right image.
**Section 4 (WHITE)**: "Ideas & Execution" — large centered heading, "&" in script.
Dark elevated cards inside white section: bg oklch(0.13 0 0), radius 12px, padding 32px,
border 1px oklch(0.18 0 0). Service list: 1.125rem weight 500, padding 20px 0,
border-bottom 1px oklch(0.2 0 0). Arrow icon 20px oklch(0.5 0 0), hover translateX(4px) oklch(0.95).
**Section 5 (BLACK)**: "Showcase". Image grid + body text.
Stats grid: 3 columns gap 48px. Numbers clamp(2.5rem, 5vw, 4rem) weight 700 oklch(0.95 0 0).
Labels 0.875rem oklch(0.5 0 0), margin-top 8px.
**Sections 6-8**: Continue alternating — "Metrics that matter", "Clear & honest pricing",
"Proof that speaks". Each mixes serif connector + sans-serif.
**CTA (BLACK)**: bg oklch(0.07 0 0), padding 180px 80px, centered.
Repeats "Design & Strategy" typography. White pill button below:
bg oklch(0.95 0 0), color oklch(0.07 0 0), radius 999px, padding 16px 40px, 0.875rem weight 600.
**Footer (BLACK)**: padding 48px 80px, border-top 1px oklch(0.15 0 0), flex between.
Small links 0.8125rem oklch(0.5 0 0).

### CSS Specifications
- Black: `bg:oklch(0.07); color:oklch(0.95); padding:140px 80px`
- White: `bg:oklch(0.99); color:oklch(0.07); padding:140px 80px`
- Display H: `Inter; clamp(3rem,9vw,7rem); 600; 1.0; -0.03em`
- Script: `Playfair Display italic; 400; 1.15em; 0.02em`
- Label: `monospace; 0.6875rem; 500; 0.25em; uppercase` | dark:`oklch(0.45)` | light:`oklch(0.55)`
- Body dark: `1.0625rem/1.75; oklch(0.6); max-width:520px` | light: `oklch(0.4)`
- Grid: `1fr 1fr; gap:80px` | Images: `8px radius; 16/10; saturate(0.85) contrast(1.05)`
- Cards: `oklch(0.13); 12px; padding:32px; border 1px oklch(0.18)`
- Services: `1.125rem 500; padding:20px 0; border-bottom 1px oklch(0.2)` | Arrow: `hover:translateX(4px)`
- Stats: `3-col gap 48px` | Number: `clamp(2.5rem,5vw,4rem) 700` | CTA btn: `oklch(0.95); 999px; 16px 40px`
- Responsive: 768px headings→3rem, padding→80px 24px, grids→1-col

### Gemini Context Prompt
Build a design agency page with full-width sections alternating strictly between pure black
oklch(0.07) and pure white oklch(0.99). No gray sections — only these two values.
Padding 140px 80px per section. Transparent navbar over dark hero with ghost pill button.
Hero (black): monospace label "// Strategy //" in 0.6875rem uppercase 0.25em letter-spacing,
then massive heading "Design & Strategy" — Inter sans-serif 7rem weight 600 line-height 1.0
tracking -0.03em for main words, Playfair Display italic weight 400 at 1.15em for "&".
White section: 2-column grid (gap 80px) with desaturated editorial images (8px radius,
filter saturate 0.85 contrast 1.05) and body text 1.0625rem max-width 520px.
Black section: heading "Solutions that truly matter" with "that" in italic serif.
Dark elevated cards (oklch 0.13, 1px border oklch 0.18) with service list items
with border-bottom separators and arrow icons that translateX(4px) on hover.
Stats grid: 3 columns, numbers at 4rem bold oklch(0.95). Continue alternating
with "Ideas & Execution", "Metrics that matter", "Proof that speaks".
CTA (black): centered heading with serif/sans-serif mix, white pill button.
Footer: dark, thin top border, muted links. Strictly monochrome — zero color accents.

### Anti-patterns (what NOT to do)
- Do not use gray backgrounds — ONLY pure black oklch(0.07) and pure white oklch(0.99)
- Do not apply serif font to more than 1 connector per heading ("&", "that")
- Do not introduce any color — strictly monochrome
- Do not make section labels bigger than 0.6875rem — quiet wayfinding only
- Do not use fully saturated photos — desaturate to 0.85 for editorial tone
- Do not center-align all text — mix left-aligned body with centered CTA headings
