---
name: design-inspiration
description: "Use before generating any page, to source taste — palette, typography, depth, craft technique. Order is fixed: the local corpus (`refs-design/`, eleven pages with measured procedures) first and mandatory, then 1-2 real production sites in the client's own sector for register only. The corpus sets a floor of execution, never a ceiling: it also grants the right to invent a procedure no reference contains, provided it is derived from the subject and documented. Do NOT use for section structure — the first screen comes from macrostructure-bank, the body order from body-sequence-bank. Also holds the canonical Lookalike Test."
related: design-inspiration-urls.md, refs-design/README.md, 21st-dev.md, gemini/gemini-feedback-loop.md, ../../design-method/references/macrostructure-bank.md, ../../design-method/references/body-sequence-bank.md, ../../design-method/references/register/brand.md
---

## What This Phase Is For (read before anything)

This phase supplies **taste signals only**: palette, typography, visual depth, craft
technique. It NEVER supplies the page's structure. Structure comes from the register locked
at Gate 0 (`../../design-method/references/register/brand.md` or `product.md`) plus two
named picks — a hero treatment for the first screen
(`../../design-method/references/macrostructure-bank.md`) and a body sequence for everything
after it (`../../design-method/references/body-sequence-bank.md`) — validated per-section by
the Competitor Lift Test (`brand.md` §3).

A reference is a taste donor, never a template. Cloning its section flow, spacing rhythm or
copy skeleton is precisely the failure this file exists to prevent.

## Source order — not a menu

**1. The local corpus — mandatory, always first.**

```
./refs-design/README.md
```

Eleven references built and accepted for this purpose. Ten are real production pages rebuilt
by hand; one (`elysian/`) is an original build in a different register. Each of the eleven
folders carries two files that do not overlap:

| File | Answers | Holds |
|---|---|---|
| `tokens-<name>.md` | **how** | the procedures, the measured values, the traps — 33 indexed across the corpus |
| `design-system.md` | **what** and **why** | register, tone, signature element, the named macrostructure and its section sequence |

Open `README.md` first: it holds the procedure index (technique → reference → section), so
you read the two or three `tokens-*.md` sections that matter instead of everything. Read a
`design-system.md` when you want to see how a page's decisions were argued — never to lift
its structure, which comes from the two banks named above.

**2. Real sites in the client's actual sector — 1-2, for register only.**

The corpus does not tell you how a driving school, a law practice or a bakery presents
itself. That is **register**, and it comes from the subject. Use
`mcp__fuse-browser__browser_serp_batch` on the real vertical, then browse 1-2 actual
companies in it.

Look at those sites for **register only** — vocabulary, codes, level of formality, what the
sector's audience expects to see. Do NOT mine them for craft: the procedures come from the
corpus, which documents its own mechanisms. Never extract taste from a template gallery (see
FORBIDDEN below).

## The standard the corpus sets

Ten of the eleven are dense, dark, precisely-built product pages. That is **deliberate**: it
fixes the level of execution expected — tight tokens, real depth, motion that carries
meaning, no filler section. Read it as a quality floor, not as a theme to apply. `elysian/`
is in the corpus specifically to prove the same rigour holds in a completely different
register (neoclassical, printed, warm) — the standard travels, the look does not.

So: take the standard from every reference, take the register from the subject. A bakery
built to this standard is not a dark product page; it is a bakery page that is actually
built.

### A floor, not a ceiling

That protects against copying the corpus's *register*. The same thing has to be said one
level down, about its *procedures*: the 33 indexed procedures are a point of departure, not
a catalogue to work through. Two consequences, and they cut in opposite directions.

- **A page that uses none of them and holds the same level of execution has succeeded.**
  There is no quota and no minimum. The question at review is never "which corpus
  procedures did you use", it is "does this hold up".
- **A page that stacks six of them without needing any has failed**, however well each one
  is executed. A procedure with no job on the page is filler with good provenance.

The mandatory read below is a floor on what you should know before building. It is not a
specification of what to build.

## You may invent a procedure

Nothing above obliges you to assemble a page out of borrowed mechanisms. **If the subject
asks for something no file in the corpus contains, build it.** That is a first move, not a
consolation for an index that came up empty.

