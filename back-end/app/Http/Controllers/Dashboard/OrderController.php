<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{

    private const CACHE_TTL = 1;

    public function index(Request $request)
    {
        $cacheKey = sprintf(
            'orders_status_%s_payment_%s_page_%s_perpage_%s',
            $request->status ?? 'all',
            $request->payment_status ?? 'all',
            $request->get('page', 1),
            $request->per_page ?? 10
        );

        $orders = Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($request) {
            return Order::with(['items.product', 'user'])
                ->when($request->status, fn($query, $status) => $query->where('status', $status))
                ->when($request->payment_status, fn($query, $payment_status) => $query->where('payment_status', $payment_status))
                ->latest()
                ->paginate($request->per_page ?? 10);
        });

        return OrderResource::collection($orders);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
            'user_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error', $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();
            $total_price = 0;
            $order_items = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $product->final_price * $item['quantity'];
                $total_price += $subtotal;

                $order_items[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->final_price,
                    'subtotal' => $subtotal,
                ];
            }


            $userId = $request->user_id ?? auth('sanctum')->id();

            if (!$userId) {
                return response()->json([
                    'message' => 'User ID is required',
                    'userId' => $userId
                ], 422);
            }

            $order = Order::create([
                'user_id' => $userId,
                'total_price' => $total_price,
                'notes' => $request->notes
            ]);

            $order->items()->createMany($order_items);
            DB::commit();

            $this->clearOrderCaches($userId);
            return new OrderResource($order->fresh()->load('items.product'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }


    public function show(Order $order)
    {
        $cacheKey = "order_{$order->id}";

        $cachedOrder = Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($order) {
            return $order->load(['items.product', 'user']);
        });

        return new OrderResource($cachedOrder);
    }

    public function update(Request $request, Order $order)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|required|in:pending,paid,failed,refunded',
            'notes' => 'nullable|string',
            'user_id' => 'sometimes|required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error', $validator->errors()], 422);
        }


        $updateData = $request->only([
            'status',
            'payment_status',
            'notes',
            'user_id',
        ]);


        $oldUserId = $order->user_id;
        $order->update($updateData);


        if ($request->has('user_id') && $oldUserId !== $request->user_id && $order->invoice) {
            $order->invoice()->update(['user_id' => $request->user_id]);
        }


        if ($request->has('items')) {

            foreach ($request->items as $item) {
                if (!isset($item['product_id'], $item['quantity'])) {
                    return response()->json(['message' => 'Invalid item data'], 422);
                }
            }

            $order->items()->delete();

            // Create new items
            foreach ($request->items as $item) {

                $product = Product::findOrFail($item['product_id']);

                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $product->price * $item['quantity']
                ]);
            }

            $order->update([
                'total_price' => $order->items()->sum('subtotal')
            ]);

            if ($order->invoice) {
                $subtotal = $order->items->sum(function ($item) {
                    return $item->quantity * $item->unit_price;
                });

                $tax = $subtotal * 0.09;

                $order->invoice()->update([
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    // shipping_cost remains unchanged
                    // total will be auto-calculated by Invoice model boot method
                ]);
            }
        }


        if ($request->payment_status == 'paid') {
            $order->markAsPaid();
        }


        $this->clearOrderCaches($order->user_id);
        Cache::forget("order_{$order->id}");
        if ($order->invoice) {
            Cache::forget("invoice_{$order->invoice->id}");
            app(InvoiceController::class)->clearInvoiceCaches($order->user_id);
        }

        return new OrderResource($order->fresh()->load('items.product'));
    }


    public function destroy(Order $order)
    {
        $userId = $order->user_id;

        $order->delete();


        $this->clearOrderCaches($userId);
        Cache::forget("order_{$order->id}");
        return response()->json([
            'message' => 'Order deleted successfully.',
        ]);
    }

    private function clearOrderCaches($userId = null)
    {

        Cache::forget('orders_status_all_payment_all_page_1_perpage_10');


        for ($page = 1; $page <= 5; $page++) {
            Cache::forget("orders_status_all_payment_all_page_{$page}_perpage_10");
        }


        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

        foreach ($statuses as $status) {
            foreach ($paymentStatuses as $paymentStatus) {
                for ($page = 1; $page <= 5; $page++) {
                    Cache::forget("orders_status_{$status}_payment_{$paymentStatus}_page_{$page}_perpage_10");
                }
            }
        }


        if ($userId) {
            for ($page = 1; $page <= 5; $page++) {
                Cache::forget("user_orders_{$userId}_page_{$page}");
            }
        }


    }

}
