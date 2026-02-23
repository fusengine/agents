---
name: test
description: RSpec tests with test doubles (mocks/stubs) and shared examples
when-to-use: Writing unit and integration tests
keywords: RSpec, testing, mocks, stubs, doubles, shared examples
---

# RSpec Testing Template

## Service Test

```ruby
# frozen_string_literal: true

require 'rails_helper'

describe CreateUserService do
  subject(:service) { described_class.new(repository: repository, mailer: mailer) }

  let(:repository) { double('repository') }
  let(:mailer) { double('mailer') }

  describe '#call' do
    context 'with valid input' do
      it 'creates user' do
        allow(repository).to receive(:create).and_return(
          instance_double(User, id: 1, email: 'test@example.com')
        )
        allow(mailer).to receive(:welcome)

        result = service.call(email: 'test@example.com')

        expect(result.id).to eq 1
        expect(repository).to have_received(:create)
        expect(mailer).to have_received(:welcome)
      end
    end

    context 'with invalid email' do
      it 'raises ValidationError' do
        expect { service.call(email: '') }
          .to raise_error(ValidationError, /Email required/)
      end
    end

    context 'on duplicate email' do
      it 'raises DuplicateError' do
        allow(repository).to receive(:create).and_raise(ActiveRecord::RecordNotUnique)
        expect { service.call(email: 'test@example.com') }
          .to raise_error(DuplicateError)
      end
    end
  end
end
```

---

## Shared Examples (Contracts)

```ruby
# spec/support/shared_examples/repository_contract.rb
RSpec.shared_examples 'a repository' do
  let(:repo) { described_class.new }
  it { expect(repo).to respond_to(:find, :all, :create, :update, :delete) }
end

# Use: describe UserRepository do; it_behaves_like 'a repository'; end
```

---

## Model Test

```ruby
describe User do
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to have_many(:posts).dependent(:destroy) }
  it { is_expected.to belong_to(:account).optional }
end
```

---

## Mocking Patterns

```ruby
# Create mock
mock = double('service')

# Stub method
allow(mock).to receive(:call).and_return(result)

# Verify called
expect(mock).to have_received(:call)

# With arguments
expect(mock).to have_received(:call).with(id: 1)

# Raise exception
allow(mock).to receive(:call).and_raise(StandardError)

# Multiple return values
allow(mock).to receive(:call).and_return(result1, result2, result3)
```

---

## Factories (Factorybot)

```ruby
FactoryBot.define do
  factory :user do
    email { "user#{SecureRandom.hex(4)}@example.com" }
    password { 'password123' }
  end
end

# Usage: create(:user), build(:user), create_list(:user, 3)
```

---

## Best Practices

- Use `described_class`
- Mock external dependencies
- Test happy path + errors
- One behavior per test
- Use shared examples
