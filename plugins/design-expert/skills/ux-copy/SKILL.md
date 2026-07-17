---
name: ux-copy
description: "Copy self-audit and ban-lists — filler verbs/hype adjectives, slop placeholder names, fake-precise numbers, Title Case headlines, humor in error copy ('Oops!'), em-dash crutch, one copy register per page."
when-to-use: "Any time visible copy is written or reviewed — headlines, subheads, buttons, body, captions, errors, empty states — inside any design-method move, or standalone copy work."
keywords: copy, microcopy, ban-list, register, tone, error-messages, self-audit
priority: critical
related: design-method, design-review, design-web, design-webapp
---

## UX Copy — Self-Audit + Ban-Lists, One Register Per Page

### When
Any time visible copy is written or edited — headlines, subheads, eyebrows, button
labels, body, captions, alt text, error messages, empty states — inside `generate`/
`critique`/`audit`/`polish` (`design-method`) or as a standalone copy pass. Register is
resolved once, at Gate 0 (`design-method/SKILL.md`), before this runs — never re-guessed
here.

### Input
- Register (`brand`/`product`) from Gate 0.
- Sector, if resolved, for `references/voice-tone-sectors.md`.
- Every visible string in the deliverable.

### One register per page — hard rule
A single copy register per page (`references/copy-self-audit.md` §7): don't mix
technical mono, editorial prose, and marketing punch on one surface unless the brand
voice explicitly calls for it. Register direction is conditional exactly like layout and
motion (`design-method/references/register/copy.md` §3): **brand** copy must trace to
the one-sentence POV — run the Competitor Lift Test on the paragraph itself, could it run
unchanged on a competitor's site; **product** copy stays precise and domain-specific,
naming the real object and the real action, never marketing voice bleeding into the app
shell.

### Ban-lists — mechanical (grep), not vibes

1. **Filler verbs / hype adjectives** — `elevate`, `seamless(ly)`, `unleash`, `next-gen`,
   `revolutionize`, `empower`, `supercharge`, `game-changer`, `cutting-edge`, `unlock`,
   `robust`, `effortless`, `frictionless`, plus `delve` and `tapestry`. Full grep pattern
   and flag-not-fail nuance (read against the POV or the domain-specificity floor before
   rewriting): `design-method/references/register/copy.md` §1.
2. **Slop placeholder names** — `Acme`, `Nexus`, `SmartFlow`, `Cloudly`, `Initech`,
   `Globex`, `Contoso`, `Umbrella Corp`, `Zenith (Labs/Tech)`. Blocks unless the brief
   explicitly names a fictional example on purpose. Grep + rule:
   `design-method/references/register/copy.md` §2.
3. **Fake-precise numbers** — `92%`, `4.1x`, `48k`, `99.99%`, or any figure not traced to
   real data, brief/brand guidelines, or an explicitly labelled mock
   (`<!-- mock -->`/"example"). Real data reads organic and messy (`47.2%`), not
   fake-perfect. `references/copy-self-audit.md` §3.
4. **Title Case headlines** — sentence case is the default register for headings and body
   copy; reserve Title Case for UI labels, buttons, and eyebrows only, never a body
   headline, unless the brand style guide explicitly specifies Title Case. Inconsistent
   or unjustified Title Case on headlines is a recurring AI-slop tell (grounding
   corpus; general consistency principle also flagged in the reference clone's
   capitalization check — apply it here as a default ban, not a mere consistency note).
5. **Humor in error copy ("Oops!"/"Whoops!")** — banned. Errors use the what-happened +
   why + how-to-fix formula (`references/templates/error-messages.md`), never cute
   framing — a frustrated user doesn't want jokes. Bad-example precedent already in this
   skill: `references/voice-tone-sectors.md` error row flags exactly `"Whoops!
   Something went wrong."` against the correct `"Connection lost. Try again or continue
   offline."`
6. **AI production-tell catalogue** — version-label eyebrows (`v0.6`/`BETA`/`EARLY
   ACCESS`), numbered section eyebrows (`00 / INDEX`), scroll cues, weather/locale
   strips, "quietly trusted by", decorative photo-credit captions, fabricated live
   counters, poetic craftsman labels, generic step labels (`Stage 1/2/3`). Full table:
   `references/copy-self-audit.md` §2.
