---
name: liskov-substitution
description: LSP for Ruby - Duck typing contracts, consistent implementations
when-to-use: Validating implementations honor contracts, testing polymorphic behavior
keywords: LSP, liskov substitution, duck typing, contracts, shared examples
priority: high
related: interface-segregation.md, dependency-inversion.md
---

# Liskov Substitution Principle (LSP)

## Definition

Implementations must honor the contract. Services work with ANY implementation.

---

## Duck Typing Contracts

**Contract module:**
```ruby
module RepositoryContract
  def find(id); end
  def create(attributes); end
  def update(id, attributes); end
  def delete(id); end
  def all; end
end
```

**Implementations:**
```ruby
class UserRepository
  include RepositoryContract

  def find(id) = User.find(id)
  def create(attributes) = User.create(attributes)
  def update(id, attributes) = User.find(id).tap { |u| u.update(attributes) }
  def delete(id) = User.find(id).destroy
  def all = User.all
end

class PostRepository
  include RepositoryContract
  # Same interface, different model
end
```

**Service works with ANY repository:**
```ruby
class GenericService
  def initialize(repo)
    @repo = repo  # Any RepositoryContract
  end

  def find_record(id) = @repo.find(id)
  def create_record(attrs) = @repo.create(attrs)
end
```

---

## Testing Contracts with Shared Examples

**Define shared tests:**
```ruby
RSpec.shared_examples 'a repository' do
  describe 'contract' do
    let(:repo) { described_class.new }

    it { expect(repo).to respond_to(:find) }
    it { expect(repo).to respond_to(:create) }
    it { expect(repo).to respond_to(:update) }
    it { expect(repo).to respond_to(:delete) }
    it { expect(repo).to respond_to(:all) }
  end
end
```

**Use in tests:**
```ruby
describe UserRepository do
  it_behaves_like 'a repository'
end

describe PostRepository do
  it_behaves_like 'a repository'
end
```

---

## LSP Violation Examples

**WRONG: Missing method**
```ruby
class InvalidRepository
  # Missing methods from contract
  def fetch_one(id)  # Wrong name
  end
end

service = GenericService.new(InvalidRepository.new)
service.find_record(1)  # CRASH: undefined method `find'
```

**WRONG: Different return type**
```ruby
class BadProcessor
  def process(amount:)
    true  # Contract expects { success: bool, id: String }
  end
end
```

**WRONG: Different error behavior**
```ruby
class BadFinder
  def find(id)
    nil  # Contract says raise NotFoundError
  end
end
```

---

## Key Rule

**All implementations of a contract must be interchangeable:**
- Same method names
- Same return types
- Same exceptions
- Same side effects

---

## Architecture

```
app/modules/
├── core/
│   └── contracts/
│       └── repository_contract.rb
├── users/
│   └── repositories/
│       └── user_repository.rb
└── posts/
    └── repositories/
        └── post_repository.rb
```
