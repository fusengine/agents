---
name: validation-attributes
description: FormRequest attributes shipped in Laravel 13
---

# Validation Attributes (Laravel 13)

Namespace: `Illuminate\Foundation\Http\Attributes\*` (`RedirectTo`, `RedirectToRoute`, `ErrorBag`, `StopOnFirstFailure`, `FailOnUnknownFields`)

## Redirect target

```php
use Illuminate\Foundation\Http\Attributes\RedirectTo;
use Illuminate\Foundation\Http\FormRequest;

#[RedirectTo('/dashboard')]
class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'name' => 'required|string',
        ];
    }
}
```

Replaces `protected $redirect = '/dashboard';` - destination after validation failure.

For named routes, use the dedicated attribute:

```php
use Illuminate\Foundation\Http\Attributes\RedirectToRoute;

#[RedirectToRoute('dashboard')]
class StorePostRequest extends FormRequest {}
```

## Named error bag

```php
use Illuminate\Foundation\Http\Attributes\ErrorBag;

#[ErrorBag('login')]
class LoginRequest extends FormRequest {}
```

## Stop on first failure

```php
use Illuminate\Foundation\Http\Attributes\StopOnFirstFailure;

#[StopOnFirstFailure]
class StoreUserRequest extends FormRequest {}
```

Marker attribute - replaces `protected $stopOnFirstFailure = true`. Validation stops once a single validation failure has occurred.

## Reject unknown fields

```php
use Illuminate\Foundation\Http\Attributes\FailOnUnknownFields;

#[FailOnUnknownFields]
class StoreUserRequest extends FormRequest {}
```

Rejects any input field not declared in `rules()`; `#[FailOnUnknownFields(false)]` opts a request back out.

## Notes

- These attributes apply only to `FormRequest` subclasses (resolved from parent classes since 13.33)
- Combine with `authorize()` and `rules()` methods as usual
- `#[RedirectTo]` is ignored for JSON requests (API returns 422 regardless)
