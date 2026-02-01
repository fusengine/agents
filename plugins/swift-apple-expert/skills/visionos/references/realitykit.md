---
name: realitykit
description: RealityKit for visionOS with RealityView, 3D entities, gestures, and animations
when-to-use: rendering 3D content, adding models, implementing spatial gestures, animating entities
keywords: RealityKit, RealityView, Entity, ModelEntity, gesture, 3D, animation
priority: high
requires: spatial-computing.md
related: ornaments.md
---

# RealityKit for visionOS

## When to Use

- Rendering 3D content
- Loading 3D models
- Spatial gestures (tap, drag, rotate)
- 3D animations
- Physics simulations

## Key Concepts

### RealityView
SwiftUI view for 3D content.

**Key Points:**
- Bridge between SwiftUI and RealityKit
- Create entities in closure
- Update on SwiftUI state change
- Supports attachments

### Entity
Base class for 3D objects.

**Types:**
- `ModelEntity` - Visible 3D models
- `AnchorEntity` - Spatial anchors
- `Entity` - Container/grouping

### ModelEntity
Visible 3D content with mesh and materials.

**Key Points:**
- `.generateBox/Sphere/Plane` for primitives
- Load .usdz models
- Apply materials
- Add physics

### Gestures
Spatial interaction with entities.

**Supported:**
- `TapGesture` - Point and tap
- `DragGesture` - Move in space
- `RotateGesture3D` - Rotate object
- `MagnifyGesture` - Scale object

### Animations
Entity movement and changes.

**Methods:**
- `Entity.move(to:relativeTo:duration:)`
- Transform animations
- Component-based animation

---

## Loading Models

```swift
// From bundle
let entity = try await Entity(named: "model.usdz")

// Generate primitive
let sphere = ModelEntity(
    mesh: .generateSphere(radius: 0.1),
    materials: [SimpleMaterial(color: .blue, isMetallic: false)]
)
```

---

## Gestures on Entities

```swift
RealityView { content in
    // Add entities
}
.gesture(
    TapGesture()
        .targetedToAnyEntity()
        .onEnded { value in
            // value.entity is tapped entity
        }
)
```

---

## Best Practices

- ✅ Use .usdz for complex models
- ✅ Optimize polygon count
- ✅ Add collision for interaction
- ✅ Use gestures for manipulation
- ✅ Test on device
- ❌ Don't use huge models
- ❌ Don't forget accessibility
- ❌ Don't skip performance testing
