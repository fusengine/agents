---
name: component-variants
description: Component variant system with Glass, Outline, and Flat styles. Use when creating multi-style components, variant props, or style switching.
allowed-tools: Read, Write, Edit, Glob, Grep
user-invocable: true
---

# Component Variants

Three-style system inspired by DesignCode UI: Glass, Outline, Flat.

## Agent Workflow (MANDATORY)

Before implementation:
1. **fuse-ai-pilot:explore-codebase** - Check existing variant patterns
2. **fuse-ai-pilot:research-expert** - cva/class-variance-authority docs

After: Run **fuse-ai-pilot:sniper** for validation.

## The Three Styles

| Style | Characteristics | Use Case |
|-------|-----------------|----------|
| **Glass** | Blur + transparency + glow | Premium, modern, hero |
| **Outline** | Border only, no fill | Secondary actions |
| **Flat** | Solid color, no effects | Dense UI, fallback |

## Implementation with CVA

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-2xl p-6 transition-all duration-200", // base
  {
    variants: {
      variant: {
        glass: [
          "bg-white/80 backdrop-blur-xl",
          "border border-white/20",
          "shadow-xl shadow-black/5",
        ],
        outline: [
          "bg-transparent",
          "border-2 border-primary/30",
          "hover:border-primary/50",
        ],
        flat: [
          "bg-surface",
          "border border-border",
        ],
      },
      size: {
        sm: "p-4 rounded-xl",
        default: "p-6 rounded-2xl",
        lg: "p-8 rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "default",
    },
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export function Card({ variant, size, children }: CardProps) {
  return (
    <motion.div
      className={cardVariants({ variant, size })}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  );
}
```

## Button Variants

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all",
  {
    variants: {
      variant: {
        glass: [
          "bg-white/20 backdrop-blur-md",
          "border border-white/30",
          "text-foreground",
          "hover:bg-white/30",
        ],
        outline: [
          "bg-transparent",
          "border-2 border-primary",
          "text-primary",
          "hover:bg-primary/10",
        ],
        flat: [
          "bg-primary",
          "text-primary-foreground",
          "hover:bg-primary/90",
        ],
      },
    },
  }
);
```

## Automatic Style Detection

```tsx
function usePreferredVariant() {
  // Detect background type for auto-variant
  const [variant, setVariant] = useState<"glass" | "outline" | "flat">("glass");

  useEffect(() => {
    // Glass works best on gradient/image backgrounds
    // Flat works best on solid backgrounds
    const bgType = detectBackgroundType();
    setVariant(bgType === "gradient" ? "glass" : "flat");
  }, []);

  return variant;
}
```

## Dark Mode Variants

```tsx
const glassVariant = {
  light: "bg-white/80 backdrop-blur-xl border-white/20",
  dark: "bg-black/40 backdrop-blur-xl border-white/10",
};

// Usage with Tailwind
className="bg-white/80 dark:bg-black/40 backdrop-blur-xl
           border-white/20 dark:border-white/10"
```

## Style Switching UI

```tsx
function StyleSwitcher({ value, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {["glass", "outline", "flat"].map((style) => (
        <button
          key={style}
          onClick={() => onChange(style)}
          className={cn(
            "px-3 py-1 rounded-md text-sm capitalize",
            value === style && "bg-background shadow-sm"
          )}
        >
          {style}
        </button>
      ))}
    </div>
  );
}
```

## Validation

```
[ ] All 3 variants defined (glass, outline, flat)
[ ] CVA or similar variant system used
[ ] Dark mode handled per variant
[ ] Default variant specified
[ ] Hover states per variant
```

## References

- `../../references/design-patterns.md` - Component patterns
- `../../skills/glassmorphism-advanced/SKILL.md` - Glass details
