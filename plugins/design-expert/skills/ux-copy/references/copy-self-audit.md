---
name: copy-self-audit
description: Pre-ship copy audit — em-dash crutch threshold, AI "production tell" catalogue, fake-precise-number flag, and final string review before handoff
when-to-use: Before declaring any copy or page done — re-read every visible string against these gates
keywords: copy-audit, em-dash, ai-tells, fake-numbers, pre-flight, self-review
priority: critical
related: microcopy-patterns.md, voice-tone-sectors.md
---

# Copy Self-Audit

> Inspired by the anti-slop philosophy of [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill); the concrete gates below are curated Fusengine design decisions (the repo has no canonical rule list for these — verified against its actual files 2026-07-05).

Run this pass on **every visible string** before handing copy off to component generation (`design-web`/`design-webapp`): headlines, subheads, eyebrows, button labels, body, captions, alt text, footer, error messages. A single failure below is a blocking pre-flight failure, not a warning.

## 1. Em-dash — avoid as a crutch, not a hard ban

`—` (em-dash) is a real risk of reading as a machine-writing tic, but a single occurrence anywhere on the page (headline, eyebrow, label, body, quote, caption, alt text) does not block on its own. Flag and rewrite it when it shows up as a **recurring crutch** — the same writer reaching for it repeatedly instead of a period, comma, colon, or parentheses — or whenever a plainer mark reads better.

- Prefer a period, a comma, a colon, or parentheses over a pause em-dash. Split into two sentences when in doubt.
- En-dashes for ranges are fine: `2018-2026`, `€40-80k` (plain hyphen also acceptable).
- Attribution uses a spaced hyphen (` - `) or a line break.
- One-off em-dash use is not a failure; repeated use across a page's strings is.

## 2. AI "production tell" catalogue (banned unless the brief demands it)

Each of these reads as machine-generated decoration. Ban by default; allow only when the brief explicitly calls for it.

| Tell | What it looks like | Do instead |
|------|--------------------|-----------|
| **Hero version labels** | `v0.6`, `BETA`, `EARLY ACCESS`, `ALPHA` as a hero eyebrow | Drop it. Allowed only for an explicit launch/preview brief. |
| **Numbered section eyebrows** | `00 / INDEX`, `001 · Capabilities`, `06 · How it works` | Name the topic in plain language, or drop the eyebrow. |
| **Scroll cues** | `Scroll`, `↓ scroll`, `Scroll to explore`, animated mouse-wheel | Remove. The hero is already the first thing they see. |
| **Weather / locale strips** | `LIS 14:23 · 18°C`, `Lisbon, Portugal` in nav/header | Remove. Allowed only for a genuinely place/timezone-bound brand. |
| **"Quietly trusted by"** | `Quietly in use at`, `Quietly trusted by` | Use plain language: `Trusted by`, `Used at`, or let logos speak. |
| **Decorative photo-credit captions** | `Field study no. 12 · Ines Caetano`, `Frame XII · 35mm` under stock images | Skip, or one functional caption. Credit only real, permissioned photos. |
| **Fabricated live counters** | `Reservation 412 of 800`, `last sync 4s ago` | Remove. Allowed only for a real limited-run waitlist with real data. |
| **Poetic craftsman labels** | `From the field`, `Currently on the bench`, `Loose plates` | Plain functional labels (`Testimonials`, `Now working on`) or none. |
| **Generic step labels** | `Stage 1 / 2 / 3`, `Phase 01 / 02 / 03` | Use the verb-noun directly (`Install`, `Configure`, `Ship`). |

## 3. Fake-precise-number flag

Numbers such as `92%`, `4.1×`, `48k`, `5.8 mm`, `13.4 lb` must trace to one of:

- **Real data** — brief, brand guidelines, or a public metric. Fine.
- **Explicitly labelled mock** — `<!-- mock -->`, "example", "sample data". Fine.
- **AI-invented spec aesthetics** — banned. Do not fabricate engineering precision the brand never claims.

Also avoid fake-perfect numbers (`99.99%`, `50%`, `1234567`); real data is organic and messy (`47.2%`).

## 4. "Not X. Y." contrast fragments — count, don't feel

Grep for the manufactured-contrast pattern: a short negation clause immediately followed
by a period-terminated affirmation (e.g. "Not features. Focus."). A single instance is
fine; **2+ occurrences on one page is a blocking tic**.

## 5. "theater" keyword

Grep for the literal word `theater`/`théâtre` (case-insensitive) in any visible string
(e.g. "security theater", "performance theater") — a near-universal AI copy tell. Any
hit blocks.

## 6. All-caps body copy

Grep for a run of ≥ 3 consecutive all-caps words outside a recognized UI label (button,
eyebrow, badge). All-caps body paragraphs/subheads block; all-caps is fine inside a
label/button/eyebrow.

## 7. Final string review before handoff

Re-read each visible string and flag any that is:

- **Grammatically broken** or has an **unclear referent** (a "we" or "that" with no antecedent).
- **AI-hallucination-sounding** — cute-but-wrong wordplay, forced metaphors, "elegant nothing" phrasing.
- **LLM-trying-to-sound-thoughtful** — passive-aggressive humility, mock-poetic micro-meta, fake-craftsman asides.

Rewrite every flagged string. When unsure whether a line lands, replace it with a plain functional sentence. Boring correct copy beats clever wrong copy. Keep **one copy register per page** — do not mix technical mono, editorial prose, and marketing punch unless the brand voice explicitly calls for it.

## Not self-audited — routed to challenger

Aphoristic cadence (the "feel" of the copy: does it read punchy-staccato ad copy
pretending to be product copy) is a subjective judgment call, not a grep/count. Self-audit
above stays mechanical only — this one goes to the challenger pass instead (fresh-context,
per `design-review/references/review-procedure.md`'s Part 2 Challenger gate, item 9) —
never scored as a self-audit item.
