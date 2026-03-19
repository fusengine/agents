---
name: CTA Giant Typography
source: https://bold-studio-wbs.framer.website
sector: Agency
---

## CTA Giant Typography

### Visual Walkthrough (top to bottom)
**Nav**: Transparent on dark bg, flex row, padding 20px 64px.
Logo "Bold" left 1rem weight 700 uppercase oklch(0.93 0 0). Links 0.875rem weight 500 oklch(0.7 0 0), gap 36px.
Right: ghost pill button — 1px border oklch(0.93 0 0), radius 999px, padding 10px 24px.
**Hero**: Full dark section oklch(0.08 0 0), padding 140px 64px 100px.
Cinematic image at top with dark overlay. Heading "NARRATIVE MEETS DESIGN" in 3 lines.
"NARRATIVE" + "DESIGN": condensed sans-serif, clamp(3.5rem, 11vw, 9rem), weight 900,
line-height 0.92, letter-spacing -0.04em, uppercase, oklch(0.93 0 0).
"MEETS": Playfair Display italic, weight 400, normal case, letter-spacing 0.01em.
Small preview image right, radius 8px, shadow 0 4px 20px oklch(0 0 0 / 0.3).
**About**: 2-column grid (gap 64px, padding 120px 64px). Left: "ABOUT BOLD" heading
1rem weight 600 uppercase letter-spacing 0.1em oklch(0.5 0 0). Right: body 1.0625rem
line-height 1.75 oklch(0.6 0 0), max-width 520px.
**Services**: Padding 100px 64px. Stacked list: BRAND STRATEGY / VISUAL IDENTITY / GROWTH /
OPTIMIZATION / LAUNCH SUPPORT. Each: clamp(1.25rem, 2.5vw, 1.75rem) weight 500 uppercase,
letter-spacing 0.04em, oklch(0.7 0 0), padding 20px 0, border-bottom 1px oklch(0.2 0 0).
Hover → oklch(0.93 0 0) transition 0.3s ease.
**Work**: "OUR WORK" heading. 2-column grid (gap 20px). Cards: radius 12px, aspect-ratio 16/10.
Gradient overlay: linear-gradient(to top, oklch(0 0 0 / 0.7), transparent 60%).
Tag 0.75rem uppercase oklch(0.65 0 0), title 1.125rem weight 600 oklch(0.95 0 0) at bottom.
**Testimonials**: "OUR CLIENTS SAY" section. Quote mark: 6rem Georgia oklch(0.2 0 0).
Quote text: Georgia italic 1.375rem line-height 1.65 oklch(0.7 0 0), max-width 640px.
Author: sans-serif 0.875rem weight 500 oklch(0.5 0 0), margin-top 24px.
Percentage stats: "96%" in 3rem weight 700 oklch(0.93 0 0) displayed inline.
**Blog**: "THE STUDIO BLOG". 2-col grid. Cards: bg oklch(0.12 0 0), radius 12px,
padding 24px, border 1px oklch(0.18 0 0). Date 0.75rem oklch(0.45 0 0), title 1.125rem weight 600.
**Footer CTA** (SIGNATURE): Padding 160px 64px 100px, centered.
"LET'S BUILD SOMETHING TIMELESS" — clamp(4rem, 14vw, 12rem) weight 900,
line-height 0.88, letter-spacing -0.05em, uppercase, oklch(0.93 0 0).
Letters "SO" have a photo clipped inside: background-clip: text, -webkit-background-clip: text,
color: transparent, background-size: cover, background-position: center, display: inline-block.
Ghost button below: transparent bg, 1px border oklch(0.93 0 0), radius 999px,
padding 14px 36px, 0.8125rem uppercase, letter-spacing 0.08em, margin-top 56px.
Hover: bg fills oklch(0.93 0 0), color oklch(0.08 0 0), transition 0.3s ease.
**Footer bar**: Flex row, padding 40px 64px, border-top 1px oklch(0.15 0 0).
Logo "BOLD" 1.5rem weight 800 letter-spacing 0.15em uppercase oklch(0.93 0 0).

### CSS Specifications
- Palette: bg `oklch(0.08)` | panels `oklch(0.12)` | text `oklch(0.93)` | muted `oklch(0.55)` | dividers `oklch(0.2)`
- Hero H1: `condensed sans-serif; clamp(3.5rem,11vw,9rem); 900; 0.92; -0.04em; uppercase`
- Serif word: `Playfair Display italic; 400; normal-case; 0.01em`
- CTA H1: `clamp(4rem,14vw,12rem); 900; 0.88; -0.05em` | Image-clip: `background-clip:text; color:transparent`
- Ghost btn: `transparent; 1px oklch(0.93); 999px; 14px 36px; 0.8125rem uppercase 0.08em` | Hover: fills white
- Services: `clamp(1.25rem,2.5vw,1.75rem); 500; uppercase; 0.04em; border-bottom 1px oklch(0.2); padding:20px 0`
- Work: `2-col gap 20px` | Card: `12px radius; 16/10; gradient to top oklch(0 0 0/0.7)→transparent 60%`
- Quote: `6rem Georgia oklch(0.2)` | Text: `Georgia italic 1.375rem/1.65 oklch(0.7)`
- Blog card: `oklch(0.12); 12px; padding 24px; border 1px oklch(0.18)`
- Responsive: 768px grids→1-col | CTA→4rem | hero→3.5rem | image-clip fallback→solid white

### Gemini Context Prompt
Build a dark creative agency website on oklch(0.08 0 0) background. Strictly monochrome — zero color accents.
Transparent navbar: logo left, links 0.875rem oklch(0.7), ghost pill CTA right.
Hero: cinematic image top with dark overlay, then massive condensed uppercase heading (9rem desktop,
weight 900, line-height 0.92, letter-spacing -0.04em). One word in Playfair Display italic weight 400.
About: 2-column grid, small uppercase heading left oklch(0.5), body text right 1.0625rem oklch(0.6).
Services: stacked items uppercase 1.75rem weight 500 with 1px border-bottom oklch(0.2). Hover→oklch(0.93).
Work: 2-col image grid (12px radius, 16:10) with gradient overlay bottom oklch(0 0 0/0.7). Tag + title.
Testimonials: serif quote marks 6rem oklch(0.2), italic quote text 1.375rem oklch(0.7).
Blog: 2-col cards oklch(0.12) with 1px border oklch(0.18), 12px radius.
FOOTER CTA (signature): centered text at 12rem desktop, weight 900, line-height 0.88,
tracking -0.05em. Two letters have a photograph clipped inside via background-clip:text.
Ghost button: transparent, 1px white border, pill-shaped, 0.8125rem uppercase. Hover fills white.
Footer bar: logo left, links right, 1px top border.

### Anti-patterns (what NOT to do)
- Do not use weight below 800 on display headings — condensed type needs extreme weight
- Do not image-clip more than 2 letters — contrast effect, not decoration
- Do not introduce ANY color — strictly oklch neutrals from 0.08 to 0.93
- Do not exceed line-height 0.95 on CTA heading — ultra-tight leading is essential
- Do not use filled buttons — ghost style (transparent + border) matches the monochrome language
