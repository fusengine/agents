---
name: viewmodel-template
description: Complete @Observable ViewModel template with @MainActor
when-to-use: creating ViewModels, state management, service injection
keywords: viewmodel, observable, MainActor, template, Swift
---

# ViewModel Template

## Rules

- ViewModels < 100 lines
- Always `@MainActor @Observable`
- Location: `Features/[Feature]/ViewModels/`
- Depend on protocols, not concrete types
- Include `.preview` static for `#Preview`

---

## Standard ViewModel

```swift
// Features/[Feature]/ViewModels/FeatureViewModel.swift
import Foundation

/// ViewModel for [Feature] screen.
@MainActor
@Observable
final class FeatureViewModel {
    // MARK: - State

    var data: FeatureData?
    var isLoading = false
    var error: Error?

    // MARK: - Dependencies

    private let service: FeatureServiceProtocol

    // MARK: - Init

    init(service: FeatureServiceProtocol) {
        self.service = service
    }

    // MARK: - Actions

    /// Loads feature data from API.
    func load() async {
        isLoading = true
        defer { isLoading = false }

        do {
            data = try await service.fetchData()
            error = nil
        } catch {
            self.error = error
        }
    }

    /// Refreshes data (pull-to-refresh).
    func refresh() async {
        do {
            data = try await service.fetchData()
            error = nil
        } catch {
            self.error = error
        }
    }
}

// MARK: - Preview

extension FeatureViewModel {
    static var preview: FeatureViewModel {
        let vm = FeatureViewModel(service: MockFeatureService())
        vm.data = .preview
        return vm
    }

    static var previewLoading: FeatureViewModel {
        let vm = FeatureViewModel(service: MockFeatureService())
        vm.isLoading = true
        return vm
    }
}
```

---

## CRUD ViewModel

```swift
// Features/[Feature]/ViewModels/FeatureFormViewModel.swift
import Foundation

/// ViewModel for creating/editing [Feature].
@MainActor
@Observable
final class FeatureFormViewModel {
    // MARK: - Form State

    var name = ""
    var description = ""
    var isSaving = false
    var validationError: String?

    // MARK: - Dependencies

    private let service: FeatureServiceProtocol

    init(service: FeatureServiceProtocol) {
        self.service = service
    }

    // MARK: - Validation

    var isValid: Bool {
        !name.trimmingCharacters(in: .whitespaces).isEmpty
    }

    // MARK: - Actions

    /// Saves the feature data.
    func save() async -> Bool {
        guard isValid else {
            validationError = "feature.validation.name_required"
            return false
        }

        isSaving = true
        defer { isSaving = false }

        do {
            let dto = CreateFeatureDTO(name: name, description: description)
            _ = try await service.create(dto)
            return true
        } catch {
            validationError = error.localizedDescription
            return false
        }
    }
}
```
