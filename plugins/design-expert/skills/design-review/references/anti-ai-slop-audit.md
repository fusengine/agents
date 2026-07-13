---
name: anti-ai-slop-audit
description: Detection flags for generic AI-generated design patterns that lack uniqueness
when-to-use: Auditing designs for generic AI-generated patterns, ensuring brand uniqueness
keywords: ai-slop, generic, detection, audit, fonts, colors, gradient, default, unique
priority: high
related: audit-checklist.md, consistency-checks.md, elicitation-visual.md
---

# Anti-AI-Slop Audit

## What is AI Slop?

AI slop is the statistical convergence toward the same defaults every generator reaches
for absent a deliberate constraint — same palette family, same macrostructure, same
component silhouettes. It reads as "generated with zero customization," regardless of
stack (this audit runs against the generated HTML/CSS, not a specific framework).

## Canonical Sources (referenced, not restated)

- The 3 default-look clusters (cream+serif+terracotta / near-black+acid-accent /
  broadsheet-hairlines) and their evolutions (glassmorphism+`rounded-2xl` everywhere,
  generic round-icon bento) — `design-method` SKILL.md, "Anti-Slop" section.
- Forbidden fonts list — `design-system` SKILL.md, "Forbidden Fonts" section.
- Contrast thresholds (4.5:1 text / 3:1 UI) — `design-system/references/contrast-ratios.md`.

## Deterministic Blacklist (grep the generated HTML/CSS)

Each entry: pattern → detection → imposed alternative. Run on the actual output, not a
specific framework's source tree — the pipeline defaults to vanilla HTML/CSS + OKLCH.

| # | Pattern | Detection | Imposed alternative |
|---|---------|-----------|----------------------|
| 1 | Forbidden font, undeclared | `grep -ri "font-family" *.html *.css` against the `design-system` forbidden list | Approved pair from `design-system/references/typography-pairs.md` |
| 2 | Purple/indigo gradient tell | `grep -riE "linear-gradient" *.css \| grep -iE "#6366f1\|#8b5cf6\|#a855f7\|oklch\([^)]*2[7-9][0-9]|oklch\([^)]*30[0-9]"` (hue ~270-300°) | Sector OKLCH palette from `design-system`, chroma > 0.05, non-purple hue |
| 3 | Uniform low-alpha shadow | `grep -o "box-shadow:[^;]*" *.css \| grep -oE "0\.0[0-9]\|0\.1[0-2]"` on every card/button, no variation | Elevation scale with varied alpha/blur per depth level |
| 4 | Identical corner-radius everywhere | `grep -o "border-radius:[^;]*" *.css \| sort -u` returns exactly 1 value across all component types | One radius scale (e.g. sm/md/lg), applied by component role, not a single flat value |
| 5 | Hero-centered + 3-icon-cards macrostructure | Visual inspection: centered `h1` + subtitle + 2 buttons, immediately followed by a 3-column icon-card grid | Pick a non-default macrostructure per `design-method` "Macrostructure Variety" |
| 6 | Eyebrow/badge above every `h2` | Count uppercase-tracking labels immediately preceding section headlines; compare to `design-review/references/pre-flight-checklist.md` cap | Drop the eyebrow on repeat sections; headline alone is enough |
| 7 | Colored left-border cards | `grep -o "border-left:[^;]*" *.css` present on every card in a grid | Depth/hierarchy via elevation, size, or fill — not a uniform accent stripe |
| 8 | "Steps 1-2-3" numbered list pattern | Visual inspection: 3 items each with a large numeral badge, identical card shell | Asymmetric process treatment (timeline, connected path, varied card sizes) |

## Prevention

1. Run `design-method` Step 1 (brief) + Step 2 (signature element) BEFORE any generation —
   not a separate "identity" skill, `design-method` is the single entry point.
2. Generate `design-system.md` with unique OKLCH tokens (`design-system` skill).
3. Gemini Design MCP, Magic, and shadcn MCP are optional tools of convenience — never a
   requirement, and never a substitute for the brief/signature-element discipline above.
4. Run this audit as part of `design-review` Part 1, after every major feature addition.

## Scoring

| Score | Meaning |
|-------|---------|
| 0 flags | Unique, intentional design |
| 1-2 flags | Minor customization gaps |
| 3-4 flags | Significant AI slop indicators |
| 5+ flags | Heavy AI slop — return to `design-method` Step 1-2 before continuing |

## Audit Report Format

```markdown
## Anti-AI-Slop Audit Results

### Score: X/8 flags detected

| # | Pattern | Status | Details |
|---|---------|--------|---------|
| 1 | Forbidden font | PASS/FAIL | [findings] |
| 2 | Purple/indigo gradient | PASS/FAIL | [findings] |
| 3 | Uniform low-alpha shadow | PASS/FAIL | [findings] |
| 4 | Identical corner-radius | PASS/FAIL | [findings] |
| 5 | Hero+3-cards macrostructure | PASS/FAIL | [findings] |
| 6 | Eyebrow over every H2 | PASS/FAIL | [findings] |
| 7 | Colored left-border cards | PASS/FAIL | [findings] |
| 8 | Steps 1-2-3 pattern | PASS/FAIL | [findings] |

### Recommendations
1. [Highest priority fix]
2. [Second priority fix]
3. [Third priority fix]
```
