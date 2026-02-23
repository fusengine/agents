---
name: dependency-inversion
description: DIP - Constructor injection, duck typing, contracts
when-to-use: Tight coupling, hard to test, swappable implementations
keywords: DIP, dependency inversion, injection, contracts
priority: high
related: open-closed.md, liskov-substitution.md
---

# Dependency Inversion Principle (DIP)

## Definition

Depend on **abstractions** (contracts), NOT **concrete implementations**.

---

## Anti-Pattern: Direct Dependency

```ruby
# WRONG: Tight coupling
class ChargeService
  def call(amount:)
    processor = StripeProcessor.new  # Hard dependency
    processor.process(amount: amount)
  end
end

# Problems:
# - Can't use PayPal without modifying ChargeService
# - Hard to test (must mock StripeProcessor)
# - Can't swap implementations
```

---

## DIP Solution: Constructor Injection

```ruby
# RIGHT: Inject dependency
module ProcessorContract
  def process(amount:); end
end

class StripeProcessor
  include ProcessorContract
  def process(amount:)
    { success: true, id: 'charge_123' }
  end
end

class ChargeService
  def initialize(processor = StripeProcessor.new)
    @processor = processor  # Depends on contract
  end

  def call(amount:)
    @processor.process(amount: amount)
  end
end

# Usage:
ChargeService.new                          # Uses Stripe
ChargeService.new(PayPalProcessor.new)     # Override
```

---

## Injection Patterns

```ruby
# Default
def initialize(processor = StripeProcessor.new)
  @processor = processor
end

# Multiple with defaults
def initialize(repo:, mailer: UserMailer.new, validator: UserValidator.new)
  @repository = repo
  @mailer = mailer
end
```

---

## Anti-Pattern: Service Locator

```ruby
# WRONG: Hidden dependency
class ChargeService
  def call(amount:)
    processor = ServiceLocator.get(:payment_processor)  # Where does it come from?
    processor.process(amount: amount)
  end
end

# RIGHT: Explicit dependency
class ChargeService
  def initialize(processor)
    @processor = processor  # Clear
  end
end
```

---

## Testing with DIP

```ruby
describe ChargeService do
  it "uses processor" do
    mock = double('processor', process: { success: true, id: '123' })
    service = ChargeService.new(mock)
    result = service.call(amount: 5000)
    expect(result[:id]).to eq '123'
  end
end
```

Easy mocking because dependencies are explicit.

---

## Contract Locations

| Scope | Location |
|-------|----------|
| Feature-specific | `app/modules/[feature]/contracts/` |
| Shared (2+ features) | `app/modules/core/contracts/` |

---

## Key Rules

1. **Inject via constructor** not `new`
2. **Define contracts** in `contracts/`
3. **Depend on abstractions**, not concrete classes
4. **Avoid service locators** (hidden dependencies)
5. **Test with doubles** (easy mocking)
