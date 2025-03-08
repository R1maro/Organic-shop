<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SettingGroup extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relation to settings
    public function settings()
    {
        return $this->hasMany(Setting::class, 'group', 'name');
    }
}
