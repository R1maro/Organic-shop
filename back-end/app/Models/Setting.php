<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class Setting extends Model implements HasMedia
{
    use InteractsWithMedia, SoftDeletes, HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'label',
        'description',
        'is_public'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_public' => 'boolean'
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('setting_image')
            ->singleFile()
            ->useDisk('public');
    }

    public static function getGroups(): array
    {
        return ['General', 'Social', 'Slider', 'Seo', 'Contact'];
    }

    public static function getTypes(): array
    {
        return ['text', 'textarea', 'image', 'boolean', 'email', 'url', 'number'];
    }

    public static function getLogoUrl(): ?string
    {
        $setting = self::where('key', 'logo')->first();
        return $setting->value;
    }

    /**
     * Get all slider image settings
     *
     * @return Collection
     */
    public static function getSliderImages(): Collection
    {
        return self::where('key', 'like', 'slider_image_%')
            ->where('is_public', true)
            ->get(['key', 'value']);
    }

    /**
     * Get all slider image settings with media URLs
     *
     * @return Collection
     */
    public static function getSliderImagesWithMedia(): Collection
    {
        $sliderImages = self::where('key', 'like', 'slider_image_%')
            ->where('is_public', true)
            ->get();

        return $sliderImages->map(function ($setting) {
            $mediaUrl = null;

            if ($setting->type === 'image' && $setting->hasMedia('setting_image')) {
                $mediaUrl = $setting->getFirstMediaUrl('setting_image');
            }

            return [
                'key' => $setting->key,
                'value' => $setting->value,
                'label' => $setting->label,
                'image_url' => $mediaUrl
            ];
        });
    }

    /**
     * Get all benefit settings with media URLs
     *
     * @return Collection
     */
    public static function getBenefits(): Collection
    {
        $benefitSettings = self::where('key', 'like', 'benefit_%')
            ->where('is_public', true)
            ->get();

        return $benefitSettings->map(function ($setting) {
            $mediaUrl = null;

            if ($setting->type === 'image' && $setting->hasMedia('setting_image')) {
                $mediaUrl = $setting->getFirstMediaUrl('setting_image');
            }

            return [
                'id' => $setting->id,
                'key' => $setting->key,
                'label' => $setting->label,
                'value' => $setting->value,
                'description' => $setting->description,
                'image_url' => $mediaUrl
            ];
        });
    }
}
