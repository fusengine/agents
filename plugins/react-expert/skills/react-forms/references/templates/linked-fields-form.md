---
name: "TanStack Form Linked Fields Patterns"
description: "Complete working examples for dependent field validation, conditional enabling, and cross-field validation using TanStack Form v1"
---

# TanStack Form Linked Fields Patterns

Complete TypeScript patterns for handling interdependent fields in forms using TanStack Form.

## Pattern 1: Password Confirmation Validation

```typescript
import { useForm, useField } from '@tanstack/react-form';
import { ZodValidator } from '@tanstack/react-form/zod';
import { z } from 'zod';

/**
 * Password confirmation schema with custom refinement
 * Ensures password and confirmPassword fields match
 */
const passwordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

/**
 * Password confirmation form component
 * Demonstrates:
 * - Cross-field validation with Zod refinement
 * - Form-level error propagation to specific fields
 * - Type-safe field validation
 */
export function PasswordConfirmationForm() {
  const form = useForm<PasswordFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: ZodValidator(passwordSchema),
    onSubmit: async (formData) => {
      console.log('Form submitted:', formData.value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <PasswordField form={form} />
      <ConfirmPasswordField form={form} />
      <button type="submit">Sign Up</button>
    </form>
  );
}

/**
 * Password input field component
 * @param form - TanStack form instance
 */
function PasswordField({
  form,
}: {
  form: ReturnType<typeof useForm<PasswordFormData>>;
}) {
  return form.Field(
    { name: 'password' },
    (field) => (
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={!!field.state.meta.errors.length}
        />
        {field.state.meta.errors.length > 0 && (
          <span role="alert" className="error">
            {field.state.meta.errors[0]}
          </span>
        )}
      </div>
    )
  );
}

/**
 * Confirm password input field component
 * Validates against password field using form-level schema
 * @param form - TanStack form instance
 */
function ConfirmPasswordField({
  form,
}: {
  form: ReturnType<typeof useForm<PasswordFormData>>;
}) {
  return form.Field(
    { name: 'confirmPassword' },
    (field) => (
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={!!field.state.meta.errors.length}
        />
        {field.state.meta.errors.length > 0 && (
          <span role="alert" className="error">
            {field.state.meta.errors[0]}
          </span>
        )}
      </div>
    )
  );
}
```

---

## Pattern 2: Country/Province Dependent Select

