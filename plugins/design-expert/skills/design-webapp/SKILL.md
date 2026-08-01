---
name: design-webapp
description: "Use when building or extending a dashboard, SaaS screen, or any authenticated app surface — use design-web instead for a marketing site."
when-to-use: "Building or extending a dashboard, SaaS product screen, or any authenticated app surface (not a marketing site — see design-web for that)."
keywords: webapp, dashboard, density, states, data-table, dataviz, auth, settings, onboarding, corpus, je-reproduis
priority: critical
related: design-method, design-system, design-web, design-motion, design-review
---

<objective>
Builds logged-in web apps under register `product` — dashboards, auth flows, settings, onboarding, data tables, command palettes, modals, toasts. Optimizes for density and glance-speed over marketing polish: no hero, no scroll-reveal, no CTA-tricks.

Requires every data surface to explicitly cover empty, loading, and error states (never a silent blank default), and applies preattentive-processing rules to tables and dataviz (right-aligned numbers, sticky headers, bar/line over pie, consistent category-to-color mapping).

Reuses `design-web`'s general component guides (buttons, cards, grids, icons) rather than duplicating them — this skill only adds what's specific to apps.

Sources craft from the local corpus's two application interfaces (`reve`, `linear`) — no sector browsing — and declares the three reproduced elements (`Je reproduis`) that `design-review` verdicts.
</objective>

## Design Webapp — Dashboards, Density, States

### When
After `design-system` tokens exist and `design-method`'s Gate 0 has locked register
`product` (dense, predictable, motion stays discreet). Read `design-method`'s routing
table first — if the surface is a marketing/landing page instead, use `design-web`.

### Input
- `design-system.md` — OKLCH palette, typography, spacing density, the 3 dials.
- `design-method/references/register/product.md` — the Domain-Specificity Floor and the
  Product Furniture table (generic KPI ribbon, marketing triad reused in-app, cookie-cutter
  empty state, undifferentiated settings list, generic nav vocabulary).
- The corpus's two application interfaces, both under
  `../design-web/references/refs-design/` — `reve-recode/` (`tokens-reve.md` §3 surface
  hierarchy, §4 application UI patterns) and `linear-recode/` (`tokens-linear.md` §6
  masking/light, §7 button architecture), plus each folder's `design-system.md`. Loaded
  once per task (step 11).
- The specific page/pattern being built (dashboard, auth, settings, data table, etc.).

### Steps

1. **Register `product` ≠ marketing register.** No hero, no scroll-reveal, no CTA-tricks —
   this register optimizes for glance-speed, not first impression. Density is a feature:
   Enterprise Dense / Standard spacing profile (`design-system/references/spacing-density.md`),
   `MOTION_INTENSITY ≤ 4` by default (`design-motion/references/motion-performance.md`).
   The Focal-Block Floor and Signature Dominance from `design-web` do not apply here
   (`register/product.md` §4) — several equal-weight blocks in one viewport is correct, not
   a defect.

2. **Pick the page pattern** from `references/layouts/pages/` — dashboard, auth-login,
   auth-register, onboarding, profile, settings, error-pages. Each is a starting structure,
   not a template to copy verbatim — adapt density from `design-system.md`, and run the
   Domain-Specificity Floor test on it: would this page's copy/icons/grouping look native
   dropped unedited into an unrelated product in the same category? If yes, it's furniture
   — name the product's real entities instead (`register/product.md` §2-3).

   **This is where app structure comes from — not from the page-structure banks.** Page
   structure in this plugin now comes from a *matched pair* of files, and both are marketing
   instruments: a hero treatment from
   `../design-method/references/macrostructure-bank.md` (eight treatments of the first
   screen) **and** a body sequence from `../design-method/references/body-sequence-bank.md`
   (fifteen sequences read off shipped code). Naming one without the other is an incomplete
   plan — *there*.

   Neither applies to an app surface, and this is a real difference, not a shortcut: an app
   has no first screen to compose and no scroll narrative to order. It has a persistent
   shell, a task, and the data that task needs; the reader arrives mid-session with an
   intent, not at a pitch. So the banks are **not** consulted here, and a webapp plan that
   names a hero treatment or a body sequence has mis-routed. There is exactly one case where
   both picks are still required — a marketing-adjacent page inside the app shell — and that
   page routes to `design-web` anyway (step 11).

   What *does* transpose from the banks is their underlying rule, which holds in every
   register: a structure is chosen for the principle it serves on this subject, never
   adopted because it is the common shape. The `product` equivalent of "don't reach the
   canon by omission" is the Domain-Specificity Floor above — reaching a settings page's
   shape by omission is the same defect wearing different clothes.

