---
name: service
description: Business logic service (PORO) with dependency injection
when-to-use: Extracting business logic from controllers
keywords: service, PORO, business logic
---

# Service Template (< 100 lines)

## Basic Service

```ruby
# frozen_string_literal: true

class YourActionService
  # Business logic orchestration
  #
  # @param name [String]
  # @param repository [RepositoryContract]
  # @param mailer [MailableContract]
  #
  def initialize(name:, repository: YourRepository.new, mailer: Mailer.new)
    @name = name
    @repository = repository
    @mailer = mailer
  end

  def call
    validate_input
    record = @repository.create(name: @name)
    @mailer.notify(record)
    record
  rescue StandardError => e
    raise ServiceError, e.message
  end

  private

  def validate_input
    raise ServiceError, 'Name required' if @name.blank?
  end
end
```

---

## Result Object

```ruby
Result = Struct.new(:success?, :data, :errors)
# Usage: Result.new(true, record, [])
```

---

## Multi-Step Service

```ruby
# frozen_string_literal: true

class CheckoutService
  def initialize(repo:, charger: ChargeService.new, mailer: OrderMailer.new)
    @repo = repo
    @charger = charger
    @mailer = mailer
  end

  def call(user_id:, items:)
    validate_items(items)
    order = create_order(user_id, items)
    charge_order(order)
    @mailer.confirmation(order)
    order
  rescue CheckoutError => e
    @repo.delete(order.id) if order
    raise e
  end

  private

  def validate_items(items)
    raise CheckoutError, 'No items' if items.empty?
  end

  def create_order(user_id, items)
    @repo.create(user_id: user_id, items: items)
  end

  def charge_order(order)
    result = @charger.call(amount: order.total)
    raise CheckoutError, 'Payment failed' unless result[:success]
    order.update(transaction_id: result[:id])
  end
end
```

---

## Service with Transactions

```ruby
# frozen_string_literal: true

class TransferFundsService
  def initialize(repo: AccountRepository.new)
    @repo = repo
  end

  def call(from_id:, to_id:, amount:)
    ActiveRecord::Base.transaction do
      from = @repo.find(from_id)
      to = @repo.find(to_id)
      raise TransferError, 'Insufficient funds' if from.balance < amount
      from.update(balance: from.balance - amount)
      to.update(balance: to.balance + amount)
      [from, to]
    end
  end
end
```

---

## Error Classes

```ruby
class ServiceError < StandardError; end
class ServiceValidationError < ServiceError; end
```

---

## Key Rules

- Max 100 lines
- One public method: `call`
- Constructor accepts all dependencies
- Raise custom errors
- Easy to test with mocks