`elysian/` is the proof, and it is on disk. Its four image transformations — slat shear,
arch aperture, torn counter-pan, letterform plate (`refs-design/elysian/tokens-elysian.md`
§§ 3-6) — come from no reference. They were derived from what that page is about: four
engraved plates and an auction house cataloguing objects that do not exist. It is also the
only page in the corpus standing outside the dominant register, and it got there by
inventing rather than by borrowing.

The counterpart is exactly the one a borrowed procedure carries — no lighter, no heavier.

1. **Derived from the subject, and you can name from what.** A mechanism you cannot trace
   back to the thing being designed is decoration, whoever authored it. "It looked good" is
   not a derivation.
2. **Documented**: the mechanism, the values you settled on, and what breaks if it is
   transposed elsewhere. `elysian § 3.4` and `§ 17` are the model — the slat shear's `--n`
   duplicates a DOM child count with nothing checking it, and a global
   `img { max-width: 100% }` silently defeats the whole effect. Both are written down.
3. **Declared** on the `Invented` line of the Reference Selection Format below, so a
   reviewer reads it as a decision you took and defended, not as an unexplained flourish.

Inventing removes no obligation. It removes a boundary that was never there.

## Rules (CRITICAL)

1. **Corpus first, every time.** Read `refs-design/README.md` plus at least **two
   `tokens-*.md` sections** relevant to what you are building, before any browsing and
   before any code. This read is also the Gate 0 evidence artefact — cite the sections.
2. **Borrow a technique, never a composition.** The test: could the element you are about to
   reuse sit on a brand in an unrelated sector without changing a pixel? Then it is a
   composition — rework it. A technique carries a *function*, not a look. Borrowing is not
   compulsory: an invented procedure is a first-class answer under the three conditions
   above.
3. **Vary the entries.** Do not pull the same two references every session; the index exists
   so the choice follows the need, not habit.
4. **Register comes from the subject**, never from a reference. If sector browsing runs, it
   informs register only.
5. **Run the Lookalike Test** (canonical definition below) once the page is built — not
   while sourcing.

## Reading a `tokens-*.md` (how to extract)

Each file states the mechanism, its measured values, and the trap that breaks it elsewhere.
Take the three together — a value without its mechanism transplants badly.

Marker convention inside those files:

| Marker | Meaning |
|---|---|
| `[relevé]` | value read in the source or measured on the render |
| `[arbitrage]` | judgment call by the rebuilder, justified on the line |
| `[estimé]` | reconstructed — the source does not carry it explicitly |

Each file also has a section on what it deliberately did **not** reproduce. Read it before
assuming a gap is an oversight.

## Sector browsing — fuse-browser workflow

Only for step 2, only for register, 1-2 sites.

```
Step 0: mcp__fuse-browser__browser_serp_batch → find real companies in the vertical
Step 1: mcp__fuse-browser__browser_open → sessionId (once, reused)
Step 2: mcp__fuse-browser__browser_navigate → the real production URL
Step 3: browser_scroll to: "end" → wait 5s → scroll back to top → wait 2s
Step 4: mcp__fuse-browser__browser_screenshot with fullPage: true
Step 5: Note register signals ONLY — vocabulary, formality, what this sector shows
        and in what tone. Do NOT log section order, spacing rhythm or copy skeleton.
```

Award galleries (`awwwards.com/websites/`, `godly.website`, `bestwebsite.gallery`) are
useful for exactly one thing: they link out to real production sites. Follow the outbound
link, never extract from the gallery page.

## If you do record CSS from a browsed site

Be exact, never vague:

```
### {URL}
1. Colors: primary=oklch(X% X X), accent=..., bg=..., text=...
2. Typography: exact family, H1 clamp(Xrem,Xvw,Xrem) weight X, body Xrem weight X
3. Depth: box-shadow (X layers), border-radius Xpx, backdrop-blur Xpx, opacity X
```

FLAT DESIGNS ARE FORBIDDEN. Flat sections, no shadow, no layer, no effect — bad reference,
drop it.

## Absolute Ban — AI-Slop Signature Combo (canonical: `../../design-method/SKILL.md` §Absolute bans)

