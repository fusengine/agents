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
5. **Fix gaps** — If comparison reveals issues, use `mcp__gemini-design__modify_frontend` to fix. Maximum 2 fix cycles.
6. **Generate report** with:
   - Side-by-side light/dark screenshots.
   - List of verified components with status (pass/fail).
   - Any remaining Minor issues from Phase 5 audit.
   - Summary of fixes applied during this phase.

### Output
- Final report with light/dark screenshots at 3 viewports.
- All components verified visually. Gaps fixed (max 2 cycles).
- Design pipeline complete — HTML/CSS delivered.
