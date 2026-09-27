---
name: lang-files
description: Complete translation file examples
keywords: lang, messages, json, translations
---

# Translation Files

## PHP Translation File

### File: lang/en/messages.php

```php
<?php

declare(strict_types=1);

return [
    'welcome' => 'Welcome to our application',
    'hello' => 'Hello :name',
    'goodbye' => 'Goodbye :name, see you :time',

    'notifications' => [
        'title' => 'Notifications',
        'empty' => 'No notifications yet',
        'new' => 'You have :count new notifications',
    ],

    'items' => '{0} No items|{1} One item|[2,*] :count items',
];
```

### File: lang/es/messages.php

```php
<?php

declare(strict_types=1);

return [
    'welcome' => 'Bienvenido a nuestra aplicación',
    'hello' => 'Hola :name',
    'goodbye' => 'Adiós :name, hasta :time',

    'notifications' => [
        'title' => 'Notificaciones',
        'empty' => 'Aún no hay notificaciones',
        'new' => 'Tienes :count notificaciones nuevas',
    ],

    'items' => '{0} Ningún elemento|{1} Un elemento|[2,*] :count elementos',
];
```

## JSON Translation File

### File: lang/en.json

```json
{
    "Welcome to our application": "Welcome to our application",
    "Hello :name": "Hello :name",
    "Sign In": "Sign In",
    "Sign Out": "Sign Out",
    "Dashboard": "Dashboard"
}
```

### File: lang/es.json

```json
{
    "Welcome to our application": "Bienvenido a nuestra aplicación",
    "Hello :name": "Hola :name",
    "Sign In": "Iniciar sesión",
    "Sign Out": "Cerrar sesión",
    "Dashboard": "Panel de control"
}
```
