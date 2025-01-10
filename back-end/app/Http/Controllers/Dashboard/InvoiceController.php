<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{
    private const CACHE_TTL = 24; // hours

    public function index(Request $request)
    {
        $cacheKey = sprintf(
            'invoices_status_%s_page_%s_perpage_%s',
            $request->status ?? 'all',
            $request->get('page', 1),
            $request->per_page ?? 15
        );

        return Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($request) {
            return response()->json(
                Invoice::with(['order', 'user'])
                    ->when($request->status, function ($query, $status) {
                        return $query->where('status', $status);
                    })
                    ->latest()
                    ->paginate($request->per_page ?? 15)
            );
        });
    }

    public function store(Request $request, Order $order)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'due_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string',
            'payment_method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $order = Order::findOrFail($request->order_id);

            $subtotal = $order->items->sum(function ($item) {
                return $item->quantity * $item->unit_price;
            });

            $tax = $subtotal * 0.09; // 9% tax
            $shipping_cost = 0; // You can modify based on your shipping calculation

            $invoice = Invoice::create([
                'order_id' => $order->id,
                'user_id' => $order->user_id,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shipping_cost,
                'total' => $subtotal + $tax + $shipping_cost,
                'due_date' => $request->due_date,
                'notes' => $request->notes,
                'payment_method' => $request->payment_method,
            ]);

            DB::commit();

            $this->clearInvoiceCaches($order->user_id);

            return response()->json([
                'message' => 'Invoice created successfully.',
                'invoice' => $invoice->fresh()->load('order.items'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Invoice $invoice)
    {
        $cacheKey = "invoice_{$invoice->id}";

        return Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($invoice) {
            return response()->json($invoice->load(['order.items.product', 'user']));
        });
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'status' => 'sometimes|required|in:pending,paid,cancelled,refunded',
            'payment_method' => 'sometimes|required|string',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $updateData = $request->only([
            'status',
            'payment_method',
            'due_date',
            'notes'
        ]);

        $invoice->update($updateData);

        if ($request->status === 'paid') {
            $invoice->markAsPaid();
            $invoice->order->markAsPaid();
        }

        $this->clearInvoiceCaches($invoice->user_id);
        Cache::forget("invoice_{$invoice->id}");

        return response()->json([
            'message' => 'Invoice updated successfully.',
            'invoice' => $invoice->fresh()->load('order.items'),
        ]);
    }

    public function destroy(Invoice $invoice)
    {
        $userId = $invoice->user_id;

        $invoice->delete();

        $this->clearInvoiceCaches($userId);
        Cache::forget("invoice_{$invoice->id}");

        return response()->json([
            'message' => 'Invoice deleted successfully.',
        ]);
    }

    public function getUserInvoices(Request $request, $userId)
    {
        $page = $request->get('page', 1);
        $cacheKey = "user_invoices_{$userId}_page_{$page}";

        return Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($userId, $request) {
            return response()->json(
                Invoice::with(['order'])
                    ->where('user_id', $userId)
                    ->latest()
                    ->paginate($request->per_page ?? 15)
            );
        });
    }

    private function clearInvoiceCaches($userId = null)
    {
        // Clear main listing cache for first 5 pages
        for ($page = 1; $page <= 5; $page++) {
            Cache::forget("invoices_status_all_page_{$page}_perpage_10");
        }

        // Clear status-specific caches
        $statuses = ['pending', 'paid', 'cancelled', 'refunded'];
        foreach ($statuses as $status) {
            for ($page = 1; $page <= 5; $page++) {
                Cache::forget("invoices_status_{$status}_page_{$page}_perpage_10");
            }
        }

        // Clear user-specific caches
        if ($userId) {
            Cache::forget("user_invoices_{$userId}_page_1");
        }
    }
}
