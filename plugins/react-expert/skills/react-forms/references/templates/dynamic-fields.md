---
title: "Dynamic Field Arrays"
description: "Template for managing dynamic arrays of form fields with add/remove/reorder functionality"
version: "1.0.0"
lastUpdated: "2026-01-31"
author: "React Expert"
category: "Form Management"
tags: ["forms", "arrays", "dynamic-fields", "useFieldArray"]
difficulty: "intermediate"
related:
  - form-validation.md
  - controlled-inputs.md
---

## Overview

Dynamic field arrays allow users to add, remove, and reorder multiple form inputs. This template demonstrates how to implement array-based form fields using React Hook Form's `useFieldArray`.

**Key Features:**
- Add new items to array
- Remove specific items
- Reorder items with drag-and-drop or buttons
- Support for complex nested objects
- Full TypeScript support
- Validation per array item

---

## Basic Implementation

### Component: DynamicFieldArray

```typescript
/**
 * DynamicFieldArray Component
 *
 * Manages a dynamic array of form fields with add/remove/reorder capabilities.
 * Suitable for lists like social links, phone numbers, education history, etc.
 *
 * @param name - Field name in form data (e.g., "socialLinks", "phoneNumbers")
 * @param label - Display label for the field array section
 * @param placeholder - Placeholder text for input fields
 * @param onAdd - Optional callback when item is added
 * @param maxItems - Maximum number of items allowed (optional)
 *
 * @example
 * ```tsx
 * <DynamicFieldArray
 *   name="socialLinks"
 *   label="Social Media Links"
 *   placeholder="Enter URL"
 *   maxItems={5}
 * />
 * ```
 */

'use client';

import React, { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface DynamicFieldArrayProps {
  name: string;
  label: string;
  placeholder?: string;
  onAdd?: () => void;
  maxItems?: number;
  minItems?: number;
}

export function DynamicFieldArray({
  name,
  label,
  placeholder = '',
  onAdd,
  maxItems,
  minItems = 0,
}: DynamicFieldArrayProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name,
  });

  /**
   * Handler to add new field
   * Calls optional onAdd callback and appends empty object to array
   */
  const handleAddField = useCallback(() => {
    if (maxItems && fields.length >= maxItems) {
      return;
    }
    append({ value: '' });
    onAdd?.();
  }, [append, fields.length, maxItems, onAdd]);

  /**
   * Handler to remove field at specific index
   * @param index - Position in array to remove
   */
  const handleRemoveField = useCallback(
    (index: number) => {
      if (fields.length > minItems) {
        remove(index);
      }
    },
    [remove, fields.length, minItems]
  );

  /**
   * Handler to move item up in array
   * @param index - Current position
   */
  const handleMoveUp = useCallback(
    (index: number) => {
      if (index > 0) {
        move(index, index - 1);
      }
    },
    [move]
  );

  /**
   * Handler to move item down in array
   * @param index - Current position
   */
  const handleMoveDown = useCallback(
    (index: number) => {
      if (index < fields.length - 1) {
        move(index, index + 1);
      }
    },
    [move, fields.length]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-900">
          {label}
        </label>
        {(!maxItems || fields.length < maxItems) && (
          <button
            type="button"
            onClick={handleAddField}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label={`Add ${label}`}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      <div className="space-y-3">
        {fields.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No items added yet</p>
        ) : (
          fields.map((field, index) => {
            const fieldErrors = errors[name]?.[index];

            return (
              <div
                key={field.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* Drag handle */}
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="w-5 h-5" />
                </button>

                {/* Input field */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={placeholder}
                    {...register(`${name}.${index}.value`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-invalid={!!fieldErrors}
                  />
                  {fieldErrors?.value && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.value.message}
                    </p>
                  )}
                </div>

                {/* Reorder buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === fields.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  disabled={fields.length <= minItems}
                  className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Remove item ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {maxItems && (
        <p className="text-xs text-gray-500">
          {fields.length} / {maxItems} items
        </p>
      )}
    </div>
  );
}
```

---

## Advanced: Complex Object Array

For managing arrays of complex objects like social links:

