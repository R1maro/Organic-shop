<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function getProducts(Request $request)
    {

        $cacheKey = 'products_main_page';


        return Cache::remember($cacheKey, now()->addHours(2), function () {

            // Only fetching the necessary fields (name, price, discount, and media)
            return response()->json(
                Product::with('media')
                    ->select('id', 'name', 'price', 'discount') // Adjust based on the fields you need
                    ->where('status', true) // Only active products

                    ->orderBy('id', 'desc')
                    ->get(9)
                    ->map(function ($product) {
                        // Get the product image URL, if available
                        $imageUrl = $product->media->isNotEmpty()
                            ? asset($product->media[0]->original_url)
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

    public function getPublicSettings()
    {
        $cacheKey = 'settings_main_page';
        return Cache::remember($cacheKey, now()->addHours(2), function () {

            $settings = Setting::where('is_public', true)->get();

            return $settings->map(function ($setting) {
                $data = $setting->toArray();

                if ($setting->type === 'image') {
                    $media = $setting->getFirstMedia('setting_image');
                    $data['media_url'] = $media ? $media->getFullUrl() : null;
                }

                return $data;
            });
        });
    }


    public function getCategoriesWithProducts()
    {
        $cacheKey = 'categories_with_products';

        return Cache::remember($cacheKey, now()->addHours(2), function () {
            $categories = Category::with(['products' => function ($query) {
                $query->take(6);
            }])->where('is_active', true)->get();

            return $categories->map(function ($category) {
                $data = $category->toArray();


                $data['products'] = $category->products->map(function ($product) {
                    $productData = $product->toArray();
                    $media = $product->getFirstMedia('product_image');
                    $productData['image_url'] = $media ? $media->getFullUrl() : null;
                    return $productData;
                });

                return $data;
            });
        });
    }

    public function getLogo()
    {
        $logoUrl = Setting::getLogoUrl();
        return response()->json(['logo_url' => $logoUrl]);
    }

    public function getSliderImages()
    {
        // Use the model method to get slider images with media
        $result = Setting::getSliderImagesWithMedia();

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }

}
