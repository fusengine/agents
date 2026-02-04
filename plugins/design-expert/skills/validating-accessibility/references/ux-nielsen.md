---
name: ux-nielsen
description: Nielsen's 10 Usability Heuristics and practical UX principles
when-to-use: Applying Nielsen heuristics, improving usability, validating UX decisions
keywords: nielsen, heuristics, usability, system status, user control, feedback
priority: critical
related: ux-laws.md, ux-wcag.md, ux-patterns.md
---

# Nielsen's 10 Usability Heuristics

## Sources
- [Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/)

---

## 1. Visibility of System Status

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

---

## 2. Match Between System and Real World

**Use language users understand, not technical jargon.**

| WRONG (Technical) | CORRECT (Human) |
|-------------------|-----------------|
| `Error 500` | `Something went wrong. Please try again.` |
| `Invalid input` | `Please enter a valid email address` |
| `Authentication failed` | `Wrong password. Try again or reset it.` |
| `Null reference exception` | `We couldn't find that page` |
| `Session expired` | `You've been logged out. Please sign in again.` |

---

## 3. User Control and Freedom

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

---

## 4. Consistency and Standards

**Follow platform conventions. Users spend most time on OTHER sites.**

```tsx
// Use established patterns
<nav>Logo left, nav center/right, CTA far right</nav>
<form>Labels above inputs, submit button bottom-right</form>
<table>Actions column far right</table>
<modal>X close button top-right</modal>
```

---

## 5. Error Prevention

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

---

## 6. Recognition Rather Than Recall

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

---

## 7. Flexibility and Efficiency of Use

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

---

## 8. Aesthetic and Minimalist Design

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

---

## 9. Help Users Recover from Errors

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

---

## 10. Help and Documentation

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

## CHECKLIST: Nielsen Heuristics

- [ ] System status visible (loading, success, error)
- [ ] Language matches users (no jargon)
- [ ] Undo available for destructive actions
- [ ] Follows established conventions
- [ ] Errors prevented before they happen
- [ ] No memory burden (recognition > recall)
