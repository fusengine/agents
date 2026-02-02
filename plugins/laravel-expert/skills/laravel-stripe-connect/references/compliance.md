---
name: compliance
description: Legal, tax, and regulatory requirements
when-to-use: Understanding platform obligations
keywords: compliance, tax, legal, 1099, kyc, aml
---

# Compliance

## Platform Obligations

| Area | Requirement |
|------|-------------|
| **KYC** | Verify seller identity |
| **AML** | Anti-money laundering checks |
| **Tax** | Report earnings (1099, VAT) |
| **PCI** | Card data security |
| **Terms** | Platform terms of service |

## KYC (Know Your Customer)

| Information | Purpose |
|-------------|---------|
| Legal name | Identity verification |
| Date of birth | Age verification |
| Address | Residence verification |
| Tax ID (SSN/EIN) | Tax reporting |
| Bank account | Payout destination |

## Who Handles KYC?

| Account Type | KYC Handler |
|--------------|-------------|
| Standard | Stripe directly |
| Express | Stripe (Stripe-hosted flow) |
| Custom | Platform (with Stripe verification APIs) |

## Tax Reporting

### United States

| Form | Threshold | Recipient |
|------|-----------|-----------|
| 1099-K | $600/year | Sellers |
| 1099-MISC | $600/year | Contractors |

### European Union

| Requirement | Details |
|-------------|---------|
| DAC7 | Report seller info to tax authorities |
| VAT | May need to collect/report |

## Stripe's Compliance Features

| Feature | What It Does |
|---------|--------------|
| Identity verification | Automated ID checks |
| Tax reporting | Automatic 1099 generation |
| Sanctions screening | OFAC compliance |
| PCI compliance | Handles card data |

## Platform Responsibilities

| Responsibility | Required Action |
|----------------|-----------------|
| Terms of Service | Clear seller agreement |
| Privacy Policy | Data handling disclosure |
| Prohibited businesses | Screen seller types |
| Transaction monitoring | Flag suspicious activity |
| Record keeping | 7-year retention |

## Prohibited Business Types

Stripe prohibits certain businesses:
- Illegal products/services
- High-risk categories
- Regulated without license

→ Check [Stripe's Restricted Businesses](https://stripe.com/legal/restricted-businesses)

## Best Practices

| Practice | Reason |
|----------|--------|
| Screen sellers before onboarding | Avoid prohibited businesses |
| Keep complete transaction records | Audit trail |
| Implement seller agreements | Legal protection |
| Monitor for fraud patterns | Platform integrity |
| Stay updated on regulations | Compliance changes |

## Checklist Before Launch

- [ ] Terms of Service includes Connect language
- [ ] Privacy Policy covers seller data
- [ ] Seller agreement/onboarding terms
- [ ] Prohibited business screening
- [ ] Tax ID collection for reporting
- [ ] Record retention policy
- [ ] Dispute handling process documented
