---
name: photos-images
description: Photo and image best practices for UI design
when-to-use: Adding images to UI, creating overlays, optimizing resolution
keywords: photos, images, sourcing, hotlinking, stock, unsplash, pexels, background, overlay, resolution, focal point, consistency
priority: medium
related: ../../design-system/references/gradients-guide.md, ui-visual-design.md
---

# Photos & Images Guide

## WHERE THE IMAGE COMES FROM (SOURCING)

**A page with zero `<img>` is a defect, not a style.** If the brief mentions
photographs — "shot by a pro", "our workshop", "the team" — the page must
contain photographs. Drawn matter (SVG) is never the answer to "we have photos".

### FIRST — does this visual DOCUMENT the client, or ILLUSTRATE?

Answer this **before** the hierarchy below: it decides whether the bank is open
to you at all.

**The test that settles it:**
> *If the caption or the surrounding page makes the reader believe this image is
> a piece of the client's, then it must actually be one.*

| | Meaning | Allowed sources |
|---|---|---|
| **DOCUMENTS** | The image *is* a piece of the client: their portfolio, their finished projects, their team, their premises, their vehicles, their products. | **a** or **c** only. **The bank is NOT a valid source**, however beautiful the photo. |
| **ILLUSTRATES** | The image claims nothing about the client: atmosphere, material, texture, trade context, a generic subject. | **a**, then **b** — the normal route. |

The real failure this prevents: a page headed **"COMPLETED AND PHOTOGRAPHED"**
sitting above a stock photo of somebody else's building. Technically an image,
factually a lie. Replacing "no image" with "a beautiful image that lies" is the
worse of the two defects — the honest empty slot at least reads as pending.

**When the visual documents and the client supplied nothing**: go straight to
**c** (placeholder at the final ratio, visibly marked), and **state it in the
delivery report** — name the shots you need from them, one line per slot
("3 photos of completed projects, landscape 3:2, min 1920px"). Do not silently
downgrade the copy to make a bank photo fit; the missing files are the client's
to provide.

### Source hierarchy — take the first one available

| # | Source | When |
|---|--------|------|
| **a** | **Client files** | Whenever the brief supplies any. They **always win**, even amateur quality. A real photo of the actual workshop beats a beautiful stock photo of *a* workshop. |
| **b** | **Free bank, direct URL in `src`** — **Unsplash by default** | The visual **illustrates** (see the test above) and the client supplies none. Search with `mcp__fuse-browser__browser_serp_batch` / `browser_fetch`, take the `images.unsplash.com/…` URL, put it in the `src`. No key needed. |
| **c** | **Explicit placeholder** | Either the visual **documents** and no client file exists, or a and b are both impossible. Same format and ratio as the final visual, **visibly marked as a placeholder**, and listed in the delivery report. Never a default for want of searching. |
| **d** | **Drawn matter (SVG)** | Legitimate on its own merits — but it does **not** replace an available photograph. It adds to one, or stands in only where no photograph exists (diagrams, abstract concepts, empty states). |

**RULE**: Never use low-res Google Images. Never `src` an image you have not
confirmed resolves.

### Banks — what was actually verified

Read on the official pages, july 2026. Anything not listed here was **not**
verified — do not invent a URL shape, a parameter, or a licence clause.

#### Unsplash — DEFAULT SOURCE, direct URL, no key

**This is the normal route.** Search Unsplash with `mcp__fuse-browser__*`, take
the `images.unsplash.com/…` URL, put it in the `src`. No key, no build step, no
download. Do this first; fall back to Pexels only if the subject is not there.

⚠️ **First run the DOCUMENTS/ILLUSTRATES test at the top of this section.**
Unsplash being this easy makes that test *more* important, not less: a beautiful
Unsplash photo under "our completed projects" is still the exact lie described
there. Easy access is not permission to misrepresent.

**Licence** — free, commercial and personal use, no permission and no credit
required. Verified on
`help.unsplash.com/en/articles/2612315-can-i-use-unsplash-images-for-personal-or-commercial-projects`:

> "The images on Unsplash are free to use and can be used for most commercial,
> personal projects, and for editorial use. You do not need to ask permission
> from or provide credit to the contributor or Unsplash, although it is
> appreciated when possible."

- **Attribution**: **not required**. Credit the photographer when the layout
  allows it — "appreciated when possible" is their own wording, and it costs one
  line. Never present it to the client as an obligation; it is not one.
- **Resizing in the URL**: these params are documented on
  `unsplash.com/documentation` and work on `images.unsplash.com` —
  `w`, `h`, `fit`, `crop`, `auto=format`, `q`, `dpr`, `fm`. Other imgix params
  exist but are explicitly unsupported and may be removed. Do not invent any.
