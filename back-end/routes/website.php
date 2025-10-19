<?php

use App\Http\Controllers\Website\CartController;
use App\Http\Controllers\Website\MenuController;
use App\Http\Controllers\Website\ProductController;
use App\Http\Controllers\Website\SettingController;
use App\Http\Controllers\Website\UserController;
use App\Http\Controllers\Website\WishListController;
use Illuminate\Support\Facades\Route;


Route::get('/categories', [SettingController::class, 'getCategoriesWithProducts']);
Route::get('/menu-items', [MenuController::class, 'getMenuItems']);
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'getProducts']);
    Route::get('/last', [ProductController::class, 'getLastProducts']);
    Route::get('/{slug}', [ProductController::class, 'show']);
});
Route::prefix('settings')->group(function () {
    Route::get('/', [SettingController::class, 'getPublicSettings']);
    Route::get('/logo', [SettingController::class, 'getLogo']);
    Route::get('/slider', [SettingController::class, 'getSliderImages']);
    Route::get('/benefits', [SettingController::class, 'getBenefits']);
    Route::get('/slider_autoplay_speed', [SettingController::class, 'getSliderAutoPlay']);


});


Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'getCart']);
        Route::post('/add', [CartController::class, 'addItem']);
        Route::post('/update', [CartController::class, 'updateItem']);
        Route::delete('/remove/{cartItemId}', [CartController::class, 'removeItem']);
        Route::delete('/clear', [CartController::class, 'clearCart']);
        Route::post('/checkout', [CartController::class, 'checkout']);
    });

    Route::prefix('user')->group(function () {
        Route::get('/orders/stats', [UserController::class, 'getOrderStats']);
//        Route::get('/profile', [UserController::class, 'getProfile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
    });


    Route::prefix('wishlist')->group(function () {
        Route::get('/', [WishlistController::class, 'index']);
        Route::post('/toggle/{product}', [WishlistController::class, 'toggle']);
        Route::get('/check/{product}', [WishlistController::class, 'check']);


    });
});
