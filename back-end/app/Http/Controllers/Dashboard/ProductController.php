<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\UserActivityLogger;
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
                'shipping_time' => 'required|string|max:255',
                'images.*' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
                'images' => 'array',
                'category_id' => 'required|exists:categories,id',
                'status' => 'boolean',
                'display_photo_index' => 'required|integer|min:0',
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
            $product->update(['display_photo_index' => $request->display_photo_index]);

            $this->clearProductCaches($product->category_id);

            UserActivityLogger::created($product);

            return new ProductResource($product->load(['category', 'media']));
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong',
                'message' => $e->getMessage()
            ], 500);
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
                'shipping_time' => 'sometimes|string|max:255',
                'images.*' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:2048',
                'images' => 'array',
                'category_id' => 'sometimes|exists:categories,id',
                'status' => 'boolean',
                'display_photo_index' => 'required|integer|min:0',
            ]);

            $oldCategoryId = $product->category_id;
            UserActivityLogger::prepareForUpdate($product);

            $product->update($validated);


            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $product->addMedia($image)
                        ->withResponsiveImages()
                        ->toMediaCollection('product_image');
                }
            }

            $product->update(['display_photo_index' => $request->display_photo_index]);

            $this->clearProductCaches($oldCategoryId);
            if ($oldCategoryId !== $product->category_id) {
                $this->clearProductCaches($product->category_id);
            }

            UserActivityLogger::updated($product);
            Cache::forget('product_' . $product->id);

            return new ProductResource($product->load(['category', 'media']));
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong',
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function destroy(Product $product)
    {
        try {
            $categoryId = $product->category_id;

            UserActivityLogger::deleted($product);
            $product->delete();

            // NOTE: media is intentionally NOT cleared here — only on forceDelete.
            // Otherwise restoring a soft-deleted product would lose its images.

            $this->clearProductCaches($categoryId);
            Cache::forget('product_' . $product->id);

            return response()->json(['message' => 'Product deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a list of trashed products.
     */
    public function trashed()
    {
        try {
            $trashedProducts = Product::onlyTrashed()
                ->with(['category', 'media'])
                ->orderBy('deleted_at', 'desc')
                ->get();

            return ProductResource::collection($trashedProducts);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch trashed products',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Restore a soft-deleted product.
     */
    public function restore(int $id)
    {
        try {
            $product = Product::withTrashed()->findOrFail($id);

            if (!$product->trashed()) {
                return response()->json([
                    'error' => 'Product is not deleted',
                ], 422);
            }

            $product->restore();

            $this->clearProductCaches($product->category_id);
            Cache::forget('product_' . $product->id);

            UserActivityLogger::updated($product);

            return response()->json([
                'message' => 'Product restored successfully',
                'data' => new ProductResource($product->load(['category', 'media'])),
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Product not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to restore product',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Permanently delete a soft-deleted product (and its media).
     */
    public function forceDelete(int $id)
    {
        try {
            $product = Product::withTrashed()->findOrFail($id);

            if (!$product->trashed()) {
                return response()->json([
                    'error' => 'Please soft delete the product first',
                ], 422);
            }

            $categoryId = $product->category_id;

            $product->clearMediaCollection('product_image');
            $product->forceDelete();

            $this->clearProductCaches($categoryId);
            Cache::forget('product_' . $id);

            return response()->json(['message' => 'Product permanently deleted']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Product not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to permanently delete product',
                'message' => $e->getMessage(),
            ], 500);
        }
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
            $imageUrl = $request->input('image_url');
            if (!$imageUrl) {
                return response()->json(['error' => 'Image URL is required.'], 400);
            }


            // Extract the file name without the directory path
            $thumbFileName = basename($imageUrl);

            // Remove the "-thumb" suffix and get the base file name (without extension)
            $baseFileNameWithoutExtension = pathinfo(str_replace('-thumb', '', $thumbFileName), PATHINFO_FILENAME); // "1736637466-ezgif.com-jpg-to-webp-converter"

            // Check if the image is already stored in the media collection
            $media = $product->getMedia('product_image')->first(function ($media) use ($baseFileNameWithoutExtension) {
                $mediaFileNameWithoutExtension = pathinfo($media->file_name, PATHINFO_FILENAME); // Strip the extension
                return $mediaFileNameWithoutExtension === $baseFileNameWithoutExtension;
            });

            if ($media) {
                // Image exists in the media collection
                $media->delete();
            } else {
                // Image might be in temporary storage (not yet saved to the media collection)
                $temporaryFilePath = storage_path('app/public/temp/' . $thumbFileName);

                if (file_exists($temporaryFilePath)) {
                    unlink($temporaryFilePath); // Delete the temporary file
                } else {
                    return response()->json(['error' => 'Image not found.'], 404);
                }
            }

            return response()->json(['message' => 'Image deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete image.'], 500);
        }
    }




}
