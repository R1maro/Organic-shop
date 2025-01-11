<?php

use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Dashboard\InvoiceController;
use App\Http\Controllers\Dashboard\OrderController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\SettingController;
use Illuminate\Support\Facades\Route;


Route::prefix('admin')->group(function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::get('user/{userId}/invoices', [InvoiceController::class, 'getUserInvoices']);
    Route::get('settings/groups', [SettingController::class, 'getGroups']);
    Route::get('settings/types', [SettingController::class, 'getTypes']);
    Route::post('settings/bulk-update', [SettingController::class, 'bulkUpdate']);
    Route::apiResource('settings', SettingController::class);
})->middleware(['auth:sanctum']);
