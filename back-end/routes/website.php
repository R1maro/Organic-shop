<?php

use App\Http\Controllers\Website\CartController;
use App\Http\Controllers\Website\MenuController;
use App\Http\Controllers\Website\ProductController;
use App\Http\Controllers\Website\SettingController;
use Illuminate\Support\Facades\Route;

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

Route::prefix('cart')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [CartController::class, 'getCart']);
    Route::post('/add', [CartController::class, 'addItem']);
    Route::post('/update', [CartController::class, 'updateItem']);
    Route::delete('/remove/{cartItemId}', [CartController::class, 'removeItem']);
    Route::delete('/clear', [CartController::class, 'clearCart']);
    Route::post('/checkout', [CartController::class, 'checkout']);
});
