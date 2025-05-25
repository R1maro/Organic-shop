<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cart extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Get the user that owns the cart.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items in the cart.
     */
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Calculate the total price of all items in the cart.
     */
    public function getTotalAttribute()
    {
        return $this->items->sum(function ($item) {
            return $item->quantity * $item->product->final_price;
        });
    }

    /**
     * Calculate the total formatted price of all items in the cart.
     */
    public function getFormattedTotalAttribute()
    {
        return "$ " . number_format($this->total, 0, '.', ',');
    }

    /**
     * Extend the expiration time by 24 hours.
     */
    public function extendExpiration()
    {
        $this->expires_at = now()->addHours(24);
        $this->save();
    }

    /**
     * Scope a query to only include active carts.
     */
    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now());
    }
}
