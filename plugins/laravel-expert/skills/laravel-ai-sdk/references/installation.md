---
name: ai-sdk-installation
description: Install and configure laravel/ai for Laravel 13
---

# Installation & Configuration

## Install

```shell
composer require laravel/ai
```

## Publish config + migrations

```shell
php artisan vendor:publish --provider="Laravel\Ai\AiServiceProvider"
php artisan migrate
```

Creates `config/ai.php` and the `agent_conversations` / `agent_conversation_messages` tables used for conversation storage.

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
OPENAI_COMPATIBLE_API_KEY=
OPENAI_COMPATIBLE_URL=
OPENROUTER_API_KEY=
TYPESAFE_API_KEY=
VOYAGEAI_API_KEY=
XAI_API_KEY=
```

## config/ai.php (excerpt of the published file)

```php
return [
    'default' => 'openai',
    'default_for_images' => 'gemini',
    'default_for_audio' => 'openai',
    'default_for_transcription' => 'openai',
    'default_for_embeddings' => 'openai',
    'default_for_reranking' => 'cohere',
    'default_for_classification' => 'typesafe',

    'caching' => [
        'embeddings' => [
            'cache' => false,
            'store' => env('CACHE_STORE', 'database'),
            'individually' => true,
        ],
    ],

    'providers' => [
        'anthropic' => [
            'driver' => 'anthropic',
            'key' => env('ANTHROPIC_API_KEY'),
            'url' => env('ANTHROPIC_URL', 'https://api.anthropic.com/v1'),
        ],

        'openai' => [
            'driver' => 'openai',
            'key' => env('OPENAI_API_KEY'),
            'url' => env('OPENAI_URL', 'https://api.openai.com/v1'),
        ],

        // ... azure, bedrock, cohere, deepseek, eleven, gemini, groq, jina,
        //     mistral, ollama, openai-compatible, openrouter, typesafe, voyageai, xai
    ],
];
```

## Provider list

| Provider | `Lab` enum | Env var |
|----------|-----------|---------|
| OpenAI | `Lab::OpenAI` | `OPENAI_API_KEY` |
| OpenAI-compatible | `Lab::OpenAICompatible` | `OPENAI_COMPATIBLE_API_KEY` |
| Anthropic | `Lab::Anthropic` | `ANTHROPIC_API_KEY` |
| Google Gemini | `Lab::Gemini` | `GEMINI_API_KEY` |
| Azure OpenAI | `Lab::Azure` | `AZURE_OPENAI_API_KEY` |
| AWS Bedrock | `Lab::Bedrock` | `AWS_BEARER_TOKEN_BEDROCK` |
| Groq | `Lab::Groq` | `GROQ_API_KEY` |
| DeepSeek | `Lab::DeepSeek` | `DEEPSEEK_API_KEY` |
| Ollama (local) | `Lab::Ollama` | `OLLAMA_API_KEY` |
| Mistral | `Lab::Mistral` | `MISTRAL_API_KEY` |
| xAI | `Lab::xAI` | `XAI_API_KEY` |
| Cohere | `Lab::Cohere` | `COHERE_API_KEY` |
| ElevenLabs | `Lab::ElevenLabs` | `ELEVENLABS_API_KEY` |
| Jina | `Lab::Jina` | `JINA_API_KEY` |
| TypeSafe | `Lab::TypeSafe` | `TYPESAFE_API_KEY` |
| VoyageAI | `Lab::VoyageAI` | `VOYAGEAI_API_KEY` |
| OpenRouter | `Lab::OpenRouter` | `OPENROUTER_API_KEY` |

## Custom base URLs

For proxies (LiteLLM, corporate gateways) set the provider's `url` key in `config/ai.php` (e.g. `OPENAI_URL`, `ANTHROPIC_URL`). Supported for OpenAI, Anthropic, Gemini, Groq, Cohere, DeepSeek, xAI and OpenRouter.
