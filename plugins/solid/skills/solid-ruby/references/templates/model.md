---
name: model
description: Thin ActiveRecord model - associations, validations, scopes only
when-to-use: Defining Rails models with SOLID compliance
keywords: model, ActiveRecord, validations, associations
---

# Model Template (< 50 lines)

## Complete Example

```ruby
# frozen_string_literal: true

class User < ApplicationRecord
  # Associations
  belongs_to :account, optional: true
  has_many :posts, dependent: :destroy
  has_and_belongs_to_many :groups

  # Validations
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, length: { minimum: 8 }

  # Enums
  enum status: { active: 0, inactive: 1 }
  enum role: { user: 0, admin: 1 }

  # Scopes
  scope :active, -> { where(status: :active) }
  scope :recent, -> { order(created_at: :desc) }
end
```

---

## Associations

```ruby
class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_and_belongs_to_many :tags
end

class User < ApplicationRecord
  has_many :subscriptions
  has_many :publications, through: :subscriptions
end
```

---

## Validations

```ruby
validates :name, presence: true
validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
validates :password, length: { minimum: 8, maximum: 128 }
validates :age, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 150 }
validates :role, inclusion: { in: %w[user admin] }

validate :email_domain_valid

private

def email_domain_valid
  domain = email.split('@').last
  errors.add(:email, 'Invalid domain') unless domain.in?(%w[example.com])
end
```

---

## Enums

```ruby
enum status: { draft: 0, published: 1, archived: 2 }

# Usage:
User.draft                      # where(status: 0)
user.draft?                     # true/false
user.published!                 # changes to published
```

---

## Scopes

```ruby
scope :active, -> { where(active: true) }
scope :recent, -> { order(created_at: :desc) }
scope :by_role, ->(role) { where(role: role) }
scope :created_after, ->(date) { where('created_at > ?', date) }

# Usage:
User.active.recent
User.by_role(:admin)
User.created_after(1.month.ago)
```

---

## Key Rules

- **Max 50 lines**
- Associations ONLY
- Validations ONLY
- Scopes (queries)
- Enums
- **ZERO business logic**
- **ZERO callbacks** (use Services)
- **ZERO complex methods**

---

## Testing

```ruby
describe User do
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_uniqueness_of(:email) }
  it { is_expected.to have_many(:posts).dependent(:destroy) }
  it { is_expected.to belong_to(:account).optional }

  describe '.active' do
    it 'returns only active users' do
      active = create(:user, status: :active)
      inactive = create(:user, status: :inactive)
      expect(User.active).to include(active)
      expect(User.active).not_to include(inactive)
    end
  end
end
```