- **Rights beyond copyright still apply** — recognisable people, private
  property, brands and logos in frame may need a release Unsplash does not
  provide (`help.unsplash.com/en/articles/2612329-releases-and-trademarks`).
  Weigh this on any commercial page showing faces or branded objects.
- **Operational risk, accepted**: a remote URL can be purged or throttled. That
  is why the `<img>` rules below are not optional. Confirm each URL resolves
  before reporting the page done.
- **Note — the guaranteed route, if ever needed**: with an API key
  (`api.unsplash.com`), Unsplash *requires* hotlinking, asks you to keep the
  `ixid` param on resized URLs, and mandates credit with
  `?utm_source=…&utm_medium=referral`. Fully documented end to end. Not the
  recommendation here; recorded in case the project ever wants that guarantee.
- **Never read**: `unsplash.com/license` itself returns HTTP 401 (Anubis
  anti-scraping) and could not be opened. Everything above comes from the Help
  Center and the API docs, which are reachable. Left here for whoever reads this
  next.

```html
<!-- normal route: URL taken straight from Unsplash, resized in the src -->
<img
  src="https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=1600&q=80"
  width="1600" height="900"
  alt="Sanded oak frame drying in the workshop, morning light" />

<!-- optional, not required by the licence — do it when the layout allows -->
<figcaption>Photo — <a href="https://unsplash.com/@anniespratt">Annie Spratt</a></figcaption>
```

#### Pexels — second choice, when Unsplash lacks the subject

Its licence is the most permissive of the two, and it was read in full — but
unlike Unsplash the direct-URL route has not been sanctioned here, so reach for
it only when Unsplash does not have the shot. Same DOCUMENTS/ILLUSTRATES test.

Verified on `pexels.com/license`, `pexels.com/terms-of-service` and
`pexels.com/api/documentation`:

- **Licence**: "All photos and videos on Pexels are free to use.
  **Attribution is not required.** … You can modify the photos and videos."
- **Forbidden** (verbatim): identifiable people shown in a bad or offensive
  light; selling unaltered copies; implying endorsement by people or brands;
  redistributing on other stock platforms; use as a trade-mark or business name.
  The ToS adds: no misleading use, no political context, and **you** are
  responsible for obtaining model/property releases — Pexels warrants none.
- **Key required**: yes for the API — `Authorization: YOUR_API_KEY` on
  `https://api.pexels.com/v1/…`, 200 req/h and 20 000 req/month by default.
- **Resizing in the URL**: the API returns ready-made sizes under `src.*`
  (`original`, `large2x`, `large`, `medium`, `small`, `portrait`, `landscape`,
  `tiny`) on `images.pexels.com`, carrying `auto=compress&cs=tinysrgb` plus
  `w`/`h`/`fit=crop`/`dpr`.
- **API guideline**: "Whenever you are doing an API request make sure to show a
  **prominent link to Pexels**" (e.g. "Photos provided by Pexels"), and credit
  the photographer when possible. This is an *API* obligation; the licence
  itself asks for nothing.
- **Not verified**: whether hotlinking `images.pexels.com` without the API is
  permitted. No official page addresses it.

```html
<!-- Pexels, a src.* URL returned by the API -->
<img
  src="https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=627"
  width="1200" height="627" alt="…" />
```

#### Lorem Picsum — placeholder only (source c), never a real subject

Verified on `picsum.photos`: size in the path (`/1600/900`), stable image via
`/seed/{seed}/…` or `/id/{id}/…`, `?grayscale`, `?blur=1..10`, `.jpg`/`.webp`
suffix, `?random=n` to defeat caching on repeated sizes. No key, no documented
rate limit.
**Not verified**: its licence terms — the images are sourced from Unsplash and
the site publishes no licence page. Use it as a **marked placeholder**, never as
the finished visual of a real client.

```html
<img src="https://picsum.photos/seed/atelier-01/1600/900.webp"
     width="1600" height="900" alt="Placeholder — replace with the client photo" />
```

#### Illustration banks (carried over, licence not re-verified)

| Source | Kind | Licence as previously stated |
|--------|------|------------------------------|
| **Undraw** | Illustrations | Free |
| **Storyset** | Illustrations | Free with attribution |

Both are **source d**, not a substitute for a photograph. Their terms were not
re-read for this section — check before shipping a client project.

## RESOLUTION REQUIREMENTS

### Minimum Resolutions
- **Hero images**: 1920x1080 or higher
- **Card images**: 800x600 or higher
- **Thumbnails**: 400x400 or higher
- **Avatars**: 256x256 or higher

### Responsive Images
```tsx
<Image
  src="/hero.jpg"
  width={1920}
  height={1080}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1920px"
  alt="Hero description"
/>
```

## SINGLE FOCAL POINT (CRITICAL)

### Choose Images That:
- Have ONE clear subject
- Guide user attention naturally
- Don't require searching the entire image