NEVER ship the combination of: Tailwind blue/indigo hue range (200-290°) as the
primary/accent color + Inter as the primary typeface + `rounded-2xl` as the default corner
radius. This exact triad is the single most common AI-generated site signature (grounding:
sailop ai-slop research — ~83% of sampled AI-generated pages share this palette/font/radius
fingerprint; the figure belongs to this triad and to nothing else). If 2 of these 3 are
already fixed by brand guidelines, the third MUST change — different hue, different radius,
or a different typeface (`../../design-system/references/forbidden-fonts.md` lists
reflex-reject fonts and alternatives).

## Lookalike Test — canonical definition (other files link here, none restate it)

**1. What you compare against.** Two sets, both required: 2-3 direct competitors in the
client's real sector, **and** the corpus references you actually drew from (those named on
the `Corpus` line of the `## Design Reference` block below). A page that dodges its
competitors but reproduces the corpus reference it borrowed from has failed just as hard.

If the `Corpus` line names no reference — the page's craft is invented, which is allowed —
the corpus set is empty and the test runs on the competitor set alone. Write
`[corpus silhouettes: none drawn from]` in the report. Inventing does not exempt a page
from the test; it only removes one side of the comparison.

**2. Where the silhouettes come from — nothing new gets opened.** A silhouette is the page
reduced until only structure survives: a full-page capture scaled to ~200px wide, a
downsampled/blurred render, or a squint test on the render. Sources, in order:

- competitors → reduce the full-page captures the sector step already took
  (`../../design-method/references/moves/generate.md`, step 2b). Do not re-open the sites.
- corpus → open the reference's own page under `refs-design/{reference}/` locally, reduce
  it identically. Nothing to browse: the corpus is on disk.
- `redesign` move → add the old-surface capture from its Delta 1
  (`../../design-method/references/moves/redesign.md`), reduced identically.

If the sector step ran with zero sites (register already locked in writing), compare against
the corpus set alone and write `[competitor silhouettes: none captured]` in the report. At
most ONE capture may be taken to fill a gap, and only of a URL already named in the brief or
in `design-system.md` — never a discovery search opened for this test.

**3. When it runs, and what a fail costs.** After the build, before handoff — per project,
not as a sourcing-time habit. Fail = the silhouette is not distinguishable from one in the
set: same section count, same proportions, same rhythm of light/dark blocks in the same
order. A fail is STRUCTURAL: go back to the body sequence in
`../../design-method/references/body-sequence-bank.md` — pick a different one, or treat the
one you have (its rule 2) — then re-run the test on the rebuilt page. A different hero
treatment alone does not answer it, and a spacing or colour adjustment is never a fix.

## FORBIDDEN Navigation Targets

- **Template platforms, as a taste source: banned.** `{slug}-wbs.framer.website`,
  `{slug}.webflow.io`, `themeforest.net`, and any URL with `/templates`, `/marketplace`,
  `/themes` in the path. Marketing templates are *built* to be interchangeable — that is
  their product requirement. Extracting taste from them converges every output toward the
  same body: the documented root cause of the generic-page problem, and why the corpus
  exists.
- Catalogue/product-grid pages of any kind: nothing real to extract.

## Reference Selection Format

Before coding, write in `design-system.md`:

```
## Design Reference
- Corpus: {reference}/{tokens section}, {reference}/{tokens section}  — what each gave
- Invented: {name of the procedure} — derived from {what in the subject} — {mechanism,
  the values settled on, what it breaks if transposed}. Drop this line if you invented
  nothing; never write "none" to fill it.
- Sector sites (register only): {url1}, {url2}
- Extracted: {palette oklch} / {typography} / {depth & craft technique(s)}
- Macrostructure: {hero treatment from macrostructure-bank.md} + {body sequence from
  body-sequence-bank.md, with its principle in this brief's terms} — chosen independently
- NOT reproduced: section flow/order/copy skeleton
```

The `Corpus` line may legitimately be short, or name a single procedure, when most of the
page's craft is on the `Invented` line. A long `Corpus` line is not evidence of quality; it
is only evidence of borrowing.

This feeds the Gemini XML `<style_reference>` block — taste signals only. NEVER call Gemini
without it, and never let `<style_reference>` smuggle in a section order.

## What NOT to Do

- NEVER skip the corpus and go straight to browsing
- NEVER extract craft from a template platform — banned above
- NEVER treat any reference as a structural template
- NEVER copy a value without the mechanism that makes it work
- NEVER skip the Lookalike Test before declaring the page done
