---
name: PestConfig
description: Pest configuration file template
file-type: template
---

# Pest Configuration Template

## tests/Pest.php

```php
<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

pest()->extends(TestCase::class);

/*
|--------------------------------------------------------------------------
| Traits
|--------------------------------------------------------------------------
*/

// Apply RefreshDatabase to all Feature tests
pest()->use(RefreshDatabase::class)->in('Feature');

// Apply WithFaker globally
pest()->use(WithFaker::class)->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

expect()->extend('toBeValidEmail', function () {
    return $this->toMatch('/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/');
});

expect()->extend('toBeUuid', function () {
    return $this->toMatch('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i');
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
*/

/**
 * Create an admin user.
 */
function createAdmin(): \App\Models\User
{
    return \App\Models\User::factory()->admin()->create();
}

/**
 * Create a regular user.
 */
function createUser(array $attributes = []): \App\Models\User
{
    return \App\Models\User::factory()->create($attributes);
}

/**
 * Act as a user with Sanctum.
 */
function actingAsApi(\App\Models\User $user, array $abilities = ['*']): void
{
    \Laravel\Sanctum\Sanctum::actingAs($user, $abilities);
}

/**
 * Get JSON response data.
 */
function responseData(\Illuminate\Testing\TestResponse $response, string $key = 'data'): mixed
{
    return $response->json($key);
}

/*
|--------------------------------------------------------------------------
| Datasets
|--------------------------------------------------------------------------
*/

dataset('valid-emails', [
    'simple' => ['user@example.com'],
    'with-plus' => ['user+tag@example.com'],
    'subdomain' => ['user@mail.example.com'],
]);

dataset('invalid-emails', [
    'no-at' => ['userexample.com'],
    'no-domain' => ['user@'],
    'no-user' => ['@example.com'],
    'spaces' => ['user @example.com'],
]);

dataset('http-methods', [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
]);

dataset('user-roles', [
    'admin' => [['role' => 'admin', 'can_delete' => true]],
    'editor' => [['role' => 'editor', 'can_delete' => false]],
    'viewer' => [['role' => 'viewer', 'can_delete' => false]],
]);
```

## tests/TestCase.php

```php
<?php

declare(strict_types=1);

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Setup the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Disable Telescope in tests
        // \Laravel\Telescope\Telescope::stopRecording();

        // Set default fake time
        // $this->freezeTime();
    }

    /**
     * Create authenticated user and return response.
     */
    protected function actingAsUser(array $attributes = []): self
    {
        $user = \App\Models\User::factory()->create($attributes);

        return $this->actingAs($user);
    }

    /**
     * Create authenticated admin and return response.
     */
    protected function actingAsAdmin(): self
    {
        $admin = \App\Models\User::factory()->admin()->create();

        return $this->actingAs($admin);
    }

    /**
     * Assert response has validation errors for fields.
     */
    protected function assertValidationErrors(
        \Illuminate\Testing\TestResponse $response,
        array $fields
    ): void {
        $response->assertUnprocessable();

        foreach ($fields as $field) {
            $response->assertJsonValidationErrorFor($field);
        }
    }
}
```

## phpunit.xml Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true"
>
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
        <testsuite name="Arch">
            <file>tests/Arch.php</file>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>app</directory>
        </include>
    </source>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="APP_DEBUG" value="true"/>
        <env name="BCRYPT_ROUNDS" value="4"/>
        <env name="CACHE_DRIVER" value="array"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
        <env name="MAIL_MAILER" value="array"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
        <env name="SESSION_DRIVER" value="array"/>
        <env name="TELESCOPE_ENABLED" value="false"/>
    </php>
</phpunit>
```

## Directory Structure

```
tests/
├── Arch.php              # Architecture tests
├── Pest.php              # Pest configuration
├── TestCase.php          # Base test case
├── Feature/
│   ├── Auth/
│   │   ├── LoginTest.php
│   │   └── RegisterTest.php
│   ├── Api/
│   │   ├── PostsTest.php
│   │   └── UsersTest.php
│   └── Web/
│       ├── DashboardTest.php
│       └── ProfileTest.php
└── Unit/
    ├── Services/
    │   └── PricingServiceTest.php
    ├── Policies/
    │   └── PostPolicyTest.php
    └── Rules/
        └── StrongPasswordTest.php
```
