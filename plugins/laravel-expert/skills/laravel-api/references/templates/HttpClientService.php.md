---
name: HttpClientService
description: Reusable HTTP client service for external APIs
keywords: http client, service, api, guzzle
---

# HTTP Client Service Example

## API Client Service

```php
<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

/**
 * Client for interacting with external payment API.
 */
final class PaymentApiService
{
    private const TIMEOUT = 30;
    private const RETRY_TIMES = 3;
    private const RETRY_SLEEP = 100;

    public function __construct(
        private readonly string $baseUrl,
        private readonly string $apiKey,
    ) {}

    /**
     * Create a charge.
     *
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    public function createCharge(array $data): array
    {
        $response = $this->client()
            ->post('/charges', $data)
            ->throw();

        return $response->json('data');
    }

    /**
     * Get a charge by ID.
     *
     * @return array<string, mixed>
     */
    public function getCharge(string $chargeId): array
    {
        $response = $this->client()
            ->get("/charges/{$chargeId}")
            ->throw();

        return $response->json('data');
    }

    /**
     * Refund a charge.
     *
     * @return array<string, mixed>
     */
    public function refundCharge(string $chargeId, int $amount): array
    {
        $response = $this->client()
            ->post("/charges/{$chargeId}/refunds", [
                'amount' => $amount,
            ])
            ->throw();

        return $response->json('data');
    }

    /**
     * Get configured HTTP client.
     */
    private function client(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->withToken($this->apiKey)
            ->timeout(self::TIMEOUT)
            ->retry(self::RETRY_TIMES, self::RETRY_SLEEP)
            ->acceptJson()
            ->asJson();
    }
}
```

## Service Provider Registration

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\PaymentApiService;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(PaymentApiService::class, fn () => new PaymentApiService(
            baseUrl: config('services.payment.url'),
            apiKey: config('services.payment.key'),
        ));
    }
}
```

## Configuration

```php
// config/services.php
return [
    'payment' => [
        'url' => env('PAYMENT_API_URL', 'https://api.payment.com/v1'),
        'key' => env('PAYMENT_API_KEY'),
    ],
];
```

## Controller Usage

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\PaymentApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentApiService $paymentApi,
    ) {}

    public function charge(Request $request): JsonResponse
    {
        $charge = $this->paymentApi->createCharge([
            'amount' => $request->input('amount'),
            'currency' => 'EUR',
            'source' => $request->input('payment_method_id'),
        ]);

        return response()->json(['data' => $charge], 201);
    }
}
```

## Testing with Fakes

```php
<?php

namespace Tests\Feature;

use App\Services\PaymentApiService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class PaymentTest extends TestCase
{
    public function test_creates_charge(): void
    {
        Http::fake([
            'api.payment.com/*' => Http::response([
                'data' => [
                    'id' => 'ch_123',
                    'amount' => 5000,
                    'status' => 'succeeded',
                ],
            ], 201),
        ]);

        $response = $this->postJson('/api/v1/payments/charge', [
            'amount' => 5000,
            'payment_method_id' => 'pm_123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'id' => 'ch_123',
                    'status' => 'succeeded',
                ],
            ]);

        Http::assertSent(fn ($request) =>
            $request->url() === 'https://api.payment.com/v1/charges'
            && $request['amount'] === 5000
        );
    }
}
```