7. **Em-dash as a crutch** — a single `—` isn't a hard fail; 2+ occurrences reading as a
   repeated tic is. `references/copy-self-audit.md` §1 (shared gate with `design-review`).
8. **"Not X. Y." manufactured-contrast fragments** — one instance is fine, 2+ on one page
   is a blocking tic. `references/copy-self-audit.md` §4.
9. **"theater"/"théâtre" keyword** — any hit blocks, near-universal AI copy tell.
   `references/copy-self-audit.md` §5.
10. **All-caps body copy** — 3+ consecutive all-caps words outside a recognized UI label
    blocks; fine inside a button/eyebrow/badge. `references/copy-self-audit.md` §6.

### Steps
1. Confirm register (inherited from Gate 0) — never re-resolve it here.
2. Write/review against the sector voice profile
   (`references/voice-tone-sectors.md`, NNG 4 dimensions) and the matching sector guide
   if one applies (`references/copy-saas.md`, `references/copy-fintech.md`,
   `references/copy-ecommerce.md`).
3. Apply the formula references for the surface being written: buttons/forms/toasts
   (`references/microcopy-patterns.md`), CTAs (`references/templates/cta-patterns.md`),
   errors (`references/templates/error-messages.md`), empty states
   (`references/empty-states-copy.md`), onboarding
   (`references/templates/onboarding-copy.md`). Project-level output uses
   `references/templates/copy-guide-template.md`.
4. Run every visible string through the ban-lists above.
5. Final read (`references/copy-self-audit.md` §7): grammatically broken, unclear
   referent, hallucination-sounding, "LLM trying to sound thoughtful" (forced metaphor,
   mock-poetic aside, cute-but-empty wordplay). Rewrite; when unsure, replace with the
   plain functional sentence — boring-correct beats clever-wrong.
6. Mechanical checks (1-10 above) resolve on the spot. Judgment calls — does this line
   actually trace to the POV, does it sound like forced profundity, does the aphoristic
   cadence read as punchy ad copy pretending to be product copy — are named specifically
   (quote the line, name the section) and routed to the `fuse-ai-pilot:challenger` gate
   inside `design-review`, never self-scored
   (`design-method/references/register/copy.md` §4; `references/copy-self-audit.md`,
   "Not self-audited — routed to challenger").

### Failure Handling
- Sector not resolved / no sector guide fits → default to
  `references/microcopy-patterns.md`'s generic patterns, flag the gap instead of
  inventing sector voice.
- A ban-list hit is contractually required by the brief (brand literally named "Acme",
  a launch brief that genuinely wants a `BETA` eyebrow) → note the override explicitly in
  the deliverable rather than silently keeping it unflagged.

### Output
- Every visible string checked against the 10 ban-lists above, register-consistent, one
  voice per page.
- Judgment-call flags (if any), quoted and located, handed to `design-review`'s
  challenger gate — not resolved solo.

### Next → `design-review` — Part 1's em-dash/production-tell checks are the same gates
enforced here; Part 2's challenger judges any remaining judgment call (aphoristic
cadence, POV-tracing) this skill flagged but didn't self-score.

### References
| File | Purpose |
|------|---------|
| `references/copy-self-audit.md` | **Canonical self-audit — em-dash, AI tells, fake numbers, final read** |
| `design-method/references/register/copy.md` | Filler-verb + slop-name ban-lists, register direction (external, canonical there) |
| `references/voice-tone-sectors.md` | Sector voice profiles, NNG 4 dimensions, do/don't examples |
| `references/microcopy-patterns.md` | CTA/form-label/validation/toast/button-state patterns |
| `references/empty-states-copy.md` | Empty-state copy formulas per type and sector |
| `references/copy-saas.md` | SaaS sector copy examples |
| `references/copy-fintech.md` | Fintech sector copy examples |
| `references/copy-ecommerce.md` | E-commerce sector copy examples |
| `references/templates/cta-patterns.md` | CTA label examples by context |
| `references/templates/error-messages.md` | Error message formula + good/bad examples |
| `references/templates/onboarding-copy.md` | Welcome-flow / first-run copy patterns |
| `references/templates/copy-guide-template.md` | Project-level copy guide output template |
