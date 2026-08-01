# Design reference corpus — fifteen pages

Fifteen references. Ten of one kind, then five that broke the mould.

**Fifteen rebuilds** (`*-recode/`) — public pages rebuilt by hand from their live source,
each reviewed and accepted by the owner. Every folder holds `index.html`, `styles.css`,
one or more `motion*.js`, plus the two markdown files described below. The five most
recent — `mosa`, `stash`, `parley`, `dispatch`, `stripe` — also carry an `img/`
subfolder: **22 photographs on disk**, which the first ten have none of.

There is **no original creation here**, and that is deliberate: every value in this folder
was measured against something that actually shipped, which is what makes `[relevé]` mean
anything.

---

## Look before you read — the order is not negotiable

These fifteen are **pages**, not documentation. They were accepted one by one *on the render*,
by eye, and that judgment is the only thing in this folder that was never written down.

**Open the pages first.** Double-click `index.html` in the folders you are considering —
`file://`, no server, no build, nothing to install. Scroll each one to the bottom. Do this
before you open a single `.md` file in here.

```
open design-web/references/refs-design/{reference}-recode/index.html
```

Then, and only then:

| Order | What you open | What you are there for |
|---|---|---|
| 1 | `index.html`, rendered in a browser | what the page **is**. Whether it holds. Whether it is anything like what your subject needs. |
| 2 | `design-system.md` | the **decision** — register, tone, signature element, macrostructure, and the argument behind them |
| 3 | `tokens-<name>.md` | the **values**, once you already know which procedure you want and have seen what it gives |

**Why that order, stated plainly: measured values let you *reproduce* a procedure. They
never let you *choose* one.** `VISUAL_DENSITY 2` read in a table and `VISUAL_DENSITY 2`
seen on screen are not the same information. The first is a number. The second is `reve`
giving one editing capability the full height of the window — with fifty-one images inside
it. An agent that reads the number and skips the render infers "sparse means empty", and
ships three screens with nothing on them. That has happened, on a real brief, and it is
why this section exists.

Reading this corpus without opening a page is not a shortcut. It is a different and lesser
activity: a `tokens-*.md` opened before the render it documents is a list of numbers with
no referent.

**What you actually get offline — and this changed.** For the first ten, "frozen but not
autonomous" was the whole story: every one pulls its images or video from the network, and
nine of the ten pull their typefaces too. Offline, images resolve to their `alt` text and
two pages lose their typography entirely.

**The five most recent invert that.** `mosa`, `stash`, `parley`, `dispatch` and `stripe`
ship **22 `.webp` photographs inside their own `img/` folder** and reference not a single
remote image: three URLs each, all three Google Fonts (two `preconnect`, one stylesheet).
Open one on a plane and you get the page the owner accepted, minus the webfont — the
photographs, the crops, the scrims and the text laid over them all resolve. That is a
different reference object: **the first ten let you study a layout offline; these five let
you study a photograph in a layout offline**, which is the part `alt` text never carried.

It also gave the corpus a working procedure it did not have. The first ten argue with
drawings, screenshots and remote stock; these five were built *around* real photographs
that exist on disk — which is what makes `stash § 6` (crop axis), `parley § 11.3` (dark
type on a pale photograph) and `dispatch § 11` (a portrait section with no portrait)
possible to write at all. Full breakdown in *Network dependency* below. A degraded render
is a reason to note what you are missing; it is never a reason to skip the render and read
the markdown instead.

---

## The one rule: borrow a technique, never a composition

A technique is a mechanism: how a scrim is layered, how a marquee loops without a jump,
how a card gets a hairline without a border. It transposes.

A composition is *this* page for *this* brand: its section order, its proportions, its
tone. It does not transpose.

**The test.** Take the element you are about to reuse. Could it sit on a brand in an
unrelated sector without changing a single pixel? Then you copied a composition — rework
it. A technique survives the move because it carries a *function*, not a look.

Concretely: umbrel's marquee mechanism on a driving school, yes. Umbrel's hero on a
driving school, no.

---

## The other side of that rule: you may invent

The rule above governs what you *take*. It says nothing about what you *make*, and it is
not an obligation to take anything at all.

**You may build a procedure that appears in no file here.** Not as a fallback for when the
index comes up empty — as a first move, whenever the subject asks for something this folder
does not contain. Nothing in this plugin requires a page to be assembled out of borrowed
mechanisms.

