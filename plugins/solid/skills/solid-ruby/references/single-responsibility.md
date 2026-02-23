---
name: single-responsibility
description: SRP for Ruby/Rails - Controller/Service/Query separation
when-to-use: Fat classes, business logic in models, controllers doing too much
keywords: SRP, single responsibility, service layer, query objects
priority: high
related: architecture-patterns.md, dependency-inversion.md
---

# Single Responsibility Principle (SRP)

## Definition

Each class has ONE reason to change.

---

## Layer Responsibilities

| Layer | Responsibility | Max Lines |
|-------|-----------------|-----------|
| Controller | Parse HTTP, authorize, delegate | 50 |
| Service | Business logic, orchestration | 100 |
| Query | Data retrieval, filtering | 100 |
| Repository | SQL abstraction | 100 |
| Model | Associations, validations, scopes | 50 |

---

## Example: Fat Model → SRP

**BEFORE:**
```ruby
class User < ApplicationRecord
  def create_account(params)
    save
    send_welcome_email
  end

  def send_welcome_email
    UserMailer.deliver_now
  end

  def find_active_recently
    where(active: true).last(10)
  end
end
```

**AFTER:**
```ruby
# app/modules/users/models/user.rb
class User < ApplicationRecord
  validates :email, uniqueness: true
end

# app/modules/users/services/create_user_service.rb
class CreateUserService
  def initialize(notifier: UserMailer.new)
    @notifier = notifier
  end

  def call(email:)
    user = User.create(email: email)
    @notifier.welcome(user)
    user
  end
end

# app/modules/users/queries/active_users_query.rb
class ActiveUsersQuery
  def call
    User.where(active: true).last(10)
  end
end
```

---

## Identifying Multiple Responsibilities

**Red flags:**
- Multiple reasons to change
- "And" in method names: `validate_and_save`
- Hard to test: requires many mocks

**Solution:**
1. Identify 2-3 reasons to change
2. Create Service for each
3. Controllers orchestrate Services
4. Inject Services via constructor

---

## Testing Benefit

```ruby
describe CreateUserService do
  it "creates user and notifies" do
    notifier = double(welcome: true)
    service = CreateUserService.new(notifier: notifier)

    expect { service.call(email: 'x@y.com') }
      .to change(User, :count).by(1)
    expect(notifier).to have_received(:welcome)
  end
end
```

---

## Shared Logic Location

Code used by 2+ features → `app/modules/core/`

```
app/modules/core/
├── services/
│   └── encryption_service.rb
├── contracts/
│   └── repository_contract.rb
└── concerns/
    └── timestampable_concern.rb
```
