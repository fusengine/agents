---
name: adapter-template
description: Adapter pattern template for external service integration
---

# Adapter Pattern

```typescript
// modules/payments/src/adapters/stripe.adapter.ts
import Stripe from 'stripe'
import type {
  PaymentProvider,
  PaymentResult,
  RefundResult
} from '../interfaces/payment.interface'

/**
 * Stripe payment adapter
 */
export class StripeAdapter implements PaymentProvider {
  private stripe: Stripe

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, { apiVersion: '2024-01-01' })
  }

  /**
   * Process payment
   *
   * @param amount - Amount in cents
   * @param currency - Currency code
   * @returns Payment result
   */
  async charge(amount: number, currency: string): Promise<PaymentResult> {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase()
    })

    return {
      transactionId: intent.id,
      status: intent.status === 'succeeded' ? 'success' : 'pending',
      amount,
      timestamp: new Date()
    }
  }

  /**
   * Refund payment
   *
   * @param transactionId - Original transaction ID
   * @returns Refund result
   */
  async refund(transactionId: string): Promise<RefundResult> {
    const refund = await this.stripe.refunds.create({
      payment_intent: transactionId
    })

    return {
      refundId: refund.id,
      originalTransaction: transactionId,
      status: refund.status === 'succeeded' ? 'success' : 'failed'
    }
  }
}
```

## Email Adapter

```typescript
// modules/email/src/adapters/sendgrid.adapter.ts
import type { EmailProvider, SendResult } from '../interfaces/email.interface'

/**
 * SendGrid email adapter
 */
export class SendGridAdapter implements EmailProvider {
  constructor(private apiKey: string) {}

  /**
   * Send email via SendGrid
   */
  async send(to: string, subject: string, html: string): Promise<SendResult> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'noreply@app.com' },
        subject,
        content: [{ type: 'text/html', value: html }]
      })
    })

    return {
      success: response.ok,
      messageId: response.headers.get('x-message-id') || ''
    }
  }
}
```
