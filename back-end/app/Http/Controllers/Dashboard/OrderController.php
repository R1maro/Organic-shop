<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{

    private const CACHE_TTL = 24; // hours

    public function index(Request $request)
    {
        $cacheKey = sprintf(
            'orders_status_%s_payment_%s_page_%s_perpage_%s',
            $request->status ?? 'all',
            $request->payment_status ?? 'all',
            $request->get('page', 1),
            $request->per_page ?? 15
        );

        return Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($request) {
            return response()->json(
                Order::with(['items.product', 'user'])
                    ->when($request->status, function ($query, $status) {
                        return $query->where('status', $status);
                    })
                    ->when($request->payment_status, function ($query, $payment_status) {
                        return $query->where('payment_status', $payment_status);
                    })
                    ->latest()
                    ->paginate($request->per_page ?? 15)
            );
        });
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
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
            return response()->json([
                'message' => 'Order created successfully.',
                'order' => $order->fresh()->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }


    public function show(Order $order)
    {
        $cacheKey = "order_{$order->id}";

        return Cache::remember($cacheKey, now()->addHours(self::CACHE_TTL), function () use ($order) {
            return response()->json($order->load(['items.product', 'user']));
        });
    }

    public function update(Request $request, Order $order)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|required|in:pending,paid,failed,refunded',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error', $validator->errors()], 422);
        }


        $updateData = $request->only([
            'status',
            'payment_status',
            'notes',
        ]);


        $order->update($updateData);


        if ($request->has('items')) {

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
        }



        if ($request->payment_status == 'paid') {
            $order->markAsPaid();
        }

        $this->clearOrderCaches($order->user_id);
        Cache::forget("order_{$order->id}");

        return response()->json([
            'message' => 'Order updated successfully.',
            'order' => $order->fresh()->load('items.product'),
        ]);
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
            Cache::forget("user_orders_{$userId}_page_1");
        }
    }

}
