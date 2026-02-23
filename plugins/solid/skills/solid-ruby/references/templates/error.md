---
name: error
description: Custom exception hierarchy organized by layer
when-to-use: Raising typed errors from services, repositories
keywords: error, exception, hierarchy, StandardError
---

# Error Template

## Feature Error Hierarchy

```ruby
# frozen_string_literal: true

class YourFeatureError < StandardError
end

class YourFeatureNotFoundError < YourFeatureError
end

class YourFeatureValidationError < YourFeatureError
end

class YourFeatureAuthorizationError < YourFeatureError
end
```

---

## Core Errors

```ruby
# app/modules/core/errors/core_error.rb
class CoreError < StandardError; end
class NotFoundError < CoreError; end
class ValidationError < CoreError; end
class AuthorizationError < CoreError; end
class DuplicateError < CoreError; end
```

---

## Service Error Hierarchy

```ruby
class ServiceError < StandardError; end
class ServiceValidationError < ServiceError; end
class ServiceExecutionError < ServiceError; end
class ServiceTimeoutError < ServiceError; end
```

---

## Using Errors in Services

```ruby
class CreateUserService
  def call(email:, password:)
    validate_input(email, password)
    user = @repository.create(email: email, password: password)
    user
  rescue ActiveRecord::RecordInvalid => e
    raise ValidationError, "Invalid user: #{e.message}"
  rescue ActiveRecord::RecordNotUnique => e
    raise DuplicateError, "Email already exists"
  rescue StandardError => e
    raise ServiceError, "Creation failed: #{e.message}"
  end

  private

  def validate_input(email, password)
    raise ValidationError, 'Email required' if email.blank?
    raise ValidationError, 'Password required' if password.blank?
    raise ValidationError, 'Password too short' if password.length < 8
  end
end
```

---

## Using Errors in Repositories

```ruby
class UserRepository
  def find(id)
    User.find(id)
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError, "User #{id} not found"
  end

  def create(attributes)
    User.create!(attributes)
  rescue ActiveRecord::RecordInvalid => e
    raise ValidationError, "Failed to create: #{e.message}"
  end
end
```

---

## Controller Error Handling

```ruby
class UsersController < ApplicationController
  rescue_from ValidationError, with: :render_validation_error
  rescue_from NotFoundError, with: :render_not_found
  rescue_from StandardError, with: :render_internal_error

  def create
    service = CreateUserService.new
    result = service.call(email: params[:email])
    render json: result, status: :created
  end

  private

  def render_validation_error(error)
    render json: { error: error.message }, status: :unprocessable_entity
  end

  def render_not_found(error)
    render json: { error: error.message }, status: :not_found
  end

  def render_internal_error(error)
    Rails.logger.error("#{error.class}: #{error.message}")
    render json: { error: 'Internal error' }, status: :internal_server_error
  end
end
```

