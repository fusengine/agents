---
name: "React Native Form Template"
description: "Complete TanStack Form patterns for React Native with TextInput, keyboard management, and platform-specific styling"
tags: ["forms", "tanstack-form", "react-native", "zod", "validation", "typescript", "mobile"]
difficulty: "intermediate"
---

# React Native Form Template: TanStack Form + Zod

Complete working example of a form optimized for mobile with keyboard management, platform-specific styling, and proper error display.

## Installation

```bash
npm install @tanstack/react-form zod
npm install react-native
# Expo project: Already includes React Native
# Bare RN project: Ensure react-native is installed
```

## Complete Code

```typescript
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

/**
 * Zod validation schema for mobile form
 * Defines field requirements and validation rules
 */
const mobileFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters'),
});

type MobileFormData = z.infer<typeof mobileFormSchema>;

interface ReactNativeFormProps {
  /** Callback fired on successful form submission */
  onSubmit: (data: MobileFormData) => Promise<void>;
  /** Optional loading state prop from parent */
  isSubmitting?: boolean;
}

/**
 * ReactNativeForm Component
 *
 * Mobile-optimized form with:
 * - TextInput integration with onChangeText
 * - Automatic keyboard dismiss on submit
 * - Platform-specific styling (iOS/Android)
 * - Proper keyboard avoidance layout
 * - Error display optimized for mobile screens
 * - Loading state with activity indicator
 *
 * @param onSubmit - Async callback to handle form submission
 * @param isSubmitting - Optional external loading state
 *
 * @example
 * ```tsx
 * export default function ContactScreen() {
 *   const handleSubmit = async (data: MobileFormData) => {
 *     const response = await fetch('https://api.example.com/contact', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(data),
 *     });
 *     if (!response.ok) throw new Error('Submission failed');
 *   };
 *
 *   return (
 *     <ReactNativeForm onSubmit={handleSubmit} />
 *   );
 * }
 * ```
 */
export function ReactNativeForm({
  onSubmit,
  isSubmitting: externalIsSubmitting = false,
}: ReactNativeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<MobileFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: '',
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setServerError(null);
        // Dismiss keyboard when submitting
        Keyboard.dismiss();
        await onSubmit(values.value as MobileFormData);
        // Show success feedback
        Alert.alert('Success', 'Your submission was successful!', [
          { text: 'OK' },
        ]);
        // Reset form after successful submission
        form.reset();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'An error occurred';
        setServerError(message);
        Alert.alert('Error', message, [{ text: 'OK' }]);
      } finally {
        setIsLoading(false);
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: mobileFormSchema,
      onBlur: mobileFormSchema,
      onSubmit: mobileFormSchema,
    },
  });

  const isProcessing = isLoading || externalIsSubmitting;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingVertical: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Server Error Alert - Mobile Optimized */}
        {serverError && (
          <View
            style={{
              marginBottom: 16,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#FEE2E2',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#DC2626',
            }}
          >
            <Text style={{ color: '#991B1B', fontSize: 14, fontWeight: '500' }}>
              Error: {serverError}
            </Text>
          </View>
        )}

        {/* Full Name Field */}
        <FieldRenderer
          field={form.getFieldInfo('fullName')}
          label="Full Name"
          placeholder="John Doe"
          keyboardType="default"
          disabled={isProcessing}
          onChangeText={(value) =>
            form.getFieldInfo('fullName').handleChange(value)
          }
          onBlur={() => form.getFieldInfo('fullName').handleBlur()}
        />

        {/* Email Field */}
        <FieldRenderer
          field={form.getFieldInfo('email')}
          label="Email Address"
          placeholder="john@example.com"
          keyboardType="email-address"
          disabled={isProcessing}
          onChangeText={(value) =>
            form.getFieldInfo('email').handleChange(value)
          }
          onBlur={() => form.getFieldInfo('email').handleBlur()}
          autoCapitalize="none"
        />

        {/* Phone Field */}
        <FieldRenderer
          field={form.getFieldInfo('phone')}
          label="Phone Number"
          placeholder="1234567890"
          keyboardType="phone-pad"
          disabled={isProcessing}
          onChangeText={(value) =>
            form.getFieldInfo('phone').handleChange(value)
          }
          onBlur={() => form.getFieldInfo('phone').handleBlur()}
        />

        {/* Message Field - Multiline */}
        <FieldRenderer
          field={form.getFieldInfo('message')}
          label="Message"
          placeholder="Type your message here..."
          multiline
          numberOfLines={4}
          disabled={isProcessing}
          onChangeText={(value) =>
            form.getFieldInfo('message').handleChange(value)
          }
          onBlur={() => form.getFieldInfo('message').handleBlur()}
          textAlignVertical="top"
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={() => form.handleSubmit()}
          disabled={isProcessing || !form.state.isFormValid}
          style={{
            marginTop: 24,
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: isProcessing ? '#9CA3AF' : '#2563EB',
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
          }}
          activeOpacity={isProcessing ? 1 : 0.8}
        >
          {isProcessing && (
            <ActivityIndicator size="small" color="#FFFFFF" />
          )}
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {isProcessing ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>

        {/* Form Validity Indicator (Debug) */}
        {process.env.NODE_ENV === 'development' && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              Form Valid: {form.state.isFormValid ? 'Yes' : 'No'}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/**
 * FieldRenderer Component
 *
 * Reusable field component with:
 * - TextInput with proper styling
 * - Error display below input
 * - Platform-specific styling (iOS has different appearance)
 * - Focus states with visual feedback
 * - Support for multiline inputs (textarea-like)
 *
 * @param field - Field info from TanStack Form
 * @param label - Field label text
 * @param placeholder - Input placeholder text
 * @param keyboardType - TextInput keyboardType prop
 * @param disabled - Whether input is disabled
 * @param onChangeText - Callback for text changes
 * @param onBlur - Callback for blur event
 * @param autoCapitalize - TextInput autoCapitalize prop
 * @param multiline - Whether input is multiline
 * @param numberOfLines - Number of lines for multiline input
 * @param textAlignVertical - Text alignment for multiline
 */
interface FieldRendererProps {
  field: ReturnType<typeof form.getFieldInfo>;
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  disabled: boolean;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: 'auto' | 'top' | 'center' | 'bottom';
}

/**
 * FieldRenderer - Internal field component
 *
 * Handles individual field rendering with proper error states
 * and platform-specific styling
 */
function FieldRenderer({
  field,
  label,
  placeholder,
  keyboardType = 'default',
  disabled,
  onChangeText,
  onBlur,
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines,
  textAlignVertical = 'auto',
}: FieldRendererProps) {
  const hasError = field.state.meta.errors.length > 0;
  const value = field.state.value as string;

  return (
    <View style={{ marginBottom: 20 }}>
      {/* Label */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: 8,
        }}
      >
        {label}
        {hasError && <Text style={{ color: '#DC2626' }}> *</Text>}
      </Text>

      {/* TextInput - Platform Specific Styling */}
      <TextInput
        style={{
          paddingHorizontal: 12,
          paddingVertical: Platform.OS === 'ios' ? 12 : 10,
          fontSize: 16,
          borderWidth: 1,
          borderColor: hasError ? '#DC2626' : '#D1D5DB',
          borderRadius: 8,
          color: '#1F2937',
          backgroundColor: disabled ? '#F3F4F6' : '#FFFFFF',
          ...(Platform.OS === 'android' && {
            paddingVertical: 12,
          }),
          ...(Platform.OS === 'ios' && {
            fontSize: 16,
          }),
          ...(hasError && {
            borderColor: '#DC2626',
            backgroundColor: '#FEF2F2',
          }),
        }}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        disabled={disabled}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
      />

      {/* Error Message - Mobile Optimized */}
      {hasError && (
        <Text style={{ fontSize: 12, color: '#DC2626', marginTop: 6 }}>
          {field.state.meta.errors[0]?.toString()}
        </Text>
      )}
    </View>
  );
}

/**
 * Example Usage in a Screen Component
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { View, SafeAreaView } from 'react-native';
 *
 * type MobileFormData = Parameters<
 *   typeof ReactNativeForm
 * >[0]['onSubmit'] extends (data: infer T) => Promise<void>
 *   ? T
 *   : never;
 *
 * export default function ContactScreen() {
 *   const [isSubmitting, setIsSubmitting] = useState(false);
 *
 *   const handleSubmit = async (data: MobileFormData) => {
 *     try {
 *       setIsSubmitting(true);
 *       const response = await fetch('https://api.example.com/contact', {
 *         method: 'POST',
 *         headers: {
 *           'Content-Type': 'application/json',
 *         },
 *         body: JSON.stringify(data),
 *       });
 *
 *       if (!response.ok) {
 *         throw new Error('Failed to submit form');
 *       }
 *     } finally {
 *       setIsSubmitting(false);
 *     }
 *   };
 *
 *   return (
 *     <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
 *       <ReactNativeForm
 *         onSubmit={handleSubmit}
 *         isSubmitting={isSubmitting}
 *       />
 *     </SafeAreaView>
 *   );
 * }
 * ```
 */
