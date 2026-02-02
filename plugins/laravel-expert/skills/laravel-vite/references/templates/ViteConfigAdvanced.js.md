---
name: ViteConfigAdvanced.js
description: Advanced Vite configuration with optimization
file-type: javascript
---

# Vite Configuration - Advanced

## Full Production Configuration

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isProduction = mode === 'production';

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.js'],
                refresh: !isProduction,
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
                '@components': resolve(__dirname, 'resources/js/components'),
                '@composables': resolve(__dirname, 'resources/js/composables'),
                '@stores': resolve(__dirname, 'resources/js/stores'),
                '@utils': resolve(__dirname, 'resources/js/utils'),
                '@assets': resolve(__dirname, 'resources/assets'),
                'vue': 'vue/dist/vue.esm-bundler.js',
            },
        },

        server: {
            host: env.VITE_HOST || 'localhost',
            port: parseInt(env.VITE_PORT) || 5173,
            https: false,
            cors: true,
            hmr: {
                host: env.VITE_HMR_HOST || 'localhost',
            },
        },

        build: {
            outDir: 'public/build',
            manifest: true,
            sourcemap: isProduction ? 'hidden' : true,
            minify: isProduction ? 'terser' : false,

            terserOptions: isProduction ? {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            } : undefined,

            rollupOptions: {
                output: {
                    manualChunks: {
                        'vendor-vue': ['vue', 'vue-router', 'pinia'],
                        'vendor-ui': ['@headlessui/vue', '@heroicons/vue'],
                        'vendor-utils': ['axios', 'lodash-es', 'dayjs'],
                    },
                    entryFileNames: 'assets/[name]-[hash].js',
                    chunkFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]',
                },
            },

            chunkSizeWarningLimit: 500,
        },

        define: {
            'import.meta.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
            '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
        },

        optimizeDeps: {
            include: ['vue', 'axios'],
        },
    };
});
```

## Docker/Sail Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
        watch: {
            usePolling: true,
            interval: 1000,
        },
    },
});
```

```yaml
# docker-compose.yml (Sail)
services:
    laravel.test:
        ports:
            - '${APP_PORT:-80}:80'
            - '${VITE_PORT:-5173}:5173'
```

## Multiple Entry Points

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                // Main app
                'resources/css/app.css',
                'resources/js/app.js',
                // Admin panel
                'resources/css/admin.css',
                'resources/js/admin.js',
                // Landing pages
                'resources/js/landing.js',
            ],
            refresh: true,
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Split large libraries
                        if (id.includes('chart.js')) {
                            return 'vendor-chart';
                        }
                        if (id.includes('monaco-editor')) {
                            return 'vendor-monaco';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
});
```

## Valet TLS Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
            valetTls: 'myapp.test',
        }),
    ],
});
```

## CSP Nonce Middleware

```php
<?php
// app/Http/Middleware/AddCspHeaders.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class AddCspHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        Vite::useCspNonce();

        $response = $next($request);

        $nonce = Vite::cspNonce();

        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'nonce-{$nonce}'",
            "style-src 'self' 'nonce-{$nonce}'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self' ws://localhost:5173 wss://localhost:5173",
        ]);

        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}
```

## Legacy Browser Support

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        legacy({
            targets: ['defaults', 'not IE 11'],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        }),
    ],
});
```

## PWA Support

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                name: 'My Laravel App',
                short_name: 'LaravelApp',
                description: 'My awesome Laravel application',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            },
        }),
    ],
});
```

## CDN Asset URLs

```php
<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            Vite::createAssetPathsUsing(function (string $path, ?bool $secure) {
                return "https://cdn.myapp.com/{$path}";
            });
        }
    }
}
```

## Custom Build Directory

```php
{{-- In Blade --}}
{{
    Vite::useHotFile(storage_path('vite.hot'))
        ->useBuildDirectory('custom-build')
        ->useManifestFilename('custom-manifest.json')
        ->withEntryPoints(['resources/js/app.js'])
}}
```

## Static File Copy

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'resources/images/*',
                    dest: 'images',
                },
                {
                    src: 'resources/fonts/*',
                    dest: 'fonts',
                },
            ],
        }),
    ],
});
```
