---
name: ux-patterns
description: Form patterns, validation, mobile UX, and practical implementation guidelines
when-to-use: Implementing forms, validating user input, optimizing mobile interactions
keywords: forms, validation, mobile, patterns, touch zone, inline validation
priority: high
related: ux-nielsen.md, ux-laws.md, ux-wcag.md
---

# UX Patterns & Practical Guidelines

## Form Validation (Baymard Institute)

### Inline Validation Rules

```
1. DON'T validate prematurely (on focus)
2. DO validate on blur (field exit)
3. DO remove errors immediately when corrected
4. DO show positive feedback for valid fields
```

```tsx
const [touched, setTouched] = useState(false);
const [value, setValue] = useState('');
const error = touched && !isValid(value);

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onBlur={() => setTouched(true)}
  aria-invalid={error}
  className={error ? "border-destructive" : ""}
/>
{error && (
  <p className="text-sm text-destructive mt-1">
    Please enter a valid email address
  </p>
)}
{touched && !error && (
  <p className="text-sm text-success mt-1">
    <Check className="inline h-4 w-4" /> Looks good!
  </p>
)}
```

---

## Adaptive Error Messages (98% of sites fail this)

| Generic (BAD) | Adaptive (GOOD) |
|---------------|-----------------|
| `Invalid card` | `Your card number is incomplete (need 16 digits)` |
| `Invalid card` | `Card numbers don't start with 0` |
| `Invalid card` | `This doesn't look like a Visa/Mastercard number` |
| `Invalid email` | `Missing @ symbol` |
| `Invalid email` | `Missing domain (e.g., .com)` |
| `Invalid password` | `Need at least 8 characters (you have 5)` |
| `Invalid password` | `Add at least one number` |

---

## Form UX Statistics

```
- 31% of sites lack inline validation
- 34% don't retain card data after errors → abandonments
- 53% don't Luhn-validate credit card numbers
- Users take UP TO 5 MINUTES to resolve vague errors
```

---

## Touch Zone (Mobile)

```
┌─────────────────────────┐
│   ❌ HARD TO REACH      │  Avoid primary actions here
│      (top corners)      │
├─────────────────────────┤
│   ⚠️ STRETCH ZONE      │  Secondary actions OK
│      (top center)       │
├─────────────────────────┤
│   ✅ NATURAL ZONE      │  PRIMARY ACTIONS HERE
│      (bottom half)      │  Navigation, main CTAs
└─────────────────────────┘
        👍 (thumb)
```

---

## Mobile Navigation Patterns

```tsx
// Bottom navigation for primary actions
<nav className="fixed bottom-0 inset-x-0 h-16 bg-background border-t">
  <div className="flex justify-around items-center h-full">
    <NavItem icon={Home} label="Home" />
    <NavItem icon={Search} label="Search" />
    <NavItem icon={Plus} label="Create" primary />
    <NavItem icon={Bell} label="Activity" />
    <NavItem icon={User} label="Profile" />
  </div>
</nav>

// FAB for primary action
<Button
  size="icon"
  className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg"
>
  <Plus className="h-6 w-6" />
</Button>
```

---

## Input Group Pattern

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="name@example.com" />
  <p className="text-sm text-muted-foreground">
    We'll never share your email.
  </p>
</div>
```

---

## Error State Pattern

```tsx
<div className="space-y-2">
  <Label htmlFor="email" className="text-destructive">Email</Label>
  <Input
    id="email"
    className="border-destructive focus-visible:ring-destructive"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-destructive">
    Please enter a valid email address.
  </p>
</div>
```

---

## CHECKLIST: UX Patterns

### Forms
- [ ] Inline validation on blur
- [ ] Errors removed when corrected
- [ ] Adaptive error messages
- [ ] Helper text for complex fields
- [ ] Positive feedback for valid fields

### Mobile
- [ ] Touch targets ≥ 48×48 dp
- [ ] 8dp spacing between targets
- [ ] Primary actions in thumb zone
- [ ] Bottom navigation for main actions
- [ ] FAB for primary action
