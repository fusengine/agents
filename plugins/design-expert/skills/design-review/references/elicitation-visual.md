---
name: elicitation-visual
description: Named visual elicitation techniques for self-critiquing a design deliverable before/during design-review's Part 2 visual loop
when-to-use: During design-review Part 2 (Bounded Visual Review), or whenever the elicitation skill's eLicit phase needs a named technique for a design/UI deliverable
keywords: elicitation, self-review, squint-test, subtraction-test, competitor-lineup, five-second-test, persona-lens
priority: high
related: ../SKILL.md, anti-ai-slop-audit.md, motion-verdict.md
---

# Visual Elicitation Techniques

Named techniques to cite when the APEX eLicit phase (see `fuse-ai-pilot:elicitation`)
runs against a design/UI deliverable. Apply against the light AND dark screenshots
already captured in `design-review` Part 2 — these are lenses on those screenshots, not
a separate capture step.

## 1. Squint Test

Blur or squint at the full-page screenshot (mentally, or by shrinking the image). What
survives at low detail is the hierarchy that actually reads. If the CTA, the headline, or
the signature element don't stand out at this resolution, the hierarchy is flat — fix
size/weight/contrast before anything else.

## 2. Subtraction Test

The same test named in `design-method` Step 3, applied here to the rendered screenshot
instead of the plan: cover or remove the declared signature element from the screenshot.
If the page still reads as distinctive without it, the signature didn't actually land in
the execution — flag it as a Major finding, not just a planning gap.

## 3. Competitor Line-up

Place the screenshot mentally (or literally, side by side) next to 2-3 screenshots from
the sector's inspiration browsing step (`design-web`/`design-webapp`). If the deliverable
is indistinguishable from the line-up at a glance, differentiation (brief Step 1,
question 4) failed — name specifically what makes it interchangeable.

## 4. 5-Second First Read

Look at the full-page screenshot for 5 seconds, then look away. What do you remember?
That's the actual message hierarchy a real visitor gets. If the answer isn't the Step 1
"Purpose," the layout is burying the point under decoration.

## 5. Persona Lens

Re-view the screenshot as the sector's actual target user (not as a designer) — e.g. a
time-pressed enterprise buyer, a price-sensitive shopper, a developer skimming for API
shape. Flag anything that reads as designer-pleasing but persona-irrelevant (decorative
motion, jargon-free-but-vague copy, buried pricing).

## Usage

Cite the technique by name in the eLicit report (e.g. "Squint Test: hero CTA doesn't
survive — increase weight/contrast"). At least one technique from this list satisfies the
elicitation skill's requirement for a named technique on design/UI deliverables.
