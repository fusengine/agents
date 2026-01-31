---
title: Conditional Field Rendering
description: Show/hide form fields based on user selections with React Hook Form
keywords:
  - conditional fields
  - form.Subscribe
  - radio buttons
  - dropdown selections
  - dynamic validation
  - payment methods
category: Form Patterns
level: intermediate
---

# Conditional Field Rendering in React Hook Form

Template for rendering form fields conditionally based on user selections, with automatic validation handling.

## Pattern Overview

Use `form.Subscribe()` to watch specific field values and render fields conditionally. Supports radio buttons, select dropdowns, and complex nested conditions.

---

## Basic Example: Payment Method Form

```typescript
/**
 * PaymentFormData - Form data with conditional payment fields
 * @interface
 * @property {string} paymentMethod - Selected payment method (card, bank, paypal)
 * @property {string} [cardNumber] - Credit card number (shown when method=card)
 * @property {string} [cardExpiry] - Card expiry date (shown when method=card)
 * @property {string} [bankAccount] - Bank account number (shown when method=bank)
 * @property {string} [bankRoutingNumber] - Routing number (shown when method=bank)
 * @property {string} [paypalEmail] - PayPal email (shown when method=paypal)
 */
interface PaymentFormData {
  paymentMethod: 'card' | 'bank' | 'paypal';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  bankAccount?: string;
  bankRoutingNumber?: string;
  paypalEmail?: string;
}

/**
 * PaymentForm - Render conditional payment fields based on selection
 *
 * Features:
 * - Watch paymentMethod field for changes
 * - Render different fields per payment type
 * - Conditional validation rules
 * - Register/unregister fields dynamically
 *
 * @returns {JSX.Element} Form with conditional payment fields
 */
export function PaymentForm(): JSX.Element {
  const form = useForm<PaymentFormData>({
    defaultValues: {
      paymentMethod: 'card',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      bankAccount: '',
      bankRoutingNumber: '',
      paypalEmail: '',
    },
  });

  const { control, watch, register, formState: { errors } } = form;

  /**
   * Subscribe to paymentMethod changes
   * Re-render conditionally visible fields when selection changes
   */
  const paymentMethod = watch('paymentMethod');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Payment Method Selection */}
      <fieldset>
        <legend className="text-lg font-semibold mb-4">Payment Method</legend>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              value="card"
              {...register('paymentMethod')}
            />
            <span>Credit Card</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              value="bank"
              {...register('paymentMethod')}
            />
            <span>Bank Transfer</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              value="paypal"
              {...register('paymentMethod')}
            />
            <span>PayPal</span>
          </label>
        </div>
      </fieldset>

      {/* Conditional: Credit Card Fields */}
      {paymentMethod === 'card' && (
        <fieldset className="mt-6 p-4 border rounded-lg bg-blue-50">
          <legend className="text-md font-semibold mb-4">Card Details</legend>

          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                Card Number
              </label>
              <input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                {...register('cardNumber', {
                  required: 'Card number is required',
                  pattern: {
                    value: /^\d{13,19}$/,
                    message: 'Enter valid card number',
                  },
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardExpiry" className="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <input
                  id="cardExpiry"
                  placeholder="MM/YY"
                  {...register('cardExpiry', {
                    required: 'Expiry date is required',
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                      message: 'Use MM/YY format',
                    },
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.cardExpiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardExpiry.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="cardCvc" className="block text-sm font-medium mb-1">
                  CVC
                </label>
                <input
                  id="cardCvc"
                  type="password"
                  placeholder="123"
                  {...register('cardCvc', {
                    required: 'CVC is required',
                    pattern: {
                      value: /^\d{3,4}$/,
                      message: 'Enter 3-4 digits',
                    },
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.cardCvc && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardCvc.message}</p>
                )}
              </div>
            </div>
          </div>
        </fieldset>
      )}

      {/* Conditional: Bank Transfer Fields */}
      {paymentMethod === 'bank' && (
        <fieldset className="mt-6 p-4 border rounded-lg bg-green-50">
          <legend className="text-md font-semibold mb-4">Bank Account</legend>

          <div className="space-y-4">
            <div>
              <label htmlFor="bankRoutingNumber" className="block text-sm font-medium mb-1">
                Routing Number
              </label>
              <input
                id="bankRoutingNumber"
                placeholder="123456789"
                {...register('bankRoutingNumber', {
                  required: 'Routing number is required',
                  pattern: {
                    value: /^\d{9}$/,
                    message: 'Routing number must be 9 digits',
                  },
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.bankRoutingNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bankRoutingNumber.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="bankAccount" className="block text-sm font-medium mb-1">
                Account Number
              </label>
              <input
                id="bankAccount"
                type="password"
                placeholder="0123456789"
                {...register('bankAccount', {
                  required: 'Account number is required',
                  minLength: {
                    value: 8,
                    message: 'Account number must be at least 8 digits',
                  },
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.bankAccount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bankAccount.message}
                </p>
              )}
            </div>
          </div>
        </fieldset>
      )}

      {/* Conditional: PayPal Fields */}
      {paymentMethod === 'paypal' && (
        <fieldset className="mt-6 p-4 border rounded-lg bg-yellow-50">
          <legend className="text-md font-semibold mb-4">PayPal Account</legend>

          <div>
            <label htmlFor="paypalEmail" className="block text-sm font-medium mb-1">
              PayPal Email
            </label>
            <input
              id="paypalEmail"
              type="email"
              placeholder="user@example.com"
              {...register('paypalEmail', {
                required: 'PayPal email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter valid email address',
                },
              })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.paypalEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paypalEmail.message}
              </p>
            )}
          </div>
        </fieldset>
      )}

      <button
        type="submit"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit Payment
      </button>
    </form>
  );
}

/**
 * Handler for form submission
 * Only processes fields visible for selected payment method
 *
 * @param {PaymentFormData} data - Form data from React Hook Form
 */
async function onSubmit(data: PaymentFormData): Promise<void> {
  console.log('Form submitted:', data);
  // Process payment based on selected method
}
```

