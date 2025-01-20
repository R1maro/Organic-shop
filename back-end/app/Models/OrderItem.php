<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    protected $appends = [ 'formatted_unit_price', 'formatted_subtotal'];
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($item) {
            $item->subtotal = $item->quantity * $item->unit_price;
        });
    }

    public function order(){
        return $this->belongsTo(Order::class);
    }

    public function product(){
        return $this->belongsTo(Product::class);
    }

    public function getFormattedUnitPriceAttribute()
    {
        return "$".number_format($this->unit_price, 0, '.', ',');
    }
    public function getFormattedSubTotalAttribute()
    {
        return "$".number_format($this->subtotal, 0, '.', ',');
    }
}
