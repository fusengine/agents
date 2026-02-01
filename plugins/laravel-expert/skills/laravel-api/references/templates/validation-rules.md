---
name: validation-rules
description: Complete reference of Laravel validation rules
keywords: validation, rules, reference, api
---

# Validation Rules Reference

## Presence Rules

| Rule | Description |
|------|-------------|
| `required` | Field must be present and not empty |
| `required_if:field,value` | Required if other field equals value |
| `required_unless:field,value` | Required unless other field equals value |
| `required_with:field1,field2` | Required if any of fields present |
| `required_without:field` | Required if field is not present |
| `required_array_keys:key1,key2` | Array must contain specified keys |
| `nullable` | Field can be null |
| `filled` | If present, cannot be empty |
| `sometimes` | Only validate if present (for updates) |
| `present` | Must exist but can be empty |
| `prohibited` | Field must not be present |
| `prohibited_if:field,value` | Prohibited if other field equals value |
| `missing` | Field must not be present |

## Type Rules

| Rule | Description |
|------|-------------|
| `string` | Must be a string |
| `integer` | Must be an integer |
| `numeric` | Must be numeric |
| `boolean` | Must be boolean (true, false, 1, 0, "1", "0") |
| `array` | Must be an array |
| `json` | Must be valid JSON string |
| `date` | Must be valid date |
| `file` | Must be uploaded file |
| `image` | Must be image (jpg, png, bmp, gif, svg, webp) |

## Size Rules

| Rule | Description |
|------|-------------|
| `min:value` | Minimum (length for string, value for number, items for array) |
| `max:value` | Maximum (length for string, value for number, items for array) |
| `size:value` | Exact size |
| `between:min,max` | Between min and max inclusive |
| `gt:field` | Greater than other field |
| `gte:field` | Greater than or equal to other field |
| `lt:field` | Less than other field |
| `lte:field` | Less than or equal to other field |

## String Rules

| Rule | Description |
|------|-------------|
| `email` | Valid email format |
| `url` | Valid URL format |
| `uuid` | Valid UUID |
| `ulid` | Valid ULID |
| `alpha` | Only alphabetic characters |
| `alpha_dash` | Alphanumeric, dashes, underscores |
| `alpha_num` | Only alphanumeric |
| `regex:pattern` | Matches regex pattern |
| `not_regex:pattern` | Does not match regex |
| `starts_with:foo,bar` | Starts with one of values |
| `ends_with:foo,bar` | Ends with one of values |
| `lowercase` | Must be lowercase |
| `uppercase` | Must be uppercase |

## Database Rules

| Rule | Description |
|------|-------------|
| `unique:table,column` | Not exists in database |
| `unique:table,column,except,id` | Unique except for ID |
| `exists:table,column` | Must exist in database |
| `Rule::unique()->ignore($id)` | Unique ignoring specific ID (for updates) |

## Date Rules

| Rule | Description |
|------|-------------|
| `date` | Valid date |
| `date_format:Y-m-d` | Matches date format |
| `after:date` | After specified date |
| `after_or_equal:date` | After or equal to date |
| `before:date` | Before specified date |
| `before_or_equal:date` | Before or equal to date |
| `date_equals:date` | Equals specified date |
| `after:field` | After another field's date |

## File Rules

| Rule | Description |
|------|-------------|
| `file` | Must be file |
| `image` | Must be image |
| `mimes:jpg,png,pdf` | Allowed MIME types |
| `mimetypes:image/jpeg` | Specific MIME types |
| `max:1024` | Max file size in KB |
| `dimensions:min_width=100` | Image dimensions |

## Array Rules

| Rule | Description |
|------|-------------|
| `array` | Must be array |
| `array:key1,key2` | Only specified keys allowed |
| `in:foo,bar,baz` | Value must be in list |
| `not_in:foo,bar` | Value must not be in list |
| `distinct` | No duplicate values in array |
| `*.field` | Validate field in each array item |

## Comparison Rules

| Rule | Description |
|------|-------------|
| `confirmed` | Must have matching `field_confirmation` |
| `same:field` | Must match another field |
| `different:field` | Must differ from another field |
| `in:a,b,c` | Must be one of values |
| `not_in:a,b,c` | Must not be one of values |
| `accepted` | Must be "yes", "on", 1, "1", true, "true" |
| `declined` | Must be "no", "off", 0, "0", false, "false" |

## Password Rules

```php
use Illuminate\Validation\Rules\Password;

'password' => [
    'required',
    Password::min(8)
        ->letters()
        ->mixedCase()
        ->numbers()
        ->symbols()
        ->uncompromised(),
],
```

## Enum Rules

```php
use App\Enums\Status;
use Illuminate\Validation\Rule;

'status' => [Rule::enum(Status::class)],
```

## Common Patterns

### Create Post
```php
[
    'title' => ['required', 'string', 'max:255'],
    'slug' => ['required', 'string', 'max:255', 'unique:posts,slug'],
    'content' => ['required', 'string'],
    'published_at' => ['nullable', 'date'],
]
```

### Update Post
```php
[
    'title' => ['sometimes', 'string', 'max:255'],
    'slug' => ['sometimes', 'string', 'max:255', Rule::unique('posts')->ignore($this->post)],
    'content' => ['sometimes', 'string'],
]
```

### User Registration
```php
[
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'email', 'unique:users,email'],
    'password' => ['required', 'confirmed', Password::defaults()],
]
```

### File Upload
```php
[
    'avatar' => ['nullable', 'image', 'max:2048', 'dimensions:min_width=100,min_height=100'],
    'document' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
]
```