---

## Advanced: Using form.Subscribe() for Complex Conditions

```typescript
/**
 * ProductCheckoutForm - Multi-condition form with Subscribe
 * Shows different fields based on product type AND delivery method
 */
interface CheckoutFormData {
  productType: 'physical' | 'digital' | 'service';
  deliveryMethod?: 'shipping' | 'pickup' | 'email';
  address?: string;
  zipCode?: string;
  pickupLocation?: string;
  emailAddress?: string;
}

export function ProductCheckoutForm(): JSX.Element {
  const form = useForm<CheckoutFormData>({
    defaultValues: {
      productType: 'physical',
    },
  });

  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Product Type */}
      <div className="space-y-3 mb-6">
        <legend className="font-semibold">Product Type</legend>
        <label>
          <input type="radio" value="physical" {...register('productType')} />
          Physical Product
        </label>
        <label>
          <input type="radio" value="digital" {...register('productType')} />
          Digital Download
        </label>
        <label>
          <input type="radio" value="service" {...register('productType')} />
          Service
        </label>
      </div>

      {/* Conditional delivery fields based on productType */}
      <ConditionalDeliveryFields form={form} />

      <button type="submit" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
        Complete Purchase
      </button>
    </form>
  );
}

/**
 * ConditionalDeliveryFields - Show delivery options based on product type
 *
 * @param {UseFormReturn<CheckoutFormData>} form - React Hook Form instance
 * @returns {JSX.Element} Conditional delivery fields
 */
function ConditionalDeliveryFields({
  form,
}: {
  form: UseFormReturn<CheckoutFormData>;
}): JSX.Element {
  const { register, watch, formState: { errors } } = form;
  const productType = watch('productType');
  const deliveryMethod = watch('deliveryMethod');

  // Physical products: show shipping and pickup options
  if (productType === 'physical') {
    return (
      <fieldset className="space-y-4 p-4 border rounded-lg">
        <legend className="font-semibold">Delivery Method</legend>

        <label className="flex gap-3">
          <input
            type="radio"
            value="shipping"
            {...register('deliveryMethod', { required: 'Select delivery method' })}
          />
          <span>Shipping</span>
        </label>

        {deliveryMethod === 'shipping' && (
          <div className="ml-6 space-y-3 p-3 bg-blue-50 rounded">
            <div>
              <label htmlFor="address" className="block text-sm font-medium">
                Address
              </label>
              <input
                id="address"
                {...register('address', { required: 'Address is required' })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium">
                ZIP Code
              </label>
              <input
                id="zipCode"
                {...register('zipCode', { required: 'ZIP code is required' })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
              )}
            </div>
          </div>
        )}

        <label className="flex gap-3">
          <input
            type="radio"
            value="pickup"
            {...register('deliveryMethod')}
          />
          <span>Store Pickup</span>
        </label>

        {deliveryMethod === 'pickup' && (
          <div className="ml-6 space-y-3 p-3 bg-green-50 rounded">
            <label htmlFor="pickupLocation" className="block text-sm font-medium">
              Pickup Location
            </label>
            <select
              id="pickupLocation"
              {...register('pickupLocation', { required: 'Select a location' })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Choose location...</option>
              <option value="downtown">Downtown Store</option>
              <option value="mall">Mall Location</option>
              <option value="airport">Airport</option>
            </select>
            {errors.pickupLocation && (
              <p className="text-red-500 text-sm">{errors.pickupLocation.message}</p>
            )}
          </div>
        )}
      </fieldset>
    );
  }

  // Digital products: show email field
  if (productType === 'digital') {
    return (
      <fieldset className="space-y-4 p-4 border rounded-lg">
        <legend className="font-semibold">Delivery Email</legend>

        <div>
          <label htmlFor="emailAddress" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            id="emailAddress"
            type="email"
            {...register('emailAddress', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email',
              },
            })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.emailAddress && (
            <p className="text-red-500 text-sm">{errors.emailAddress.message}</p>
          )}
        </div>
      </fieldset>
    );
  }

  // Services: no delivery needed
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600">Service will be scheduled separately</p>
    </div>
  );
}
```

