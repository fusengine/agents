---
name: module
description: Feature module structure - copy-paste directory layout
when-to-use: Setting up new feature module
keywords: module, structure, organization
---

# Feature Module Template

## Directory Structure (Copy-Paste)

```
app/modules/your_feature/
├── controllers/
│   └── your_feature_controller.rb
├── services/
│   └── your_feature_service.rb
├── queries/
│   └── your_feature_query.rb
├── repositories/
│   └── your_feature_repository.rb
├── models/
│   └── your_feature.rb
├── contracts/
│   └── your_feature_contract.rb
└── concerns/
    └── your_feature_concern.rb
```

---

## Controller (< 50 lines)

```ruby
# frozen_string_literal: true

require_relative '../services/create_your_feature_service'

class YourFeatureController < ApplicationController
  def create
    service = CreateYourFeatureService.new
    result = service.call(create_params)
    result.success? ? render(json: result.data, status: :created) : render(json: { errors: result.errors }, status: 422)
  rescue StandardError => e
    render json: { error: e.message }, status: 500
  end

  private

  def create_params
    params.require(:your_feature).permit(:name, :email)
  end
end
```

---

## Service (< 100 lines)

```ruby
# frozen_string_literal: true

require_relative '../repositories/your_feature_repository'

class CreateYourFeatureService
  # @param repository [RepositoryContract]
  # @param mailer [MailableContract]
  #
  def initialize(repository: YourFeatureRepository.new, mailer: Mailer.new)
    @repository = repository
    @mailer = mailer
  end

  def call(name:)
    validate(name)
    record = @repository.create(name: name)
    @mailer.notify(record) if record.persisted?
    record
  rescue ActiveRecord::RecordInvalid => e
    raise ServiceError, e.message
  end

  private

  def validate(name)
    raise ServiceError, 'Name required' if name.blank?
  end
end
```

---

## Other Layers

See **service.md, contract.md, model.md, error.md** for Query, Repository, Model, Contract, Error templates.