```tsx
// ✅ Clear focal point
<Image src="/product-focus.jpg" alt="MacBook on desk" />

// ❌ Busy, no focal point
<Image src="/cluttered-desk.jpg" alt="Various items on desk" />
```

## BACKGROUND IMAGES

### Problem: Text Readability
Text on photos varies in readability based on placement.

### Solutions

#### 1. Gradient Overlay
```tsx
<div className="relative">
  <Image src="/hero.jpg" className="object-cover" fill />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
  <div className="relative z-10 text-white">
    <h1>Headline</h1>
  </div>
</div>
```

#### 2. Color Overlay
```tsx
<div className="relative">
  <Image src="/hero.jpg" className="object-cover" fill />
  <div className="absolute inset-0 bg-primary/60" />
  <div className="relative z-10 text-white">
    <h1>Headline</h1>
  </div>
</div>
```

#### 3. Scrim/Vignette
```tsx
<div className="relative">
  <Image src="/hero.jpg" className="object-cover" fill />
  <div className="absolute inset-0 bg-black/40" />
  <div className="relative z-10 text-white">
    <h1>Headline</h1>
  </div>
</div>
```

#### 4. Blur Background
```tsx
<div className="relative">
  <Image src="/hero.jpg" className="object-cover blur-sm" fill />
  <div className="relative z-10 backdrop-blur-md bg-white/10 p-6 rounded-xl">
    <h1>Headline</h1>
  </div>
</div>
```

## VISUAL CONSISTENCY

### Apply Unified Treatment
All images in a section should share:
- Similar color temperature
- Consistent lighting
- Same aspect ratio

```tsx
// Color overlay for consistency
<div className="grid grid-cols-3 gap-4">
  {images.map(img => (
    <div key={img.id} className="relative aspect-square">
      <Image src={img.src} fill className="object-cover" />
      <div className="absolute inset-0 bg-primary/20" /> {/* Unifying overlay */}
    </div>
  ))}
</div>
```

## ASPECT RATIOS

| Ratio | Use Case | Tailwind |
|-------|----------|----------|
| 1:1 | Avatars, thumbnails | `aspect-square` |
| 16:9 | Video, hero | `aspect-video` |
| 4:3 | Product images | `aspect-[4/3]` |
| 3:2 | Photography | `aspect-[3/2]` |
| 21:9 | Cinematic hero | `aspect-[21/9]` |

```tsx
<div className="aspect-video overflow-hidden rounded-lg">
  <Image src="/video-thumb.jpg" fill className="object-cover" />
</div>
```

## CHOOSING THE PHOTO (POSITIVE CRITERIA)

A list of bans tells you what to reject; it never tells you what to pick — and
an agent with only bans rationally picks nothing. These are the criteria that
make a photo hold up in a good page. Each one is the positive face of a ban
stated elsewhere in this file.

### 1. The subject comes from the client's trade, not from an abstraction

Search the **thing**, not the feeling: `pottery workshop wheel clay hands`, not
`teamwork success`. A real object, place, gesture or material from the business.
→ positive face of *"Obvious stock photo poses"* and *"Doesn't match context"*.

```
✅ "concrete formwork construction site" for an architecture studio
❌ "professional handshake office" for an architecture studio
```

### 2. Light and palette must be able to live with the tokens

Before accepting a photo, name its dominant hue and its light. Then check it
against the page tokens: a cold blue-grey photo in a warm ochre page fights the
system. Either the photo already agrees, or you unify it deliberately (see
*VISUAL CONSISTENCY* — one shared overlay, one shared treatment).
→ positive face of *"Inconsistent image treatments"*.

### 3. One large photo beats five thumbnails

If you have one good image, give it the width and the height it deserves.
A grid of small crops reads as filler; a single full-bleed frame reads as
intent. Multiply only when the set itself is the content (a portfolio, a
product range) — and then all of them share ratio and treatment.
→ positive face of *"Too busy/cluttered"* and of *SINGLE FOCAL POINT*.

### 4. The framing must survive the responsive crop you planned

Pick the ratio first (see *ASPECT RATIOS*), then check the subject still reads
once `object-cover` crops it — a 21:9 hero on desktop becomes near-square on
mobile. Leave air around the subject on the axis that will be cut, and set
`object-position` where the subject actually sits rather than accepting `center`.
→ positive face of *"Text on busy background without overlay"* and of the
minimum-resolution rule (crop eats pixels; source above the target size).

### 5. It must survive the "would a photographer have shot this?" test

Someone chose that frame for a reason you can state in one sentence. If you
cannot say what the photo is *of* and why it is here, it is decoration — cut it
or replace it.

## BAD PHOTOS (AVOID)

### Red Flags
- Low resolution (pixelated)
- Doesn't match context
- Too busy/cluttered
- Obvious stock photo poses
- Watermarks