---

## Validation Rules for Conditional Fields

```typescript
/**
 * Conditional validation resolver
 * Only validates fields visible based on form state
 */
const conditionalResolver: Resolver<PaymentFormData> = async (data) => {
  const errors: FieldErrors<PaymentFormData> = {};

  // Always validate payment method
  if (!data.paymentMethod) {
    errors.paymentMethod = {
      type: 'required',
      message: 'Payment method is required',
    };
  }

  // Validate credit card fields only if selected
  if (data.paymentMethod === 'card') {
    if (!data.cardNumber?.match(/^\d{13,19}$/)) {
      errors.cardNumber = {
        type: 'pattern',
        message: 'Invalid card number',
      };
    }
    if (!data.cardExpiry?.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.cardExpiry = {
        type: 'pattern',
        message: 'Use MM/YY format',
      };
    }
  }

  // Validate bank fields only if selected
  if (data.paymentMethod === 'bank') {
    if (!data.bankRoutingNumber?.match(/^\d{9}$/)) {
      errors.bankRoutingNumber = {
        type: 'pattern',
        message: 'Routing number must be 9 digits',
      };
    }
    if (!data.bankAccount || data.bankAccount.length < 8) {
      errors.bankAccount = {
        type: 'minLength',
        message: 'Account number too short',
      };
    }
  }

  // Validate PayPal field only if selected
  if (data.paymentMethod === 'paypal') {
    if (!data.paypalEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.paypalEmail = {
        type: 'pattern',
        message: 'Invalid email address',
      };
    }
  }

  return { values: data, errors };
};

// Use in form
const form = useForm<PaymentFormData>({
  resolver: conditionalResolver,
});
```

---

## Key Patterns

### 1. Watch Single Field
```typescript
const paymentMethod = watch('paymentMethod');

// In JSX:
{paymentMethod === 'card' && <CreditCardFields />}
```

### 2. Watch Multiple Fields
```typescript
const [productType, deliveryMethod] = watch(['productType', 'deliveryMethod']);
```

### 3. Conditional Error Display
```typescript
{errors.cardNumber && (
  <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>
)}
```

### 4. Nested Conditionals
```typescript
{paymentMethod === 'card' && (
  <div>
    {cardType === 'debit' && <DebitCardFields />}
    {cardType === 'credit' && <CreditCardFields />}
  </div>
)}
```

---

## Best Practices

- **Use `watch()` for simple conditions**: When watching 1-2 fields
- **Use `form.Subscribe()` for complex logic**: When conditions depend on multiple fields
- **Validate conditionally**: Only require fields that are visible
- **Clear default values**: Ensure hidden fields have sensible defaults
- **Test all paths**: Verify each conditional branch works correctly
- **Combine with custom resolvers**: Complex validation logic for interdependent fields
- **Reset on condition change**: Clear values when switching between conditions (optional but recommended)

---

## Related Templates

- [Basic Form Setup](./basic-form.md)
- [Custom Validation](./custom-validation.md)
- [Dynamic Field Arrays](./dynamic-arrays.md)
