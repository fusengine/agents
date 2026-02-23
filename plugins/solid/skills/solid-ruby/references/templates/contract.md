---
name: contract
description: Duck typing contract module defining expected interface
when-to-use: Defining service interfaces, repository patterns
keywords: contract, duck typing, interface, module
---

# Contract Template (< 30 lines)

## Basic Contract

```ruby
# frozen_string_literal: true

module ProcessorContract
  # Process payment
  # @param amount [Integer] Amount in cents
  # @return [Hash] { success: Boolean, id: String }
  #
  def process(amount:)
    raise NotImplementedError, "#{self.class} must implement #process"
  end

  # Refund charge
  # @param transaction_id [String] Transaction ID
  # @return [Hash] { success: Boolean, refund_id: String }
  #
  def refund(transaction_id:)
    raise NotImplementedError, "#{self.class} must implement #refund"
  end
end
```

---

## Implementation

```ruby
# frozen_string_literal: true

require_relative '../../core/contracts/processor_contract'

class StripeProcessor
  include ProcessorContract

  def process(amount:)
    charge = Stripe::Charge.create(amount: amount)
    { success: true, id: charge.id }
  rescue Stripe::CardError
    { success: false, id: nil }
  end

  def refund(transaction_id:)
    refund = Stripe::Refund.create(charge: transaction_id)
    { success: true, refund_id: refund.id }
  rescue Stripe::InvalidRequestError
    { success: false, refund_id: nil }
  end
end
```

---

## Repository Contract

```ruby
# frozen_string_literal: true

module RepositoryContract
  def find(id); end
  def all; end
  def create(attributes); end
  def update(id, attributes); end
  def delete(id); end
end
```

---

## Testing (RSpec Shared Examples)

See test.md for contract testing with shared examples.

---

## Other Contracts

```ruby
module ValidatorContract
  def valid?(data); end
  def errors; end
end

module LoggerContract
  def info(message, metadata: {}); end
  def error(message, metadata: {}); end
end

module NotifiableContract
  def send(recipient:, message:); end
end
```

---

## Using Contract in Service

```ruby
# frozen_string_literal: true

require_relative '../contracts/processor_contract'

class ChargeService
  def initialize(processor = StripeProcessor.new)
    @processor = processor  # Any ProcessorContract
  end

  def call(amount:)
    result = @processor.process(amount: amount)
    log_charge(result)
    result
  end

  private

  def log_charge(result)
    # Log result
  end
end
```

---

## Key Rules

- Max 30 lines per contract
- Use module, not class
- YARD document all methods
- Raise NotImplementedError in stubs
- Include contract in implementations
