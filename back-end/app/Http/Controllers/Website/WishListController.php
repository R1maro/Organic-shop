<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\Product;

class WishListController extends Controller
{
    public function index()
    {
        $wishlistItems = auth()->user()
            ->wishlist()
            ->with(['media', 'category'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wishlistItems
        ]);
    }

    public function toggle(Product $product)
    {
        $user = auth()->user();

        if ($user->hasInWishlist($product->id)) {
            $user->wishlist()->detach($product->id);
            $inWishlist = false;
            $message = 'Product removed from wishlist';
        } else {
            $user->wishlist()->attach($product->id);
            $inWishlist = true;
            $message = 'Product added to wishlist';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'in_wishlist' => $inWishlist
        ]);
    }

    public function check(Product $product)
    {
        $inWishlist = auth()->user()->hasInWishlist($product->id);

        return response()->json([
            'success' => true,
            'in_wishlist' => $inWishlist
        ]);
    }
}
