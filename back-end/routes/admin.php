<?php

use App\Http\Controllers\Dashboard\BlogController;
use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Dashboard\InvoiceController;
use App\Http\Controllers\Dashboard\MenuItemController;
use App\Http\Controllers\Dashboard\OrderController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\SettingController;
use App\Http\Controllers\Dashboard\SettingGroupController;
use App\Http\Controllers\Dashboard\TagController;
use App\Http\Controllers\Dashboard\UserActivityLogController;
use App\Http\Controllers\Dashboard\UserController;
use App\Http\Controllers\Dashboard\RoleController;
use Illuminate\Support\Facades\Route;


Route::prefix('admin')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::get('users/search', [UserController::class, 'search']);
    Route::get('users/trashed', [UserController::class, 'trashed']);
    Route::post('users/{id}/restore', [UserController::class, 'restore']);

    Route::get('roles', [RoleController::class, 'index']);


    Route::prefix('menu-items')->group(function () {
        Route::post('/reorder', [MenuItemController::class, 'reorder']);
        Route::get('/trashed', [MenuItemController::class, 'trashed']);
        Route::patch('/{id}/toggle-active', [MenuItemController::class, 'toggleActive']);
        Route::patch('/{id}/restore', [MenuItemController::class, 'restore']);
        Route::delete('/{id}/force', [MenuItemController::class, 'forceDelete']);
        Route::get('/', [MenuItemController::class, 'index']);
        Route::get('/{id}', [MenuItemController::class, 'show']);
        Route::post('/', [MenuItemController::class, 'store']);
        Route::put('/{id}', [MenuItemController::class, 'update']);



    });


    Route::apiResource('categories', CategoryController::class);

    Route::apiResource('products', ProductController::class);
    Route::delete('products/{product}/image', [ProductController::class, 'deleteImage']);

    Route::apiResource('orders', OrderController::class);

    Route::apiResource('invoices', InvoiceController::class);
    Route::get('user/{userId}/invoices', [InvoiceController::class, 'getUserInvoices']);

    Route::apiResource('blogs', BlogController::class);
    Route::post('blogs/upload-image', [BlogController::class, 'uploadImage']);
    Route::apiResource('tags', TagController::class);


    Route::get('settings/groups', [SettingController::class, 'getGroups']);
    Route::get('settings/types', [SettingController::class, 'getTypes']);
    Route::post('settings/bulk-update', [SettingController::class, 'bulkUpdate']);
    Route::apiResource('settings', SettingController::class);
    Route::apiResource('setting-groups', SettingGroupController::class)->only(['index', 'store', 'destroy']);


    Route::get('/user-activity-logs', [UserActivityLogController::class, 'index']);
    Route::get('/user-activity-logs/{id}', [UserActivityLogController::class, 'show']);
    Route::get('/log-filter-options', [UserActivityLogController::class, 'getFilterOptions']);

})->middleware(['auth:sanctum', 'role:admin']);
