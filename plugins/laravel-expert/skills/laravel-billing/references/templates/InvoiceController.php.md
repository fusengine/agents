---
name: InvoiceController
description: Invoice listing and PDF download
when-to-use: Displaying invoices, generating PDFs
keywords: invoice, pdf, download, receipt, billing
---

# Invoice Controller

## Complete Implementation

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\URL;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Handle invoice display and download.
 */
class InvoiceController extends Controller
{
    /**
     * List user's invoices.
     */
    public function index(Request $request): JsonResponse|View
    {
        $user = $request->user();
        $invoices = $user->invoices();

        $formattedInvoices = $invoices->map(fn ($invoice) => [
            'id' => $invoice->id,
            'number' => $invoice->number,
            'date' => $invoice->date()->toFormattedDateString(),
            'total' => $invoice->total(),
            'status' => $invoice->paid ? 'paid' : 'unpaid',
            'download_url' => URL::signedRoute('invoices.download', [
                'invoice' => $invoice->id,
            ]),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'invoices' => $formattedInvoices,
            ]);
        }

        return view('billing.invoices', [
            'invoices' => $formattedInvoices,
        ]);
    }

    /**
     * Show single invoice details.
     */
    public function show(Request $request, string $invoiceId): JsonResponse
    {
        $user = $request->user();
        $invoice = $user->findInvoice($invoiceId);

        if (!$invoice) {
            return response()->json([
                'message' => 'Invoice not found',
            ], 404);
        }

        return response()->json([
            'id' => $invoice->id,
            'number' => $invoice->number,
            'date' => $invoice->date()->toIso8601String(),
            'due_date' => $invoice->dueDate()?->toIso8601String(),
            'status' => $invoice->status,
            'subtotal' => $invoice->subtotal(),
            'tax' => $invoice->tax(),
            'total' => $invoice->total(),
            'amount_due' => $invoice->amountDue(),
            'currency' => $invoice->currency,
            'items' => collect($invoice->invoiceItems())->map(fn ($item) => [
                'description' => $item->description,
                'quantity' => $item->quantity,
                'unit_amount' => $item->unitAmount(),
                'total' => $item->total(),
            ]),
        ]);
    }

    /**
     * Download invoice as PDF.
     */
    public function download(Request $request, string $invoiceId): StreamedResponse|Response
    {
        $user = $request->user();
        $invoice = $user->findInvoice($invoiceId);

        if (!$invoice) {
            abort(404, 'Invoice not found');
        }

        return $user->downloadInvoice($invoiceId, [
            'vendor' => config('app.name'),
            'product' => 'Subscription',
            'street' => config('billing.company.street'),
            'location' => config('billing.company.location'),
            'phone' => config('billing.company.phone'),
            'email' => config('billing.company.email'),
            'url' => config('app.url'),
            'vendorVat' => config('billing.company.vat'),
        ]);
    }

    /**
     * Download invoice via signed URL (for email links).
     */
    public function downloadSigned(Request $request, string $invoiceId): StreamedResponse|Response
    {
        // URL signature is verified by middleware
        $user = $request->user();

        return $this->download($request, $invoiceId);
    }

    /**
     * Get upcoming invoice preview.
     */
    public function upcoming(Request $request): JsonResponse
    {
        $user = $request->user();
        $upcoming = $user->upcomingInvoice();

        if (!$upcoming) {
            return response()->json([
                'message' => 'No upcoming invoice',
            ], 404);
        }

        return response()->json([
            'date' => $upcoming->date()->toFormattedDateString(),
            'subtotal' => $upcoming->subtotal(),
            'tax' => $upcoming->tax(),
            'total' => $upcoming->total(),
            'items' => collect($upcoming->invoiceItems())->map(fn ($item) => [
                'description' => $item->description,
                'total' => $item->total(),
            ]),
        ]);
    }

    /**
     * Generate signed download URL for email.
     */
    public function getSignedUrl(Request $request, string $invoiceId): JsonResponse
    {
        $user = $request->user();
        $invoice = $user->findInvoice($invoiceId);

        if (!$invoice) {
            return response()->json([
                'message' => 'Invoice not found',
            ], 404);
        }

        $url = URL::temporarySignedRoute(
            'invoices.download.signed',
            now()->addHours(24),
            ['invoice' => $invoiceId]
        );

        return response()->json([
            'download_url' => $url,
            'expires_at' => now()->addHours(24)->toIso8601String(),
        ]);
    }
}
```

---

## Routes

```php
<?php
// routes/web.php

use App\Http\Controllers\Billing\InvoiceController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/invoices', [InvoiceController::class, 'index'])
        ->name('invoices.index');

    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])
        ->name('invoices.show');

    Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download'])
        ->name('invoices.download');

    Route::get('/invoices/{invoice}/url', [InvoiceController::class, 'getSignedUrl'])
        ->name('invoices.url');

    Route::get('/invoices/upcoming', [InvoiceController::class, 'upcoming'])
        ->name('invoices.upcoming');
});

// Signed URL route (no auth required - signature verifies user)
Route::get('/invoices/{invoice}/download-signed', [InvoiceController::class, 'downloadSigned'])
    ->name('invoices.download.signed')
    ->middleware('signed');
```

---

## Blade View

```blade
{{-- resources/views/billing/invoices.blade.php --}}

<h2>Invoices</h2>

@forelse($invoices as $invoice)
    <div class="invoice-row">
        <span>{{ $invoice['number'] }}</span>
        <span>{{ $invoice['date'] }}</span>
        <span>{{ $invoice['total'] }}</span>
        <span class="status-{{ $invoice['status'] }}">
            {{ ucfirst($invoice['status']) }}
        </span>
        <a href="{{ $invoice['download_url'] }}" download>
            Download PDF
        </a>
    </div>
@empty
    <p>No invoices yet.</p>
@endforelse
```

---

## Config

```php
<?php
// config/billing.php

return [
    'company' => [
        'street' => env('BILLING_COMPANY_STREET', '123 Main St'),
        'location' => env('BILLING_COMPANY_LOCATION', 'New York, NY 10001'),
        'phone' => env('BILLING_COMPANY_PHONE'),
        'email' => env('BILLING_COMPANY_EMAIL'),
        'vat' => env('BILLING_COMPANY_VAT'),
    ],
];
```