**The proof is in the corpus.** `mainframe`'s macrostructure — *Shrinking Aperture*
(`mainframe-recode/design-system.md`, §Macrostructure and the §Principle line under it) —
appears in no row of the index below, and no row could have produced it. Its order is set
by **decreasing display surface, not by argument**: a 100vw carousel, then 52rem frames,
then 16rem cards, then 400px rail cards, then pricing with no media at all, then a 180px
object. That order comes straight out of what the page is about — a tool that turns agent
runs into videos a team can watch, a subject whose whole claim is *watching*. So the page
opens at the largest viewing surface it can afford and closes the aperture step by step,
and the type is forbidden to compensate: the h1 is 28px from 390 to 1440 and the closing
heading, at 24px, is *smaller* than it. Even the header obeys — it is not sticky, it
scrolls away and never returns. Nothing here was borrowed; it was read off the subject.

**What it costs.** Exactly what a borrowed procedure costs, no more and no less.

- **Derived from the subject, and you can say from what.** A mechanism you cannot trace
  back to the thing being designed is decoration, whether you invented it or lifted it.
  "It looked good" is not a derivation.
- **Documented like everything else here**: the mechanism, the values you settled on, and
  what breaks if someone transposes it. `supercommon § 1.1` and `§ 4` are the model — the
  first gives the mechanism (vertical rhythm carried by empty `vh` blocks, not padding),
  its fifteen measured values, and the condition under which it fails: long silences are a
  large-screen luxury and become a fault on a phone, which is why the source itself cuts
  two of them below 1440px. The second is a two-entry list of what broke during the
  rebuild. An invented procedure with no such note is unfinished, not original.

Inventing exempts you from nothing. It only means the index was never the boundary.

---

## Almost one register — and it is still not the one you are designing for

**The warning that used to open this section stands: this folder is one industry.** All
fifteen are tech products — umbrel, linear, cursor, harness, xai, mainframe, reve,
endlesstools, supercommon, fora, mosa, stash, parley, dispatch, stripe. Not one artisan,
not one school, not one shop, not one public service. If you are designing for a sector
that is not software, **no page here shows you your register**, and reading fifteen of them
will not produce it.

What has changed is narrower and worth naming precisely: the *visual* register is no longer
uniform. **Twelve of the fifteen are dark and dense**, which is still the overwhelming
default of this folder and still a bias to correct for. The three that are not:

- **`parley` is the first light page in the corpus** — perle `#f4f5f7`, ink `#2c3a4b`, no
  glow anywhere. It is the counter-example the first ten did not have, and its
  `tokens-parley.md § 11` is the only place in this folder that writes down what a light
  page actually costs: the hairline replaces the glow (25 borders against 14 shadows), the
  shadow has to be tinted with the page's own ink instead of black, dark type on a pale
  photograph needs a three-stop wash *and* a white `text-shadow` behind it, weight has to
  rise a step because thin strokes disappear on light, and alpha stops being free.
- **`stripe` is the densest and by far the most colourful** — `VISUAL_DENSITY 9`, a locked
  light theme with a dark block in the middle of it, and multi-hue gradients (never round
  angles, stops outside 0-100%, three hues maximum per declaration) that exist nowhere else
  on disk. It is also the only page here that runs saturated colour as *structure* rather
  than as an accent.
- **`cursor`** remains what it always was: light-based, but grey and unaccented, which is
  why it never read as a counter-example.

Read the rest as a **limit of this folder, not as its recommendation.** What the fifteen
demonstrate is a level of execution, and that level is register-independent. The nearest
thing the corpus offers to an argument against its own lane is `mainframe`: register
`brand` — a launch page whose job is conversion — that argues in `product` terms, with no
display type, no accent, no proof section and no persuasion device, and it holds.

They are all here as **inspiration**: for the quality of their execution and the
mechanisms they use, not as a template to trace. Take the mechanism, bring your own
register — on this corpus it can only come from the subject you are designing for, never
from this folder.

---

## Two documents per folder

Each of the fifteen folders carries both, and they do not overlap.

| File | Answers | Holds |
|---|---|---|
| `tokens-<name>.md` | **how** | the procedures, the measured values, the traps |
| `design-system.md` | **what** and **why** | register, tone, signature element, the named macrostructure and its section sequence |

**Both come after the render** — see *Look before you read* above. Open `design-system.md`
for the decision, what the page commits to and what it refuses; `tokens-*.md` to build the
thing, once you have seen what the thing looks like.

The technique index below indexes `tokens-*.md` sections. That means it can tell you
**where a procedure is written down** — and nothing else. It does not tell you what the
procedure looks like on screen, nor whether it suits your subject. Those two questions are
answered by the render and by `design-system.md`, in that order; the index answers neither.
Using it as the entry point is exactly how a page gets assembled out of values nobody has
ever looked at.

