---
name: SSRSetup
description: Server-Side Rendering configuration for Inertia
file-type: multi
---

# SSR Setup

## Vue.js SSR

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            ssr: 'resources/js/ssr.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            'vue': 'vue/dist/vue.esm-bundler.js',
        },
    },
});
```

### SSR Entry Point

```javascript
// resources/js/ssr.js
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.vue`,
                import.meta.glob('./Pages/**/*.vue')
            ),
        setup({ App, props, plugin }) {
            return createSSRApp({ render: () => h(App, props) })
                .use(plugin)
                .use(ZiggyVue, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });
        },
    })
);
```

### Build Commands

```json
{
    "scripts": {
        "dev": "vite",
        "build": "vite build && vite build --ssr",
        "preview": "vite preview"
    }
}
```

### Start SSR Server

```bash
# Build first
npm run build

# Start SSR server
php artisan inertia:start-ssr

# Stop SSR server
php artisan inertia:stop-ssr
```

---

## React SSR

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
        },
    },
});
```

### SSR Entry Point

```jsx
// resources/js/ssr.jsx
import ReactDOMServer from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx')
            ),
        setup: ({ App, props }) => <App {...props} />,
    })
);
```

---

## SSR Configuration

### config/inertia.php

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Server Side Rendering
    |--------------------------------------------------------------------------
    |
    | These options configure how Inertia handles server-side rendering.
    |
    */

    'ssr' => [
        'enabled' => true,
        'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Testing
    |--------------------------------------------------------------------------
    |
    | These options configure Inertia's testing utilities.
    |
    */

    'testing' => [
        'ensure_pages_exist' => true,
        'page_paths' => [
            resource_path('js/Pages'),
        ],
        'page_extensions' => [
            'js',
            'jsx',
            'vue',
            'ts',
            'tsx',
        ],
    ],
];
```

---

## Production Deployment

### Supervisor Configuration

```ini
; /etc/supervisor/conf.d/inertia-ssr.conf
[program:inertia-ssr]
process_name=%(program_name)s
command=php /var/www/html/artisan inertia:start-ssr
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/html/storage/logs/inertia-ssr.log
stopwaitsecs=60
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'laravel-ssr',
            script: 'php',
            args: 'artisan inertia:start-ssr',
            cwd: '/var/www/html',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '256M',
        },
    ],
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## SSR-Safe Components

### Checking SSR Environment

```vue
<script setup>
import { computed } from 'vue';

const isSSR = computed(() => typeof window === 'undefined');
</script>

<template>
    <div>
        <ClientOnlyChart v-if="!isSSR" :data="chartData" />
        <div v-else class="chart-placeholder">
            Loading chart...
        </div>
    </div>
</template>
```

### Client-Only Component Wrapper

```vue
<!-- resources/js/Components/ClientOnly.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const mounted = ref(false);

onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <slot v-if="mounted" />
    <slot v-else name="fallback">
        <div class="animate-pulse bg-gray-200 rounded" />
    </slot>
</template>
```

### Usage

```vue
<template>
    <ClientOnly>
        <ChartComponent :data="data" />
        <template #fallback>
            <div class="h-64 bg-gray-100 rounded">Loading chart...</div>
        </template>
    </ClientOnly>
</template>
```

---

## Debugging SSR

### Check SSR Status

```php
<?php
// In a controller or middleware

use Inertia\Inertia;

// Check if SSR is enabled and running
$ssrEnabled = config('inertia.ssr.enabled');
$ssrUrl = config('inertia.ssr.url');

// Test SSR connection
try {
    $response = Http::get($ssrUrl . '/health');
    $ssrRunning = $response->successful();
} catch (\Exception $e) {
    $ssrRunning = false;
}
```

### SSR Logs

```bash
# View SSR logs
tail -f storage/logs/inertia-ssr.log

# Check SSR process
ps aux | grep inertia
```

### Common Issues

```javascript
// Avoid window/document in SSR
// BAD
const width = window.innerWidth;

// GOOD
import { onMounted, ref } from 'vue';

const width = ref(0);
onMounted(() => {
    width.value = window.innerWidth;
});
```
