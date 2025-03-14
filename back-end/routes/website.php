<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Website\SettingController;
use App\Http\Controllers\Website\ProductController;
use App\Http\Controllers\Website\MenuController;

Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('/categories', [SettingController::class, 'getCategoriesWithProducts']);
Route::get('/menu-items', [MenuController::class, 'getMenuItems']);
Route::prefix('settings')->group(function () {
    Route::get('/', [SettingController::class, 'getPublicSettings']);
    Route::get('/logo', [SettingController::class, 'getLogo']);
    Route::get('/slider', [SettingController::class, 'getSliderImages']);
    Route::get('/benefits', [SettingController::class, 'getBenefits']);
    Route::get('/slider_autoplay_speed', [SettingController::class, 'getSliderAutoPlay']);



});
