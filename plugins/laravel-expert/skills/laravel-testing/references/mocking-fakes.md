---
name: mocking-fakes
description: Facade fakes - Mail, Queue, Event, Notification, Storage
file-type: markdown
---

# Facade Fakes

## Overview

| Facade | Fake | Assert Methods |
|--------|------|----------------|
| `Mail` | `Mail::fake()` | `assertSent`, `assertNotSent`, `assertSentCount` |
| `Queue` | `Queue::fake()` | `assertPushed`, `assertPushedOn`, `assertPushedWithChain` |
| `Event` | `Event::fake()` | `assertDispatched`, `assertDispatchedTimes` |
| `Notification` | `Notification::fake()` | `assertSentTo`, `assertSentTimes` |
| `Storage` | `Storage::fake()` | `assertExists`, `assertMissing` |
| `Bus` | `Bus::fake()` | `assertDispatched`, `assertBatched`, `assertChained` |

---

## Mail::fake()

```php
Mail::fake();
$order->ship();

Mail::assertSent(OrderShipped::class);
Mail::assertSent(OrderShipped::class, fn ($m) => $m->order->id === $order->id);
Mail::assertSent(OrderShipped::class, 2);       // Sent twice
Mail::assertNotSent(AnotherMailable::class);
Mail::assertSentCount(1);
```

---

## Queue::fake()

```php
Queue::fake();
ProcessOrder::dispatch($order);

Queue::assertPushed(ProcessOrder::class);
Queue::assertPushed(ProcessOrder::class, fn ($j) => $j->order->id === $order->id);
Queue::assertPushedOn('high', ProcessOrder::class);
Queue::assertPushedWithChain(ProcessOrder::class, [NotifyUser::class]);
Queue::assertNotPushed(AnotherJob::class);
```

---

## Event::fake()

```php
Event::fake();
$order = Order::factory()->create();

Event::assertDispatched(OrderCreated::class);
Event::assertDispatched(OrderCreated::class, fn ($e) => $e->order->id === $order->id);
Event::assertDispatchedTimes(OrderCreated::class, 1);
Event::assertNotDispatched(AnotherEvent::class);

// Partial: Event::fake([OrderCreated::class]);
// Scoped: Event::fakeFor(fn () => Order::factory()->create());
```

---

## Notification::fake()

```php
Notification::fake();
$user->notify(new InvoicePaid($invoice));

Notification::assertSentTo($user, InvoicePaid::class);
Notification::assertSentTo($user, InvoicePaid::class, fn ($n) => $n->invoice->id === $invoice->id);
Notification::assertSentTimes(InvoicePaid::class, 1);
Notification::assertNotSentTo($user, AnotherNotification::class);
```

---

## Storage::fake()

```php
Storage::fake('avatars');
$file = UploadedFile::fake()->image('avatar.jpg');

$this->postJson('/avatar', ['avatar' => $file]);

Storage::disk('avatars')->assertExists('avatars/avatar.jpg');
Storage::disk('avatars')->assertMissing('missing.jpg');
```

---

## Bus::fake()

```php
Bus::fake();
$this->post('/import');

Bus::assertDispatched(ImportJob::class);
Bus::assertBatched(fn ($batch) => $batch->jobs->count() === 10);
Bus::assertChained([Job1::class, Job2::class]);
```

---

## Decision Tree

```
What to fake?
├── Emails → Mail::fake()
├── Jobs → Queue::fake() / Bus::fake()
├── Events → Event::fake()
├── Notifications → Notification::fake()
├── File uploads → Storage::fake()
└── Partial/Scoped → fake([...]) / fakeFor()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Fake before triggering action | Forget to fake before action |
| Assert content in closures | Skip content assertions |
| Use assertNothingSent() for negative | Leave real services unfaked |
