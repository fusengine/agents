# Responsive Mobile Navigation Patterns

## Pattern 1 — Bottom Tab Bar (iOS/Android style)

```tsx
// Best for: 3-5 primary destinations, app-like feel
<nav className="
  fixed bottom-0 inset-x-0
  h-16 bg-card border-t border-border
  flex items-center justify-around
  safe-area-inset-bottom
  md:hidden
">
  {tabs.map(tab => (
    <Link key={tab.href} href={tab.href}
      className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground
        aria-[current=page]:text-primary">
      <tab.Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{tab.label}</span>
    </Link>
  ))}
</nav>
```

## Pattern 2 — Hamburger + Drawer

```tsx
// Best for: 6+ destinations, content-heavy sites
function MobileDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="lg:hidden p-2">
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border
        transform transition-transform duration-300 lg:hidden
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <Logo />
          <button onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <DrawerNav onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );
}
```

## Pattern 3 — Collapsible Header Nav

```tsx
// Best for: marketing sites, blogs
function MobileHeaderNav() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="flex items-center justify-between h-16 px-4">
        <Logo />
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className="hidden md:flex gap-6">{desktopLinks}</nav>
      </div>

      {/* Mobile menu — slides down */}
      <div className={`
        md:hidden overflow-hidden transition-all duration-300
        ${open ? 'max-h-96' : 'max-h-0'}
      `}>
        <nav className="flex flex-col p-4 gap-3 border-t">
          {mobileLinks}
        </nav>
      </div>
    </header>
  );
}
```

## Safe Area (notch/home indicator)

```css
/* Add to global CSS for iOS safe areas */
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Rules
- Bottom tab: max 5 items, always show label
- Drawer: include close button + overlay tap to close
- Touch targets: minimum 44x44px for all tap areas
- Active state must be visually clear (color + optionally bold)
