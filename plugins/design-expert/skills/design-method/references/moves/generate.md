---
name: generate
description: "Full production pipeline for a page/screen — opens with a comparative Exploration Gate (three divergent directions, three distinct body sequences, judged blind) and then orders and FORCES consultation of the frozen taste-reference system (register, corpus inspiration, tokens, hero treatment + body sequence, components, layout-discipline, body, motion) instead of improvising."
when-to-use: "FULL scope (new project, no design-system.md yet) or PAGE scope (design-system.md exists) — see design-method/SKILL.md routing table. Not for COMPONENT or MOBILE scope."
keywords: generate, move, pipeline, exploration, divergence, register, tokens, macrostructure, body-sequence, layout-discipline, body, motion
priority: critical
related: ../../SKILL.md, ../macrostructure-bank.md, ../body-sequence-bank.md, ../register/brand.md, ../register/product.md, ../register/copy.md, ../../../design-web/references/design-inspiration.md, ../../../design-web/references/refs-design/README.md, ../../../design-web/references/layout-discipline.md
---

# Generate — Full/Page Production Move

The generation move turns a locked brief (design-method/SKILL.md Gate 0) into markup. It is a fixed
8-step order, not a menu: every step names the exact frozen reference file it pulls from, and
skipping a step or substituting "what feels right" for the file is the defect this move exists to
prevent. Nothing here re-derives taste data (palettes, type pairs, spacing, pattern CSS) — it only
sequences which frozen file governs which decision, and forces the consultation to actually happen
(read, not recalled from memory).

The eight steps keep a page from being bad. They do not, on their own, make it good: a page that
passes every one of them can still be the only page anybody would have drawn for that brief. The
Exploration Gate below is the part of this move that produces an actual choice — several pages
drawn, one kept, for a stated reason. Run it before the pipeline, not alongside it.

### When to use

- **FULL** — new project, no `design-system.md` yet. Step 2 **opens the corpus pages, then
  reads** the corpus, then **2 real sector sites** for register.
- **PAGE** — `design-system.md` already exists. Step 2 opens and reads the corpus, then **1** sector site
  (skip that site entirely when the register is already locked in writing). Step 3 (tokens)
  reads the existing `design-system.md` first, and falls back to
  `sector-palettes.md`/`typography-pairs.md` only for what that file does not already answer.
- **Prerequisite, not re-run here:** Gate 0 in `design-method/SKILL.md` — register, tone,
  signature element, and at least one concrete reference must already be locked **in
  writing**. This move consumes that lock; if it doesn't exist, stop and go run Gate 0
  first, don't improvise a register on the fly.
- **Not for:** COMPONENT scope (single element — skip step 2 sourcing, reuse existing tokens) or
  MOBILE scope (iOS/Android — platform HIG/Material references, no web browsing): other moves.

## Exploration Gate — three directions before Step 1

Runs **before Step 1**, whenever this move has a page body to decide. It replaces a single fiat
pick with three directions judged against each other, and it is where the Gate 0 Tone artefact
(`../../SKILL.md` Gate 0, item 1) comes from when tone is one of the axes in play. Its output is
always at least a locked pair — hero treatment + body sequence — that Step 4 records rather than
re-decides, plus whichever other axes its scope row put in play.

### Scope — what is in play, per scope × register

