<?php

namespace App\Classes;


use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CustomPathGenerator implements PathGenerator
{
    public function getPath(Media $media): string
    {
        // Check the model type and define the storage path accordingly
        if ($media->model_type === \App\Models\Setting::class) {
            return 'settings/';
        }

        if ($media->model_type === \App\Models\Product::class) {
            return 'product/';
        }

        // Default path if no specific model is matched
        return 'other/';
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
