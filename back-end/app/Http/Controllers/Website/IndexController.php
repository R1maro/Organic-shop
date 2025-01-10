<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class IndexController extends Controller
{
    public function getProducts(Request $request)
    {
        // Optionally, you can apply pagination or filters here
        $cacheKey = 'products_main_page';

        // Using Cache to avoid multiple queries
        return Cache::remember($cacheKey, now()->addHours(0.1), function () {
            // Only fetching the necessary fields (name, price, discount, and media)
            return response()->json(
                Product::with('media')
                    ->select('id', 'name', 'price', 'discount') // Adjust based on the fields you need
                    ->where('status', true) // Only active products
                    ->get(-9)
                    ->map(function ($product) {
                        // Get the product image URL, if available
                        $imageUrl = $product->media->isNotEmpty()
                            ? asset( $product->media[0]->original_url)
                            : null;

                        return [
                            'id' => $product->id,
                            'name' => $product->name,
                            'price' => $product->price,
                            'discount' => $product->discount,
                            'image_url' => $imageUrl,
                        ];
                    })
            );
        });
    }
}
