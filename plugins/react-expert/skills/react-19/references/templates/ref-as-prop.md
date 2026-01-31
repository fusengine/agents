---
name: ref-as-prop-template
description: ref as prop patterns - no more forwardRef needed in React 19
---

# ref as Prop Patterns

## Basic Input with Ref

```typescript
// modules/cores/components/Input.tsx
import type { InputHTMLAttributes, Ref } from 'react'
import { cn } from '@/modules/cores/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
  label?: string
  error?: string
}

/**
 * Input component with ref support.
 */
export function Input({
  ref,
  label,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium">{label}</label>
      )}
      <input
        ref={ref}
        className={cn(
          'rounded border px-3 py-2',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  )
}

// Usage
function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null)

  const focusEmail = () => {
    emailRef.current?.focus()
  }

  return (
    <form>
      <Input
        ref={emailRef}
        label="Email"
        type="email"
        placeholder="Enter email"
      />
      <button type="button" onClick={focusEmail}>
        Focus Email
      </button>
    </form>
  )
}
```

---

## Button with Ref

```typescript
// modules/cores/components/Button.tsx
import type { ButtonHTMLAttributes, Ref } from 'react'
import { cn } from '@/modules/cores/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
  variant?: ButtonVariant
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-secondary-foreground',
  ghost: 'hover:bg-accent'
}

/**
 * Button component with ref support.
 */
export function Button({
  ref,
  variant = 'primary',
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'rounded px-4 py-2 font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}
```

---

## Generic Polymorphic Component

```typescript
// modules/cores/components/Box.tsx
import type { ElementType, ComponentPropsWithRef, Ref } from 'react'

type BoxProps<T extends ElementType> = {
  as?: T
  ref?: Ref<Element>
} & Omit<ComponentPropsWithRef<T>, 'as' | 'ref'>

/**
 * Polymorphic Box component.
 */
export function Box<T extends ElementType = 'div'>({
  as,
  ref,
  ...props
}: BoxProps<T>) {
  const Component = as || 'div'
  return <Component ref={ref} {...props} />
}

// Usage
function Example() {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Box as="a" ref={linkRef} href="/home">Link</Box>
      <Box as="button" ref={buttonRef} onClick={() => {}}>Button</Box>
      <Box ref={useRef<HTMLDivElement>(null)}>Div</Box>
    </>
  )
}
```

---

## Multiple Refs

```typescript
// modules/cores/components/Dialog.tsx
import type { Ref, ReactNode } from 'react'

interface DialogProps {
  containerRef?: Ref<HTMLDivElement>
  contentRef?: Ref<HTMLDivElement>
  children: ReactNode
  open: boolean
}

/**
 * Dialog with multiple ref props.
 */
export function Dialog({
  containerRef,
  contentRef,
  children,
  open
}: DialogProps) {
  if (!open) return null

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black/50">
      <div
        ref={contentRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded"
      >
        {children}
      </div>
    </div>
  )
}

// Usage
function Example() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (e: MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      // Clicked outside content
    }
  }

  return (
    <Dialog
      containerRef={overlayRef}
      contentRef={contentRef}
      open={true}
    >
      Dialog content
    </Dialog>
  )
}
```

---

## Ref Callback Pattern

```typescript
// modules/cores/components/AutoFocusInput.tsx
import type { InputHTMLAttributes, RefCallback } from 'react'

interface AutoFocusInputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: RefCallback<HTMLInputElement>
  autoFocusOnMount?: boolean
}

/**
 * Input with optional auto-focus using ref callback.
 */
export function AutoFocusInput({
  ref,
  autoFocusOnMount = false,
  ...props
}: AutoFocusInputProps) {
  const handleRef: RefCallback<HTMLInputElement> = (element) => {
    if (element && autoFocusOnMount) {
      element.focus()
    }

    // Forward to parent ref if provided
    if (typeof ref === 'function') {
      ref(element)
    }
  }

  return <input ref={handleRef} {...props} />
}
```

---

## Composing Refs

```typescript
// modules/cores/lib/compose-refs.ts
import type { Ref, MutableRefObject, RefCallback } from 'react'

/**
 * Compose multiple refs into one.
 */
export function composeRefs<T>(
  ...refs: (Ref<T> | undefined)[]
): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref && 'current' in ref) {
        (ref as MutableRefObject<T | null>).current = value
      }
    })
  }
}

// Usage
function ComposedInput({ ref, ...props }: InputProps) {
  const internalRef = useRef<HTMLInputElement>(null)

  return (
    <input
      ref={composeRefs(ref, internalRef)}
      {...props}
    />
  )
}
```

---

## Migration from forwardRef

```typescript
// BEFORE (React 18)
import { forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...props} />
      </div>
    )
  }
)

// AFTER (React 19)
interface InputProps {
  ref?: Ref<HTMLInputElement>
  label: string
}

function Input({ ref, label, ...props }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} {...props} />
    </div>
  )
}
```

---

## Rules

- Add `ref?: Ref<ElementType>` to props interface
- Destructure `ref` from props
- Pass `ref` to the target element
- No wrapper needed (unlike forwardRef)
- Component name preserved in DevTools
- forwardRef still works but is deprecated
