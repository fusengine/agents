---
name: app-icons
description: App icons, SF Symbols, launch screens, and asset catalogs for all Apple platforms
when-to-use: creating app icons, using SF Symbols, configuring launch screens, managing assets
keywords: app icon, SF Symbols, launch screen, asset catalog, dark mode icon, tinted icon
priority: medium
related: code-signing.md, app-store.md
---

# App Icons & Assets

## When to Use

- Creating app icons
- Using SF Symbols
- Configuring launch screens
- Managing asset catalogs
- Supporting dark/tinted icons

## Key Concepts

### Single-Size Icons (Xcode 15+)
Provide one 1024x1024 PNG, Xcode generates all sizes.

**Key Points:**
- No transparency (alpha = 1.0)
- No rounded corners (system applies)
- PNG format, sRGB or Display P3
- Simple design readable at small sizes

### iOS 26 Dark & Tinted Icons
Three icon variants for appearance modes.

**Variants:**
- **Light** - Default icon (required)
- **Dark** - For dark mode
- **Tinted** - Monochrome for tint

**Dark Icon Guidelines:**
- Darker background
- Gradient: #313131 → #141414
- Keep design recognizable

**Tinted Icon Guidelines:**
- Grayscale only
- Black background
- 100% → 60% opacity gradient

### SF Symbols
Apple's icon system with 5,000+ symbols.

**Rendering Modes:**
- Monochrome - Single color
- Hierarchical - Depth levels
- Palette - Custom colors
- Multicolor - Original colors

**Key Points:**
- Always add accessibility labels
- Use semantic names
- Check availability per OS version

### Launch Screen
Modern approach without storyboard.

**Info.plist Configuration:**
- UILaunchScreen dictionary
- UIImageName for image
- UIColorName for background

---

## Platform Icon Sizes

| Platform | Master Size | Notes |
|----------|-------------|-------|
| iOS/iPadOS | 1024×1024 | Square, auto-rounded |
| macOS | 1024×1024 | .icns generated |
| watchOS | 1024×1024 | Circular mask |
| visionOS | 1024×1024 | 3 layers for parallax |

---

## Asset Catalog Structure

```
Assets.xcassets/
├── AppIcon.appiconset/
│   ├── Contents.json
│   ├── icon-light.png
│   ├── icon-dark.png (optional)
│   └── icon-tinted.png (optional)
├── AccentColor.colorset/
├── LaunchImage.imageset/
└── Colors/
    └── BrandPrimary.colorset/
```

---

## Best Practices

- ✅ Provide single 1024×1024 icon
- ✅ Support dark mode icon
- ✅ Use SF Symbols when possible
- ✅ Add accessibility labels to icons
- ✅ Test at all sizes
- ❌ Don't use transparency in app icon
- ❌ Don't add manual rounded corners
- ❌ Don't use complex details
