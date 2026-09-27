---
name: tailwindcss-typography
description: "Use when setting font family/size/weight, aligning or wrapping text (balance/pretty), applying text-shadow or decoration, or letter/line spacing."
user-invocable: false
---

<objective>
Complete reference for Tailwind CSS v4.3 typography utilities: font family (`font-sans`/`font-serif`/`font-mono`), font size and weight, `font-features-*` (since v4.2), text color/alignment, text wrapping including the `balance`/`pretty` values (since v3.4), the `text-shadow` utility (since v4.1), `tab-*` tab size (since v4.3), letter spacing (`tracking-*`), line height (`leading-*`), text decoration, and text transform (`uppercase`/`lowercase`/`capitalize`).
</objective>

# Tailwind CSS Typography v4.3

Typography utilities for controlling font families, sizes, weights, text styling, spacing, and decoration in Tailwind CSS v4.3.

## Core Features

- **Font Family**: font-sans, font-serif, font-mono
- **Font Size**: text-xs to text-9xl with scaling
- **Font Weight**: thin, extralight, light, normal, medium, semibold, bold, extrabold, black
- **Text Color**: Full color palette support
- **Text Alignment**: left, center, right, justify
- **Font Features**: `font-features-[…]` for `font-feature-settings` (since v4.2)
- **Text Wrapping**: wrap, nowrap, balance, pretty (since v3.4)
- **Text Shadow**: text-shadow effects (since v4.1)
- **Tab Size**: `tab-<number>` for `tab-size` (since v4.3)
- **Letter Spacing**: tracking values
- **Line Height**: leading values
- **Text Decoration**: decoration styles and colors
- **Text Transform**: uppercase, lowercase, capitalize, normal-case

## Detailed References

- [fonts.md](references/fonts.md) - Load when picking font-family/size/weight values, italics, numeric variants, font-feature-settings, or font smoothing
- [text.md](references/text.md) - Load when styling text color, alignment, wrapping (balance/pretty), text-shadow, decoration, transform, whitespace, or tab size
- [spacing.md](references/spacing.md) - Load when tuning letter-spacing (tracking) or line-height (leading)
