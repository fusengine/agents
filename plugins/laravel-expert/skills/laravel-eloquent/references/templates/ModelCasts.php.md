---
name: ModelCasts.php
description: Model with advanced casts and accessors/mutators
file-type: php
---

# Model Casts Template

## Complete Casts Example

```php
<?php

namespace App\Models;

use App\Casts\AddressCast;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Casts\AsEncryptedCollection;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
use Illuminate\Database\Eloquent\Casts\AsStringable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'total',
        'items',
        'metadata',
        'notes',
        'shipping_address',
        'completed_at',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            // Primitives
            'total' => 'decimal:2',
            'is_express' => 'boolean',
            'quantity' => 'integer',

            // Dates
            'completed_at' => 'datetime',
            'shipped_at' => 'datetime:Y-m-d',
            'delivery_date' => 'date',
            'created_at' => 'immutable_datetime',

            // JSON/Array
            'items' => 'array',
            'metadata' => AsArrayObject::class,
            'tags' => AsCollection::class,

            // Encrypted
            'notes' => 'encrypted',
            'payment_details' => 'encrypted:array',
            'sensitive_data' => AsEncryptedCollection::class,

            // Enums
            'status' => OrderStatus::class,
            'statuses' => AsEnumCollection::of(OrderStatus::class),

            // Stringable
            'tracking_number' => AsStringable::class,

            // Custom cast
            'shipping_address' => AddressCast::class,
        ];
    }
}
```

---

## Accessors & Mutators

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class User extends Model
{
    protected $fillable = ['first_name', 'last_name', 'email', 'password'];

    protected $appends = ['full_name', 'initials'];

    /**
     * Full name (computed from first + last)
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }

    /**
     * Initials (computed)
     */
    protected function initials(): Attribute
    {
        return Attribute::make(
            get: fn () => Str::upper(
                Str::substr($this->first_name, 0, 1) .
                Str::substr($this->last_name, 0, 1)
            ),
        );
    }

    /**
     * First name with get/set
     */
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => strtolower($value),
        );
    }

    /**
     * Password (set only - hashing)
     */
    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => bcrypt($value),
        );
    }

    /**
     * Email normalization
     */
    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => strtolower($value),
            set: fn (string $value) => strtolower(trim($value)),
        );
    }

    /**
     * Cached expensive computation
     */
    protected function statistics(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->calculateStatistics(),
        )->shouldCache();
    }

    private function calculateStatistics(): array
    {
        return [
            'posts_count' => $this->posts()->count(),
            'comments_count' => $this->comments()->count(),
        ];
    }
}
```

---

## Custom Cast Class

```php
<?php

namespace App\Casts;

use App\ValueObjects\Address;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

class AddressCast implements CastsAttributes
{
    /**
     * Cast the given value (DB → PHP)
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Address
    {
        if (is_null($attributes['address_line_1'])) {
            return null;
        }

        return new Address(
            line1: $attributes['address_line_1'],
            line2: $attributes['address_line_2'],
            city: $attributes['address_city'],
            state: $attributes['address_state'],
            postalCode: $attributes['address_postal_code'],
            country: $attributes['address_country'],
        );
    }

    /**
     * Prepare the given value for storage (PHP → DB)
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        if (is_null($value)) {
            return [
                'address_line_1' => null,
                'address_line_2' => null,
                'address_city' => null,
                'address_state' => null,
                'address_postal_code' => null,
                'address_country' => null,
            ];
        }

        if (! $value instanceof Address) {
            throw new InvalidArgumentException('Value must be an Address instance');
        }

        return [
            'address_line_1' => $value->line1,
            'address_line_2' => $value->line2,
            'address_city' => $value->city,
            'address_state' => $value->state,
            'address_postal_code' => $value->postalCode,
            'address_country' => $value->country,
        ];
    }
}
```

---

## Value Object

```php
<?php

namespace App\ValueObjects;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

readonly class Address implements Arrayable, JsonSerializable
{
    public function __construct(
        public string $line1,
        public ?string $line2,
        public string $city,
        public string $state,
        public string $postalCode,
        public string $country,
    ) {}

    public function formatted(): string
    {
        $parts = array_filter([
            $this->line1,
            $this->line2,
            "{$this->city}, {$this->state} {$this->postalCode}",
            $this->country,
        ]);

        return implode("\n", $parts);
    }

    public function toArray(): array
    {
        return [
            'line1' => $this->line1,
            'line2' => $this->line2,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postalCode,
            'country' => $this->country,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
```

---

## Inbound-Only Cast (Hashing)

```php
<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsInboundAttributes;
use Illuminate\Database\Eloquent\Model;

class Hash implements CastsInboundAttributes
{
    public function __construct(
        protected ?string $algorithm = null
    ) {}

    /**
     * Prepare the given value for storage.
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return is_null($this->algorithm)
            ? bcrypt($value)
            : hash($this->algorithm, $value);
    }
}

// Usage in model:
// 'secret' => Hash::class.':sha256'
```

---

## Enum

```php
<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::Pending => 'Pending',
            self::Processing => 'Processing',
            self::Shipped => 'Shipped',
            self::Delivered => 'Delivered',
            self::Cancelled => 'Cancelled',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::Pending => 'yellow',
            self::Processing => 'blue',
            self::Shipped => 'purple',
            self::Delivered => 'green',
            self::Cancelled => 'red',
        };
    }
}
```
