---
name: register-copy
description: "Copy-level anti-slop, register-aware — two ban-lists missing from the existing copy-self-audit gate (filler verbs, slop placeholder names), plus how brand vs product register should change what a section's copy is allowed to sound like. Mechanical checks marked separately from judgment calls."
when-to-use: "Any time copy is written or reviewed for a page with a register already picked at Gate 0 — run alongside, not instead of, ux-copy/references/copy-self-audit.md."
keywords: register, copy, ban-list, filler-verbs, slop-names, self-audit, mechanical, judgment
priority: critical
related: ../SKILL.md, brand.md, product.md, ../../ux-copy/references/copy-self-audit.md
---

# Register: Copy — The Missing Ban-Lists + Register Direction

> Paraphrased from the anti-slop approach of
> [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT), in the spirit of
> its §4.9 copy-review pass — no verbatim text reused. Same attribution convention as
> `ux-copy/references/copy-self-audit.md` and `design-review/references/pre-flight-checklist.md`.

**Does not replace `ux-copy/references/copy-self-audit.md`** — that file already owns
em-dash-as-crutch, the AI production-tell catalogue (including version-label eyebrows:
`v0.6`/`BETA`/`EARLY ACCESS`), the fake-precise-number flag, and "one copy register per
page." Canonical there, run it as-is. This file adds the two ban-lists that gate never
had, and the piece neither file covers: how the `brand`/`product` register pick
(`design-method/SKILL.md` Gate 0) should change what a section is *allowed to sound like*
— copy is where the body-of-page generic-slop problem is most visible, because a POV-free
section almost always shows up first as POV-free copy.

## 1. Ban-List — Filler Verbs / Hype Adjectives (new, mechanical)

Grep-able. None of these are hard-banned in every possible context (a brief can
legitimately ask for one), but their presence unreviewed is the single most common
tell that copy was never actually rewritten from a first-draft LLM pass.

```bash
grep -noiE '\b(elevate|seamless(ly)?|unleash|next-gen|revolutioniz(e|ing)|empower(ing)?|supercharg(e|ed)|game-chang(er|ing)|cutting-edge|unlock(ing)?|robust|effortless(ly)?|frictionless)\b' "$FILE"
```

Any hit is a flag, not an automatic fail — read it against the POV (`brand.md` §1) or the
domain-specificity floor (`product.md` §2). Almost always the word is standing in for a
concrete claim that was never written; replace it with the actual mechanism or outcome
("cuts deploy time from 40min to 4min" beats "supercharges your workflow").

## 2. Ban-List — Slop Placeholder Names (new, mechanical)

Grep-able. These are the default names an LLM reaches for when inventing example
companies, products, or fictional brands inside copy (testimonials, case studies, sample
data, placeholder logos) — using one unreviewed signals nothing here was actually
customized to the brief.

```bash
grep -noiE '\b(acme|nexus|smartflow|cloudly|initech|globex|contoso|umbrella\s?corp|zenith\s?(labs|tech)?)\b' "$FILE"
```

Any hit blocks unless the brief explicitly names a fictional example brand on purpose
(rare — e.g. a deliberately anonymized case study). Otherwise: use the real brand/product
name, or a placeholder clearly marked as such (`<!-- mock company name -->`), never a
name that reads as a genuine but generic company.

## 3. Register Direction: What a Section Is Allowed to Sound Like

Copy is register-conditional the same way layout and motion are (`brand.md` /
`product.md`) — a copy pass that ignores which register it's writing for is exactly how a
page ends up with the "checklist, interchangeable" body voice regardless of how sharp the
hero line was:

- **`brand`**: every section's copy should be traceable to the one-sentence POV
  (`brand.md` §1) — a features section, an FAQ, a footer CTA are still making the page's
  argument, not reciting a category-default feature list. Run the Competitor Lift Test
  (`brand.md` §3) on the copy specifically: could this paragraph run unchanged on a
  competitor's site? If yes, it isn't carrying the POV.
- **`product`**: copy should be precise and domain-specific, never marketing voice bleeding
  into the app shell (`product.md` §3, "marketing triad reused in-app"). An empty state, a
  button label, a settings description should name the real object and the real action —
  boring-but-correct beats clever-but-vague here even more than in brand copy, because a
  product user is mid-task, not being persuaded.

## 4. Mechanical vs Judgment — Explicit Split

Same discipline `ux-copy/references/copy-self-audit.md` already applies to its own gates (self-audit stays
mechanical; subjective calls go to the challenger, never self-scored):

| Check | Type | Where |
|---|---|---|
| Filler-verb ban-list (§1) | Mechanical (grep) | here |
| Slop-name ban-list (§2) | Mechanical (grep) | here |
| Em-dash crutch, production tells, fake numbers, one register/page | Mechanical (grep/count) | `ux-copy/references/copy-self-audit.md` (canonical) |
| "Does this line trace to the POV?" (brand) / "Is this the real object/action?" (product) | **Judgment** | flag during self-audit, resolve at `design-review`'s challenger gate — never self-scored |
| "Sounds like an LLM trying to sound profound" (forced metaphor, mock-poetic aside, cute-but-empty wordplay) | **Judgment** | same — `ux-copy/references/copy-self-audit.md` §4 names the smell, the verdict is the challenger's, not a self-grade |

Mechanical failures block on their own; judgment flags get named specifically (quote the
line, name the section) and go to the challenger — a self-audit that "resolves" its own
judgment calls is not independent review.
