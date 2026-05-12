---
name: validation-attributes
description: FormRequest attributes shipped in Laravel 13
---

# Validation Attributes (Laravel 13)

Namespace: `Illuminate\Validation\Attributes\*`

## Redirect target

```php
use Illuminate\Validation\Attributes\RedirectTo;
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

For named routes, use `#[RedirectTo(route: 'dashboard')]` if your version supports the named-arg form, otherwise stick to the `$redirectRoute` property.

## Stop on first failure

```php
use Illuminate\Validation\Attributes\StopOnFirstFailure;

#[StopOnFirstFailure]
class StoreUserRequest extends FormRequest {}
```

Marker attribute - replaces `protected $stopOnFirstFailure = true`. Validation stops at the first failing rule per field AND per request.

## Notes

- Both attributes apply only to `FormRequest` subclasses
- Combine with `authorize()` and `rules()` methods as usual
- `#[RedirectTo]` is ignored for JSON requests (API returns 422 regardless)