```

## Key Features

### TextInput Integration
- **onChangeText Handler**: Captures user input changes directly
- **Keyboard Types**: email-address, phone-pad, numeric, default
- **Multiline Support**: Text areas for longer messages
- **Auto Capitalization**: Sentence, word, or character level

### Keyboard Management
- **Dismiss on Submit**: `Keyboard.dismiss()` hides keyboard after form submission
- **KeyboardAvoidingView**: Prevents form inputs from being hidden by keyboard
- **ScrollView Integration**: `keyboardShouldPersistTaps="handled"` for smooth interactions
- **Platform-Aware**: Different behavior for iOS vs Android

### Platform-Specific Styling
- **iOS Styling**:
  - Rounded corners with proper padding
  - Specific font sizes for readability
  - Light background for disabled state

- **Android Styling**:
  - Material Design compliant
  - Proper text alignment for multiline inputs
  - Native-feeling interactions

### Error Display - Mobile Optimized
- **Compact Error Messages**: Fit small screens
- **Visual Indicators**: Red borders, pink backgrounds
- **Required Markers**: Red asterisk on labels with errors
- **Inline Feedback**: Errors appear immediately below fields

### Loading State
- **ActivityIndicator**: Shows loading spinner on button
- **Button State Management**: Disabled during submission
- **External State Support**: Accept isSubmitting prop for parent-controlled state
- **Form Reset**: Clears fields after successful submission

## Usage

### Basic Form Submission
```tsx
<ReactNativeForm
  onSubmit={async (data) => {
    const result = await submitContactForm(data);
    if (!result.success) throw new Error(result.error);
  }}
