---
name: react-native
description: TanStack Form with React Native - native input handling, keyboard management, platform-specific validation
when-to-use: mobile forms, native TextInput, keyboard handling, platform-specific patterns
keywords: React Native, TanStack Form, TextInput, onChangeText, keyboard, mobile forms
priority: low
related: templates/react-native-form.md
---

# TanStack Form for React Native

## Native Input Handling

**React Native forms differ fundamentally from web forms.**

### Purpose
- Adapt web form validation patterns to native components
- Handle TextInput vs HTML input differences
- Manage mobile keyboard interactions

### When to Use
- Building forms in React Native apps (iOS/Android)
- Complex validation on native platforms
- Multi-step forms with persistent state

### Key Points
- Replace `onChange` with `onChangeText` (TextInput specific)
- TextInput returns string directly, not event object
- Handle keyboard visibility manually
- Platform-specific validation rules may differ

---

## onChangeText vs onChange

**TextInput requires `onChangeText` callback.**

### Purpose
- Capture user input from native TextInput components
- Simplified API compared to web onChange events

### When to Use
- Any TextInput field in React Native
- When integrating with TanStack Form

### Key Points
- `onChangeText` passes the text string directly
- No event object wrapping required
- Fires on every character change
- More performant than web onChange in some cases

---

## Keyboard Handling

**Mobile keyboards require special management.**

### Purpose
- Control keyboard visibility during form interaction
- Improve user experience with keyboard timing
- Dismiss keyboard on form submission

### When to Use
- After form submission completes
- When transitioning between form sections
- On validation errors requiring user attention

### Key Points
- Use `Keyboard.dismiss()` from react-native
- Handle keyboard avoiding views with SafeAreaView
- Consider keyboard type per input (`keyboardType="email-address"`)
- Test on both iOS and Android

---

## Platform-Specific Validation

**iOS and Android may have different constraints.**

### Purpose
- Apply validation rules appropriate to each platform
- Handle device-specific behaviors
- Optimize user experience per platform

### When to Use
- Complex validation logic
- Handling phone numbers or locale-specific formats
- Platform-specific character restrictions

### Key Points
- Use `Platform.select()` for conditional validation
- Different character sets may be available per platform
- Network requests may have different timeouts
- Gesture handling differs between platforms

---

## Native Form Patterns

**React Native forms follow established mobile conventions.**

### Purpose
- Leverage native UI patterns users expect
- Maintain accessibility on mobile devices
- Follow platform guidelines (iOS HIG, Material Design)

### When to Use
- Any form submission flow
- Structured data capture
- Multi-field validation

### Key Points
- Use native components (TextInput, ScrollView, SafeAreaView)
- Form submission typically uses `onPress` on Button
- No form tag equivalent - use View wrapper
- Access field values from TanStack Form store

---

→ See `templates/react-native-form.md` for code examples
