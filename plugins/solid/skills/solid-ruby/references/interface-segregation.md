---
name: interface-segregation
description: ISP - Small focused modules, avoid fat interfaces
when-to-use: Fat modules, mixing concerns, unused methods
keywords: ISP, interface segregation, concerns, composition
priority: medium
related: single-responsibility.md, liskov-substitution.md
---

# Interface Segregation Principle (ISP)

## Definition

Many **small** interfaces > one **fat** interface.

Classes shouldn't implement methods they don't use.

---

## Anti-Pattern: Fat Module

```ruby
# WRONG: Too many responsibilities
module UserConcern
  def authenticate; end      # Auth
  def send_email; end        # Email
  def track_activity; end    # Analytics
  def generate_report; end   # Reporting
  def cache_invalidate; end  # Caching
end

class User
  include UserConcern
  # Has unused methods
end
```

---

## ISP Solution: Focused Modules

```ruby
# RIGHT: Small, role-based modules
module AuthenticableContract
  def authenticate(password); end
end

module EmailableContract
  def send_email(template:); end
end

module TrackableConcern
  def track_activity(action:)
    Activity.create(actor: self, action: action)
  end
end

class User < ApplicationRecord
  include AuthenticableContract
  include EmailableContract
  include TrackableConcern
  # Only what it needs
end

class Post < ApplicationRecord
  include TrackableConcern  # Only tracking
  # No auth or email
end
```

---

## Repository Example

```ruby
# WRONG: Fat interface
module RepositoryContract
  def find(id); end
  def create(attributes); end
  def update(id, attributes); end
  def delete(id); end
  def paginate(page:); end
  def search(query:); end
end

# RIGHT: Segregated interfaces
module ReadableContract
  def find(id); end
  def all; end
end

module WritableContract
  def create(attributes); end
  def update(id, attributes); end
  def delete(id); end
end

module SearchableContract
  def search(query:); end
end

class UserRepository
  include ReadableContract
  include WritableContract
  include SearchableContract
end

class AuditLogRepository
  include ReadableContract  # Read-only
end
```

---

## Service Clarity

```ruby
class UserSearchService
  def initialize(repository)
    @repository = repository  # Needs SearchableContract
  end

  def search(query:)
    @repository.search(query: query)
  end
end

UserSearchService.new(UserRepository.new)        # ✓ Works
UserSearchService.new(AuditLogRepository.new)    # ✗ CRASH: no #search
```

Clear contract makes dependency violations obvious at runtime.

---

## Key Takeaway

**Small, focused interfaces > one fat interface**

Use **composition** (dependency injection) instead of **inclusion** for complex needs.
