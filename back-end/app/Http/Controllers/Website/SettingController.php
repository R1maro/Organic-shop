<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function getPublicSettings()
    {
        $cacheKey = 'settings_main_page';
        return Cache::remember($cacheKey, now()->addHours(2), function () {

            $settings = Setting::query()->whereRaw('is_public = true')->get();

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
            }])->whereRaw('is_active = true')->get();

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
        $result = Setting::getSliderImagesWithMedia();

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }

    /**
     * Get all benefit settings
     *
     * @return JsonResponse
     */
    public function getSliderAutoPlay():JsonResponse
    {
        $settings = Setting::getSliderAutoPlay();

        if ($settings->isNotEmpty()) {
            $value = $settings->first()->value;
            return response()->json(['value' => $value]);
        }

        return response()->json(['value' => null]);
    }

    /**
     * Get all benefit settings
     *
     * @return JsonResponse
     */
    public function getBenefits(): JsonResponse
    {
        $benefits = Setting::getBenefits();

        return response()->json(['data' => $benefits]);
    }



}
