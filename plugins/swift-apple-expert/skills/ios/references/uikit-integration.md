---
name: uikit-integration
description: UIKit integration in SwiftUI with UIViewRepresentable, UIViewControllerRepresentable
when-to-use: using UIKit views in SwiftUI, accessing UIKit-only features, wrapping third-party UIKit libraries
keywords: UIViewRepresentable, UIViewControllerRepresentable, UIKit, coordinator, bridge
priority: medium
related: views-modifiers.md
---

# UIKit Integration

## When to Use

- UIKit-only components (MKMapView, WKWebView)
- Third-party UIKit libraries
- Complex gesture handling
- Features not yet in SwiftUI
- Gradual migration from UIKit

## Key Concepts

### UIViewRepresentable
Wrap UIKit views for SwiftUI.

**Required Methods:**
- `makeUIView(context:)` - Create UIKit view
- `updateUIView(_:context:)` - Update from SwiftUI state

**Key Points:**
- Returns concrete UIView subclass
- Context provides coordinator and environment
- Update called on every SwiftUI state change

### UIViewControllerRepresentable
Wrap UIKit view controllers for SwiftUI.

**Required Methods:**
- `makeUIViewController(context:)` - Create VC
- `updateUIViewController(_:context:)` - Update

**Key Points:**
- For full view controllers (camera, document picker)
- Manages view controller lifecycle
- Access to navigation controller

### Coordinator
Bridge between UIKit delegates and SwiftUI.

**Key Points:**
- Handle UIKit delegate callbacks
- Communicate back to SwiftUI via bindings
- Created in `makeCoordinator()`
- Access via `context.coordinator`

### Context
Environment and coordinator access.

**Provides:**
- `coordinator` - Your coordinator instance
- `environment` - SwiftUI environment values
- `transaction` - Animation context

---

## When to Use Which

| Scenario | Protocol |
|----------|----------|
| Simple view (text field, slider) | UIViewRepresentable |
| Full screen (camera, picker) | UIViewControllerRepresentable |
| Delegate callbacks | Coordinator |
| SwiftUI → UIKit data | updateUIView |
| UIKit → SwiftUI data | Coordinator + Binding |

---

## Common UIKit Wrappers

| Component | Protocol | Notes |
|-----------|----------|-------|
| MKMapView | UIViewRepresentable | Maps |
| WKWebView | UIViewRepresentable | Web content |
| UIImagePickerController | UIViewControllerRepresentable | Camera/photos |
| UIDocumentPickerViewController | UIViewControllerRepresentable | File picker |
| UIActivityViewController | UIViewControllerRepresentable | Share sheet |

---

## Best Practices

- ✅ Use Coordinator for delegates
- ✅ Keep wrapper views small
- ✅ Handle dismantling in representable
- ✅ Pass bindings for two-way data
- ✅ Check if SwiftUI equivalent exists first
- ❌ Don't store state in representable
- ❌ Don't access UIKit from main SwiftUI views
- ❌ Don't forget dismantleUIView when needed

→ See `templates/uiview-representable.md` for code examples
