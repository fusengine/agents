---
name: media-playback
description: AVKit video playback with AVPlayer, AVPlayerViewController, and picture-in-picture
when-to-use: implementing video streaming, audio playback, media controls, PiP support
keywords: AVKit, AVPlayer, video, streaming, media, playback, PiP
priority: high
related: focus-system.md, remote-control.md
---

# Media Playback

## When to Use

- Video streaming applications
- Audio playback
- Live content
- Picture-in-picture
- Custom player controls

## Key Concepts

### AVPlayerViewController

Standard video player with full controls.

```swift
import AVKit

struct VideoPlayerView: View {
    let url: URL
    @State private var player: AVPlayer?

    var body: some View {
        VideoPlayer(player: player)
            .onAppear {
                player = AVPlayer(url: url)
                player?.play()
            }
    }
}
```

### Custom Player

```swift
struct CustomPlayer: View {
    @State private var player = AVPlayer()
    @State private var isPlaying = false

    var body: some View {
        VideoPlayer(player: player)
            .overlay(alignment: .bottom) {
                CustomControls(isPlaying: $isPlaying)
            }
    }
}
```

### Streaming with HLS

```swift
let hlsURL = URL(string: "https://example.com/stream.m3u8")!
let playerItem = AVPlayerItem(url: hlsURL)
player.replaceCurrentItem(with: playerItem)
```

### Background Audio

```swift
// In App init
try? AVAudioSession.sharedInstance().setCategory(.playback)
```

---

## Best Practices

- ✅ Use `VideoPlayer` for standard playback
- ✅ Support picture-in-picture
- ✅ Handle interruptions gracefully
- ✅ Preload content for smooth playback
- ❌ Don't autoplay without user intent
- ❌ Don't block UI during loading
