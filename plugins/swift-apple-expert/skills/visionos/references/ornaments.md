---
name: ornaments
description: visionOS ornaments and attachments for connecting 2D UI to 3D content
when-to-use: adding controls to 3D content, creating contextual UI, attaching SwiftUI to entities
keywords: ornament, attachment, attachmentAnchor, RealityView attachment, UI overlay
priority: medium
requires: spatial-computing.md, realitykit.md
related: views-modifiers.md
---

# visionOS Ornaments & Attachments

## When to Use

- Adding 2D controls to 3D content
- Contextual menus on objects
- Floating UI near volumes
- Labels for 3D entities
- Toolbars in immersive spaces

## Key Concepts

### Ornaments
2D SwiftUI attached to windows/scenes.

**Key Points:**
- `.ornament()` modifier on views
- Position with `attachmentAnchor`
- Standard SwiftUI content
- Liquid Glass styling by default

### Attachments (RealityView)
2D SwiftUI attached to 3D entities.

**Key Points:**
- Define in RealityView `attachments:`
- Position relative to entities
- Update with SwiftUI state
- Great for labels/controls

### Attachment Anchors

| Anchor | Position |
|--------|----------|
| `.scene(.bottom)` | Below scene |
| `.scene(.top)` | Above scene |
| `.scene(.leading)` | Left of scene |
| `.scene(.trailing)` | Right of scene |

---

## Ornament Usage

```swift
WindowGroup {
    ContentView()
}
.ornament(
    attachmentAnchor: .scene(.bottom)
) {
    HStack {
        Button("Play") { }
        Button("Settings") { }
    }
    .padding()
}
```

---

## RealityView Attachments

```swift
RealityView { content, attachments in
    // Add attachment to entity
    if let label = attachments.entity(for: "label") {
        entity.addChild(label)
    }
} attachments: {
    Attachment(id: "label") {
        Text("Hello")
            .padding()
            .glassBackgroundEffect()
    }
}
```

---

## Liquid Glass Styling

iOS 26 / visionOS 26 default styling:
- Translucent backgrounds
- Blur effects
- `.glassBackgroundEffect()`
- `.liquidGlassEffect()`

---

## Best Practices

- ✅ Use ornaments for scene controls
- ✅ Use attachments for entity UI
- ✅ Keep ornaments minimal
- ✅ Apply glass effects
- ✅ Position intuitively
- ❌ Don't overcrowd with UI
- ❌ Don't block 3D content
- ❌ Don't ignore depth perception
