<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    //

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'discount',
        'quantity',
        'sku',
        'image',
        'status',
        'category_id',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($product) {
            $product->slug = Str::slug($product->name . ' ' . uniqid(), '-');
        });

        static::updating(function ($product) {
            if ($product->isDirty('name')) {
                $product->slug = Str::slug($product->name . ' ' . uniqid(), '-');
            }
        });
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function scopeActive($query){
        return $query->where('status', 1);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function getFormattedPriceAttribute()
    {
        return '$' . number_format($this->price, 2);
    }
}
