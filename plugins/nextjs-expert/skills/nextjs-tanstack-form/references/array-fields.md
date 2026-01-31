---
name: array-fields
description: Dynamic field arrays for lists, invitations, and repeating inputs
when-to-use: Building forms with dynamic add/remove fields like guests, items, addresses
keywords: mode array, pushValue, removeValue, insertValue, swapValues, moveValue
priority: medium
requires: field-api.md
related: multi-step-form.md
---

# Array Fields

## Form.Field with mode="array"

Use `mode="array"` for dynamic repeating fields:

```typescript
form.Field(
  {
    name: "guests",
    mode: "array",
  },
  (fieldApi) => (
    <fieldApi.Info>
      {(fieldState) => (
        <div>
          {fieldState.value.map((_, index) => (
            <GuestField key={index} index={index} />
          ))}
        </div>
      )}
    </fieldApi.Info>
  )
)
```

## Array Field Methods

### pushValue - Add Item
```typescript
const guestField = form.getFieldValue("guests")
guestField.pushValue({
  name: "",
  email: "",
})
```

### removeValue - Delete Item
```typescript
guestField.removeValue(2) // Remove guest at index 2
```

### insertValue - Insert at Position
```typescript
guestField.insertValue(1, {
  name: "John",
  email: "john@example.com",
})
```

### swapValues - Reorder Items
```typescript
guestField.swapValues(0, 1) // Swap guests 0 and 1
```

### moveValue - Move Item
```typescript
guestField.moveValue(2, 0) // Move item from index 2 to 0
```

## Nested Field Access

Access nested properties via dot notation with index:

```typescript
const nameField = form.getFieldValue("guests")[0].name
// Or use path:
form.Field({ name: "guests.0.name" }, (fieldApi) => (
  <input {...fieldApi.getInputProps()} />
))
```

## Complete Dynamic Form Example

```typescript
/**
 * Dynamic guests form with array field management
 */
export function GuestListForm() {
  const form = useForm({
    defaultValues: {
      guests: [{ name: "", email: "" }],
    },
  })

  return (
    <form.Provider>
      <form.Field
        name="guests"
        mode="array"
      >
        {(fieldApi) => (
          <div>
            <fieldApi.Info>
              {(fieldState) =>
                fieldState.value.map((_, i) => (
                  <GuestRow
                    key={i}
                    index={i}
                    onRemove={() =>
                      form.getFieldValue("guests").removeValue(i)
                    }
                  />
                ))
              }
            </fieldApi.Info>
            <button
              type="button"
              onClick={() =>
                form
                  .getFieldValue("guests")
                  .pushValue({ name: "", email: "" })
              }
            >
              Add Guest
            </button>
          </div>
        )}
      </form.Field>
      <button type="submit">Submit</button>
    </form.Provider>
  )
}

function GuestRow({
  index,
  onRemove,
}: {
  index: number
  onRemove: () => void
}) {
  return (
    <form.Field name={`guests.${index}.name`}>
      {(fieldApi) => (
        <div>
          <input
            {...fieldApi.getInputProps()}
            placeholder="Guest name"
          />
          <button type="button" onClick={onRemove}>
            Remove
          </button>
        </div>
      )}
    </form.Field>
  )
}
```
