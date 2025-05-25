<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class CartController extends Controller
{
    /**
     * Get the current user's cart.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCart(Request $request)
    {
        // Get user from token
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        // Get active cart or create a new one
        $cart = Cart::with(['items.product' => function ($query) {
            $query->select('id', 'name', 'slug', 'final_price', 'price', 'discount', 'display_photo_index')
                ->with('media');
        }])
            ->where('user_id', $user->id)
            ->active()
            ->latest()
            ->first();

        if (!$cart) {
            return response()->json([
                'message' => 'Cart is empty',
                'cart' => null,
                'total' => 0,
                'formatted_total' => '$ 0',
                'items_count' => 0
            ]);
        }

        // Extend cart expiration
        $cart->extendExpiration();

        return response()->json([
            'message' => 'Cart retrieved successfully',
            'cart' => $cart,
            'total' => $cart->total,
            'formatted_total' => $cart->formatted_total,
            'items_count' => $cart->items->count()
        ]);
    }

    /**
     * Add a product to the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $token = request()->bearerToken();
        $user = null;

        if ($token) {
            $user = PersonalAccessToken::findToken($token)?->tokenable;
        }

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $product = Product::findOrFail($request->product_id);

        // Check if product is in stock
        if ($product->quantity < $request->quantity) {
            return response()->json([
                'message' => 'Not enough stock available',
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Get active cart or create new one
            $cart = Cart::where('user_id', $user->id)
                ->active()
                ->latest()
                ->first();

            if (!$cart) {
                $cart = Cart::create([
                    'user_id' => $user->id,
                    'expires_at' => now()->addHours(24),
                ]);
            } else {
                // Extend cart expiration
                $cart->extendExpiration();
            }

            // Check if item already exists in cart
            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->first();

            if ($cartItem) {
                // Update existing item
                $cartItem->quantity += $request->quantity;
                $cartItem->save();
            } else {
                // Create new item
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $request->quantity,
                ]);
            }

            DB::commit();

            // Reload cart with items
            $cart->load(['items.product' => function ($query) {
                $query->select('id', 'name', 'slug', 'final_price', 'price', 'discount', 'display_photo_index')
                    ->with('media');
            }]);

            return response()->json([
                'message' => 'Product added to cart successfully',
                'cart' => $cart,
                'total' => $cart->total,
                'formatted_total' => $cart->formatted_total,
                'items_count' => $cart->items->count()
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to add product to cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update cart item quantity.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateItem(Request $request)
    {
        $request->validate([
            'cart_item_id' => 'required|exists:cart_items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Get user from token
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $cartItem = CartItem::findOrFail($request->cart_item_id);

        // Ensure item belongs to user's cart
        if ($cartItem->cart->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized access to cart item',
            ], 403);
        }

        // Check product stock
        if ($cartItem->product->quantity < $request->quantity) {
            return response()->json([
                'message' => 'Not enough stock available',
            ], 422);
        }

        // Update item quantity
        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        // Extend cart expiration
        $cartItem->cart->extendExpiration();

        // Reload cart with items
        $cart = $cartItem->cart->load(['items.product' => function ($query) {
            $query->select('id', 'name', 'slug', 'final_price', 'price', 'discount', 'display_photo_index')
                ->with('media');
        }]);

        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart' => $cart,
            'total' => $cart->total,
            'formatted_total' => $cart->formatted_total,
            'items_count' => $cart->items->count()
        ]);
    }

    /**
     * Remove an item from cart.
     *
     * @param  int  $cartItemId
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeItem(Request $request, $cartItemId)
    {
        // Get user from token
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $cartItem = CartItem::findOrFail($cartItemId);

        // Ensure item belongs to user's cart
        if ($cartItem->cart->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized access to cart item',
            ], 403);
        }

        // Get cart before deleting item
        $cart = $cartItem->cart;

        // Delete the item
        $cartItem->delete();

        // Extend cart expiration
        $cart->extendExpiration();

        // Reload cart with items
        $cart->load(['items.product' => function ($query) {
            $query->select('id', 'name', 'slug', 'final_price', 'price', 'discount', 'display_photo_index')
                ->with('media');
        }]);

        return response()->json([
            'message' => 'Cart item removed successfully',
            'cart' => $cart,
            'total' => $cart->total,
            'formatted_total' => $cart->formatted_total,
            'items_count' => $cart->items->count()
        ]);
    }

    /**
     * Clear the cart.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearCart(Request $request)
    {
        // Get user from token
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        // Get active cart
        $cart = Cart::where('user_id', $user->id)
            ->active()
            ->latest()
            ->first();

        if ($cart) {
            // Delete all items in the cart
            CartItem::where('cart_id', $cart->id)->delete();

            // Delete the cart itself
            $cart->delete();
        }

        return response()->json([
            'message' => 'Cart cleared successfully',
            'cart' => null,
            'total' => 0,
            'formatted_total' => '$ 0',
            'items_count' => 0
        ]);
    }
}