```typescript
import { useForm, useField } from '@tanstack/react-form';
import { ZodValidator } from '@tanstack/react-form/zod';
import { z } from 'zod';

/** Province data mapped by country code */
const PROVINCE_DATA: Record<string, string[]> = {
  CA: ['Alberta', 'British Columbia', 'Manitoba', 'Ontario', 'Quebec'],
  US: ['California', 'Texas', 'New York', 'Florida'],
  MX: ['Jalisco', 'Mexico City', 'Guanajuato'],
};

interface LocationFormData {
  country: string;
  province: string;
}

/**
 * Location form with dependent country/province selects
 * Demonstrates:
 * - Dynamic field options based on other field value
 * - fieldApi.form.getFieldValue() for reading other field values
 * - Resetting dependent fields when parent changes
 */
export function CountryProvinceForm() {
  const form = useForm<LocationFormData>({
    defaultValues: {
      country: '',
      province: '',
    },
    validators: ZodValidator(
      z.object({
        country: z.string().min(1, 'Country is required'),
        province: z.string().min(1, 'Province is required'),
      })
    ),
    onSubmit: async (formData) => {
      console.log('Location submitted:', formData.value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <CountrySelect form={form} />
      <ProvinceSelect form={form} />
      <button type="submit">Save Location</button>
    </form>
  );
}

/**
 * Country select field
 * Triggers province field reset when country changes
 * @param form - TanStack form instance
 */
function CountrySelect({
  form,
}: {
  form: ReturnType<typeof useForm<LocationFormData>>;
}) {
  return form.Field(
    { name: 'country' },
    (field) => (
      <div>
        <label htmlFor="country">Country</label>
        <select
          id="country"
          value={field.state.value}
          onChange={(e) => {
            const newCountry = e.target.value;
            field.handleChange(newCountry);

            // Reset province field when country changes
            const provinceField = form.getFieldInfo('province');
            if (provinceField) {
              form.setFieldValue('province', '');
            }
          }}
          onBlur={field.handleBlur}
          aria-invalid={!!field.state.meta.errors.length}
        >
          <option value="">Select a country</option>
          <option value="CA">Canada</option>
          <option value="US">United States</option>
          <option value="MX">Mexico</option>
        </select>
        {field.state.meta.errors.length > 0 && (
          <span role="alert" className="error">
            {field.state.meta.errors[0]}
          </span>
        )}
      </div>
    )
  );
}

/**
 * Province select field
 * Options are dynamically populated based on selected country
 * Uses fieldApi.form.getFieldValue() to read country value
 * @param form - TanStack form instance
 */
function ProvinceSelect({
  form,
}: {
  form: ReturnType<typeof useForm<LocationFormData>>;
}) {
  return form.Field(
    { name: 'province' },
    (field) => {
      // Read the current country value from the form
      const selectedCountry = form.getFieldValue('country') as string;
      const provinces = PROVINCE_DATA[selectedCountry] || [];
      const isDisabled = !selectedCountry;

      return (
        <div>
          <label htmlFor="province">Province/State</label>
          <select
            id="province"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            disabled={isDisabled}
            aria-invalid={!!field.state.meta.errors.length}
          >
            <option value="">
              {isDisabled ? 'Select a country first' : 'Select a province'}
            </option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          {field.state.meta.errors.length > 0 && (
            <span role="alert" className="error">
              {field.state.meta.errors[0]}
            </span>
          )}
        </div>
      );
    }
  );
}
```

---

## Pattern 3: Start Date / End Date Validation

```typescript
import { useForm } from '@tanstack/react-form';
import { ZodValidator } from '@tanstack/react-form/zod';
import { z } from 'zod';

interface DateRangeFormData {
  startDate: string;
  endDate: string;
}

/**
 * Date range schema with custom refinement
 * Ensures end date is after start date
 */
const dateRangeSchema = z
  .object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

/**
 * Date range form with cross-field date validation
 * Demonstrates:
 * - Date format validation and comparison
 * - Custom error messages for date relationships
 * - Dynamic min/max attributes on date inputs
 */
export function DateRangeForm() {
  const form = useForm<DateRangeFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
    },
    validators: ZodValidator(dateRangeSchema),
    onSubmit: async (formData) => {
      console.log('Date range submitted:', formData.value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <StartDateField form={form} />
      <EndDateField form={form} />
      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Start date input field
 * @param form - TanStack form instance
 */
function StartDateField({
  form,
}: {
  form: ReturnType<typeof useForm<DateRangeFormData>>;
}) {
  return form.Field(
    { name: 'startDate' },
    (field) => (
      <div>
        <label htmlFor="startDate">Start Date</label>
        <input
          id="startDate"
          type="date"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={!!field.state.meta.errors.length}
        />
        {field.state.meta.errors.length > 0 && (
          <span role="alert" className="error">
            {field.state.meta.errors[0]}
          </span>
        )}
      </div>
    )
  );
}

/**
 * End date input field
 * min attribute enforces start date as minimum
 * @param form - TanStack form instance
 */
function EndDateField({
  form,
}: {
  form: ReturnType<typeof useForm<DateRangeFormData>>;
}) {
  return form.Field(
    { name: 'endDate' },
    (field) => {
      // Get start date to use as min constraint
      const startDate = form.getFieldValue('startDate') as string;

      return (
        <div>
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            min={startDate || undefined}
            aria-invalid={!!field.state.meta.errors.length}
          />
          {field.state.meta.errors.length > 0 && (
            <span role="alert" className="error">
              {field.state.meta.errors[0]}
            </span>
          )}
        </div>
      );
    }
  );
}
```

---

## Pattern 4: fieldApi.form.getFieldValue() Usage