| Scope | Register | Exploration | Axes in play | Why |
|---|---|---|---|---|
| FULL | brand | Full | tone/POV · palette family · hero treatment · body sequence · signature element | Nothing is locked yet, and in this register the design *is* the product. Every axis is a live decision, so every axis is worth putting against an alternative. |
| FULL | product | Reduced — demonstration axes | hero treatment · body sequence · unit of progression | `../register/product.md` already bounds tone, density and motion; three sketches arguing adjectives inside those bounds are three shades of one page. What actually separates two good product surfaces is the ORDER of surfaces and what one step of that order demonstrates — `Verb Reel` (one usage verb per full screen) and `Numbered Surface Index` (the product's own workflow, a stage earning its number only if it has a surface to show) are opposite answers to that single question. Palette and type still come from Step 3 against the register, unexplored. |
| PAGE | brand | Reduced — structure only | hero treatment · body sequence | `design-system.md` exists: tone, palette and register are already arbitrated in writing. Re-opening them here yields either a contradiction of the system or theatre. The body of THIS page has never been decided by anyone — it is a new decision on every page, and it is the documented failure mode (`../register/brand.md` intro). |
| PAGE | product | Reduced — structure only | hero treatment · body sequence · unit of progression | Same lock, same open decision, read through this screen's primary task and the Domain-Specificity Floor (`../register/product.md` §2). |
| COMPONENT | brand | None | — | A component has no page body. Nothing is left for three sketches to disagree about that the tokens and the parent page do not already settle. Gate 0's Tone stays the direct single-fiat pick. (This move does not run on COMPONENT scope anyway — see *When to use*.) |
| COMPONENT | product | None | — | Same: no body, no sequence, no gate. |

MOBILE scope is outside this move entirely; its structure comes from the platform skill
(`design-ios` / `design-android`), not from these two banks.

**Reduced is not lighter.** Same three sketches, same blind challenger, same lock, same salvage
step — only the list of axes shrinks. An axis already locked in writing is not put back in play;
an axis genuinely open is never left unexplored on the grounds that "the tone was already
settled."

### 1. Fan out 3 divergent sketches

Via `Task`, spawn 3 parallel sub-agents, each producing exactly one lightweight direction
sketch — **text-only**: no HTML/CSS, no screenshots, no further sub-spawn (a nested sub-spawn
here risks exceeding the depth-5 nesting ceiling). Each sketch states, in prose, the axes its
row above puts in play, and nothing else:

- **Body sequence — mandatory in every exploration, at every scope where the gate runs.** Its
  name, its section order, and one line stating **what its organising principle becomes for THIS
  subject**. The bank's own wording recopied is not an answer — it is the tell of a composition
  lifted instead of a direction taken (`../body-sequence-bank.md` rule 1).
- **Hero treatment** — from `../macrostructure-bank.md`, chosen to serve that sequence, never
  picked independently of it.
- **Unit of progression** (product register) — what one step of the sequence demonstrates, and
  what tells the reader they have advanced: a usage verb, a workflow stage, an application
  surface, a change of scale.
- **Tone/POV** (FULL only) — one committed extreme, not the same adjective reworded three ways.
- **Palette family** (FULL only) — a direction, not final hex values: "muted terracotta/ink" vs
  "near-black/acid-lime" vs "warm paper/deep forest".
- **Signature-element idea** (FULL + brand) — per `../register/brand.md` Signature Dominance.

**The three body sequences must be distinct.** Three different organising principles — not one
principle wearing three palettes. Two sketches on the same sequence are one direction rendered
twice, whatever else separates them: send that pair back and re-fan one of the two. Distinctness
is judged on the principle, not the label: two sketches that both order by buyer stage have
collided even when they cite different bank entries.

### 2. The fourth road — a sequence that is in no bank

`../body-sequence-bank.md` holds fifteen sequences read off shipped code. Fifteen observations, not
a list of legal moves. Any sketch may instead propose a sequence **derived from its subject** that
matches none of them.

An off-bank sketch renders exactly the same accounts as the other two, in the bank's own entry
format: **forged name · section order · the principle that decides that order · what it drops from
the canonical skeleton · what subject it suits**. Anything less is an improvisation wearing a
name, and the challenger should be able to tell.

The precedent is the bank itself: **every one of its fifteen entries was off-bank once.** None was
picked from a list — each was forged by the page's own designers out of their subject and only
catalogued afterwards, which is why the headings name a folder and not a pattern. Entry 7,
`Void-Metered Stack` (`supercommon-recode`), is the plainest case: six consecutive sections
share one `band` class and are told apart by nothing but their content, the void in front of
each one is sized to what it announces, and testimonials, pricing table, FAQ, CTA band and nav
are all simply absent. No canonical skeleton produces that; a focus timer does.

Being off-bank earns neither credit nor penalty: the challenger is never told which sketches are
off-bank, and judges all three on the same question. Three well-transposed bank sequences are a
complete exploration; no run owes anyone a forged one. Forge a sequence when the subject carries
an order the fifteen do not — and then make it earn its place on the fifteen's terms.

### 3. Judge comparatively — blind, fresh context

Invoke `fuse-ai-pilot:challenger`, fresh-context and blind: fed **only** the three sketches —
never which one you would pick, never why, never which of them are off-bank. That blindness is
the entire value of the step; feeding it your preference converts a comparison into a
ratification.

The question it answers is fit and reach, never taste:

> For each of the three directions, name the thing this subject must actually supply for that
> direction to hold up — an ordered workflow with a real surface behind each stage, countable
> sets of genuine output, one object worth showing twice, a nesting to walk outward through,
> copy short enough that silence reads as emphasis — and say whether this brief supplies it. A
> direction whose precondition the brief cannot meet is out, however well it reads.
> Among the directions that survive that, pick the one whose principle keeps deciding things
> past the first screen: which sections it forces into existence, which it forbids, and what it
> lets this page say that the other two could not. Name the pick and give that reason in one
> paragraph.

More than one direction usually survives the first half; the second half is what settles it. A
verdict that praises a direction without naming what its principle decides downstream has not
answered — put the question again.

### 4. Lock the winner

The winning sketch's **hero treatment + body sequence** become Step 4's pick, carried forward
with its principle line; Step 4 records that pair and does not re-open it. Where the axis was in
play, the winner's tone/POV becomes the Gate 0 Tone artefact, its palette family seeds Step 3,
and its signature-element idea seeds Step 7 and the register's Signature Dominance floor. Where
an axis was not in play, what was already locked in writing stands unchanged. Report which of
the three won and the challenger's stated reason, quoted.

### 5. Salvage one idea from a losing sketch

Two directions are about to be thrown away, and a losing sketch usually holds one idea the
winner never had — a section only it thought to include, a transition, a way of naming the
product's objects, a place to put the ask.

Name **one** such idea and where it lands in the winning direction, or state that there is none
and why. One line either way. This is a judgement, not a quota: an idea that fights the winner's
organising principle costs more than it adds, and saying "nothing worth grafting — sketch 2's
strength was its sequence, which the winner replaces" is a complete answer. What is not
acceptable is silence, which is how the losing work goes unread.

### Fallback — `Task`/`Agent` unavailable (already at nesting depth 5)

Skip the fan-out, fall back to the direct single-fiat pick Gate 0 already requires (tone where
it applies, plus the Step 4 hero + body-sequence pair), and mark the report "direction not
explored / single-fiat — Task unavailable at depth 5." Never report a "done" that implies
exploration ran when it didn't.

## Steps

1. **Load the register.** Read `../register/brand.md` or `../register/product.md`
   (whichever Gate 0 picked) in full before any other step. This is the register that
   arbitrates Signature Dominance and the Focal-Block Floor later in step 6 — load it
   first so every downstream choice is already filtered through it, not bolted on after.

2. **Source taste — corpus first, sector second.** Follow
   `../../../design-web/references/design-inspiration.md`, in its fixed order:

   **2a. The corpus (mandatory, always).** Read `../../../design-web/references/refs-design/README.md`,
   then **at least two `tokens-*.md` sections** relevant to what you are building. These are fifteen
   rebuilt pages whose procedures are documented with measured values — that is where palette,
   typography, depth and craft technique come from. Name in the plan which references and which
   sections you pulled from, and what each gave.

   **2b. Sector register (2 sites for FULL, 1 for PAGE, 0 if the register is already
   locked in writing).** `browser_serp_batch` on the client's real vertical, then browse
   real production companies in it — **for register only** (vocabulary, codes, level of
   formality). Not for craft: the procedures come from 2a. Template platforms
   (`*-wbs.framer.website`, `*.webflow.io`, themeforest, any `/templates` path) are
   **banned as a taste source** — building every page from the same ~100 interchangeable
   templates is the documented root cause of generic output, and the reason the corpus
   exists.

   **Reproduce NO reference's structure, spacing rhythm, or section flow** — structure comes
   from the register plus the two banks: `../macrostructure-bank.md` (first screen) and
   `../body-sequence-bank.md` (body). Borrow a technique, never a composition. This step is
   mandatory evidence, not a planning note: 2a must actually be read (sections cited), 2b
   actually run (screenshots taken) — never marked done because it was "considered."

3. **Source tokens.** Pull palette from `sector-palettes.md` or `oklch-system.md`
   (`design-system/references/`) per the register's sector/personality, type pair from
   `typography-pairs.md`, and spacing/density profile from `spacing-density.md`. For PAGE
   scope, `design-system.md` tokens win over these where both exist; these files fill only
   what's missing. Every token in the output must be traceable to one of these files — no
   ad hoc hex/rem value.

4. **Record the macrostructure — two picks, or the plan is incomplete.** Both halves are named
   on one line in the plan:

   **"Macrostructure: {hero treatment} + {body sequence} — principle applied here: {one line}"**

   - When the Exploration Gate ran, this pair is the winning sketch's; write it down here with
     its principle line, do not re-decide it.
   - When it did not (COMPONENT, or the depth-5 fallback), pick it here: read
     `../macrostructure-bank.md` for the first screen and `../body-sequence-bank.md` for the
     body, and apply their shared selection rule.
   - The principle line restates the sequence's organising principle in **THIS subject's**
     terms. The source's wording recopied means a composition was copied, not a principle
     transposed — that line is the check for it.
   - A sequence that is in neither bank is legitimate here on the same terms as in the gate
     (§2 above): forged name, order, principle, what it drops from the canon. Written in the
     plan in the bank's own format, or it isn't a sequence.
   - Naming a hero without a body sequence is an incomplete plan. Send it back; never close
     the gap by defaulting to the canonical section order.
   - The centered-hero + 3-column icon-card grid default is **forbidden** in both halves.
   - The canonical body order is choosable, but only on `../body-sequence-bank.md` rule 2 and
     entry 5 terms — stated, and treated. Either of these two taken deliberately is an
     explicit exception written into the plan, never a default reached by omission or silence.

5. **Select components.** For each section, pull the component pattern from
   `../../../design-web/references/cards-guide.md`, `buttons-guide.md`,
   `component-composition-ref.md`. At most ONE device from
   `../../../design-web/references/premium-patterns/PATTERNS.md` per section, and at most two
   per page, on two non-adjacent sections of different layout families
   (`../../../design-web/references/layout-discipline.md` §5). Read the single matching
   `description.md` and apply its device to that section. **Never combine prompts** — those
   files give section decoration, never page structure; the structure was already fixed at
   step 4. No component is "furniture" placed because it's common — each one must map to a
   section's actual content need from the brief.

6. **Verify numeric constraints.** Check the output against every rule in
   `../../../design-web/references/layout-discipline.md` (hero hard numbers, eyebrow cap,
   zigzag cap, bento N=N, section-repetition ban, CTA discipline, measure floor,
   focal-block floor register-conditional) — mechanically, against the actual rendered
   markup, not a mental estimate. Log pass/fail per rule in the report (step below).

7. **Write the body.** Every section's copy must conform to `../register/brand.md` or
   `../register/product.md` (whichever was loaded in step 1) and to `../register/copy.md`. Each
   section needs a one-line justification tying it back to the brief/signature element —
   "why does this section exist" — not generic filler copy dropped into a chosen
   component shell.

8. **Apply motion.** Transitions use `transform`/`opacity` only (never layout-triggering
   properties), with an exponential easing curve (`cubic-bezier` exp-out family, not
   linear/ease default), and respect `prefers-reduced-motion` per the Non-Negotiable Floor
   in `design-method/SKILL.md`. Motion intensity follows the register loaded in step 1
   (`brand` can be expressive, `product` stays discreet).

### Report template

```markdown
## Generate move — report

**Scope:** FULL | PAGE
**Register loaded:** register/brand.md | register/product.md

### Exploration Gate (omit only for COMPONENT scope — state which axes were in play)
- Ran: yes/no (no → why: COMPONENT scope, no page body | Task/Agent unavailable at depth 5)
- Axes in play: {full: tone + palette family + hero + body sequence + signature}
  | {reduced: hero + body sequence (+ unit of progression, product register)}
- Sketch 1: body sequence {name, bank entry or off-bank} — order: {…} — principle for THIS
  subject: {one line} / hero: {treatment} / {tone/POV, palette family, signature — if in play}
- Sketch 2: {same fields}
- Sketch 3: {same fields}
- Three sequences distinct on their PRINCIPLE (not just their name): yes/no
  (no → which pair collided, and which one was re-fanned)
- Off-bank sketches: {none | sketch N: forged name + what it drops from the canon}
- Challenger pick: sketch {N} — reason, quoted: "{the challenger's own sentence — what the
  brief supplies for it, and what its principle decides past the first screen}"
- Salvaged from a losing sketch: {one idea + where it lands in the winner}
  | none, because {reason}
- Locked from the winner: hero + body sequence → step 4 | tone → Gate 0 artefact (if in play)
  | palette family → step 3 (if in play) | signature idea → step 7 (if in play)

### Step 2 — Taste sourced (2a corpus first — mandatory, then 2b sector register)
- 2a pages OPENED and scrolled (min. 2, before any markdown): {refs-design/{folder}/index.html} + {refs-design/{folder}/index.html} — what each looked like, in one clause
- 2a references read: {refs-design/{folder}} + {refs-design/{folder}} ← refs-design/README.md
- 2a tokens-* sections cited (min. 2): {tokens-{name}.md #{section}} — gave: {procedure/measured value}
- 2b sector sites (2 for FULL / 1 for PAGE / 0 if the register is already locked in writing): {URL} — screenshot: yes/no
- Extracted (palette / typography / depth / craft ONLY — never structure, spacing, or section flow): {traits} from {source}

### Step 3 — Tokens sourced
- Palette: {values} ← sector-palettes.md #{sector} (only if the sector is one of the seven that file lists) | derived from the subject — say from what | design-system.md (PAGE)
- Type pair: {display}/{body} ← typography-pairs.md #{pair}
- Spacing/density: {profile} ← spacing-density.md #{profile}

### Step 4 — Macrostructure (BOTH halves — a hero named alone is an incomplete plan)
- Hero treatment: {name} ← macrostructure-bank.md | exploration winner
- Body sequence: {name} ← body-sequence-bank.md | off-bank (forged) | exploration winner
- Principle applied here: {one line, in THIS brief's terms — not the source's wording}
- If off-bank: order / principle / what it drops from the canon / what subject it suits
- Deliberate exception (centered hero / icon-card grid / untreated canon order)? yes/no + reason

### Step 4 bis — What is on screen, counted (Gate 0 artefact 4)
- Per section: {section} → {images / videos / mockups / drawn interfaces / charts / tables / full-bleed colour fields / display-scale type objects}
- Total entries vs sections: {n} / {n}
- Screen-holding floor (`design-method/SKILL.md`): DENSITY {n} · VARIANCE {n} · assets {yes/none} → clear | triggered
- If triggered: which way out was taken — raise density | manufacture the matter | lower the variance — and what changed

### Step 5 — Components
- Section {name}: {component pattern} ← cards-guide.md/buttons-guide.md/component-composition-ref.md/premium-patterns/{folder}/description.md

### Step 6 — Layout-discipline check (mechanical, per rule)
| Rule | Pass/Fail | Note |
|------|-----------|------|
| Hero hard numbers | | |
| Eyebrow restraint | | |
| Zigzag cap | | |
| Bento N=N | | |
| Section-repetition ban | | |
| CTA discipline | | |
| Measure floor | | |
| Focal-block floor (brand only) | | |

### Step 7 — Body conformance
- Section {name}: justification (brief/signature tie-in) — copy source: register/copy.md #{ref}

### Step 8 — Motion
- Properties: transform/opacity only? yes/no
- Easing: {cubic-bezier} — exp-out family? yes/no
- prefers-reduced-motion respected: yes/no

### Deviations / gaps
- {anything skipped, exempted, or not yet resolved, with the reason}
```
