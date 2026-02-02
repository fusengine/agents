---
name: Envoy.blade.php
description: Complete Envoy deployment script from official Laravel 12 docs
keywords: envoy, deployment, ssh, tasks, stories
source: https://laravel.com/docs/12.x/envoy
---

# Envoy Deployment Template

## Basic Task Definition

```blade
@servers(['web' => ['user@192.168.1.1'], 'workers' => ['user@192.168.1.2']])

@task('restart-queues', ['on' => 'workers'])
    cd /home/user/example.com
    php artisan queue:restart
@endtask
```

## Stories (Task Groups)

```blade
@servers(['web' => ['user@192.168.1.1']])

@story('deploy')
    update-code
    install-dependencies
@endstory

@task('update-code')
    cd /home/user/example.com
    git pull origin master
@endtask

@task('install-dependencies')
    cd /home/user/example.com
    composer install
@endtask
```

## Multiple Servers with Parallel Execution

```blade
@servers(['web-1' => '192.168.1.1', 'web-2' => '192.168.1.2'])

@task('deploy', ['on' => ['web-1', 'web-2'], 'parallel' => true])
    cd /home/user/example.com
    git pull origin {{ $branch }}
    php artisan migrate --force
@endtask
```

## Variables and Conditionals

```blade
@servers(['web' => ['user@192.168.1.1']])

@task('deploy', ['on' => 'web'])
    cd /home/user/example.com

    @if ($branch)
        git pull origin {{ $branch }}
    @endif

    php artisan migrate --force
@endtask
```

## Hooks

```blade
@before
    if ($task === 'deploy') {
        // Before deployment...
    }
@endbefore

@after
    if ($task === 'deploy') {
        // After deployment...
    }
@endafter

@error
    if ($task === 'deploy') {
        // Handle deployment error...
    }
@enderror

@success
    // All tasks completed successfully...
@endsuccess

@finished
    if ($exitCode > 0) {
        // There were errors in one of the tasks...
    }
@endfinished
```

## Notifications

```blade
@finished
    @slack('webhook-url', '#bots')
@endfinished

@finished
    @slack('webhook-url', '#bots', 'Hello, Slack.')
@endfinished

@finished
    @discord('discord-webhook-url')
@endfinished

@finished
    @telegram('bot-id', 'chat-id')
@endfinished

@finished
    @microsoftTeams('webhook-url')
@endfinished
```

## Confirmation Prompt

```blade
@task('deploy', ['on' => 'web', 'confirm' => true])
    cd /home/user/example.com
    git pull origin {{ $branch }}
    php artisan migrate
@endtask
```

## Setup Block

```blade
@setup
    $now = new DateTime;
@endsetup
```

## Import External Tasks

```blade
@import('vendor/package/Envoy.blade.php')
```

## Usage

```shell
php vendor/bin/envoy run deploy
php vendor/bin/envoy run deploy --branch=master
```