**Structure never comes from this folder directly.** The fifteen body sequences have been
lifted out into `../../../design-method/references/body-sequence-bank.md`, and the
first-screen treatments live in `../../../design-method/references/macrostructure-bank.md`.
Pick from those two banks. A folder's `design-system.md` is here for a different use: it
explains why *this* structure was right for *this* subject — a worked argument, not an
option to select.

---

## Technique index

### Read this before the table, not after it

**Name the verb first.** This section used to sit *below* the table, which made it
decorative: by the time you reached it you had already picked a reference, and you had
picked it the way everyone picks one — by tone, because something looked like the thing you
wanted. That is the failure this paragraph exists to stop, so it now comes first, and
`design-review/references/pre-flight-checklist.md` check 18 makes it a gate rather than
advice.

The table below is sorted by technique, so it answers *how do I build X*. It does not
answer *what could carry this subject* — and that is the question that comes first.

To get the second reading, invert the entry point. **Before opening the table, name what
the subject physically is and what it does** — a printed sheet can be cut, torn,
misregistered; a schedule advances; an archive stacks and is dated; a tool has a before and
an after. Then scan the table for the **verb** rather than the technique name: what tears,
slides, opens, loops, reveals, executes, holds still. Either a listed mechanism already
performs that motion and you have your starting point, or nothing does — which is an answer
too, and the section *The other side of that rule* above says what to do with it.

**Never pick by resemblance of tone.** "This one feels premium like my brief" is not a
selection criterion; it is how a composition gets copied. The verb is the criterion.

**Two worked examples, deliberately two.** One reference used to carry this role alone,
which quietly turned it into the model everyone reached for — the exact bias this section
is against.

- **`mainframe`, a structural verb.** Its subject is a tool for *watching* something, so the
  page was ordered by decreasing display surface rather than by argument — the verb is
  **"it closes"**, no row of this table supplies it, and it decided the whole scroll before
  a single technique was picked.
- **`dispatch`, an argumentative verb.** Its subject is a newsletter platform driven from a
  command line — a thing whose whole claim is that it *runs*. So the verb is **"it
  executes"**, and it sets the body order directly: every claim is followed *within the same
  section* by a surface that performs it — the hero says *pipe it* and the terminal beneath
  prints the pipe, the pricing states a rate and the calculator below applies it. The page
  never argues twice in a row without a machine speaking in between. Again: read off the
  subject, supplied by no row below.

| Technique | Source | Section |
|---|---|---|
| Two-track marquee, loop with no visible jump | umbrel | `## 0. The six techniques to remember` |
| Radial gradient anchored at block top | umbrel | `## 4. Colors` |
| Hairlines and shadows as separators | umbrel | `## 7. Hairlines and shadows` |
| Nav scrim / pill that closes on scroll | fora | `## 5 quinquies. The nav bar's scrim` |
| Inset-hairline card (two boxes, no border) | fora | `## 6. The two pieces worth reusing` |
| Text that lights up on entry | fora | `## 5 bis. The text that lights up` |
| `opacity:0` in a scraped export is NOT design | fora | `## 1. The trap in the source` |
| Rotating tabs, media above the tab row | harness | `## 3. Reusable techniques` |
| CSS-animated SVG scenes, no library | harness | `## 10. Offline autonomy` |
| Tokens organised by role, not by value | harness | `## 4. Tokens, by role` |
| Page skeleton before anything else | linear | `## 4 bis. Page structure` |
| Masking and light techniques | linear | `## 6. Masking and light techniques` |
| Button architecture | linear | `## 7. Buttons — architecture` |
| Four structural techniques worth copying | cursor | `## 7. Four structural techniques` |
| Techniques that get missed on a first pass | cursor | `## 3 bis. Four techniques measured late` |
| Holding a page together **without images** | supercommon | `## 1. What holds this page together` |
| Same, second treatment | xai | `## 7. How the page holds together without images` |
| Bento mockups | xai | `## 3. The four bento mockups` |
| Code block as a design object | xai | `## 4. The code block` |
| Video as page material (eight of them) | endlesstools | `## 1. The main technique` |
| Opening mosaic | endlesstools | `## 1 bis. The opening mosaic` |
| Header veil | reve | `## 2. The header veil` |
| Application UI patterns | reve | `## 4. Application UI patterns` |
| Surface hierarchy | reve | `## 3. Surface hierarchy` |
| Motion system as the page's backbone | mainframe | `## 1. The motion system` |
| Product screenshots **recreated in HTML/CSS**, no capture (7 mockups, 0 `<svg>`) | stripe | `## 5. Recreating product screenshots` |
| Same, four surfaces including two terminal chassis | dispatch | `## 5. The code block as technical proof` |
| Same, four floating interface mocks on a light page | parley | `### 5.3 The four floating interface mocks` |
| Fake interface drawn on top of a photograph | mosa | `### 5.3 The fake interfaces` |
| Multi-hue gradient — never a round angle, stops outside 0-100%, 3 hues max per declaration | stripe | `### 2.3 Building multi-hue gradients` |
| Fan of blurred ribbons (elongated ellipses on one off-canvas anchor) | stripe | `### 1.3 The hero animation` |
| Interactive calculator on a **log10** scale | dispatch | `## 6. The interactive calculator` |
| Running a light page in a dark register — what it costs, item by item | parley | `## 11. On being the light one` |
| Dark type laid on a pale photograph (3-stop wash + white `text-shadow`) | parley | `### 11.3 Text on a pale photograph` |
| Cropping with `object-position` on the axis that actually crops | stash | `## 6. Images` |
| Two-voice heading: one grotesque sentence cut by a serif italic | stash | `### Two families, and the split is absolute` |
| Treating a "portrait" section **without a portrait** — geometry kept, no face invented | dispatch | `## 11. The portrait section` |
| Local photographs only, zero remote image | mosa | `### 6.1 Framing, decided after looking at the four files` |

