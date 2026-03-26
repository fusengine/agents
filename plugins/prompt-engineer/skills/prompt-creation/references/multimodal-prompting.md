---
name: multimodal-prompting
description: Multimodal prompting patterns — image analysis, screenshot-to-code, diagram understanding, vision+text
when-to-use: Creating prompts that combine images with text, visual analysis tasks, screenshot-based workflows
keywords: multimodal, vision, image, screenshot, diagram, visual-prompt
priority: medium
---

# Multimodal Prompting

## Image Analysis Prompts

### Describe
```markdown
Describe this image in detail. Focus on: main subject, composition,
colors/lighting/mood, visible text/labels, foreground and background details.
```

### Extract
```markdown
Extract ALL text visible in this image as structured data:
headers/titles, body text (preserve hierarchy), labels/captions/annotations.
Mark partially visible text as [partial].
```

### Compare
```markdown
Compare these two images. Identify: similarities, differences, changes.
Format as table: Aspect | Image A | Image B | Change Type
```

## Screenshot-to-Code

```markdown
Convert this UI screenshot to [React/HTML/Tailwind] code.
Rules: match layout/spacing exactly, semantic HTML, approximate colors,
preserve text verbatim, responsive breakpoints, placeholder images.
Output: complete, runnable component.
```

## Diagram Understanding

```markdown
Analyze this [architecture/flow/sequence] diagram:
1. Identify all components/nodes and labels
2. Map connections/arrows and directions
3. Note annotations, legends, groupings
4. Describe overall flow/architecture
Output as: structured description + Mermaid diagram code
```

## Vision + Text Combined

```markdown
# Context
[Text description or documentation]
# Visual Reference
[Image]
# Task
Using both the documentation and visual reference, [task].
Where text and image conflict, note the discrepancy.
```

### Multi-Image
```markdown
I'm showing you [N] screenshots of [app states/versions/designs].
For each (labeled 1-N): describe state, compare with previous, identify changes.
Summarize progression and recommend improvements.
```

## Best Practices

| Aspect | Recommendation |
|--------|---------------|
| Resolution | Min 768px, max 2048px (larger adds cost, not quality) |
| Format | PNG for screenshots/diagrams, JPEG for photos |
| Prompt order | Text instructions BEFORE image reference |
| Specificity | Tell the model exactly what to look for |
| Multiple images | Label clearly (Image 1, Image 2) |
| Cropping | Crop to relevant area to reduce noise |

## Limitations

- **Small text**: Below ~12px may be misread
- **Handwriting**: Accuracy varies — ask for confidence levels
- **Dense diagrams**: Break into sections if > 20 nodes
- **Charts/graphs**: Request data as tables, not descriptions
- **Rotated/skewed**: Straighten images before sending
- **Token cost**: Images consume significant context — use judiciously
