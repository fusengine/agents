---
name: modern-class
description: Complete, copy-paste modern PHP showcasing enums, readonly, property hooks, asymmetric visibility, clone() and the pipe operator
keywords: template, enum, readonly, property hooks, asymmetric visibility, clone, pipe
---

# Modern PHP Class Template

Complete working examples. Each file states its path and target PHP version.

---

## Backed Enum With Interface (PHP 8.1+)

```php
<?php
// src/Enum/Status.php
declare(strict_types=1);

namespace App\Enum;

interface HasLabel
{
    public function label(): string;
}

enum Status: string implements HasLabel
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Published => 'Published',
            self::Archived => 'Archived',
        };
    }

    public function isVisible(): bool
    {
        return $this === self::Published;
    }
}
```

---

## Value Object: readonly + clone() (PHP 8.5)

```php
<?php
// src/ValueObject/Money.php
declare(strict_types=1);

namespace App\ValueObject;

final readonly class Money
{
    public function __construct(
        public int $amount,     // minor units (cents)
        public string $currency,
    ) {}

    /** Immutable "with" update via clone() reassigning a readonly property. */
    public function withAmount(int $amount): self
    {
        return clone($this, ['amount' => $amount]);
    }
}
```

For projects below 8.5, replace `withAmount` with `return new self($amount, $this->currency);`.

---

## Entity: Property Hooks + Asymmetric Visibility (PHP 8.4)

```php
<?php
// src/Model/User.php
declare(strict_types=1);

namespace App\Model;

use App\Enum\Status;

final class User
{
    // Public read, immutable from the outside.
    public private(set) string $id;

    // Interception hook: normalize on write.
    public string $email {
        set {
            $value = strtolower(trim($value));
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                throw new \InvalidArgumentException('Invalid email');
            }
            $this->email = $value;
        }
    }

    // Virtual property: computed, no backing storage.
    public string $displayName {
        get => "{$this->firstName} {$this->lastName}";
    }

    public function __construct(
        string $id,
        string $email,
        public string $firstName,
        public string $lastName,
        public Status $status = Status::Draft,
    ) {
        $this->id = $id;
        $this->email = $email;
    }
}
```

---

## Pipe Operator + First-Class Callables (PHP 8.5)

```php
<?php
// src/Support/slugify.php
declare(strict_types=1);

namespace App\Support;

function slugify(string $title): string
{
    return $title
        |> trim(...)
        |> strtolower(...)
        |> fn(string $s): string => preg_replace('/[^a-z0-9]+/', '-', $s)
        |> fn(string $s): string => trim($s, '-');
}
```

---

## Usage

```php
<?php
declare(strict_types=1);

use App\Model\User;
use App\ValueObject\Money;
use App\Enum\Status;

$user = new User('u_1', 'ADA@Example.COM ', 'Ada', 'Lovelace', Status::Published);
echo $user->email;        // ada@example.com  (normalized by set hook)
echo $user->displayName;  // Ada Lovelace     (virtual property)

$price = new Money(1000, 'EUR');
$discounted = $price->withAmount(800);  // new instance, $price untouched
```
