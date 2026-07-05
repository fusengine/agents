---
name: handoff-review
description: "Phase 6: Serve via python3 -m http.server 8899, screenshot light mode (fullPage), screenshot dark mode via browser_screenshot colorScheme:dark, compare 3 declared elements [expected vs present], fix gaps with modify_frontend (max 2 cycles), report."
phase: 6
---

## Phase 6: FINAL REVIEW — Visual validation and report

### When
After Phase 5 audit passes. Last step of the design pipeline.

### Input (from Phase 5)
- Audited components with all Critical/Major issues resolved.
- WCAG AA validated. Anti-AI-slop checks passed.
- `design-system.md` as the source of truth.

### Steps
1. **Screenshot light mode** — Use `mcp__fuse-browser__browser_screenshot` with `colorScheme: "light"` on every key page/component via localhost.
2. **Screenshot dark mode** — Re-shoot the same pages/components with `mcp__fuse-browser__browser_screenshot` `colorScheme: "dark"` (handles both `.dark` class and `prefers-color-scheme`, no manual toggle).
3. **Compare 3 declared elements** — For each page, compare these 3 elements against the inspiration site screenshots from Phase 3:
   - Color contrast and readability.
   - Component spacing and alignment.
   - Animation and hover state consistency.
4. **Cross-viewport check** — Screenshot at mobile, tablet, and desktop widths using `mcp__fuse-browser__browser_screenshot` with `viewports: ["mobile", "tablet", "desktop"]` (one call, responsive set).
5. **Motion verdict** — for any animation/transition/hover/gesture seen in the shots, produce the Block/Approve verdict per `references/motion-verdict.md`: a Before/After/Why findings table, a tiered-impact summary, and an explicit final decision. Use the Phase 4 animation glossary (`4-adding-animations/references/`) as the shared vocabulary for comments — reference it, do not restate it.
6. **Fix gaps** — If comparison or the motion verdict reveals issues (a **Block**), use `mcp__gemini-design__modify_frontend` to fix. Maximum 2 fix cycles.
7. **Generate report** with:
   - Side-by-side light/dark screenshots.
   - List of verified components with status (pass/fail).
   - The motion verdict table and final Block/Approve decision.
   - Any remaining Minor issues from Phase 5 audit.
   - Summary of fixes applied during this phase.

### Output
- Final report with light/dark screenshots at 3 viewports.
- Motion verdict delivered with an explicit Block/Approve decision.
- All components verified visually. Gaps fixed (max 2 cycles).
- Design pipeline complete — HTML/CSS delivered.

### References
| File | Purpose |
|------|---------|
| `references/motion-verdict.md` | Block/Approve verdict format: Before/After/Why table + tiered impact (adapted from Emil Kowalski's review-animations) |