Thirty-eight procedures. Section titles are cited by their opening words; several run
longer in the file itself. Search on the number and the first few words, not on an exact
string match. **Every `.md` in this folder is in English**; only the three markers
`[relevé]` / `[arbitrage]` / `[estimé]` stay French, per *Conventions* below. A page's
own visible copy may be in another language — `stripe-recode/index.html` is in French,
because its source is `stripe.com/fr` and an English rebuild would have been an
infidelity.

**Two traps carried by the new rows, stated here so they are not discovered the hard way:**

- **`clip-path` is applied *after* `filter`.** Put a blur and a clip on the same element and
  the clip re-cuts the blurred result at a razor edge — the blur is there in the code and
  invisible on screen. `stripe § 1.3` resolves it by removing the polygon entirely ("a
  blurred polygon is still a polygon"); the other resolution is to blur the parent and clip
  the child. Never both on one element.
- **`object-fit: cover` on a source wider than its frame crops in height only.** A shift
  along X is then a **silent no-op** — it changes nothing and reports nothing. `stash § 6`
  documents a first pass that set `65% center` and had no effect at all. Read the two aspect
  ratios before choosing the axis.

---

## Traps documented here, worth reading before you start

- **`opacity:0` / `0.001` + `transform` in a scraped page is an animation's initial
  state, not the design.** Reproduce it as a resting style and the element stays invisible
  forever. → `fora § 1`, 243 occurrences in that one source.
- **On a page that holds without images, the exact length of a title drives line breaks
  and vertical rhythm.** A paraphrased title breaks the layout even when the measured type
  is right. → `supercommon § 1`
- **A scraped Next.js/RSC export is mostly script payload**, and can contain the whole
  `<body>` twice. Byte counts measure nothing. → `cursor § 8`
- **Where a source hides its real values** — inline, in a preset, in a variant.
  → `endlesstools § 6 bis`
- **What each reference deliberately does NOT reproduce**, and why. Every file has this
  section; read it before assuming a gap is an oversight.

---

## Network dependency — what degrades offline

The pages are frozen and measured. They are not autonomous. Counted over each folder's
`index.html`, `styles.css` and `motion*.js`: distinct absolute URLs in `src` / `href` /
`srcset` / `poster` and in CSS `url()`, XML namespaces excluded, a few `preconnect` hints
included.

| Folder | Remote URLs | Local images | Typefaces |
|---|---|---|---|
| reve | 104 | 0 | 4 woff2 from `app.reve.com` |
| endlesstools | 78 | 0 | Inter, `rsms.me` |
| harness | 63 | 0 | 5 woff2 from `cdn.prod.website-files.com` |
| umbrel | 47 | 0 | Inter, Google Fonts |
| fora | 35 | 0 | Inter, Google Fonts |
| cursor | 28 | 0 | none — system stack |
| mainframe | 23 | 0 | Inter, Google Fonts |
| linear | 20 | 0 | Inter, Google Fonts |
| xai | 19 | 0 | Geist, Google Fonts |
| supercommon | 11 | 0 | Inter, Google Fonts |
| stash | **3** | **6 `.webp`** | Geist + Instrument Serif, Google Fonts |
| mosa | **3** | **4 `.webp`** | Geist + Geist Mono, Google Fonts |
| parley | **3** | **4 `.webp`** | Public Sans + Instrument Serif + JetBrains Mono, Google Fonts |
| dispatch | **3** | **4 `.webp`** | Geist + Geist Mono + Instrument Serif, Google Fonts |
| stripe | **3** | **4 `.webp`** | Inter, Google Fonts |

**The floor is now 3, and it is entirely typographic.** That sentence used to read "the
lowest count in the table is 11, not 0" and is no longer true. The five most recent folders
each declare exactly three absolute URLs — `preconnect` to `fonts.googleapis.com`,
`preconnect` to `fonts.gstatic.com`, one stylesheet — and **not one remote image between
them**. Every photograph they use is a `.webp` in their own `img/` folder: 4 for `mosa`, 6
for `stash`, 4 for `parley`, 4 for `dispatch`, 4 for `stripe`. Twenty-two files.

**So five folders now survive a plane, with one loss.** Open any of them offline and you
get the composition, the photographs, the crops, the scrims and the type *scale* the owner
accepted; what you lose is the typeface, which falls back to the system stack. Nothing else
degrades. Among the first ten, `cursor` is still the only one whose *typography* survives —
and only because it ships no webfont at all.

Two things follow, and they point in opposite directions. If you want to study **how a
photograph was cropped, veiled and written over**, the five recent folders are the only
place you can do it without a connection. If you want to see any of the first ten as
accepted, you need the network.

**Two pages take their typefaces from a third-party CDN.** `harness` pulls five woff2
(Geist Light/Regular/Medium/SemiBold, CalSans-SemiBold) from `cdn.prod.website-files.com`;
`reve` pulls four (ReveDisplay medium/regular, ReveSansMono, ReveUI) from `app.reve.com`.
Both declare `font-display: swap`: offline — or the day either CDN purges — the browser
paints the fallback stack and never swaps back. The typography, which is most of what you
opened these two pages to look at, is what you lose first.

Elsewhere the loss is milder: images resolve to their `alt` text, video to an empty box.
**The values survive regardless** — every type scale, weight, tracking, colour and spacing
figure is written out in `tokens-*.md` and `design-system.md`, text in the repo, no
network. Offline you lose the render, not the reference.

---

## Seven pages load Inter — do not carry that across

`endlesstools` (via `rsms.me`), plus `fora`, `linear`, `mainframe`, `supercommon`,
`umbrel` and `stripe` (via Google Fonts). Inter is on the plugin's banned list:
`../../../design-system/references/forbidden-fonts.md`.

The other four recent folders do not add to it: `mosa` loads Geist + Geist Mono, `stash`
Geist + Instrument Serif, `dispatch` Geist + Geist Mono + Instrument Serif, `parley` Public
Sans + Instrument Serif + JetBrains Mono. `stripe` carries Inter for the same reason the
first six do — it is what the source ships.

Not a defect in the rebuilds: they are faithful reproductions of real pages, those pages
use Inter, and substituting it would have made them worse references. It becomes a defect
the moment someone transposes it unthinkingly. **The corpus documents what these pages do;
it does not prescribe imitating them on this point.** Take the mechanism, not the typeface.

---

## Conventions inside `tokens-*.md`

| Marker | Meaning |
|---|---|
| `[relevé]` | value read in the source or measured on the render |
| `[arbitrage]` | judgment call by the rebuilder, justified on the line |
| `[estimé]` | reconstructed value — the source does not carry it explicitly |

These three markers stay in French on purpose: they appear identically in the comments of
`styles.css`, `index.html` and `motion*.js`. Translating them in one place only would
desynchronise the documentation from the code. Treat them as identifiers.

Everything else in these files is English.

---

## What this corpus does not give you

It does not give you **the idea, the subject, or the angle.** Nothing in these fifteen
folders tells you what a page should be about, what claim it should make, or what it should
refuse to say. Those come from the brief and from the thing being designed — never from
here, and never from an index row.

It does not tell you **which register suits a given brand** either. That judgment — a
driving school is not a developer tool, an artisan is not a SaaS — is upstream of
everything here, and no amount of reading these fifteen references will produce it — the
more so as all fifteen sit in the same sector. `parley` being light does not change that:
it widens the *visual* range on disk by one page and leaves the sector exactly where it
was.

What it does give is a **level**: how well an idea has to be executed before it holds up.
That is a floor to clear, not a set of solutions to choose from — and the difference
matters, because a floor leaves the whole space above it open to you.

Use them once the register is settled, to build well. Not to decide what to build.
