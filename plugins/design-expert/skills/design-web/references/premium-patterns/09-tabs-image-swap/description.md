---
name: Tabs Image Swap
device: Pill-in-pill tab bar crossfading a paired image and text
source: https://mivora-wbs.framer.website
seen-in: Eco
---

## Tabs Image Swap — one section, several stories, no extra height

> `source:` is provenance — where the device was measured. Not a site to browse
> for taste; `../../design-inspiration.md` owns that ban. Read the values here.

### The device

One section holds 3-5 parallel stories behind a tab bar. Selecting a tab
crossfades both halves of the pair — the image on one side and the heading plus
body on the other — at slightly different durations (0.5s image, 0.4s text), so
the swap reads as one movement rather than two.

The tab bar itself is the second half of the device: a pill-shaped container
holding pill-shaped tabs, with the active tab filled. The shape rhyme (pill
inside pill) is what stops it reading as a browser tab strip.

Where this earns its place: it replaces three stacked image+text splits with one
section — directly relieving the `../../layout-discipline.md` §3 zigzag cap
instead of fighting it.

### CSS (measured)

```css
.tabbar {
  display: inline-flex; gap: 4px; padding: 4px;
  background: oklch(0.95 0.01 145); border-radius: 999px;
}
.tab {
  border-radius: 999px; padding: 10px 22px;
  font-size: 0.875rem; font-weight: 500;
  background: transparent; color: oklch(0.4 0 0);
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}
.tab[aria-selected="true"] {
  background: oklch(0.55 0.19 145); color: oklch(0.99 0 0);
  box-shadow: 0 2px 8px oklch(0.55 0.19 145 / 0.3);
}

.panel { display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
         align-items: center; }
.panel__img  { aspect-ratio: 4 / 3; border-radius: 16px; object-fit: cover;
               transition: opacity 0.5s ease-in-out; }
.panel__text { transition: opacity 0.4s ease; }
.panel.is-swapping .panel__img,
.panel.is-swapping .panel__text { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .panel__img, .panel__text, .tab { transition: none; }
}
```

Responsive: below 768px the tab bar becomes `overflow-x: auto` with the pill
container intact, and the panel collapses to one column.

### Conditions of use

- 3 to 5 tabs. Two tabs is a toggle; six needs a different disclosure.
- Every tab needs its own real image and its own real copy. A tab whose panel
  repeats a sibling's image is the tell that the content did not justify tabs.
- The panel must be roughly the same height across tabs, or the page jumps on
  every switch. Set a `min-height` from the tallest panel.
- Accessibility is not optional: `role="tablist"` / `role="tab"` with
  `aria-selected` and `aria-controls`, `role="tabpanel"`, arrow-key navigation,
  and the panel focusable after a switch. A `<div>` with a click handler is not
  this device.
- Honour `prefers-reduced-motion` — the crossfade is decorative; the swap is not.
- Deep-linking: if a tab's content matters for SEO, the inactive panels must
  still be in the DOM.

### Anti-patterns

- Do not skip the crossfade — an instant swap reads as a page reload.
- Do not make the tabs rectangular; the pill inside a pill is the signature
  shape, and a square tab strip reads as a browser chrome.
- Do not let the active-tab colour be the only difference between states; keep
  the weight or shadow change too, for colour-blind readers.
- Do not use tabs to hide content the page needs read — hidden panels are
  skipped by most readers.
- Do not put a second tabbed section on the same page
  (`../../layout-discipline.md` §5).

### Optional section prompt (this section only)

Build ONE tabbed section. Tab bar: `inline-flex; gap: 4px; padding: 4px;
border-radius: 999px` on a tinted container; each tab `border-radius: 999px;
padding: 10px 22px; font-size: 0.875rem; weight: 500`, inactive transparent with
muted text, active filled with the accent, white text and
`box-shadow: 0 2px 8px accent/0.3`. Panel below: `grid-template-columns: 1fr 1fr;
gap: 48px; align-items: center` — image at 4:3, 16px radius, `object-fit: cover`,
`transition: opacity 0.5s ease-in-out`; text side `transition: opacity 0.4s ease`.
Crossfade both on switch. Full ARIA tablist semantics with arrow-key navigation,
a `min-height` from the tallest panel, and `prefers-reduced-motion` disabling the
transitions. 3-5 tabs, each with its own real image and copy. Nothing outside
this section.
