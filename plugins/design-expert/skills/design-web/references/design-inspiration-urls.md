---
name: design-inspiration-urls
description: "Use when sourcing taste for a page or screen. Look in `refs-design/` first (eleven references — ten hand-rebuilt pages plus one original, each procedure documented with measured values), then real production sites in the client's sector. Do NOT use for structure — that comes from register + macrostructure-bank."
related: design-inspiration.md, ../../design-method/references/moves/generate.md
---

## Read First

Taste is extracted, never cloned. Palette, typography, depth, craft technique:
yes. Section flow, spacing rhythm, skeleton: never — structure comes from
`design-method/references/register/brand.md` (or `product.md`) plus
`design-method/references/macrostructure-bank.md`.

That rule has not changed. What changed is **where you look**.

## Primary source — the local corpus

```
./refs-design/README.md          (next to this file, inside the skill)
```

Eleven references. Ten are public pages rebuilt by hand from their live source
and accepted by the owner; one (`elysian/`) is an original build in a completely
different register. Each folder carries two files: `tokens-<name>.md` for how the
page is made (procedures, measured values, traps) and `design-system.md` for what
it decided and why (register, tone, signature element, section sequence). Roughly
7 800 lines of tokens and 33 indexed procedures across the corpus.

**Open `README.md` first.** It holds the procedure index: which technique lives
in which reference, and in which section of its `tokens-*.md`.

Why this beats a template gallery, concretely:

| A screenshot gives you | `tokens-*.md` gives you |
|---|---|
| what it looks like | the mechanism, with its measured values |
| a result | the trap that breaks it elsewhere |
| one viewport | what the author deliberately did not reproduce |

Example: a capture of a scroll-collapsing nav shows a pill. `tokens-fora.md`
§ 5 quinquies gives the scrim, the blur radius, the two distinct top offsets
for resting and scrolled state, and why the pill needs more clearance than the
bare bar.

The corpus is frozen and measured — that is the whole advantage over a browsed
site, which changes under you and gives you pixels only. It is **not** offline:
ten of the eleven load images or video from the network and nine load their
typefaces too, only `elysian/` is self-contained, and two pages (`harness`,
`reve`) fetch their woff2 from a third-party CDN that can purge it. Offline the
renders degrade — fallback fonts, `alt` text
in place of images — but the measured values stay readable in the markdown, which
is what you came for. `README.md` has the per-folder count.

## Second source — real sites in the client's actual sector

The corpus carries two registers: dark tech product (ten of them) and
neoclassical print (`elysian`). It will not hand you the register for a driving
school, a law practice, a bakery. **That comes from the subject**, and the
fastest way to see how a sector actually presents itself is to look at real
companies in it — not at templates built to be interchangeable.

Use `mcp__fuse-browser__browser_serp_batch` on the project's real vertical, then
browse 1–2 actual production sites. Award galleries (`awwwards.com/websites/`,
`godly.website`, `bestwebsite.gallery`) are useful for one thing only: they link
out to real production sites. Follow those links; do not extract from the
gallery page itself.

## What was removed, and why

This file used to list roughly a hundred Framer and Webflow template slugs.
They are gone. Its own text carried the diagnosis:

> Every generated page pulling from the same ~100 templates is the root cause
> of the generic-body problem this file used to encode.

Marketing templates are built to be interchangeable — that is their product
requirement. Extracting taste from them converges every output toward the same
body. The corpus replaces them because it offers the opposite: idiosyncratic,
production-grade pages whose craft is documented rather than guessed.

## Citing sources

Whatever was actually used — corpus references and browsed sites alike — goes in
the `design-system.md` "Design Reference" block. `elysian/design-system.md` shows
the form: sources listed, and one line on what the palette was sampled from.
