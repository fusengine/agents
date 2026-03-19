# Error Message Patterns

## Formula: What happened + Why + What to do

```
✓ "Couldn't save changes — your session expired. Sign in again."
✓ "Payment failed — your card was declined. Try another card."
✗ "An error occurred." (no context, no action)
✗ "Error 403: Unauthorized" (technical, no guidance)
```

## 404 — Page Not Found

```
Heading:     "Page not found"
Description: "This page doesn't exist or was moved."
CTA:         "Go to homepage" + "Search for something"

Friendly:    "Hmm, nothing here."
             "The page you're looking for has moved or doesn't exist."
             [Back] [Search]
```

## 500 — Server Error

```
Heading:     "Something went wrong"
Description: "We're having trouble on our end. Our team has been notified."
CTA:         "Try again" + "Contact support"

Never say:   "Internal Server Error" — technical, alarming
```

## Form Validation

| Field | Error Message |
|-------|---------------|
| Email empty | "Email is required" |
| Email invalid | "Enter a valid email (e.g., you@example.com)" |
| Password too short | "Password must be at least 8 characters" |
| Passwords don't match | "Passwords don't match — try again" |
| Required field | "This field is required" |
| File too large | "File is too large (max 10MB). Compress it and try again." |
| Wrong format | "Use PDF or DOCX format only" |

## Payment Errors

| Scenario | Message |
|----------|---------|
| Card declined | "Your card was declined. Contact your bank or use a different card." |
| Expired card | "Your card has expired. Update your payment method." |
| Insufficient funds | "Insufficient funds. Try a different payment method." |
| Network error | "Payment couldn't be processed. Check your connection and try again." |

## Permission / Access Errors

| Scenario | Message |
|----------|---------|
| Not logged in | "Sign in to access this page" |
| Insufficient role | "You don't have permission to do this. Ask your admin." |
| Feature locked | "This feature requires a Pro plan. Upgrade to unlock it." |

## Rules
- Start with "what happened", not "error" or "warning"
- Always include a recovery action
- Show inline errors next to the offending field (not a toast)
- Never blame the user ("invalid input" → "that format isn't supported")
- Destructive errors (data loss) need confirmation, not just a message
