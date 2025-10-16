<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{

    public function getProducts(): JsonResponse
    {
        try {
            $products = Product::whereRaw('status = true')
                ->with('category')
                ->orderBy('created_at', 'desc')
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

    /**
     * Get all active products
     *
     * @return JsonResponse
     */
    public function getLastProducts(): JsonResponse
    {
        try {
            $products = Product::whereRaw('status = true')
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

    public function show($slug)
    {
        try {
            $product = Product::where('slug', $slug)
                ->with('category')
                ->firstOrFail();

            // Get all image URLs (not just thumbnails)
            $allImages = $product->getMedia('product_image')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getFullUrl(),
                    'thumb' => $media->getFullUrl('thumb') ?: $media->getFullUrl(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'price' => $product->price,
                    'discount' => $product->discount,
                    'final_price' => $product->final_price,
                    'quantity' => $product->quantity,
                    'shipping_time' => $product->shipping_time,
                    'status' => $product->status,
                    'category_id' => $product->category_id,
                    'category_name' => $product->category->name ?? null,
                    'formatted_price' => $product->formatted_price,
                    'formatted_final_price' => $product->formatted_final_price,
                    'display_photo_url' => $product->display_photo_url,
                    'images' => $allImages,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
    }
}
