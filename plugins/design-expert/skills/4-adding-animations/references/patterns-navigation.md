---
name: patterns-navigation
description: Navigation patterns and responsive navbar implementation
when-to-use: Building navigation systems, creating responsive menus, implementing mobile navigation
keywords: navigation, navbar, menu, responsive, mobile, patterns
priority: high
related: patterns-cards.md, patterns-buttons.md, design-patterns.md
---

# Navigation Patterns

## Responsive Navbar

```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
  <nav className="container flex h-16 items-center justify-between">
    <Logo />
    {/* Desktop nav */}
    <div className="hidden md:flex items-center gap-6">
      {links.map(link => <NavLink key={link.href} {...link} />)}
    </div>
    {/* Mobile menu */}
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent>{/* Mobile links */}</SheetContent>
    </Sheet>
  </nav>
</header>
```

---

## Bottom Navigation (Mobile)

```tsx
<nav className="fixed bottom-0 inset-x-0 h-16 bg-background border-t">
  <div className="flex justify-around items-center h-full">
    <NavItem icon={Home} label="Home" />
    <NavItem icon={Search} label="Search" />
    <NavItem icon={Plus} label="Create" primary />
    <NavItem icon={Bell} label="Activity" />
    <NavItem icon={User} label="Profile" />
  </div>
</nav>
```

---

## Navigation Conventions

```
ESTABLISHED PATTERNS:
- Logo top-left → links to home
- Navigation center or right
- CTA far right
- Hamburger menu → mobile navigation
- Footer → legal, sitemap, contact
```

---

## Link Styling

```tsx
// Standard links
<a className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring">
  Link
</a>

// Current page indicator
<a className="text-foreground font-medium border-b-2 border-primary">
  Current Page
</a>

// Secondary links
<a className="text-muted-foreground hover:text-foreground">
  Secondary Link
</a>
```

---

## Breadcrumbs

```tsx
<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2">
    <li><a href="/">Home</a></li>
    <li>/</li>
    <li><a href="/products">Products</a></li>
    <li>/</li>
    <li aria-current="page">Product Detail</li>
  </ol>
</nav>
```

---

## Tabs Navigation

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

## Navigation Best Practices

```
1. Logo top-left links to home
2. 5-7 top-level items maximum
3. Current page clearly indicated
4. Mobile hamburger menu below md breakpoint
5. Bottom navigation for mobile primary actions
6. Skip links for accessibility
7. Keyboard navigation support
```

---

## CHECKLIST: Navigation Patterns

- [ ] Responsive behavior (desktop/mobile)
- [ ] Clear current page indicator
- [ ] 5-7 items maximum in top nav
- [ ] Logo links to home
- [ ] Mobile menu accessible
- [ ] Keyboard navigable
- [ ] Focus indicators visible
- [ ] Skip links implemented
