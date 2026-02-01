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

### File: lang/fr/messages.php

```php
<?php

declare(strict_types=1);

return [
    'welcome' => 'Bienvenue sur notre application',
    'hello' => 'Bonjour :name',
    'goodbye' => 'Au revoir :name, à :time',

    'notifications' => [
        'title' => 'Notifications',
        'empty' => 'Aucune notification',
        'new' => 'Vous avez :count nouvelles notifications',
    ],

    'items' => '{0} Aucun élément|{1} Un élément|[2,*] :count éléments',
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

### File: lang/fr.json

```json
{
    "Welcome to our application": "Bienvenue sur notre application",
    "Hello :name": "Bonjour :name",
    "Sign In": "Connexion",
    "Sign Out": "Déconnexion",
    "Dashboard": "Tableau de bord"
}
```
