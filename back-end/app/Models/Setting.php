<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;

class Setting extends Model implements HasMedia
{
    use InteractsWithMedia, SoftDeletes , HasFactory;

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
        return ['general', 'social', 'slider', 'seo', 'contact'];
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
}
