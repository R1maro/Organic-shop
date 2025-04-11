<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CartItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
    ];

    /**
     * Get the cart that owns the item.
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Get the product for this cart item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the subtotal price for this item.
     */
    public function getSubtotalAttribute()
    {
        return $this->quantity * $this->product->final_price;
    }

    /**
     * Get the formatted subtotal price for this item.
     */
    public function getFormattedSubtotalAttribute()
    {
        return "$ " . number_format($this->subtotal, 0, '.', ',');
    }
}
