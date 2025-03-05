<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Website\SettingController;

Route::get('/products', [SettingController::class, 'getProducts']);
Route::get('/categories', [SettingController::class, 'getCategoriesWithProducts']);
Route::prefix('settings')->group(function () {
    Route::get('/', [SettingController::class, 'getPublicSettings']);
    Route::get('/logo', [SettingController::class, 'getLogo']);
    Route::get('/slider', [SettingController::class, 'getSliderImages']);
    Route::get('/benefits', [SettingController::class, 'getBenefits']);
    Route::get('/slider_autoplay_speed', [SettingController::class, 'getSliderAutoPlay']);



});
