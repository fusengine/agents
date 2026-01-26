---
name: ux-principles
description: Complete UX principles 2026 - Nielsen heuristics, Laws of UX, cognitive psychology, accessibility, form validation
---

# UX Principles & Psychology 2026

## Sources
- [Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Laws of UX](https://lawsofux.com/)
- [Baymard Institute](https://baymard.com/blog/inline-form-validation)
- [Material Design 3](https://m3.material.io/foundations/designing/structure)

---

## PART 1: Nielsen's 10 Usability Heuristics

### 1. Visibility of System Status
**Always keep users informed about what's happening.**

```tsx
// WRONG - No feedback
<button onClick={submit}>Save</button>

// CORRECT - Clear system status
<button onClick={submit} disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    "Save"
  )}
</button>

// After action - Toast confirmation
<Toast>
  <CheckCircle className="text-success" />
  Changes saved successfully
</Toast>
```

**Checklist:**
- [ ] Loading indicators on all async actions
- [ ] Progress bars for multi-step processes
- [ ] Success/error feedback after actions
- [ ] Current location indicator in navigation

### 2. Match Between System and Real World
**Use language users understand, not technical jargon.**

| WRONG (Technical) | CORRECT (Human) |
|-------------------|-----------------|
| `Error 500` | `Something went wrong. Please try again.` |
| `Invalid input` | `Please enter a valid email address` |
| `Authentication failed` | `Wrong password. Try again or reset it.` |
| `Null reference exception` | `We couldn't find that page` |
| `Session expired` | `You've been logged out. Please sign in again.` |

### 3. User Control and Freedom
**Provide clear emergency exits and undo options.**

```tsx
// MANDATORY: Undo for destructive actions
const handleDelete = () => {
  setDeleted(true);
  toast({
    title: "Item deleted",
    action: <Button variant="outline" onClick={undo}>Undo</Button>,
    duration: 5000, // 5 seconds to undo
  });
};

// MANDATORY: Cancel buttons in modals
<Dialog>
  <DialogFooter>
    <Button variant="outline" onClick={close}>Cancel</Button>
    <Button onClick={confirm}>Confirm</Button>
  </DialogFooter>
</Dialog>
```

### 4. Consistency and Standards
**Follow platform conventions. Users spend most time on OTHER sites.**

```tsx
// Use established patterns
<nav>Logo left, nav center/right, CTA far right</nav>
<form>Labels above inputs, submit button bottom-right</form>
<table>Actions column far right</table>
<modal>X close button top-right</modal>
```

### 5. Error Prevention
**Prevent errors before they happen. Better than error messages.**

```tsx
// PREVENTION: Disable invalid actions
<Button disabled={!isFormValid}>Submit</Button>

// PREVENTION: Confirmation for destructive actions
<AlertDialog>
  <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This will permanently delete your account and all data.
    </AlertDialogDescription>
    <AlertDialogAction className="bg-destructive">
      Yes, delete my account
    </AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>

// PREVENTION: Smart defaults
<Input type="date" defaultValue={today} min={today} />
```

### 6. Recognition Rather Than Recall
**Make information visible. Don't force users to remember.**

```tsx
// WRONG - Requires recall
<Select placeholder="Select country" />

// CORRECT - Shows recent/common options
<Select>
  <SelectGroup>
    <SelectLabel>Recent</SelectLabel>
    <SelectItem>France (last used)</SelectItem>
  </SelectGroup>
  <SelectGroup>
    <SelectLabel>All Countries</SelectLabel>
    {countries.map(c => <SelectItem key={c}>{c}</SelectItem>)}
  </SelectGroup>
</Select>

// CORRECT - Autocomplete with suggestions
<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandGroup heading="Suggestions">
      {recentSearches.map(s => <CommandItem>{s}</CommandItem>)}
    </CommandGroup>
  </CommandList>
</Command>
```

### 7. Flexibility and Efficiency of Use
**Accelerators for experts, simplicity for novices.**

```tsx
// Keyboard shortcuts (hidden from novices)
useHotkeys('mod+s', () => save(), { enableOnFormTags: true });
useHotkeys('mod+k', () => openCommandPalette());

// Command palette for power users
<CommandDialog>
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandItem onSelect={save}>
      <span>Save</span>
      <kbd>⌘S</kbd>
    </CommandItem>
  </CommandList>
</CommandDialog>
```

### 8. Aesthetic and Minimalist Design
**Every element must earn its place. Remove the unnecessary.**

```
REMOVE if:
- It doesn't help users complete their goal
- It's rarely used (<5% of users)
- It duplicates information elsewhere
- It's decoration without function

KEEP if:
- It's essential for the primary task
- It prevents errors
- It provides critical context
```

### 9. Help Users Recover from Errors
**Error messages: Plain language + Precise problem + Solution.**

```tsx
// ERROR MESSAGE FORMULA
// [What happened] + [Why] + [How to fix]

// WRONG
<p className="text-destructive">Error</p>

// CORRECT
<div className="text-destructive">
  <p className="font-medium">Payment declined</p>
  <p className="text-sm">Your card was declined by your bank.</p>
  <p className="text-sm">Try a different card or contact your bank.</p>
</div>
```

### 10. Help and Documentation
**Contextual help at the moment of need, not lengthy manuals.**

```tsx
// Tooltips for unclear elements
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <HelpCircle className="h-4 w-4 text-muted-foreground" />
    </TooltipTrigger>
    <TooltipContent>
      <p>Your API key is used to authenticate requests.</p>
      <p className="text-muted-foreground">Find it in Settings → API</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

// Inline helper text
<div className="space-y-2">
  <Label>Password</Label>
  <Input type="password" />
  <p className="text-sm text-muted-foreground">
    Must be at least 8 characters with one number
  </p>
</div>
```

---

## PART 2: Laws of UX (Cognitive Psychology)

### Fitts's Law
**Time to reach target = f(distance, size)**
> Larger targets + closer position = faster interaction

```tsx
// PRIMARY ACTIONS: Large and prominent
<Button size="lg" className="w-full">Get Started</Button>

// Touch targets: 48x48dp minimum (Material Design)
<button className="min-h-12 min-w-12 p-3">
  <Icon className="h-6 w-6" />
</button>

// Position important actions in thumb zone (mobile)
<nav className="fixed bottom-0 left-0 right-0">
  {/* Primary actions HERE - easy thumb reach */}
</nav>
```

### Hick's Law
**Decision time = f(number of choices)**
> More options = longer decisions = higher abandonment

```
PRICING PAGES:
✅ 3 options - optimal conversion
⚠️ 4-5 options - acceptable
❌ 6+ options - decision paralysis

NAVIGATION:
✅ 5-7 top-level items maximum
❌ 10+ items in a single menu
```

### Miller's Law
**Working memory: 7 ± 2 items**
> Chunk information into digestible groups

```tsx
// WRONG - 16 digits ungrouped
<Input value="4242424242424242" />

// CORRECT - Chunked into 4 groups
<Input value="4242 4242 4242 4242" />

// WRONG - Long form, all fields visible
<form>{allFields.map(f => <Input {...f} />)}</form>

// CORRECT - Multi-step wizard
<Stepper>
  <Step title="Account">...</Step>
  <Step title="Profile">...</Step>
  <Step title="Preferences">...</Step>
</Stepper>
```

### Jakob's Law
**Users expect your site to work like other sites they know.**
> Follow established conventions

```
ESTABLISHED PATTERNS:
- Logo top-left → links to home
- Shopping cart icon top-right
- Hamburger menu → mobile navigation
- Footer → legal, sitemap, contact
- Blue underlined text → link
```

### Peak-End Rule
**Users judge experiences by peaks and endings, not averages.**

```tsx
// OPTIMIZE: Checkout success (the END)
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  className="text-center py-12"
>
  <CheckCircle className="h-16 w-16 text-success mx-auto" />
  <h1 className="text-2xl font-bold mt-4">Order Confirmed!</h1>
  <p className="text-muted-foreground">
    You'll receive a confirmation email shortly.
  </p>
</motion.div>

// OPTIMIZE: Delight moments (PEAKS)
// - First successful action
// - Milestone achievements
// - Empty state → first content
```

### Von Restorff Effect (Isolation Effect)
**Distinctive items are remembered better.**

```tsx
// Make primary CTA stand out
<div className="flex gap-2">
  <Button variant="outline">Learn More</Button>
  <Button variant="default">Get Started</Button> {/* STANDS OUT */}
</div>

// Highlight recommended option
<div className="relative border-2 border-primary rounded-xl">
  <span className="absolute -top-3 left-4 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
    Most Popular
  </span>
  {/* Plan content */}
</div>
```

### Goal-Gradient Effect
**Motivation increases as users approach their goal.**

```tsx
// Show progress explicitly
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Profile completion</span>
    <span className="font-medium">75%</span>
  </div>
  <Progress value={75} />
  <p className="text-sm text-muted-foreground">
    Add a profile photo to complete your profile!
  </p>
</div>
```

---

## PART 3: Touch Targets & Mobile UX

### Minimum Touch Target Sizes

| Platform | Minimum Size | Recommended |
|----------|--------------|-------------|
| Material Design | 48×48 dp | 56×56 dp for primary |
| Apple HIG | 44×44 pt | 44×44 pt |
| WCAG 2.2 | 24×24 px | 44×44 px |

```tsx
// CORRECT - 48px touch target
<button className="min-h-12 min-w-12 p-3 touch-manipulation">
  <X className="h-6 w-6" />
  <span className="sr-only">Close</span>
</button>

// WRONG - Too small
<button className="p-1">
  <X className="h-4 w-4" />
</button>
```

### Thumb Zone (Mobile)

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

### Mobile Navigation Patterns

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

## PART 4: Form Validation (Baymard Institute)

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

### Adaptive Error Messages (98% of sites fail this)

| Generic (BAD) | Adaptive (GOOD) |
|---------------|-----------------|
| `Invalid card` | `Your card number is incomplete (need 16 digits)` |
| `Invalid card` | `Card numbers don't start with 0` |
| `Invalid card` | `This doesn't look like a Visa/Mastercard number` |
| `Invalid email` | `Missing @ symbol` |
| `Invalid email` | `Missing domain (e.g., .com)` |
| `Invalid password` | `Need at least 8 characters (you have 5)` |
| `Invalid password` | `Add at least one number` |

### Form UX Statistics

```
- 31% of sites lack inline validation
- 34% don't retain card data after errors → abandonments
- 53% don't Luhn-validate credit card numbers
- Users take UP TO 5 MINUTES to resolve vague errors
```

---

## PART 5: Accessibility (WCAG 2.2 AA)

### Color Contrast Requirements

```
Normal text (<18px):        4.5:1 minimum
Large text (≥18px bold):    3:1 minimum
UI components:              3:1 minimum
Focus indicators (NEW):     3:1 minimum
```

### Focus Management

```tsx
// WCAG 2.2 REQUIRES visible focus indicators
<Button className="
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2
">

// Focus trap in modals (REQUIRED)
<Dialog>
  <DialogContent
    onOpenAutoFocus={(e) => firstInput.current?.focus()}
    onCloseAutoFocus={(e) => triggerButton.current?.focus()}
  >
```

### Keyboard Navigation

```
Tab           → Move forward through focusable elements
Shift+Tab     → Move backward
Enter/Space   → Activate buttons/links
Escape        → Close modals/dropdowns
Arrow keys    → Navigate within components (tabs, menus)
```

### Reduced Motion

```tsx
import { useReducedMotion } from "framer-motion";

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    />
  );
}
```

---

## CHECKLIST BEFORE SHIPPING

### Usability
- [ ] System status visible (loading, success, error)
- [ ] Language matches users (no jargon)
- [ ] Undo available for destructive actions
- [ ] Follows established conventions
- [ ] Errors prevented before they happen
- [ ] No memory burden (recognition > recall)

### Cognitive Load
- [ ] Max 5-7 navigation items
- [ ] Information chunked into groups
- [ ] Progressive disclosure used
- [ ] Primary action visually distinct

### Mobile
- [ ] Touch targets ≥ 48×48 dp
- [ ] 8dp spacing between targets
- [ ] Primary actions in thumb zone
- [ ] Bottom navigation for main actions

### Forms
- [ ] Inline validation on blur
- [ ] Errors removed when corrected
- [ ] Adaptive error messages
- [ ] Helper text for complex fields

### Accessibility
- [ ] 4.5:1 contrast for text
- [ ] 3:1 contrast for UI components
- [ ] Visible focus indicators
- [ ] Keyboard navigable
- [ ] Reduced motion respected
