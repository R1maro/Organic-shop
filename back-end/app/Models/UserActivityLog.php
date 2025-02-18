<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'description',
        'user_id',
        'user_email',
        'ip',
        'request_url',
        'request_method',
        'additional_data',
    ];

    protected $casts = [
        'additional_data' => 'array',
    ];
}
