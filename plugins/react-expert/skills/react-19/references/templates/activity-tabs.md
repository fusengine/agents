---
name: activity-tabs-template
description: Activity component for tabs that preserve state
---

# Activity Component for Tabs

## Basic Tabs with State Preservation

```typescript
// modules/cores/components/Tabs.tsx
import { Activity } from 'react'
import { useState } from 'react'
import type { TabsProps } from '../interfaces/ui.interface'

/**
 * Tabs component that preserves state when switching.
 */
export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0].id)

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'border-b-2 border-blue-500' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content with Activity */}
      <div className="p-4">
        {tabs.map((tab) => (
          <Activity
            key={tab.id}
            mode={activeTab === tab.id ? 'visible' : 'hidden'}
          >
            {tab.content}
          </Activity>
        ))}
      </div>
    </div>
  )
}

// Usage
function Dashboard() {
  return (
    <Tabs
      tabs={[
        { id: 'profile', label: 'Profile', content: <ProfileForm /> },
        { id: 'settings', label: 'Settings', content: <SettingsForm /> },
        { id: 'billing', label: 'Billing', content: <BillingForm /> }
      ]}
    />
  )
}
```

---

## Form Tabs with Preserved Input

```typescript
// modules/settings/components/SettingsTabs.tsx
import { Activity } from 'react'
import { useState } from 'react'

/**
 * Settings tabs - form inputs preserved when switching.
 */
export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general')

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('general')}>
          General
        </button>
        <button onClick={() => setActiveTab('security')}>
          Security
        </button>
      </div>

      {/* General tab - form state preserved */}
      <Activity mode={activeTab === 'general' ? 'visible' : 'hidden'}>
        <GeneralSettingsForm />
      </Activity>

      {/* Security tab - form state preserved */}
      <Activity mode={activeTab === 'security' ? 'visible' : 'hidden'}>
        <SecuritySettingsForm />
      </Activity>
    </div>
  )
}

function GeneralSettingsForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // These values persist when tab is hidden!
  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Save</button>
    </form>
  )
}
```

---

## Modal with State Preservation

```typescript
// modules/cores/components/Modal.tsx
import { Activity } from 'react'
import type { ModalProps } from '../interfaces/ui.interface'

/**
 * Modal that preserves content state when closed.
 */
export function Modal({ open, onClose, children }: ModalProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      )}

      {/* Modal content - state preserved when closed */}
      <Activity mode={open ? 'visible' : 'hidden'}>
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-lg p-6 pointer-events-auto">
            <button onClick={onClose}>×</button>
            {children}
          </div>
        </div>
      </Activity>
    </>
  )
}

// Usage - form state preserved when modal closes/reopens
function EditUserModal({ open, onClose, userId }) {
  return (
    <Modal open={open} onClose={onClose}>
      <UserEditForm userId={userId} />
    </Modal>
  )
}
```

---

## Multi-Step Wizard

```typescript
// modules/onboarding/components/OnboardingWizard.tsx
import { Activity } from 'react'
import { useState } from 'react'

/**
 * Wizard with step state preservation.
 */
export function OnboardingWizard() {
  const [step, setStep] = useState(1)

  return (
    <div>
      {/* Step indicators */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={step === s ? 'bg-blue-500' : 'bg-gray-200'}
          >
            Step {s}
          </button>
        ))}
      </div>

      {/* All steps preserved */}
      <Activity mode={step === 1 ? 'visible' : 'hidden'}>
        <Step1Form />
      </Activity>

      <Activity mode={step === 2 ? 'visible' : 'hidden'}>
        <Step2Form />
      </Activity>

      <Activity mode={step === 3 ? 'visible' : 'hidden'}>
        <Step3Form />
      </Activity>

      {/* Navigation */}
      <div>
        <button disabled={step === 1} onClick={() => setStep(step - 1)}>
          Back
        </button>
        <button disabled={step === 3} onClick={() => setStep(step + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
```

---

## Rules

- Use `Activity` when state must persist across visibility changes
- Effects are paused when `mode="hidden"`
- Refs and state remain intact
- Good for: tabs, modals, wizards, sidebars
