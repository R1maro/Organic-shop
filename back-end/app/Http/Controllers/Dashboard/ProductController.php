<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
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
            return Product::with(['category', 'media'])
                ->when($request->category_id, fn($q) => $q->byCategory($request->category_id))
                ->paginate(10);
        });

        return ProductResource::collection($products);
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
                'images.*' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
                'images' => 'array',
                'category_id' => 'required|exists:categories,id',
                'status' => 'boolean',
            ]);

            $product = Product::create($validated);

            if ($request->hasFile('images')) {
                $product->clearMediaCollection('product_image');
                foreach ($request->file('images') as $image) {
                    $product->addMedia($image)
                        ->withResponsiveImages()
                        ->toMediaCollection('product_image');
                }

            }
            $this->clearProductCaches($product->category_id);

            return new ProductResource($product->load(['category', 'media']));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Product $product)
    {
        $cacheKey = 'product_' . $product->id;


        $productData = Cache::remember($cacheKey, now()->addHours(24), function () use ($product) {
            return $product->load(['category', 'media']);
        });

        return new ProductResource($productData);
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
                'images.*' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
                'images' => 'array',
                'category_id' => 'sometimes|exists:categories,id',
                'status' => 'boolean',
            ]);

            $oldCategoryId = $product->category_id;
            $product->update($validated);


            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $product->addMedia($image)
                        ->withResponsiveImages()
                        ->toMediaCollection('product_image');
                }
            }

            $this->clearProductCaches($oldCategoryId);
            if ($oldCategoryId !== $product->category_id) {
                $this->clearProductCaches($product->category_id);
            }
            Cache::forget('product_' . $product->id);

            return new ProductResource($product->load(['category', 'media']));
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
    public function deleteImage(Request $request, Product $product)
    {
        try {
            $imageUrl = $request->input('image_url'); // Thumb URL from the frontend
            if (!$imageUrl) {
                return response()->json(['error' => 'Image URL is required.'], 400);
            }

            \Log::info("Image URL from request: $imageUrl");

            // Extract the file name without the directory path
            $thumbFileName = basename($imageUrl); // e.g., "1736637466-ezgif.com-jpg-to-webp-converter-thumb.jpg"

            // Remove the "-thumb" suffix and get the base file name (without extension)
            $baseFileNameWithoutExtension = pathinfo(str_replace('-thumb', '', $thumbFileName), PATHINFO_FILENAME); // "1736637466-ezgif.com-jpg-to-webp-converter"
            \Log::info("Base file name (without extension): $baseFileNameWithoutExtension");

            // Check if the image is already stored in the media collection
            $media = $product->getMedia('product_image')->first(function ($media) use ($baseFileNameWithoutExtension) {
                $mediaFileNameWithoutExtension = pathinfo($media->file_name, PATHINFO_FILENAME); // Strip the extension
                return $mediaFileNameWithoutExtension === $baseFileNameWithoutExtension;
            });

            if ($media) {
                // Image exists in the media collection
                \Log::info("Deleting media with file name: {$media->file_name} and URL: {$media->getFullUrl()}");
                $media->delete(); // Deletes both the main image and its conversions
            } else {
                // Image might be in temporary storage (not yet saved to the media collection)
                $temporaryFilePath = storage_path('app/public/temp/' . $thumbFileName);

                if (file_exists($temporaryFilePath)) {
                    \Log::info("Deleting temporary file: $temporaryFilePath");
                    unlink($temporaryFilePath); // Delete the temporary file
                } else {
                    \Log::error("Image not found in media collection or temporary storage: $thumbFileName");
                    return response()->json(['error' => 'Image not found.'], 404);
                }
            }

            return response()->json(['message' => 'Image deleted successfully.']);
        } catch (\Exception $e) {
            \Log::error('Error deleting image: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete image.'], 500);
        }
    }










}
