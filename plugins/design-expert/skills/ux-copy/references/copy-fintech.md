# UX Copy — Fintech

## Trust Language

### Account & Balance
```
✓ "Your balance is up to date as of 2:34 PM"
✓ "Secured with 256-bit encryption"
✓ "Protected by FDIC insurance up to $250,000"
✗ "We protect your money" (vague)
✗ "Your data is safe" (unspecific)
```

### Transfers
```
✓ "Send $50 to Sarah — arrives in 1–3 business days"
✓ "Instant transfer (fee: $0.25)"
✓ "This action cannot be undone. Confirm transfer of $500?"
✗ "Transfer submitted" (no confirmation of amount/recipient)
```

## Compliance Wording

### Disclosures (required, keep scannable)
```
✓ "Annual Percentage Yield (APY): 4.85%. Rates may change."
✓ "Investing involves risk. Past performance is not indicative of future results."
✓ "By continuing, you agree to our Terms of Service and Privacy Policy."
```

### KYC / Verification
```
✓ "We need to verify your identity — it only takes 2 minutes"
✓ "Your Social Security Number is encrypted and never stored in plain text"
✓ "Document verification powered by [Provider]"
✗ "Enter your SSN" (no context, alarming)
```

## Error Messages

| Scenario | Message |
|----------|---------|
| Insufficient funds | "You need $23.50 more to complete this transfer. Add funds?" |
| Card declined | "Your card was declined. Contact your bank or try another card." |
| Daily limit reached | "Daily transfer limit ($2,500) reached. Resets at midnight ET." |
| Verification failed | "We couldn't verify your identity. Please re-upload a clear photo of your ID." |
| Session expired | "For your security, you've been signed out. Sign back in to continue." |

## Loading States (critical for trust)

```
"Processing your payment..." (not just a spinner)
"Verifying your identity... (usually takes 30 seconds)"
"Transferring funds... Do not close this page"
```

## Tone Rules
- Formal but human — avoid robotic legal speak
- Always confirm amounts explicitly before destructive actions
- Lead with user benefit, not compliance requirement
- Never minimize risk ("small fee" → state the exact amount)
