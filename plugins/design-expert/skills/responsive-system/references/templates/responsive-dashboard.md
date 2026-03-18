# Responsive Dashboard — Sidebar + Content Pattern

## Layout Structure

```
Mobile (< lg):     Tablet (lg):         Desktop (xl):
┌──────────────┐   ┌────┬─────────────┐  ┌──────┬──────────────┐
│ Header + Ham │   │Icon│ Main Content│  │ Full │ Main Content │
│ Main Content │   │Nav │             │  │ Side │              │
│              │   │    │             │  │      │              │
└──────────────┘   └────┴─────────────┘  └──────┴──────────────┘
```

## Implementation

```tsx
// app/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="
        hidden lg:flex flex-col
        w-16 xl:w-64
        border-r border-border bg-card
        transition-all duration-300
      ">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <MobileDrawer />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 shrink-0">
          <MobileMenuButton className="lg:hidden" />
          <Breadcrumb />
          <div className="ml-auto flex items-center gap-2">
            <NotificationsBell />
            <UserAvatar />
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## Sidebar Content Component

```tsx
function SidebarContent() {
  return (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center px-3 border-b border-border shrink-0">
        <Logo className="h-8 w-8" />
        <span className="hidden xl:block ml-3 font-semibold">AppName</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(item => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="p-2 border-t border-border">
        <UserMenu />
      </div>
    </>
  );
}
```

## Dashboard Grid Content

```tsx
<div className="space-y-6">
  {/* Stats row */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map(s => <StatCard key={s.id} {...s} />)}
  </div>

  {/* Charts + sidebar */}
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div className="xl:col-span-2">
      <ChartCard />
    </div>
    <div>
      <RecentActivity />
    </div>
  </div>
</div>
```