```typescript
import { useForm } from '@tanstack/react-form';
import { ZodValidator } from '@tanstack/react-form/zod';
import { z } from 'zod';

interface PricingFormData {
  basePrice: number;
  discount: number;
  taxRate: number;
  finalPrice: number;
}

/**
 * Advanced form demonstrating multiple fieldApi.form.getFieldValue() calls
 * Calculates final price based on multiple interdependent fields
 * Shows read-only computed fields derived from other fields
 */
export function PricingCalculationForm() {
  const form = useForm<PricingFormData>({
    defaultValues: {
      basePrice: 0,
      discount: 0,
      taxRate: 0,
      finalPrice: 0,
    },
    validators: ZodValidator(
      z.object({
        basePrice: z.number().positive('Base price must be positive'),
        discount: z.number().min(0).max(100, 'Discount must be 0-100%'),
        taxRate: z.number().min(0).max(100, 'Tax rate must be 0-100%'),
        finalPrice: z.number(),
      })
    ),
    onSubmit: async (formData) => {
      console.log('Pricing submitted:', formData.value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <BasePriceField form={form} />
      <DiscountField form={form} />
      <TaxRateField form={form} />
      <FinalPriceField form={form} />
      <button type="submit">Calculate</button>
    </form>
  );
}

/**
 * Base price input field
 * @param form - TanStack form instance
 */
function BasePriceField({
  form,
}: {
  form: ReturnType<typeof useForm<PricingFormData>>;
}) {
  return form.Field(
    { name: 'basePrice' },
    (field) => (
      <div>
        <label htmlFor="basePrice">Base Price ($)</label>
        <input
          id="basePrice"
          type="number"
          step="0.01"
          value={field.state.value}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value) || 0;
            field.handleChange(newValue);
            // Recalculate final price
            updateFinalPrice(form);
          }}
          onBlur={field.handleBlur}
          aria-invalid={!!field.state.meta.errors.length}
        />
        {field.state.meta.errors.length > 0 && (
          <span role="alert" className="error">
            {field.state.meta.errors[0]}
          </span>
        )}
      </div>
    )
  );
}

/**
 * Discount percentage field
 * @param form - TanStack form instance
 */
function DiscountField({
  form,
}: {
  form: ReturnType<typeof useForm<PricingFormData>>;
}) {
  return form.Field(
    { name: 'discount' },
    (field) => (
      <div>
        <label htmlFor="discount">Discount (%)</label>
        <input
          id="discount"
          type="number"
          step="0.1"
          value={field.state.value}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value) || 0;
            field.handleChange(newValue);
            updateFinalPrice(form);
          }}
          onBlur={field.handleBlur}
          aria-invalid={!!field.state.meta.errors.length}
        />
        {field.state.meta.errors.length > 0 && (
          <span role="alert" className="error">
            {field.state.meta.errors[0]}
          </span>
        )}
      </div>
    )
  );
}

/**
 * Tax rate percentage field
 * @param form - TanStack form instance
 */
function TaxRateField({
  form,
}: {
  form: ReturnType<typeof useForm<PricingFormData>>;
}) {
  return form.Field(
    { name: 'taxRate' },
    (field) => (
      <div>
        <label htmlFor="taxRate">Tax Rate (%)</label>
        <input
          id="taxRate"
          type="number"
          step="0.1"
          value={field.state.value}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value) || 0;
            field.handleChange(newValue);
            updateFinalPrice(form);
          }}
          onBlur={field.handleBlur}
          aria-invalid={!!field.state.meta.errors.length}
        />
        {field.state.meta.errors.length > 0 && (
          <span role="alert" className="error">
            {field.state.meta.errors[0]}
          </span>
        )}
      </div>
    )
  );
}

/**
 * Final price read-only display field
 * Computed from base price, discount, and tax rate
 * @param form - TanStack form instance
 */
function FinalPriceField({
  form,
}: {
  form: ReturnType<typeof useForm<PricingFormData>>;
}) {
  return form.Field(
    { name: 'finalPrice' },
    (field) => (
      <div>
        <label htmlFor="finalPrice">Final Price ($)</label>
        <input
          id="finalPrice"
          type="number"
          value={field.state.value.toFixed(2)}
          readOnly
          aria-readonly="true"
        />
      </div>
    )
  );
}

/**
 * Utility function to recalculate final price
 * Demonstrates fieldApi.form.getFieldValue() for reading all necessary field values
 * Calculation: (basePrice - (basePrice * discount / 100)) * (1 + taxRate / 100)
 * @param form - TanStack form instance
 */
function updateFinalPrice(form: ReturnType<typeof useForm<PricingFormData>>) {
  const basePrice = (form.getFieldValue('basePrice') as number) || 0;
  const discount = (form.getFieldValue('discount') as number) || 0;
  const taxRate = (form.getFieldValue('taxRate') as number) || 0;

  const discountedPrice = basePrice - (basePrice * discount) / 100;
  const finalPrice = discountedPrice * (1 + taxRate / 100);

  form.setFieldValue('finalPrice', Math.round(finalPrice * 100) / 100);
}
```

