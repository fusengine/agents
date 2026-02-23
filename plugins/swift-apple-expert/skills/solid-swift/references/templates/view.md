---
name: view-template
description: Complete SwiftUI View template with subviews and #Preview
when-to-use: creating new views, splitting fat views
keywords: view, SwiftUI, template, preview, subview
---

# SwiftUI View Template

## Rules

- Views < 80 lines
- Extract subviews at 30+ body lines
- Location: `Features/[Feature]/Views/`
- Always include `#Preview`
- No API calls, no business logic

---

## Main View

```swift
// Features/[Feature]/Views/[Feature]View.swift
import SwiftUI

/// Main view for [Feature] screen.
struct FeatureView: View {
    @State private var viewModel: FeatureViewModel

    init(viewModel: FeatureViewModel) {
        _viewModel = State(initialValue: viewModel)
    }

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView()
            } else if let data = viewModel.data {
                FeatureContent(data: data)
            } else if let error = viewModel.error {
                ErrorView(error: error) {
                    Task { await viewModel.load() }
                }
            }
        }
        .navigationTitle("feature.title")
        .task { await viewModel.load() }
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        FeatureView(viewModel: .preview)
    }
}

#Preview("Loading") {
    FeatureView(viewModel: .previewLoading)
}
```

---

## Subview

```swift
// Features/[Feature]/Views/FeatureContent.swift
import SwiftUI

/// Content section displaying feature data.
struct FeatureContent: View {
    let data: FeatureData

    var body: some View {
        VStack(spacing: 16) {
            FeatureHeader(title: data.title)
            FeatureBody(items: data.items)
        }
        .padding()
    }
}

// MARK: - Preview

#Preview {
    FeatureContent(data: .preview)
}
```

---

## List View

```swift
// Features/[Feature]/Views/FeatureListView.swift
import SwiftUI

/// List view displaying feature items.
struct FeatureListView: View {
    let items: [FeatureItem]

    var body: some View {
        List(items) { item in
            FeatureRow(item: item)
        }
    }
}

/// Single row for feature list.
private struct FeatureRow: View {
    let item: FeatureItem

    var body: some View {
        HStack {
            Text(item.name)
            Spacer()
            Text(item.value)
                .foregroundStyle(.secondary)
        }
    }
}

#Preview {
    FeatureListView(items: FeatureItem.previewList)
}
```
