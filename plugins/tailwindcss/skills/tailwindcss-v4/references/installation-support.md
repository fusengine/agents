---
name: installation-support
description: Installation, browser support, and key resources for Tailwind CSS v4
---

# Tailwind CSS v4 — Installation & Browser Support

## Installation

```bash
npm install -D tailwindcss @tailwindcss/postcss
# or for Vite
npm install -D tailwindcss @tailwindcss/vite
# or for CLI
npm install -D tailwindcss @tailwindcss/cli
# or for webpack / Turbopack loaders (since v4.2)
npm install -D tailwindcss @tailwindcss/webpack
```

Current stable: `tailwindcss` 4.3.3 (all `@tailwindcss/*` packages share the version).

### webpack loader (since v4.2)

`@tailwindcss/webpack` compiles Tailwind directly as a webpack loader instead of going through `postcss-loader` + `@tailwindcss/postcss` (reported >2x faster on large projects; also usable from Turbopack via its webpack-loader compatibility layer).

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "@tailwindcss/webpack"],
      },
    ],
  },
};
```

## Browser Support

- Safari 16.4+
- Chrome 111+
- Firefox 128+

## Key Resources

- Official Theme Variables Documentation
- @theme Directive Syntax
- Content Detection Configuration
- Custom Variant Creation
- Animation Keyframes Definition
- CSS Variables Usage
