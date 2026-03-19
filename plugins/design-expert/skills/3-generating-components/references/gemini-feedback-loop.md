---
name: gemini-feedback-loop
description: Correction protocol for Gemini Design outputs — retry templates and failure signals
when-to-use: When Gemini output does not match the intended design
keywords: gemini, feedback, retry, correction, anti-slop
priority: high
related: gemini-design-workflow.md
---

# Gemini Design Feedback Loop

## Correction Prompt Template

When output is not satisfactory, call `modify_frontend`:

```
Tool: mcp__gemini-design__modify_frontend
Parameters:
  filePath: "<path to generated file>"
  codeToModify: "<paste the section to change>"
  modification: |
    SPECIFIC ISSUE: [describe exactly what is wrong]
    REQUIRED CHANGE: [describe exactly what it should look like]
    REFERENCE: [name a product/style it should match]
    FORBIDDEN: [what must not appear in the result]
  context: "<design-system.md tokens>"
```

## Retry Rules

- **Retry 1**: Correct specific element (never say "make it better")
- **Retry 2**: Correct with stronger constraints + reference product
- **After 2 retries**: Ask user to clarify visual intent — do not keep retrying

## Failure Signals → Required Action

| Signal | Action |
|--------|--------|
| Inter/Roboto/Arial used | Retry with `<forbidden>Inter, Roboto, Arial</forbidden>` |
| Purple-pink gradient bg | Retry with explicit OKLCH color tokens |
| No animations | Retry with explicit Framer Motion stagger spec |
| Generic card grid | Retry with named aesthetic reference (Linear, Vercel) |
| Missing states | Retry with complete `<states>` block |
| Components are centered on desktop | Retry with explicit layout alignment spec |

## Anti-Convergence Rules

Gemini converges toward generic outputs. Override:

1. **Never say "clean and modern"** — describe actual visual language
2. **Never say "professional"** — name the reference (Linear, Vercel, Arc)
3. **Name the mood** — "editorial restraint", "brutalist warmth", "productive tension"
4. **Add forbidden block** when output is generic:
   ```xml
   <forbidden>no generic SaaS aesthetic, no purple-blue gradient, no Inter font, no centered layout on desktop</forbidden>
   ```
5. **Vary aesthetics per component** — hero ≠ feature grid ≠ pricing

## Escalation Decision Tree

```
Output received
│
├── Generic aesthetic? → Add specific forbidden + retry 1
│
├── Wrong colors? → Pass OKLCH tokens explicitly + retry 1
│
├── Missing animations? → Add Framer Motion spec + retry 1
│
├── Still wrong after retry 1? → Add product reference + retry 2
│
└── Still wrong after retry 2? → Ask user for visual reference/screenshot
```
