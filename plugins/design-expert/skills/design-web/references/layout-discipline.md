---
name: layout-discipline
description: "Hard layout constraints for HTML/CSS generation — hero hard numbers, eyebrow restraint, zigzag cap, bento cell count, section-repetition ban, CTA and density limits."
when-to-use: "Before generating or modifying any marketing page — inject these into the generation brief and verify them mechanically in the output."
keywords: layout, hero, eyebrow, bento, zigzag, forbidden, density, cta, pre-flight
priority: critical
related: gemini/gemini-design-workflow.md, ui-visual-design.md, premium-patterns/PATTERNS.md
---

# Layout Discipline (Hard Rules)

> Hero minimalism and gapless-bento principles adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (`gpt-tasteskill/SKILL.md` hero/bento rules, `image-to-code-skill/SKILL.md` §14 "HERO MINIMALISM RULES"); the numeric limits and the remaining rules below are curated Fusengine design decisions (verified against the repo's actual files 2026-07-05 — it publishes no such numeric rule table).

Failing any rule below is shipping broken work. Inject each into the generation brief (or the Gemini XML blocks `<layout>`, `<spacing>`, `<forbidden>` if using the optional Gemini path) and re-check them mechanically in the returned markup before accepting output.

## 1. Hero hard numbers

- **Headline ≤ 2 lines** on desktop. A 4-line headline is always a font-size error, never a copy-length error.
- **Subtext ≤ 20 words AND ≤ 4 lines.** If the value-prop needs more than 20 words, the value-prop is unclear, not the rule too tight.
- **Top padding ≤ `pt-24`** (~6rem) at desktop. More makes the hero float halfway down the viewport and reads as a bug. Add breathing room via font/asset scale, not padding.
- **Max 4 elements in the hero stack**, in total: eyebrow (0 or 1) + headline + subtext + CTAs (1 primary, max 1 secondary).
- **Banned inside the hero:** trust strip / "Used by" logo wall, pricing teaser, feature-bullet list, social-proof avatar row, tagline below the CTAs. All move to dedicated sections directly below the hero.
- Hero must fit the initial viewport with CTAs visible without scroll.

## 2. Eyebrow Restraint (mechanical)

An eyebrow is the small uppercase wide-tracking label above a section headline (`text-[11px] uppercase tracking-[0.18em]`). Every AI site puts one over every section, producing an identical templated rhythm.

- **Max 1 eyebrow per 3 sections.** The hero counts as one.
- **Mechanical check:** `count(uppercase tracking labels above headlines) ≤ ceil(sectionCount / 3)`. Over that count → fail and strip eyebrows.
- If a section has an eyebrow, the next 2 sections cannot. Default action is to drop the eyebrow entirely; the headline alone is enough.

## 3. Zigzag Alternation Cap

Alternating "left-image + right-text" then "left-text + right-image" is banal past two uses.

- **Max 2 consecutive image+text split sections.** A 3rd in a row is a pre-flight fail.
- Break the run with a full-width section, a vertical stack, a bento grid, a marquee, or a different family.

## 4. Bento Cell Count Rule

- **N content items = N cells, exactly.** 3 items → 3 cells; 5 items → 5 cells (2+3, hero+4, etc.).
- Zero filler cells. An empty cell in the middle or end means the grid was planned wrong — re-shape it, never paste a blank tile.
- Bento cells need visual variation: at least 2-3 cells carry a real image, brand-appropriate gradient, pattern, or tint — not white-on-white typography only.

## 5. Section-Layout-Repetition Ban

- **A layout family serves at most once per page.** "Selected work" must not look like "What we do."
- A page with 8 sections uses **≥ 4 distinct layout families.**

## 6. CTA discipline

- **Label fits on one line** at desktop. A wrapping CTA label ("VIEW SELECTED WORK" over 2 lines) is a pre-flight fail; shorten the label or the font. (Source repo §4.5.)
- **One label per semantic intention across the whole site** — *Fusengine addition, not in the source repo.* Do not call the same action "Get started" here and "Start now" there.
- Verify button-text contrast against its background (WCAG AA: 4.5:1 body, 3:1 for 18px+; canonical: design-system/references/contrast-ratios.md). (Source repo §4.5.)

## 7. Content density

- **Quotes / testimonials ≤ 3 lines** of body. Cut longer quotes; a landing quote is a snippet. Attribution is name + role (+ optional company), never name only. Use real typographic quotes or none.
- **Lists > 5 items are never a raw `<ul>`.** Reach for a 2-column split, card grid, tabs/accordion, scroll-snap pills, carousel, or marquee.
- **Spec sheets are never a bordered row-list** (`border-b` on every row). Use a 2-col spec-card grid, scroll-snap pills, grouped chunks (3 clusters, one soft divider each), or a featured-vs-rest disclosure.
- Default section shape: headline (≤ 8 words) + sub-paragraph (≤ 25 words) + one asset OR one CTA. No data-dump sections on a marketing page.
