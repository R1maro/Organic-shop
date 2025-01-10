<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, softDeletes;

    protected $fillable = [
        'invoice_number',
        'order_id',
        'user_id',
        'subtotal',
        'tax',
        'shipping_cost',
        'total',
        'status',
        'payment_method',
        'due_date',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'paid_at' => 'datetime',
    ];


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            $invoice->invoice_number = 'INV_' . strtoupper(uniqid());
            $invoice->calculateTotal();
        });

        static::updating(function ($invoice) {
            if ($invoice->isDirty(['subtotal', 'tax', 'shipping_cost'])) {
                $invoice->calculateTotal();
            }
        });
    }

    private function calculateTotal()
    {
        $this->total = $this->subtotal + $this->tax + $this->shipping_cost;
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }


    public function user(){
        return $this->belongsTo(User::class);
    }

    public function markAsPaid()
    {
        $this->update([
            'status' => 'Paid',
            'paid_at' => now(),
        ]);
    }

    public function markAsRefunded(){
        $this->update([
            'status' => 'Refunded',
        ]);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'pending')
            ->whereNotNull('due_date')
            ->where('due_date', '<', now());
    }

}
