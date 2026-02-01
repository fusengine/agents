---
name: module.json
description: Module configuration file examples
keywords: module, json, config, manifest
---

# module.json Examples

Module configuration file templates.

## Basic Module

```json
{
    "name": "Blog",
    "version": "1.0.0",
    "description": "Blog management module",
    "enabled": true,
    "isCore": false,
    "dependencies": ["User"]
}
```

## Core Module

```json
{
    "name": "Core",
    "version": "1.0.0",
    "description": "FuseCore infrastructure module",
    "enabled": true,
    "isCore": true,
    "dependencies": []
}
```

## Module with Extended Configuration

```json
{
    "name": "Payment",
    "version": "2.0.0",
    "description": "Payment processing with Stripe and PayPal",
    "author": "FuseCore Team",
    "license": "MIT",
    "keywords": ["payment", "stripe", "paypal", "checkout"],
    "enabled": true,
    "isCore": false,
    "dependencies": ["User", "Shop"],
    "config": {
        "default_gateway": "stripe",
        "sandbox_mode": true,
        "supported_currencies": ["EUR", "USD", "GBP"]
    }
}
```

## Module with Multiple Dependencies

```json
{
    "name": "Analytics",
    "version": "1.0.0",
    "description": "Analytics and reporting dashboard",
    "enabled": true,
    "isCore": false,
    "dependencies": ["User", "Dashboard", "Blog"]
}
```

## Disabled Module

```json
{
    "name": "Legacy",
    "version": "1.0.0",
    "description": "Legacy module (deprecated)",
    "enabled": false,
    "isCore": false,
    "dependencies": []
}
```