### Example
```tsx
// ❌ Wrong context - Street photo for travel landing
// Even if technically fine, doesn't match "explore Paris" theme

// ✅ Right context - Iconic landmark for travel
<Image src="/eiffel-tower.jpg" alt="Eiffel Tower" />
```

## IMAGE EFFECTS

### Rounded Corners
```tsx
<Image className="rounded-lg" />      // 8px
<Image className="rounded-xl" />      // 12px
<Image className="rounded-2xl" />     // 16px
<Image className="rounded-full" />    // Circle
```

### Shadow
```tsx
<Image className="shadow-md rounded-lg" />
<Image className="shadow-xl rounded-xl" />
```

### Border
```tsx
<Image className="border border-border rounded-lg" />
<Image className="ring-4 ring-primary/20 rounded-full" />
```

## OPTIMIZATION

### Next.js Image
```tsx
import Image from 'next/image';

<Image
  src="/photo.jpg"
  width={800}
  height={600}
  quality={85}
  placeholder="blur"
  blurDataURL={blurDataUrl}
  loading="lazy"
  alt="Description"
/>
```

### Size Recommendations
- Compress before upload
- Use WebP/AVIF formats
- Provide multiple sizes (srcSet)
- Lazy load below-fold images

## EVERY `<img>` — LOCAL OR REMOTE

**These four apply to every image tag you write, whatever the source** — a
client file served from `/images/`, a bank URL, a placeholder. Nothing here
depends on the image being remote.

- **Explicit `width` and `height`** (or an `aspect-*` wrapper). Without them the
  layout reflows when the image lands. Not optional, local files included.
- **`alt`**: a real sentence describing what is in the frame — never the file
  name, never the section title. `alt=""` only for genuinely decorative matter.
  (See *ACCESSIBILITY* for the full checklist.)
- **`loading` / `decoding` by position**: the hero image, above the fold, gets
  `loading="eager" fetchpriority="high"` — lazy-loading it delays LCP.
  Everything below the fold gets `loading="lazy" decoding="async"`.
- **If it fails to load**: the block must keep its space and stay readable.
  Give the container a token background and, on a text-over-image block, keep
  the text legible against that background alone — never rely on the photo's
  own darkness for contrast.

### What a REMOTE url adds on top

A hotlinked image lives on someone else's CDN. It can be purged, rate-limited,
or simply slow. That is the accepted trade — the page must degrade, not break.
Everything above still applies; the fallback background stops mattering
"in theory" and starts mattering in practice.

```html
<!-- hero: eager, prioritized, sized, background survives a failed load -->
<figure class="hero" style="background: var(--surface-2); aspect-ratio: 16/9">
  <img src="https://images.unsplash.com/photo-…?auto=format&fit=crop&w=1920&q=80"
       width="1920" height="1080"
       loading="eager" fetchpriority="high" decoding="async"
       alt="Sanded oak frame drying in the workshop, morning light" />
</figure>

<!-- below the fold -->
<img src="…" width="800" height="600" loading="lazy" decoding="async" alt="…" />
```

**Before reporting the page done**: confirm each remote URL actually returns an
image (`mcp__fuse-browser__browser_fetch` on the URL, or a screenshot of the
rendered page). A `src` that 404s is worse than no image at all.

## ILLUSTRATIONS VS PHOTOS

| Use Photos | Use Illustrations |
|------------|-------------------|
| Real products | Abstract concepts |
| Team members | Onboarding flows |
| Locations | Empty states |
| Testimonials | Features explanation |

```tsx
// Empty state with illustration
<div className="text-center py-12">
  <Image src="/illustrations/no-data.svg" width={200} height={200} />
  <h3 className="mt-4 font-semibold">No items yet</h3>
  <p className="text-muted-foreground">Create your first item</p>
</div>
```

## 3D ILLUSTRATIONS (2026 TREND)

Isometric 3D illustrations add modern visual appeal:
- Use sparingly (hero sections, landing pages)
- Animate for extra impact
- Match color palette to design system

## FORBIDDEN PATTERNS

- Low-resolution images
- Obvious stock photos (forced smiles, pointing)
- Text on busy background without overlay
- Inconsistent image treatments
- Missing alt text
- Non-optimized large files
- A bank photo placed where the page claims it is the client's own (portfolio,
  team, premises, vehicles, products) — see the DOCUMENTS/ILLUSTRATES test
- Drawn matter (SVG) substituted for a photograph that was available
- A page claiming photographs in its copy and containing no `<img>`
- `<img>` without explicit `width`/`height` on a remote URL

## ACCESSIBILITY

- [ ] All images have descriptive alt text
- [ ] Decorative images have `alt=""`
- [ ] Text over images has sufficient contrast
- [ ] Images don't convey info without text alternative