3. **Pick the interaction pattern(s)** from `references/layouts/patterns/` — data-table,
   command-palette, modal-dialog, toast-notifications, empty-state. Apps lean on these far
   more than marketing sites do.

4. **Cover every state explicitly — empty, loading, error, populated.** Never a blank or
   silent default:
   - **Loading** — skeleton rows/cards, never spinner-only (`layouts/patterns/data-table.md`
     — NNG: skeletons perceived 9-12% faster than spinners).
   - **Empty** — name the actual object type and the actual first action ("No invoices yet
     — create one from a quote" beats "No data yet", `register/product.md` §3 Cookie-cutter
     empty state).
   - **Error** — actionable message + retry affordance, never a raw stack trace or generic
     "Something went wrong."
   - For data tables specifically, this extends to sorting/filtering/pagination states.

5. **Tables (hard rules, `layouts/patterns/data-table.md`):** first column is a readable
   identifier (not a raw ID/UUID), numeric columns right-aligned, header sticky on scroll,
   wrap content rather than truncate where legibility matters, density is a first-class
   mode (standard 48dp row / dense 36dp row — Material 3 baseline), mobile falls back to
   horizontal scroll with a sticky first column. Corpus procedure for the dense case:
   `linear/tokens-linear.md` §5.9 — a row height that **cannot grow**, with `nowrap` +
   `text-overflow: ellipsis`, is the condition for a dense list to stay readable at a glance
   (step 11). Where legibility beats density, the wrap rule above wins over it.

6. **Dataviz:** prefer bar/line charts over pie — preattentive processing reads
   magnitude/trend faster than angle/area. Color encodes data, never decorates; keep
   category → color mapping consistent across every chart on the same surface
   (`layouts/pages/dashboard.md` — F-pattern placement for the North Star metric still
   applies).

7. **Forms: one column, label above the field, inline validation** — reuse
   `../design-web/references/forms-guide.md` rather than duplicating form rules here; this
   skill only adds the product-register defaults (single column over multi-column, no
   marketing-style floating labels).

8. **Command palette (if present):** keyboard shortcuts are optional and revealed only
   after the user has triggered the action manually at least once — never taught upfront
   as a required interaction (`layouts/patterns/command-palette.md`).

9. **Apply the responsive shell** from `references/responsive-dashboard.md` — sidebar
   behavior across breakpoints (full at desktop, icon-rail at tablet, hamburger at mobile).

10. **Reuse general component guides from `design-web`** (buttons, cards, grids, icons)
    rather than duplicating them — this skill only adds what's specific to apps: density,
    data-heavy states, and persistent navigation.

