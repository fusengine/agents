---
name: ai-sdk-installation
description: Install and configure laravel/ai for Laravel 13
---

# Installation & Configuration

## Install

```shell
composer require laravel/ai
```

## Publish config

```shell
php artisan vendor:publish --tag=ai-config
```

Creates `config/ai.php`.

## Environment variables

```ini
ANTHROPIC_API_KEY=
AZURE_OPENAI_API_KEY=
COHERE_API_KEY=
DEEPSEEK_API_KEY=
ELEVENLABS_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
JINA_API_KEY=
MISTRAL_API_KEY=
OLLAMA_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
VOYAGEAI_API_KEY=
XAI_API_KEY=
```

## config/ai.php

```php
return [
    'default' => env('AI_DEFAULT_PROVIDER', 'openai'),

    'providers' => [
        'openai' => [
            'driver' => 'openai',
            'key' => env('OPENAI_API_KEY'),
            'url' => env('OPENAI_BASE_URL'),
        ],

        'anthropic' => [
            'driver' => 'anthropic',
            'key' => env('ANTHROPIC_API_KEY'),
            'url' => env('ANTHROPIC_BASE_URL'),
        ],

        // ... gemini, azure, groq, deepseek, ollama, mistral,
        //     xai, cohere, elevenlabs, jina, voyageai, openrouter
    ],

    'defaults' => [
        'text' => ['provider' => 'anthropic', 'model' => 'claude-haiku-4-5-20251001'],
        'embeddings' => ['provider' => 'openai', 'model' => 'text-embedding-3-small'],
        'image' => ['provider' => 'openai', 'model' => 'dall-e-3'],
        'audio' => ['provider' => 'openai', 'model' => 'tts-1'],
        'transcription' => ['provider' => 'openai', 'model' => 'whisper-1'],
    ],
];
```

## Provider list

| Provider | `Lab` enum | Env var |
|----------|-----------|---------|
| OpenAI | `Lab::OpenAI` | `OPENAI_API_KEY` |
| Anthropic | `Lab::Anthropic` | `ANTHROPIC_API_KEY` |
| Google Gemini | `Lab::Gemini` | `GEMINI_API_KEY` |
| Azure OpenAI | `Lab::Azure` | `AZURE_OPENAI_API_KEY` |
| Groq | `Lab::Groq` | `GROQ_API_KEY` |
| DeepSeek | `Lab::DeepSeek` | `DEEPSEEK_API_KEY` |
| Ollama (local) | `Lab::Ollama` | `OLLAMA_API_KEY` |
| Mistral | `Lab::Mistral` | `MISTRAL_API_KEY` |
| xAI | `Lab::XAI` | `XAI_API_KEY` |
| Cohere | `Lab::Cohere` | `COHERE_API_KEY` |
| ElevenLabs | `Lab::ElevenLabs` | `ELEVENLABS_API_KEY` |
| Jina | `Lab::Jina` | `JINA_API_KEY` |
| VoyageAI | `Lab::VoyageAI` | `VOYAGEAI_API_KEY` |
| OpenRouter | `Lab::OpenRouter` | `OPENROUTER_API_KEY` |

## Custom base URLs

For proxies, OpenAI-compatible self-hosted endpoints, or alternative regions, set `*_BASE_URL` env vars - already wired in `config/ai.php`.