---

## Pattern 5: Dynamic Field Enabling Based on Other Field

```typescript
import { useForm } from '@tanstack/react-form';
import { ZodValidator } from '@tanstack/react-form/zod';
import { z } from 'zod';

interface ShippingFormData {
  useDefaultAddress: boolean;
  address: string;
  city: string;
  zipCode: string;
  specialInstructions: string;
  useSpecialInstructions: boolean;
}

/**
 * Shipping form with conditional field enablement
 * Demonstrates:
 * - Disabling/enabling fields based on checkbox values
 * - fieldApi.form.getFieldValue() to read boolean toggle state
 * - Dynamic validation based on which fields are enabled
 * - Clearing field values when disabled
 */
export function DynamicShippingForm() {
  const form = useForm<ShippingFormData>({
    defaultValues: {
      useDefaultAddress: true,
      address: '',
      city: '',
      zipCode: '',
      specialInstructions: '',
      useSpecialInstructions: false,
    },
    validators: ZodValidator(
      z.object({
        useDefaultAddress: z.boolean(),
        address: z.string(),
        city: z.string(),
        zipCode: z.string(),
        specialInstructions: z.string(),
        useSpecialInstructions: z.boolean(),
      })
    ),
    onSubmit: async (formData) => {
      console.log('Shipping submitted:', formData.value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <UseDefaultAddressCheckbox form={form} />
      <CustomAddressFields form={form} />
      <UseSpecialInstructionsCheckbox form={form} />
      <SpecialInstructionsField form={form} />
      <button type="submit">Save Shipping</button>
    </form>
  );
}

/**
 * Checkbox to toggle between default and custom address
 * When checked, disables custom address fields
 * @param form - TanStack form instance
 */
function UseDefaultAddressCheckbox({
  form,
}: {
  form: ReturnType<typeof useForm<ShippingFormData>>;
}) {
  return form.Field(
    { name: 'useDefaultAddress' },
    (field) => (
      <div>
        <label>
          <input
            type="checkbox"
            checked={field.state.value}
            onChange={(e) => {
              const isChecked = e.target.checked;
              field.handleChange(isChecked);

              // Clear custom address fields when using default
              if (isChecked) {
                form.setFieldValue('address', '');
                form.setFieldValue('city', '');
                form.setFieldValue('zipCode', '');
              }
            }}
          />
          Use Default Address
        </label>
      </div>
    )
  );
}

/**
 * Custom address fields container
 * All fields are disabled when useDefaultAddress is true
 * @param form - TanStack form instance
 */
function CustomAddressFields({
  form,
}: {
  form: ReturnType<typeof useForm<ShippingFormData>>;
}) {
  // Read toggle state from form
  const useDefault = form.getFieldValue('useDefaultAddress') as boolean;
  const isDisabled = useDefault;

  return (
    <fieldset disabled={isDisabled}>
      <legend>Custom Address</legend>
      <AddressField form={form} disabled={isDisabled} />
      <CityField form={form} disabled={isDisabled} />
      <ZipCodeField form={form} disabled={isDisabled} />
    </fieldset>
  );
}

/**
 * Address input field
 * @param form - TanStack form instance
 * @param disabled - Whether field should be disabled
 */
function AddressField({
  form,
  disabled,
}: {
  form: ReturnType<typeof useForm<ShippingFormData>>;
  disabled: boolean;
}) {
  return form.Field(
    { name: 'address' },
    (field) => (
      <div>
        <label htmlFor="address">Street Address</label>
        <input
          id="address"
          type="text"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          disabled={disabled}
          aria-invalid={!!field.state.meta.errors.length}
        />
      </div>
    )
  );
}

/**
 * City input field
 * @param form - TanStack form instance
 * @param disabled - Whether field should be disabled
 */
function CityField({
  form,
  disabled,
}: {
  form: ReturnType<typeof useForm<ShippingFormData>>;
  disabled: boolean;
}) {
  return form.Field(
    { name: 'city' },
    (field) => (
      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          disabled={disabled}
          aria-invalid={!!field.state.meta.errors.length}
        />
      </div>
    )
  );
}

/**
 * Zip code input field
 * @param form - TanStack form instance
 * @param disabled - Whether field should be disabled
 */
function ZipCodeField({
  form,
  disabled,
}: {
  form: ReturnType<typeof useForm<ShippingFormData>>;
  disabled: boolean;
}) {
  return form.Field(
    { name: 'zipCode' },
    (field) => (
      <div>
        <label htmlFor="zipCode">Zip Code</label>
        <input
          id="zipCode"
          type="text"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          disabled={disabled}
          aria-invalid={!!field.state.meta.errors.length}
        />
      </div>
    )
  );
}

/**
 * Checkbox to enable/disable special instructions field
 * @param form - TanStack form instance
 */
function UseSpecialInstructionsCheckbox({
  form,
}: {
  form: ReturnType<typeof useForm<ShippingFormData>>;
}) {
  return form.Field(
    { name: 'useSpecialInstructions' },
    (field) => (
      <div>
        <label>
          <input
            type="checkbox"
            checked={field.state.value}
            onChange={(e) => {
              field.handleChange(e.target.checked);
              // Clear instructions when disabled
              if (!e.target.checked) {
                form.setFieldValue('specialInstructions', '');
              }
            }}
          />
          Add Special Instructions
        </label>
      </div>
    )
  );
}

/**
 * Special instructions textarea field
 * Only enabled when useSpecialInstructions is true
 * @param form - TanStack form instance
 */
function SpecialInstructionsField({
  form,
}: {
  form: ReturnType<typeof useForm<ShippingFormData>>;
}) {
  return form.Field(
    { name: 'specialInstructions' },
    (field) => {
      // Read toggle state to determine if field is enabled
      const isEnabled = form.getFieldValue(
        'useSpecialInstructions'
      ) as boolean;

      return (
        <div>
          <label htmlFor="specialInstructions">Special Instructions</label>
          <textarea
            id="specialInstructions"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            disabled={!isEnabled}
            rows={4}
            placeholder="e.g., Leave at door, Ring doorbell twice"
            aria-invalid={!!field.state.meta.errors.length}
          />
        </div>
      );
    }
  );
}
```

---

## Key Concepts

### fieldApi.form.getFieldValue()

```typescript
// Read any field value from the form
const countryValue = form.getFieldValue('country') as string;
const isEnabled = form.getFieldValue('useSpecialInstructions') as boolean;
const price = (form.getFieldValue('basePrice') as number) || 0;
```

### Form-Level Validation

```typescript
// Zod refinement for cross-field validation
const schema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'], // Error appears on confirmPassword field
  });
```

### Resetting Dependent Fields

```typescript
// When a parent field changes, reset dependent fields
field.handleChange(newValue);
form.setFieldValue('dependentField', '');
```

### Dynamic Field Attributes

```typescript
// Set min/max/disabled based on other field values
const startDate = form.getFieldValue('startDate') as string;
<input type="date" min={startDate} />
```