11. **No sector browsing — but the corpus is opened, looked at, then read.** Apps are
    function-first: skip the fuse-browser step, don't go look at sector sites, and never
    pull taste from a template platform (banned plugin-wide,
    `../design-web/references/design-inspiration.md`). But skipping the browse is not
    skipping the source of taste. The corpus is local and two of its entries are
    application interfaces.

    **Open `../design-web/references/refs-design/reve-recode/index.html` in a browser and
    scroll it before you read a line of the token file below.** Double-click, `file://`, no
    server. The surface
    hierarchy described in §3 is a thing you can see in about four seconds and cannot
    reconstruct from a list of hex values — white panels separating from a `neutral-50`
    ground by a 4% border plus a very low shadow is a *look*, and the numbers only let you
    reproduce it once you know what it is. `../design-web/references/refs-design/linear-recode/index.html`
    is the second application surface worth opening; it draws six product windows in markup.

    Then read. This is the only place depth, surface hierarchy and real UI procedures come
    from here; without it this skill has no source of taste at all, which is worse than
    browsing. Paths below are relative to `../design-web/references/`.

    **`refs-design/reve-recode/tokens-reve.md` — an app token system, read whole.**
    - **§3 Surface hierarchy** — the page ground is `neutral-50`, *not* white; white is
      reserved for panels laid on top, and that is where separation comes from, not from a
      shadow. Roles are named and distinct: page / panel / well (field background, image
      reserve) / canvas / panel border / field border / modal scrim. The resting card is a
      border at 4% black **plus** a very low shadow — the border separates white from white,
      the shadow gives altitude, and neither alone is enough. Elevations are role-based
      (control / panel / upward / resting / selection), not a t-shirt scale. Selection
      signals through a **surface change**, never an accent border.
    - **§4 Application UI patterns** — the field carries **no border**: it signals through a
      `neutral-100` background on the white panel, full radius, 40px tall, and its focus ring
      is **neutral** (`color-mix` 24% of the text colour, offset 1px) because the accent stays
      reserved for general keyboard navigation. One focus token for the whole app, with an
      explicit exclusion list for components managing their own ring. The list row is two
      levels, never three (name on one line with an ellipsis, description in reduced
      secondary). The status label is a fixed frame that **never takes the accent** — it
      stays muted so it cannot compete with the name. Keyboard shortcuts use `kbd:has(> kbd)`
      — semantic markup, no class. Scrollbars are themed globally at 4px with
      `scrollbar-gutter: stable`, which removes the 15px layout jump when a dialog locks
      scrolling. The `<button>` reset inherits *everything* from surrounding text before
      redeclaring, and the primary inverts text and background so it follows the theme with
      no second token set.

    **`refs-design/linear-recode/tokens-linear.md` — a dense product surface.**
    - **§6 Masking and light** — edges are never cut, they **dissolve**: `mask-image` from
      opaque to transparent on anything leaving its frame, driven by a set of *named* mask
      tokens rather than literal colours. The hairline that follows the pointer is a solid
      1px border masked by a radial gradient centred on the cursor, with JS writing only
      `--x`/`--y` — **no layout property is touched**. Large halos ship as a pre-blurred SVG
      data-URI so the blur costs nothing during scroll (with the documented trap: a data-URI
      colour escapes the token system and must be neutralised per theme).
    - **§7 Button architecture** — a single class carries **all** the geometry; size and
      variant only reassign variables, never a metric. Five sizes (24/32/40/40/44px) with
      `line-height` equal to button height, and the secondary variant built from four
      `box-shadow`s instead of a `border`.
    - Also directly applicable to app surfaces: **§5.9** fixed 44px row height with
      `nowrap` + `text-overflow: ellipsis` — the row *cannot* grow, which is the condition
      for a dense list to stay readable at a glance; **§5.10** a `--min-tap-size: 44px` token
      sizing the target independently of the text; **§2.5** depth by *stacking* five shadows
      at 1–8% (none visible alone) rather than one shadow at 20%.

    **Each folder's `design-system.md`** holds the same systems as shipped tokens — reve's
    two ramps, one opaque for surfaces and one **alpha ramp for text** (so type sits on any
    surface without needing a matching grey), linear's four parallel four-step ramps
    (background/text/border/line) where a component picks one level per ramp and never a free
    value, its five-shadow stack, and its split density profile (dense inside the data
    surfaces, generous between them).

    Cite what you took in the `Je reproduis` line below — a procedure and the section it was
    read from, never an impression. Borrow the mechanism, not the hex value. A
    marketing-adjacent surface inside the app (e.g. an in-app pricing page) routes to
    `design-web` for that one page.

12. **Generate directly as HTML/CSS** (default), or optionally via Gemini Design MCP
    (`../design-web/references/gemini/`) — same brief content either way.

### Declared Elements — the `Je reproduis` line
Before handoff, write this line into the deliverable's report and into `design-system.md`,
verbatim in this format — identical to `../design-web/SKILL.md`'s, because `design-review`
parses the same string (`../design-review/SKILL.md` Input,
`../design-review/references/review-procedure.md` Input + Part 2 item 4):

```
Je reproduis: {el1} [corpus: {reference}/{tokens section}], {el2} [corpus: {reference}/{tokens section}], {el3} [sector: {url} — register]
```

Exactly three elements, each nameable in the rendered screen — the verdict is binary, so
"a clean, dense feel" is not an element while "fields carry no border and signal through a
`neutral-100` background on the white panel" is. Register `product` changes **what gets
declared**, never the format — the prefix and the three comma-separated slots are parsed,
so they stay byte-identical to `design-web`'s.

- **The two corpus elements are UI procedures**, taken from the application references read
  in step 11 and cited with the `tokens-*.md` section they were read from. Worked examples:
  - `{surfaces separate by ground-vs-panel, resting card = 4% border + very low shadow}
    [corpus: reve/tokens-reve.md §3]`
  - `{borderless fields on a neutral-100 well, neutral focus ring, accent reserved for
    keyboard nav} [corpus: reve/tokens-reve.md §4]`
  - `{every dense surface dissolves at its edge through mask-image, never a cut}
    [corpus: linear/tokens-linear.md §6]`
  - `{one button class, size and variant reassigning variables only, never a metric}
    [corpus: linear/tokens-linear.md §7]`
  - `{44px rows that cannot grow, nowrap + ellipsis} [corpus: linear/tokens-linear.md §5.9]`

  Borrow the **mechanism**, not the hex value — a colour lifted without the procedure that
  makes it work is not a reproduced element and will verdict `[absent]`.
