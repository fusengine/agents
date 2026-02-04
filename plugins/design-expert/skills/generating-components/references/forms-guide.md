---
name: forms-guide
description: Form design best practices with validation, states, and layout
when-to-use: Designing forms, implementing validation, setting up input states
keywords: forms, input, validation, error, states, single-column, accessibility
priority: high
related: buttons-guide.md, ux-principles.md
---

# Form Design Guide

## FORM ELEMENTS

| Element | Purpose |
|---------|---------|
| **Text Input** | Single-line text entry |
| **Textarea** | Multi-line text entry |
| **Dropdown/Select** | Single choice from list |
| **Checkbox** | Multiple choice selection |
| **Radio** | Single choice from visible options |
| **Slider** | Numeric range selection |

## INPUT STATES (MANDATORY)

### 1. Normal (Inactive)
```tsx
<Input className="border-border bg-background" />
```

### 2. Active (Focused)
```tsx
<Input className="ring-2 ring-primary border-primary" />
```

### 3. Completed (Valid)
```tsx
<Input className="border-success" />
<CheckCircle className="absolute right-3 text-success" />
```

### 4. Error (Invalid)
```tsx
<Input className="border-destructive" aria-invalid="true" />
<p className="text-sm text-destructive">Error message</p>
```

### 5. Disabled
```tsx
<Input disabled className="opacity-50 cursor-not-allowed" />
```

## LAYOUT RULES

### Single Column (MANDATORY)
```tsx
// ✅ CORRECT - Single column layout
<form className="space-y-4">
  <Input placeholder="First name" />
  <Input placeholder="Last name" />
  <Input placeholder="Email" />
  <Button className="w-full">Submit</Button>
</form>

// ❌ WRONG - Multi-column disrupts vertical flow
<form className="grid grid-cols-2 gap-4">
  <Input placeholder="First name" />
  <Input placeholder="Last name" />
</form>
```

**WHY**: Multi-column forms disrupt vertical momentum and cause incorrect field grouping.

## QUESTION ORDER

1. Start with introduction/context
2. Ask for name (First, Last)
3. Basic contact info (Email, Phone)
4. Progress to complex/sensitive questions

```tsx
<form className="space-y-6">
  {/* Section 1: Personal */}
  <fieldset className="space-y-4">
    <legend className="text-lg font-semibold">Personal Details</legend>
    <Input placeholder="First name" />
    <Input placeholder="Last name" />
    <Input type="email" placeholder="Email" />
  </fieldset>

  {/* Section 2: Shipping */}
  <fieldset className="space-y-4">
    <legend className="text-lg font-semibold">Shipping Details</legend>
    <Input placeholder="Address" />
    <Input placeholder="City" />
  </fieldset>
</form>
```

## SHADOW EFFECTS

### Inner Shadow (Conversion Boost)
```tsx
<Input className="shadow-inner" />
```
**Studies show**: Subtle inner shadow marginally improves conversion rates.

### Drop Shadow (Aesthetic)
```tsx
<Input className="shadow-sm border" />
```

### Shadow + No Outline (Risky)
```tsx
// ⚠️ May confuse users - field less recognizable
<Input className="shadow-md border-0" />
```

## VALIDATION PATTERNS

### Inline Validation (On Blur)
```tsx
const [error, setError] = useState<string | null>(null);

<Input
  onBlur={(e) => {
    if (!isValidEmail(e.target.value)) {
      setError('Please enter a valid email');
    }
  }}
/>
{error && <p className="text-sm text-destructive">{error}</p>}
```

### Adaptive Error Messages
```tsx
// ❌ Generic
<p>Invalid input</p>

// ✅ Specific
<p>Email must include @ symbol</p>
```

**STAT**: 98% of sites fail at adaptive error messages (Baymard Institute).

## LABEL PLACEMENT

### Above Input (Recommended)
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email address</Label>
  <Input id="email" type="email" />
</div>
```

### Floating Label (Modern)
```tsx
<div className="relative">
  <Input id="email" placeholder=" " className="peer" />
  <Label
    htmlFor="email"
    className="absolute left-3 -top-2 text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:text-base transition-all"
  >
    Email
  </Label>
</div>
```

## PLACEHOLDER TEXT

- **DO**: Use for format hints (e.g., "name@example.com")
- **DON'T**: Use as label replacement (disappears on focus)

```tsx
// ✅ Good
<Label>Email</Label>
<Input placeholder="name@example.com" />

// ❌ Bad - No label
<Input placeholder="Enter your email address" />
```

## HELPER TEXT

```tsx
<div className="space-y-2">
  <Label>Password</Label>
  <Input type="password" />
  <p className="text-sm text-muted-foreground">
    Must be at least 8 characters with one number.
  </p>
</div>
```

## FORM SECTIONS (Long Forms)

### Divide by Category
```tsx
<form className="space-y-8">
  <section>
    <h3 className="text-lg font-semibold mb-4">Account</h3>
    {/* Account fields */}
  </section>

  <section>
    <h3 className="text-lg font-semibold mb-4">Billing</h3>
    {/* Billing fields */}
  </section>
</form>
```

### Multi-Step Forms
```tsx
<div className="space-y-4">
  <Steps current={step} />
  {step === 1 && <PersonalInfoStep />}
  {step === 2 && <ShippingStep />}
  {step === 3 && <PaymentStep />}
  <div className="flex justify-between">
    <Button variant="outline" onClick={prevStep}>Back</Button>
    <Button onClick={nextStep}>Continue</Button>
  </div>
</div>
```

## ACCESSIBILITY REQUIREMENTS

- [ ] Labels linked to inputs via `htmlFor`/`id`
- [ ] Error messages have `aria-describedby`
- [ ] Invalid fields have `aria-invalid="true"`
- [ ] Required fields marked with asterisk + `required`
- [ ] Focus order follows visual order
- [ ] Keyboard navigation works

## FORBIDDEN PATTERNS

- Multi-column layouts for forms
- Placeholder as only label
- Generic error messages
- No visual distinction between states
- Submit button before all fields
- Required fields without indicator
