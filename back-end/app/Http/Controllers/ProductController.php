<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = 'products_' . md5(json_encode($request->all()));
        $products = Cache::remember($cacheKey, 3600, function () use ($request) {
            return Product::with(['category', 'media'])
                ->when($request->category_id, fn($q) => $q->byCategory($request->category_id))
                ->active()
                ->paginate(10);
        });

        return response()->json($products);
    }


    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'quantity' => 'required|integer|min:0',
                'sku' => 'required|string|max:255|unique:products',
                'image' => 'nullable|image|max:2048',
                'category_id' => 'required|exists:categories,id',
                'status' => 'boolean',
            ]);

            $product = Product::create($validated);

            if ($request->hasFile('image')) {
                $product->clearMediaCollection('product_image');
                $product->addMedia($request->file('image'))
                    ->withResponsiveImages()
                    ->toMediaCollection('product_image');

            }
            Cache::forget('products_*');

            return response()->json($product->load(['category', 'media']), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Product $product)
    {
        $cacheKey = 'product_' . $product->id;
        $cachedProduct = Cache::remember($cacheKey, 3600, function () use ($product) {
            return $product->load(['category', 'media']);
        });

        return response()->json($cachedProduct);
    }

    public function update(Request $request, Product $product)
    {

        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'price' => 'sometimes|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'quantity' => 'sometimes|integer|min:0',
                'sku' => 'sometimes|string|max:255|unique:products,sku,' . $product->id,
                'image' => 'nullable|image|max:2048',
                'category_id' => 'sometimes|exists:categories,id',
                'status' => 'boolean',
            ]);

            $product->update($validated);


            if ($request->hasFile('image')) {
                $product->clearMediaCollection('product_image');
                $product->addMedia($request->file('image'))
                    ->withResponsiveImages()
                    ->toMediaCollection('product_image');


            }

            Cache::forget('product_' . $product->id);
            Cache::forget('products_*');
            return response()->json($product->load(['category', 'media']));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

    public function destroy(Product $product)
    {
        $product->delete();
        $product->clearMediaCollection('product_image');


        Cache::forget('product_' . $product->id);
        Cache::forget('products_*');

        return response()->json(['message' => 'Product deleted successfully.']);
    }

}
