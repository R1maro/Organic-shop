<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;


    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'discount',
        'final_price',
        'quantity',
        'sku',
        'status',
        'category_id',
    ];

    protected $appends = ['formatted_price', 'formatted_final_price', 'image_url'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($product) {
            $product->slug = Str::slug($product->name . ' ' . uniqid(), '-');
            $product->final_price = $product->calculateFinalPrice();
        });

        static::updating(function ($product) {
            if ($product->isDirty('name')) {
                $product->slug = Str::slug($product->name . ' ' . uniqid(), '-');
            }
            if ($product->isDirty('price') || $product->isDirty('discount')) {
                $product->final_price = $product->calculateFinalPrice();
            }
        });
    }

    private function calculateFinalPrice()
    {
        return max(0, $this->price - $this->discount);
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(80)
            ->height(80)
            ->sharpen(5)
            ->nonQueued();


    }

    public function getImageUrlAttribute()
    {
        return $this->getFirstMediaUrl('product_image', 'thumb') ?: $this->getFirstMediaUrl('product_image');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function getFormattedPriceAttribute()
    {
        return "$ " . number_format($this->price, 0, '.', ',');
    }

    public function getFormattedFinalPriceAttribute()
    {
        return "$ " . number_format($this->final_price, 0, '.', ',');
    }
}
