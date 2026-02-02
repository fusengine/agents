---
name: invoices
description: Invoice management, PDF generation, and receipt handling
when-to-use: Consult when generating invoices, downloading PDFs
keywords: laravel, cashier, invoices, pdf, receipts, billing
priority: medium
requires: stripe.md
related: subscriptions.md
---

# Invoices and Receipts

## Getting Invoices

### List All Invoices

```php
$invoices = $user->invoices();

foreach ($invoices as $invoice) {
    echo $invoice->date()->toFormattedDateString();  // "Jan 15, 2024"
    echo $invoice->total();                          // "$29.99"
    echo $invoice->number;                           // "INV-0001"
}
```

### Including Pending Invoices

```php
$invoices = $user->invoicesIncludingPending();
```

### Find Specific Invoice

```php
$invoice = $user->findInvoice($invoiceId);

if ($invoice) {
    echo $invoice->total();
}
```

---

## Upcoming Invoice

Preview what will be charged next:

```php
$upcoming = $user->upcomingInvoice();

if ($upcoming) {
    echo "Next charge: " . $upcoming->total();
    echo "On: " . $upcoming->date()->format('M j, Y');
}
```

---

## Invoice Details

```php
$invoice = $user->findInvoice($invoiceId);

// Basic info
$invoice->id;                    // Stripe invoice ID
$invoice->number;                // Invoice number
$invoice->date();                // Carbon date
$invoice->dueDate();             // Carbon due date

// Amounts (formatted)
$invoice->total();               // "$29.99"
$invoice->subtotal();            // "$24.99"
$invoice->tax();                 // "$5.00"
$invoice->amountDue();           // "$29.99"
$invoice->amountOff();           // Discount amount

// Raw amounts (cents)
$invoice->rawTotal();            // 2999
$invoice->rawSubtotal();         // 2499

// Status
$invoice->paid;                  // boolean
$invoice->status;                // "paid", "open", "draft"

// Line items
foreach ($invoice->invoiceItems() as $item) {
    echo $item->description;
    echo $item->total();
}
```

---

## Downloading PDF Invoices

### Download Response

```php
// Route
Route::get('/user/invoice/{invoice}', function (Request $request, $invoiceId) {
    return $request->user()->downloadInvoice($invoiceId, [
        'vendor' => 'Your Company',
        'product' => 'Premium Subscription',
    ]);
});
```

### Customization Options

```php
return $user->downloadInvoice($invoiceId, [
    'vendor' => 'Acme Inc.',
    'product' => 'SaaS Plan',
    'street' => '123 Main St',
    'location' => 'New York, NY 10001',
    'phone' => '+1 (555) 123-4567',
    'email' => 'billing@acme.com',
    'url' => 'https://acme.com',
    'vendorVat' => 'US123456789',
]);
```

---

## Signed Invoice URLs

For secure, time-limited download links:

```php
use Illuminate\Support\Facades\URL;

// Generate signed URL (expires in 1 hour)
$signedUrl = URL::temporarySignedRoute(
    'invoice.download',
    now()->addHour(),
    ['invoice' => $invoiceId]
);

// In email template
<a href="{{ $signedUrl }}">Download Invoice</a>
```

---

## Invoice PDF Customization

### Custom View

Publish and customize the invoice view:

```bash
php artisan vendor:publish --tag="cashier-views"
```

Edit `resources/views/vendor/cashier/receipt.blade.php`.

### Custom CSS

```php
return $user->downloadInvoice($invoiceId, [
    'vendor' => 'Your Company',
], 'custom-receipt');  // Uses custom-receipt.blade.php
```

---

## Paddle Transactions

Paddle uses transactions instead of invoices:

```php
$transactions = $user->transactions;

foreach ($transactions as $transaction) {
    $transaction->paddle_id;
    $transaction->invoice_number;
    $transaction->status;           // "completed", "billed"
    $transaction->total();          // "$29.99"
    $transaction->tax();            // "$5.00"
    $transaction->currency;         // "USD"
    $transaction->billed_at;        // Carbon
}

// Download PDF
if ($url = $transaction->invoicePdf()) {
    return redirect($url);
}

// Or shortcut
return $transaction->redirectToInvoicePdf();
```

---

## Creating One-Time Invoices

Charge without subscription:

```php
// Create invoice item
$user->invoiceFor('One-time Service', 5000);  // $50.00

// With options
$user->invoiceFor('Consulting', 10000, [
    'description' => '2 hours of consulting',
    'metadata' => ['hours' => 2],
]);

// Multiple items
$user->tabFor('Item 1', 1500);
$user->tabFor('Item 2', 2500);
$user->invoice();  // Creates invoice with both items
```

---

## Best Practices

### DO
- Store invoice IDs for reference
- Use signed URLs for email links
- Customize PDF branding
- Handle invoice.payment_failed webhook

### DON'T
- Expose invoice IDs in public URLs
- Skip error handling on download
- Forget to set vendor info

→ See [templates/InvoiceController.php.md](templates/InvoiceController.php.md) for implementation
