---
name: open-closed
description: OCP for Ruby - Strategy pattern, module-based extensibility
when-to-use: Adding behavior variants, multiple implementations, extensible systems
keywords: OCP, open-closed, strategy, pattern, extensibility
priority: high
related: single-responsibility.md, interface-segregation.md
---

# Open/Closed Principle (OCP)

## Definition

Open for **extension**, closed for **modification**.

Add new behavior by creating classes, NOT modifying existing ones.

---

## Strategy Pattern

**Contract:**
```ruby
module ProcessorContract
  def process(amount:)
    raise NotImplementedError
  end
end
```

**Implementations:**
```ruby
class StripeProcessor
  include ProcessorContract
  def process(amount:)
    { success: true, id: 'charge_123' }
  end
end

class PayPalProcessor
  include ProcessorContract
  def process(amount:)
    { success: true, id: 'paypal_456' }
  end
end
```

**Service (no modification needed):**
```ruby
class ChargeService
  def initialize(processor = StripeProcessor.new)
    @processor = processor
  end

  def call(amount:)
    @processor.process(amount: amount)
  end
end
```

**Usage:**
```ruby
ChargeService.new.call(amount: 5000)
ChargeService.new(PayPalProcessor.new).call(amount: 5000)
```

---

## Adding New Provider

**New processor (ZERO changes to ChargeService):**
```ruby
class ApplePayProcessor
  include ProcessorContract
  def process(amount:)
    { success: true, id: 'apple_789' }
  end
end

# Works immediately:
ChargeService.new(ApplePayProcessor.new).call(amount: 5000)
```

---

## Anti-Pattern: Modification

**WRONG:**
```ruby
class ChargeService
  def call(amount:, provider:)
    case provider
    when :stripe
      StripeProcessor.new.process(amount: amount)
    when :paypal
      PayPalProcessor.new.process(amount: amount)
    # Must modify when adding Apple Pay
    end
  end
end
```

**RIGHT:**
```ruby
class ChargeService
  def initialize(processor)
    @processor = processor
  end

  def call(amount:)
    @processor.process(amount: amount)
  end
end
```

---

## Testing OCP

```ruby
describe ChargeService do
  it "works with any processor" do
    mock = double('processor', process: { success: true, id: '123' })
    service = ChargeService.new(mock)
    result = service.call(amount: 5000)
    expect(result[:id]).to eq '123'
  end
end
```

---

## Key Takeaway

Use **dependency injection** + **contracts** to extend without modifying.
