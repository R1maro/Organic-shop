<?php

namespace App\Classes;


use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CustomPathGenerator implements PathGenerator
{
    public function getPath(Media $media): string
    {
        if ($media->model_type === \App\Models\Setting::class) {
            return 'settings/'. $media->model_id . '/';
        }

        if ($media->model_type === \App\Models\Product::class) {
            return 'products/'. $media->model_id . '/';
        }
        if ($media->model_type === \App\Models\Blog::class) {
            return 'blogs/'. $media->model_id . '/';
        }
        if ($media->model_type === \App\Models\TemporaryUpload::class) {
            return 'temp/'. $media->model_id . '/';
        }

        // Default path if no specific model is matched
        return 'other'. $media->id . '/';
    }

    public function getPathForConversions(Media $media): string
    {
        return $this->getPath($media) . 'conversions/';
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->getPath($media) . 'responsive-images/';
    }
}
