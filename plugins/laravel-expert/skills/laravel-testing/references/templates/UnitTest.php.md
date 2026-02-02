---
name: UnitTest
description: Unit test template for services, policies, and rules
file-type: template
---

# Unit Test Template

## Service Unit Test

```php
<?php

declare(strict_types=1);

use App\Services\PricingService;
use App\Models\Product;
use App\Models\User;
use App\Exceptions\InvalidDiscountException;

describe('PricingService', function () {
    beforeEach(function () {
        $this->service = new PricingService();
    });

    describe('calculatePrice', function () {
        it('returns base price without discount', function () {
            $product = new Product(['price' => 100.00]);

            $result = $this->service->calculatePrice($product);

            expect($result)->toBe(100.00);
        });

        it('applies percentage discount', function () {
            $product = new Product(['price' => 100.00]);

            $result = $this->service->calculatePrice($product, 'SAVE20');

            expect($result)->toBe(80.00);
        });

        it('applies fixed discount', function () {
            $product = new Product(['price' => 100.00]);

            $result = $this->service->calculatePrice($product, 'FLAT10');

            expect($result)->toBe(90.00);
        });

        it('never returns negative price', function () {
            $product = new Product(['price' => 5.00]);

            $result = $this->service->calculatePrice($product, 'FLAT10');

            expect($result)->toBe(0.00);
        });

        it('throws for invalid discount code', function () {
            $product = new Product(['price' => 100.00]);

            expect(fn () => $this->service->calculatePrice($product, 'INVALID'))
                ->toThrow(InvalidDiscountException::class);
        });
    });

    describe('calculateBulkPrice', function () {
        it('applies bulk discount for 10+ items', function () {
            $product = new Product(['price' => 10.00]);

            $result = $this->service->calculateBulkPrice($product, 10);

            expect($result)->toBe(90.00); // 10% bulk discount
        });
    });
});
```

## Policy Unit Test

```php
<?php

declare(strict_types=1);

use App\Models\User;
use App\Models\Post;
use App\Policies\PostPolicy;

describe('PostPolicy', function () {
    beforeEach(function () {
        $this->policy = new PostPolicy();
    });

    describe('view', function () {
        it('allows anyone to view published posts', function () {
            $user = new User();
            $post = new Post(['published' => true]);

            expect($this->policy->view($user, $post))->toBeTrue();
        });

        it('allows author to view draft posts', function () {
            $user = new User(['id' => 1]);
            $post = new Post(['user_id' => 1, 'published' => false]);

            expect($this->policy->view($user, $post))->toBeTrue();
        });

        it('denies others from viewing drafts', function () {
            $user = new User(['id' => 2]);
            $post = new Post(['user_id' => 1, 'published' => false]);

            expect($this->policy->view($user, $post))->toBeFalse();
        });
    });

    describe('update', function () {
        it('allows author to update', function () {
            $user = new User(['id' => 1]);
            $post = new Post(['user_id' => 1]);

            expect($this->policy->update($user, $post))->toBeTrue();
        });

        it('allows admin to update any post', function () {
            $admin = new User(['id' => 2, 'is_admin' => true]);
            $post = new Post(['user_id' => 1]);

            expect($this->policy->update($admin, $post))->toBeTrue();
        });

        it('denies non-author from updating', function () {
            $user = new User(['id' => 2, 'is_admin' => false]);
            $post = new Post(['user_id' => 1]);

            expect($this->policy->update($user, $post))->toBeFalse();
        });
    });

    describe('delete', function () {
        it('allows author to delete', function () {
            $user = new User(['id' => 1]);
            $post = new Post(['user_id' => 1]);

            expect($this->policy->delete($user, $post))->toBeTrue();
        });

        it('denies deletion of published posts', function () {
            $user = new User(['id' => 1]);
            $post = new Post(['user_id' => 1, 'published' => true]);

            expect($this->policy->delete($user, $post))->toBeFalse();
        });
    });
});
```

## Validation Rule Unit Test

```php
<?php

declare(strict_types=1);

use App\Rules\StrongPassword;
use Illuminate\Support\Facades\Validator;

describe('StrongPassword Rule', function () {
    beforeEach(function () {
        $this->rule = new StrongPassword();
    });

    it('passes for strong password', function () {
        $validator = Validator::make(
            ['password' => 'MyStr0ng!Pass'],
            ['password' => $this->rule]
        );

        expect($validator->passes())->toBeTrue();
    });

    it('fails without uppercase', function () {
        $validator = Validator::make(
            ['password' => 'mystr0ng!pass'],
            ['password' => $this->rule]
        );

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->first('password'))
            ->toContain('uppercase');
    });

    it('fails without number', function () {
        $validator = Validator::make(
            ['password' => 'MyStrong!Pass'],
            ['password' => $this->rule]
        );

        expect($validator->fails())->toBeTrue();
    });

    it('fails without special character', function () {
        $validator = Validator::make(
            ['password' => 'MyStr0ngPass'],
            ['password' => $this->rule]
        );

        expect($validator->fails())->toBeTrue();
    });

    it('fails for short passwords', function () {
        $validator = Validator::make(
            ['password' => 'Ab1!'],
            ['password' => $this->rule]
        );

        expect($validator->fails())->toBeTrue();
    });
})->with([
    'valid' => ['MyStr0ng!Pass', true],
    'no uppercase' => ['mystr0ng!pass', false],
    'no number' => ['MyStrong!Pass', false],
    'no special' => ['MyStr0ngPass', false],
    'too short' => ['Ab1!', false],
]);
```
