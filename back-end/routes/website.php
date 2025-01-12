<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Website\IndexController;

Route::get('/products', [IndexController::class, 'getProducts']);
Route::get('/settings', [IndexController::class, 'getPublicSettings']);