- **The third is a register signal, and for an app that signal is the domain**: the
  product's real entities, actions and vocabulary (`register/product.md` §2-3, the
  Domain-Specificity Floor) — never a craft borrowing, craft is the corpus's job. Because
  this skill does not browse, the normal value of slot three is
  `[sector: none — register from brief]`, which is an explicitly valid tag and not an empty
  slot (`../design-review/references/review-procedure.md` Input). Use a real
  `[sector: {url} — register]` only when the brief itself named a product to match on
  register — never go find one to fill the slot.

### Output Gate — the Lookalike Test does not apply here
It is a `brand`-register gate. Its definition stays canonical in
`../design-web/references/design-inspiration.md` and is not restated, renumbered or
re-parameterised here — and no silhouette count is repeated.

Stated plainly rather than mentioned for form: **an app screen is supposed to share a
silhouette with other app screens.** A settings page that reads as a settings page is
correct, a data table that reads as a data table is correct, and Jakob's Law makes
silhouette novelty a cost here rather than a win — the opposite of the `brand` register,
where the page *is* the product and looking like the competition is the defect. Running a
distinguishability test on a dashboard would push toward exactly the unfamiliarity this
register must avoid.

The structural gate `product` runs instead is the **Domain-Specificity Floor** (step 2):
could this screen's copy, icons and grouping drop unedited into an unrelated product in the
same category? That — not silhouette sameness — is the failure this register actually has,
and it is what `design-review` should be handed in place of a lookalike verdict.

### Failure Handling
- Gemini Design MCP (if chosen) unavailable → fall back to direct generation.
- A referenced page pattern doesn't fit the request → adapt the closest one rather than
  inventing an unstructured layout; note the deviation in the output report.
- A data surface has no obvious empty/error copy yet → block on that, don't ship a silent
  blank state; ask the owner for the real object name/action if it isn't in the brief.
- A corpus procedure doesn't fit this surface → take a different one from the same sheets,
  never fall back to "no corpus element": two corpus slots are mandatory, and a line short
  of them is a blocking finding at `design-review`, not a soft warning.

### Output
- HTML/CSS for the app surface, with every interaction state covered (step 4) and table/
  dataviz hard rules applied (steps 5-6).
- The `Je reproduis` line written, three elements, two `[corpus: …]` and one `[sector: …]`.
- Responsive shell verified across the size classes in `responsive-dashboard.md`.
- Ready for `design-motion`.

### Next → `design-motion`, then `design-review`.

### References
| File | Purpose |
|------|---------|
| `references/responsive-dashboard.md` | Sidebar + content responsive pattern |
| `references/layouts/pages/dashboard.md` | Dashboard page structure, F-pattern KPI placement |
| `references/layouts/pages/auth-login.md` | Login page structure |
| `references/layouts/pages/auth-register.md` | Registration page structure |
| `references/layouts/pages/onboarding.md` | Onboarding flow structure |
| `references/layouts/pages/profile.md` | Profile page structure |
| `references/layouts/pages/settings.md` | Settings page structure |
| `references/layouts/pages/error-pages.md` | 404/500/error page structure |
| `references/layouts/patterns/data-table.md` | Sortable/filterable table pattern, density tokens |
| `references/layouts/patterns/command-palette.md` | Cmd-K palette pattern |
| `references/layouts/patterns/modal-dialog.md` | Modal/dialog pattern |
| `references/layouts/patterns/toast-notifications.md` | Toast/notification pattern |
| `references/layouts/patterns/empty-state.md` | Empty-state pattern |
| `../design-method/references/register/product.md` | Domain-Specificity Floor, Product Furniture table |

### Shared with design-web (load from there, don't duplicate)
| File | Purpose |
|------|---------|
| `../design-web/references/buttons-guide.md` | Button states, sizing |
| `../design-web/references/forms-guide.md` | Validation, layout |
| `../design-web/references/cards-guide.md` | Card patterns |
| `../design-web/references/grids-layout.md` | Layout/grid system |
| `../design-web/references/icons-guide.md` | Icon usage |
| `../design-web/references/gemini/` | Optional Gemini Design MCP path |
| `../design-web/references/refs-design/reve-recode/tokens-reve.md` | App surface hierarchy (§3), application UI patterns (§4) — corpus source, step 11 |
| `../design-web/references/refs-design/linear-recode/tokens-linear.md` | Masking/light techniques (§6), button architecture (§7) — corpus source, step 11 |
| `../design-web/references/refs-design/README.md` | Corpus index — technique → reference → section |
| `../design-web/references/design-inspiration.md` | Canonical taste-sourcing order, template-platform ban, canonical Lookalike Test (`brand` only) |