/>
```

### With External Loading State
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

<ReactNativeForm
  onSubmit={async (data) => {
    setIsSubmitting(true);
    try {
      await sendData(data);
    } finally {
      setIsSubmitting(false);
    }
  }}
  isSubmitting={isSubmitting}
/>
```

### In Navigation Stack
```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: 'Contact Us' }}
      />
    </Stack.Navigator>
  );
}
```

## Platform-Specific Styling Guide

### iOS Customization
```typescript
// In FieldRenderer style prop:
...(Platform.OS === 'ios' && {
  fontSize: 16,
  fontFamily: 'System', // Use system font
  letterSpacing: 0.5,
})
```

### Android Customization
```typescript
// In FieldRenderer style prop:
...(Platform.OS === 'android' && {
  paddingVertical: 12,
  includeFontPadding: false, // Remove extra padding
})
```

## Keyboard Dismissal Patterns

### Method 1: On Submit (Recommended)
```tsx
onSubmit: async (values) => {
  Keyboard.dismiss(); // Hide keyboard before submission
  await onSubmit(values.value);
}
```

### Method 2: Custom Button Handler
```tsx
<TouchableOpacity
  onPress={() => {
    Keyboard.dismiss();
    form.handleSubmit();
  }}
>
```

### Method 3: Gesture-Based
```tsx
<GestureHandlerRootView>
  <PanGestureHandler onGestureEvent={Keyboard.dismiss}>
    <ScrollView>
      {/* form content */}
    </ScrollView>
  </PanGestureHandler>
</GestureHandlerRootView>
```

## Validation

Uses Zod schema for type-safe validation:
- **Real-time Validation**: onChange and onBlur
- **Phone Validation**: Regex pattern for 10+ digits
- **Custom Messages**: User-friendly error text
- **Cross-field Rules**: Can add password confirmation patterns

Extend the schema:
```typescript
const advancedSchema = mobileFormSchema.extend({
  dateOfBirth: z.string().refine(
    (date) => new Date(date) < new Date(),
    'Date must be in the past'
  ),
  agreeToTerms: z.boolean().refine(
    (v) => v === true,
    'You must agree to terms'
  ),
});
```

## Accessibility

- **Labels**: Associated with inputs via field name
- **Error States**: Clear red indicators
- **Keyboard Types**: Optimized for input content
- **Touch Targets**: 48+ dp minimum (handled by padding)
- **Text Size**: 16px minimum for comfortable reading

## Error Handling

- **Validation Errors**: Displayed inline below fields with red border
- **Server Errors**: Shown in banner at top with Alert dialog
- **Network Errors**: Caught in try-catch, displayed to user
- **Form Reset**: Clears all fields after successful submission

## Troubleshooting

### Keyboard Not Dismissing
```tsx
// Use Keyboard.dismiss() BEFORE async operation
Keyboard.dismiss();
await onSubmit(data);
```

### Input Validation Not Working
Ensure `validatorAdapter` and `validators` are configured:
```tsx
const form = useForm({
  validatorAdapter: zodValidator(),
  validators: {
    onChange: mobileFormSchema,
    onBlur: mobileFormSchema,
    onSubmit: mobileFormSchema,
  },
});
```

### Form Not Resetting
Call `form.reset()` after successful submission:
```tsx
await onSubmit(values.value);
form.reset();
```
