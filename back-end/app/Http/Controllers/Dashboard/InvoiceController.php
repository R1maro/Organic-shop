<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\UserActivityLogger;
use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{
    private const CACHE_TTL = 1; // hours

    public function index(Request $request)
    {
        $cacheKey = sprintf(
            'invoices_status_%s_page_%s_perpage_%s',
            $request->status ?? 'all',
            $request->get('page', 1),
            $request->per_page ?? 15
        );

        $invoices = Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($request) {
            return Invoice::with(['order', 'user'])
                ->when($request->status, fn($query, $status) => $query->where('status', $status))
                ->latest()
                ->paginate($request->per_page ?? 15);
        });

        return InvoiceResource::collection($invoices);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'due_date' => 'nullable|date|after:today',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string',
            'billing_address' => 'nullable|string',
            'notes' => 'nullable|string',

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
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
                'shipping_cost' => $shipping_cost,
                'due_date' => $request->due_date,
                'notes' => $request->notes,
                'payment_method' => $request->payment_method,
            ]);

            DB::commit();

            $this->clearInvoiceCaches($order->user_id);

            UserActivityLogger::created($invoice);
            return new InvoiceResource($invoice->load('order.items'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Invoice $invoice)
    {
        $cacheKey = "invoice_{$invoice->id}";

        $invoiceData = Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($invoice) {
            return $invoice->load(['order.items.product', 'user']);
        });

        return new InvoiceResource($invoiceData);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'status' => 'sometimes|required|in:pending,paid,cancelled,refunded',
            'shipping_address' => 'sometimes|required|string',
            'payment_method' => 'sometimes|required|string',
            'billing_address' => 'nullable|string',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            if ($request->has('order_id') && $request->order_id != $invoice->order_id) {
                $order = Order::findOrFail($request->order_id);

                $subtotal = $order->items->sum(function ($item) {
                    return $item->quantity * $item->unit_price;
                });

                $tax = $subtotal * 0.09;

                $updateData = $request->only([
                    'status',
                    'shipping_address',
                    'billing_address',
                    'payment_method',
                    'due_date',
                    'notes',
                    'order_id'
                ]);

                $updateData = array_merge($updateData, [
                    'user_id' => $order->user_id,
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                ]);
            } else {
                $updateData = $request->only([
                    'status',
                    'shipping_address',
                    'billing_address',
                    'payment_method',
                    'due_date',
                    'notes'
                ]);
            }

            $oldUserId = $invoice->user_id;
            UserActivityLogger::prepareForUpdate($invoice);
            $invoice->update($updateData);

            if ($request->status === 'paid') {
                $invoice->markAsPaid();
                $invoice->order->markAsPaid();
            }

            if ($request->status == 'delivered') {
                $invoice->markAsDelivered();
            }

            $this->clearInvoiceCaches($oldUserId);
            $this->clearInvoiceCaches($invoice->user_id);
            Cache::forget("invoice_{$invoice->id}");

            DB::commit();

            UserActivityLogger::updated($invoice);
            return new InvoiceResource($invoice->fresh()->load('order.items'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
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

        $invoices = Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($userId, $request) {
            return Invoice::with(['order'])
                ->where('user_id', $userId)
                ->latest()
                ->paginate($request->per_page ?? 15);
        });

        return InvoiceResource::collection($invoices);
    }

    public function clearInvoiceCaches($userId = null)
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
            for ($page = 1; $page <= 5; $page++) {
                Cache::forget("user_invoices_{$userId}_page_{$page}");
            }
        }
    }
}
