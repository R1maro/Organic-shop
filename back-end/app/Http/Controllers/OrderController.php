<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{

    public function index(Request $request)
    {
        $orders = Order::with(['item.product'])
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->payment_status, function ($query, $payment_status) {
                return $query->where('payment_status', $payment_status);
            })
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json($orders);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'billing_address' => 'nullable|string',
            'payment_method' => 'required|string',
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

            $userId = auth()->id() ?? $request->user_id;


            if (!$userId) {
                return response()->json(['message' => 'User ID is required'], 422);
            }

            $order = Order::create([
                'user_id' => $userId,
                'total_price' => $total_price,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_addres,
                'payment_method' => $request->payment_method,
                'notes' => $request->notes
            ]);

            $order->items()->createMany($order_items);
            DB::commit();

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
        return response()->json($order->load(['items.product', 'user']));
    }


    public function update(Request $request, Order $order)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|required|in:pending,paid,failed,refunded',
            'shipping_address' => 'sometimes|required|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error', $validator->errors()], 422);
        }

        $order->update([
            'status',
            'payment_status',
            'shipping_address',
            'notes',
        ]);

        if ($request->status == 'shipped') {
            $order->markAsShipped();
        } elseif ($request->status == 'delivered') {
            $order->markAsDelivered();
        }

        if ($request->payment_status == 'paid') {
            $order->markAsPaid();
        }

        return response()->json([
            'message' => 'Order updated successfully.',
            'order' => $order->fresh()->load('items.product'),
        ]);
    }


    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json([
            'message' => 'Order deleted successfully.',
        ]);
    }
}
