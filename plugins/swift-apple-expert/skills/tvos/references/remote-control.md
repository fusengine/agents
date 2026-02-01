---
name: remote-control
description: Siri Remote gestures, game controllers, and tvOS input handling
when-to-use: implementing remote gestures, swipes, clicks, game controller support
keywords: Siri Remote, gesture, swipe, click, game controller, tvOS input
priority: high
related: focus-system.md, media-playback.md
---

# Remote Control & Input

## When to Use

- Siri Remote gesture handling
- Custom swipe actions
- Game controller support
- Voice input (Siri)

## Key Concepts

### Siri Remote Gestures

| Gesture | Action |
|---------|--------|
| Swipe | Navigate focus |
| Click | Select/confirm |
| Menu button | Back/dismiss |
| Play/Pause | Media control |
| Volume | System volume |

### Custom Gesture Handling

```swift
struct GestureView: View {
    var body: some View {
        ContentView()
            .onMoveCommand { direction in
                switch direction {
                case .left: moveLeft()
                case .right: moveRight()
                case .up: moveUp()
                case .down: moveDown()
                @unknown default: break
                }
            }
            .onExitCommand {
                // Menu button pressed
                dismiss()
            }
            .onPlayPauseCommand {
                togglePlayback()
            }
    }
}
```

### Long Press

```swift
Button("Action") { }
    .onLongPressGesture {
        showContextMenu()
    }
```

### Game Controllers

```swift
import GameController

func setupGameController() {
    NotificationCenter.default.addObserver(
        forName: .GCControllerDidConnect,
        object: nil,
        queue: .main
    ) { notification in
        if let controller = notification.object as? GCController {
            configureController(controller)
        }
    }
}
```

---

## Best Practices

- ✅ Support standard Siri Remote gestures
- ✅ Provide haptic feedback where appropriate
- ✅ Handle Menu button for back navigation
- ✅ Support game controllers for games
- ❌ Don't require complex gestures
- ❌ Don't ignore accessibility
