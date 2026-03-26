---
name: app-intents
description: App Intents framework for Siri, Shortcuts, and Spotlight integration
when-to-use: adding Siri voice commands, Shortcuts actions, Spotlight donations
keywords: AppIntent, Parameter, Siri, Shortcuts, AppShortcutsProvider
priority: medium
related: views-modifiers.md, navigation.md
---

# App Intents

## AppIntent Protocol

```swift
import AppIntents

struct OpenArticleIntent: AppIntent {
    static var title: LocalizedStringResource = "Open Article"

    @Parameter(title: "Article")
    var article: ArticleEntity

    @MainActor
    func perform() async throws -> some IntentResult {
        NavigationManager.shared.navigate(to: article)
        return .result()
    }
}
```

---

## App Entity

```swift
struct ArticleEntity: AppEntity {
    var id: String
    var title: String

    static var defaultQuery = ArticleQuery()
    static var typeDisplayRepresentation: TypeDisplayRepresentation = "Article"

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(title)")
    }
}

struct ArticleQuery: EntityQuery {
    func entities(for identifiers: [String]) async throws -> [ArticleEntity] {
        try await ArticleStore.shared.articles(for: identifiers)
    }

    func suggestedEntities() async throws -> [ArticleEntity] {
        try await ArticleStore.shared.recentArticles()
    }
}
```

---

## App Shortcuts Provider

```swift
struct AppShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: OpenArticleIntent(),
            phrases: [
                "Open \(\.$article) in \(.applicationName)",
                "Show \(\.$article) in \(.applicationName)",
            ],
            shortTitle: "Open Article",
            systemImageName: "doc.text"
        )
    }
}
```

---

## Returning Results

```swift
func perform() async throws -> some IntentResult { .result() }
func perform() async throws -> some IntentResult & ProvidesDialog { .result(dialog: "Done!") }
func perform() async throws -> some IntentResult & ReturnsValue<String> { .result(value: title) }
```

---

## Best Practices

- Keep `perform()` fast — Siri has strict timeouts
- Use `@MainActor` when updating UI from intents
- Provide `suggestedEntities()` for quick parameter selection
- Use `AppShortcutsProvider` for automatic Spotlight/Siri exposure
