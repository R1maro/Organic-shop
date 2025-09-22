<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    /**
     * Get all active products
     *
     * @return JsonResponse
     */
    public function getProducts(): JsonResponse
    {
        try {
            $products = Product::active()
                ->with('category')
                ->orderBy('created_at', 'desc')
                ->take(8)
                ->get()
                ->map(function($product) {
                    $media = $product->getMedia('product_image');
                    if (!$media->isEmpty()) {
                        $index = $product->display_photo_index;
                        if ($index >= $media->count()) {
                            $index = 0;
                        }
                        $product->full_image_url = $media[$index]->getFullUrl();
                    } else {
                        $product->full_image_url = null;
                    }
                    return $product;
                });

            return response()->json([
                'success' => true,
                'data' => $products
            ], '200');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve products',
                'error' => $e->getMessage()
            ], '500');
        }
    }
}
