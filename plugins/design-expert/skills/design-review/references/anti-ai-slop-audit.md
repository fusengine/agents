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
| 2 | Purple/indigo gradient tell | `grep -riE "linear-gradient" *.css \| grep -iE "#6366f1\|#8b5cf6\|#a855f7\|oklch\([^)]*2[7-9][0-9]|oklch\([^)]*30[0-9]"` (hue ~270-300°) | Sector OKLCH palette from `design-system`: **committed color** — either chromatic (chroma ≥ 0.05) or an intentional near-mono base with one sharp accent, non-purple hue. The slop is a timid, non-committed gray, not low chroma itself (Linear/Vercel/Stripe ship near-mono premium) |
| 3 | Uniform low-alpha shadow | `grep -o "box-shadow:[^;]*" *.css \| grep -oE "0\.0[0-9]\|0\.1[0-2]"` on every card/button, no variation | Elevation scale with varied alpha/blur per depth level |
| 4 | Identical corner-radius everywhere | `grep -o "border-radius:[^;]*" *.css \| sort -u` returns exactly 1 value across all component types | One radius scale (e.g. sm/md/lg), applied by component role, not a single flat value |
| 5 | Hero-centered + 3-icon-cards macrostructure | Structural: `grep -qE 'class="[^"]*text-center[^"]*"[^>]*>\s*<h1'` (centered `h1`) followed by a `grid`/`flex` container whose child count is `grep -ocE '<(div\|li)[^>]*class="[^"]*(card\|icon)[^"]*"'` == 3, each containing an `<svg`/icon-class element | Pick a non-default macrostructure per `design-method` "Macrostructure Variety" |
| 6 | Eyebrow/badge above every `h2` | Count uppercase-tracking labels immediately preceding section headlines; compare to `design-review/references/pre-flight-checklist.md` cap | Drop the eyebrow on repeat sections; headline alone is enough |
| 7 | Colored left-border cards | `grep -o "border-left:[^;]*" *.css` present on every card in a grid | Depth/hierarchy via elevation, size, or fill — not a uniform accent stripe |
| 8 | "Steps 1-2-3" numbered list pattern | Structural: `STEPS=$(grep -ocE '<(div\|li)[^>]*>\s*<(span\|div)[^>]*>0?[1-3]</(span\|div)>' "$FILE")`; `[ "$STEPS" -ge 3 ]` AND all matched cards share one `class="..."` shell (`grep -oE 'class="[^"]*step[^"]*"' "$FILE" \| sort -u \| wc -l` == 1) | Asymmetric process treatment (timeline, connected path, varied card sizes) |
| 9 | Cluster #1 signature co-occurrence (cream + serif + italic-accent + terracotta), undeclared | `CREAM=$(grep -qiE 'background(-color)?:\s*(oklch\([^)]*0\.9[0-8][^)]*(6[0-9]\|[7-8][0-9]\|9[0-9])\)\|#f4f1ea\|#f7f5f1)' "$FILE" && echo 1)`; `SERIF_ITALIC=$(grep -qiE 'font-family:[^;]*serif' "$FILE" && grep -qiE 'font-style:\s*italic' "$FILE" && echo 1)`; `TERRACOTTA=$(grep -qiE '#b6553a\|#bc7c3a\|oklch\([^)]*0\.1[0-9][^)]*(3[0-9]\|4[0-9])\)' "$FILE" && echo 1)`; sum ≥ 2/3 | If ≥2/3 present **and** not declared as the Step 2 signature element (`design-method`): **FLAG-with-justification**, not a BLOCK — a declared deliberate signature is a valid override |
| 10 | Cluster #2 signature co-occurrence (near-black background + acid accent), undeclared | `NEARBLACK=$(grep -qiE 'background(-color)?:\s*(oklch\([^)]*0?\.[01][0-9]?%?\|#0[0-9a-f]{5}\|#1[0-4][0-9a-f]{4})' "$FILE" && echo 1)`; `ACID=$(grep -qiE 'oklch\([^)]*0\.[2-9][0-9][^)]*\)' "$FILE" && echo 1)`; sum ≥ 2/2 | Both present, undeclared as signature: **FLAG-with-justification**, not a BLOCK — same override rule as #9 |
| 11 | Cluster #3 signature co-occurrence (broadsheet hairlines + zero-radius + mono), undeclared | `RADIUS0=$(grep -oE "border-radius:[^;]*" *.css \| sort -u \| grep -qE '^\s*border-radius:\s*0(px)?;?\s*$' && echo 1)`; `MONO=$(grep -qi 'font-family:[^;]*mono' "$FILE" && echo 1)`; `HAIRLINE=$(grep -qiE 'border(-top\|-bottom)?:\s*1px solid' "$FILE" && echo 1)`; sum ≥ 2/3 | If ≥2/3 present, undeclared as signature: **FLAG-with-justification**, not a BLOCK — same override rule as #9 |

## Prevention

1. Run `design-method` Step 1 (brief) + Step 2 (signature element) BEFORE any generation —
   not a separate "identity" skill, `design-method` is the single entry point.
2. Generate `design-system.md` with unique OKLCH tokens (`design-system` skill).
3. Gemini Design MCP, Magic, and shadcn MCP are optional tools of convenience — never a
   requirement, and never a substitute for the brief/signature-element discipline above.
4. Run this audit as part of `design-review` Part 1, after every major feature addition.

## Gate Semantics (per entry, no aggregate)

Each entry above is judged **PASS/FAIL independently** — never summed into a score. An
aggregated "X/N flags" number invites self-grading theater and has empirically failed:
cluster #1 (cream/serif/terracotta) shipped through this exact audit while the aggregate
scored low. There is no total to compute.

- Entries 9-11 (cluster co-occurrence): a FAIL is a **FLAG-with-justification**, not a
  BLOCK — a deliberate signature declared per `design-method` Step 2 overrides it.
- All other entries (1-8): a FAIL blocks the "audit passed" verdict until fixed.

## Audit Report Format

```markdown
## Anti-AI-Slop Audit Results

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
| 9 | Cluster #1 co-occurrence (cream/serif/terracotta), undeclared | PASS/FLAG | [findings] |
| 10 | Cluster #2 co-occurrence (near-black/acid), undeclared | PASS/FLAG | [findings] |
| 11 | Cluster #3 co-occurrence (broadsheet/zero-radius/mono), undeclared | PASS/FLAG | [findings] |

### Recommendations
1. [Highest priority fix]
2. [Second priority fix]
3. [Third priority fix]
```
