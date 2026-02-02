---
name: ArtisanCommand.php
description: Complete Artisan command examples from official Laravel 12 docs
keywords: artisan, commands, console, cli
source: https://laravel.com/docs/12.x/artisan
---

# Artisan Command Templates

## Basic Command Class

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:send {user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a marketing email to a user';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Command logic here...

        return Command::SUCCESS;
    }
}
```

## Signature with Arguments and Options

```php
// Required argument
protected $signature = 'mail:send {user}';

// Optional argument
protected $signature = 'mail:send {user?}';

// Argument with default
protected $signature = 'mail:send {user=foo}';

// Boolean option (switch)
protected $signature = 'mail:send {user} {--queue}';

// Option with value
protected $signature = 'mail:send {user} {--queue=}';

// Option with default value
protected $signature = 'mail:send {user} {--queue=default}';

// Option shortcut
protected $signature = 'mail:send {user} {--Q|queue}';

// Array argument
protected $signature = 'mail:send {user*}';

// Array option
protected $signature = 'mail:send {user} {--id=*}';

// With descriptions
protected $signature = 'mail:send
                        {user : The ID of the user}
                        {--queue : Whether the job should be queued}';
```

## Input/Output Methods

```php
public function handle(): int
{
    // Get argument
    $userId = $this->argument('user');
    $allArguments = $this->arguments();

    // Get option
    $queueName = $this->option('queue');
    $allOptions = $this->options();

    // Output
    $this->info('This is informational text');
    $this->error('This is an error');
    $this->warn('This is a warning');
    $this->line('Plain text output');
    $this->newLine(3);

    // Prompts
    $name = $this->ask('What is your name?');
    $password = $this->secret('What is the password?');

    if ($this->confirm('Do you wish to continue?')) {
        // ...
    }

    $name = $this->anticipate('What is your name?', ['Taylor', 'Dayle']);
    $name = $this->choice('What is your name?', ['Taylor', 'Dayle'], 0);

    return Command::SUCCESS;
}
```

## Progress Bar

```php
use App\Models\User;

public function handle(): void
{
    $users = User::all();

    $bar = $this->output->createProgressBar(count($users));
    $bar->start();

    foreach ($users as $user) {
        $this->performTask($user);
        $bar->advance();
    }

    $bar->finish();
    $this->newLine();
}
```

## Table Output

```php
$this->table(
    ['Name', 'Email'],
    User::all(['name', 'email'])->toArray()
);
```

## Closure Command

```php
// routes/console.php
use Illuminate\Support\Facades\Artisan;

Artisan::command('mail:send {user}', function (string $user) {
    $this->info("Sending email to: {$user}!");
})->purpose('Send a marketing email to a user');
```

## Calling Commands Programmatically

```php
use Illuminate\Support\Facades\Artisan;

// Call command
Artisan::call('mail:send', [
    'user' => 1, '--queue' => 'default'
]);

// Get output
$output = Artisan::output();

// Queue command
Artisan::queue('mail:send', ['user' => 1]);

// From another command
$this->call('mail:send', ['user' => 1]);
$this->callSilently('mail:send', ['user' => 1]);
```

## Scheduling

```php
// routes/console.php
use App\Console\Commands\SendEmailsCommand;
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send Taylor --force')->daily();
Schedule::command(SendEmailsCommand::class, ['Taylor', '--force'])->daily();
```

## Return Codes

```php
public function handle(): int
{
    // Success
    return Command::SUCCESS; // 0

    // Failure
    return Command::FAILURE; // 1

    // Invalid
    return Command::INVALID; // 2
}
```
