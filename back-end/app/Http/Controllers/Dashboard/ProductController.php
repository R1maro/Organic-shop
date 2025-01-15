<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = 'products_' . ($request->category_id ?? 'all') . '_page_' . ($request->get('page', 1));

        $products = Cache::remember($cacheKey, now()->addHours(24), function () use ($request) {
            $products = Product::with(['category', 'media'])
                ->when($request->category_id, fn($q) => $q->byCategory($request->category_id))
                ->paginate(10);

            return serialize($products);
        });


        $products = unserialize($products);

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
            Log::info('Product Image URL:', ['url' => $product->image_url]);
            $this->clearProductCaches($product->category_id);

            return response()->json($product->load(['category', 'media']), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Product $product)
    {
        $cacheKey = 'product_' . $product->id;


        $productData = Cache::remember($cacheKey, now()->addHours(24), function () use ($product) {
            $productData = $product->load(['category', 'media']);
            return serialize($productData);
        });


        $productData = unserialize($productData);

        return response()->json($productData);
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

            $oldCategoryId = $product->category_id;
            $product->update($validated);


            if ($request->hasFile('image')) {
                $product->clearMediaCollection('product_image');
                $product->addMedia($request->file('image'))
                    ->withResponsiveImages()
                    ->toMediaCollection('product_image');


            }

            $this->clearProductCaches($oldCategoryId);
            if ($oldCategoryId !== $product->category_id) {
                $this->clearProductCaches($product->category_id);
            }
            Cache::forget('product_' . $product->id);

            return response()->json($product->load(['category', 'media']));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

    public function destroy(Product $product)
    {
        $categoryId = $product->category_id;

        $product->delete();
        $product->clearMediaCollection('product_image');


        $this->clearProductCaches($categoryId);
        Cache::forget('product_' . $product->id);
        return response()->json(['message' => 'Product deleted successfully.']);
    }

    private function clearProductCaches($categoryId)
    {

        Cache::forget('products_' . $categoryId . '_page_1');


        Cache::forget('products_all_page_1');


        for ($i = 1; $i <= 5; $i++) {
            Cache::forget('products_' . $categoryId . '_page_' . $i);
            Cache::forget('products_all_page_' . $i);
        }
    }

}
