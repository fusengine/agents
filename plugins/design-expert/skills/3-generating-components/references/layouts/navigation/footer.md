---
name: footer
description: Four-column responsive footer with newsletter and social links
when-to-use: Designing page footers, site-wide footer sections
keywords: footer, columns, newsletter, social, links, responsive
priority: medium
related: navbar.md, mobile-nav.md
---

# Footer Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Top | 4-column link grid | 4 -> 2 -> 1 columns |
| Middle | Newsletter input + subscribe | Full width on mobile |
| Bottom | Copyright + social icons | Stack on mobile |

## Column Structure

| Column | Title | Links |
|--------|-------|-------|
| Product | Features, Pricing, Integrations, Changelog | 4-6 links |
| Company | About, Blog, Careers, Press | 4-6 links |
| Resources | Docs, API, Community, Support | 4-6 links |
| Legal | Privacy, Terms, Cookies, License | 3-5 links |

## Components (shadcn/ui)

- `Input` - Newsletter email field
- `Button` - Subscribe button
- `Separator` - Section divider

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --footer-bg | var(--muted) | Background color |
| --footer-padding | 48px 0 (desktop) / 32px 0 (mobile) | Section padding |
| --footer-gap | 32px | Column gap |
| --footer-link-color | var(--muted-foreground) | Link text color |

## Responsive Grid

```css
/* 4 columns on desktop */
grid-template-columns: repeat(4, 1fr);

/* 2 columns on tablet */
@media (max-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}

/* 1 column on mobile */
@media (max-width: 640px) {
  grid-template-columns: 1fr;
}
```

## Newsletter Section

```
+--------------------------------------------------+
| Stay up to date                                  |
| [email@example.com          ] [Subscribe]        |
+--------------------------------------------------+
```

## Social Links Row

```
[Twitter/X] [GitHub] [LinkedIn] [Discord]    (c) 2026 Company
```

- Icon buttons, 24px icons
- Hover: opacity 0.7 -> 1.0

## Animation (Framer Motion)

- Columns: stagger entrance on scroll into view
- Newsletter: subtle slide-up entrance
- Social icons: scale on hover

## Gemini Design Prompt

```
Create a 4-column footer with Product/Company/Resources/Legal sections.
Newsletter signup input below. Copyright and social icons at bottom.
Responsive: 4 cols -> 2 cols -> 1 col. Muted background.
Use design-system.md tokens. Stagger entrance animation.
```

## Validation Checklist

- [ ] 4-column grid responsive (4 -> 2 -> 1)
- [ ] All links are functional and accessible
- [ ] Newsletter input validates email format
- [ ] Social icons are consistent size
- [ ] Copyright year is dynamic
- [ ] Sufficient contrast on muted background
- [ ] Footer links match sitemap