```typescript
/**
 * SocialLinksArray Component
 *
 * Specialized dynamic field array for managing social media profile links.
 * Each item contains platform selection and URL.
 *
 * @example
 * ```tsx
 * <SocialLinksArray maxItems={5} />
 * ```
 */

interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'website';
  url: string;
}

interface SocialLinksArrayProps {
  maxItems?: number;
  onValidate?: (link: SocialLink) => boolean;
}

const PLATFORMS = [
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'website', label: 'Personal Website' },
] as const;

export function SocialLinksArray({
  maxItems = 5,
  onValidate,
}: SocialLinksArrayProps) {
  const { control, register, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  const watchedFields = watch('socialLinks');

  /**
   * Validate URL format based on platform
   * @param platform - Social platform type
   * @param url - URL to validate
   * @returns true if valid
   */
  const validateUrl = useCallback(
    (platform: string, url: string): boolean => {
      const patterns: Record<string, RegExp> = {
        twitter: /^https?:\/\/(www\.)?twitter\.com\/[\w]+/i,
        linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w\-]+/i,
        github: /^https?:\/\/(www\.)?github\.com\/[\w\-]+/i,
        website: /^https?:\/\/.+\..+/i,
      };

      const isValid = patterns[platform]?.test(url) || true;
      return onValidate?.({ platform: platform as any, url }) ?? isValid;
    },
    [onValidate]
  );

  const handleAddLink = useCallback(() => {
    if (fields.length < maxItems) {
      append({
        platform: 'twitter',
        url: '',
      });
    }
  }, [append, fields.length, maxItems]);

  return (
    <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg">
      <legend className="text-sm font-semibold text-gray-900">
        Social Media Links
      </legend>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500">No social links added yet</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            {/* Platform selector */}
            <div className="w-40">
              <select
                {...register(`socialLinks.${index}.platform`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* URL input */}
            <div className="flex-1">
              <input
                type="url"
                placeholder="https://..."
                {...register(`socialLinks.${index}.url`, {
                  validate: (value) => {
                    if (!value) return 'URL is required';
                    const platform = watchedFields?.[index]?.platform;
                    return (
                      validateUrl(platform, value) ||
                      'Invalid URL for selected platform'
                    );
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors?.socialLinks?.[index]?.url && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.socialLinks[index]?.url?.message}
                </p>
              )}
            </div>

            {/* Reorder and remove buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === fields.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {fields.length < maxItems && (
        <button
          type="button"
          onClick={handleAddLink}
          className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
        >
          <Plus className="inline w-4 h-4 mr-2" />
          Add Social Link
        </button>
      )}
    </fieldset>
  );
}
```

---

## Usage Example

```typescript
/**
 * Complete form example with dynamic field array
 */

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema validation
const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  socialLinks: z.array(
    z.object({
      platform: z.enum(['twitter', 'linkedin', 'github', 'website']),
      url: z.string().url('Invalid URL'),
    })
  ),
});

type ProfileFormData = z.infer<typeof ProfileSchema>;

export function ProfileForm() {
  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: '',
      socialLinks: [
        { platform: 'twitter', url: '' },
      ],
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log('Form data:', data);
      // API call here
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic field */}
        <div>
          <label className="block text-sm font-medium text-gray-900">
            Name
          </label>
          <input
            type="text"
            {...methods.register('name')}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {methods.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {methods.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Dynamic field array */}
        <SocialLinksArray maxItems={5} />

        {/* Submit */}
        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {methods.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </FormProvider>
  );
}
```

---

## Drag and Drop (Advanced)

For drag-and-drop reordering:

```typescript
/**
 * DragDropFieldArray Component
 *
 * Adds visual drag-and-drop reordering capability.
 * Requires: npm install framer-motion
 */

import { Reorder } from 'framer-motion';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function DragDropFieldArray({ name, label }: any) {
  const { control, register, watch } = useFormContext();
  const { fields, move } = useFieldArray({ control, name });
  const items = watch(name);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-900">
        {label}
      </label>

      <Reorder.Group axis="y" values={items} onReorder={move}>
        {items.map((item: any, index: number) => (
          <Reorder.Item key={item.id} value={item}>
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing">
              <input
                type="text"
                {...register(`${name}.${index}.value`)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
```

---

## Best Practices

1. **Validation**: Validate array items individually, not the entire array
2. **Keys**: Always use `field.id` for React keys, not array indices
3. **Limits**: Set `maxItems` to prevent memory issues
4. **Callbacks**: Use `useCallback` for handlers to prevent re-renders
5. **Error Display**: Show validation errors per item
6. **Empty State**: Handle zero-item case gracefully
7. **Accessibility**: Add proper `aria-label` attributes
8. **Performance**: Use `useFieldArray` with `control` for optimal performance

---

## Related Templates

- **[Form Validation](form-validation.md)** - Schema validation with Zod/Yup
- **[Controlled Inputs](controlled-inputs.md)** - Managing form state
- **[Nested Forms](nested-forms.md)** - Complex nested structures
- **[Custom Hooks](../hooks/useFormState.md)** - Form state management
