<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    /**
     * Get all menu items
     *
     * @return JsonResponse
     */
    public function getMenuItems(): JsonResponse
    {
        try {
            $menuItems = MenuItem::where('is_active', true)
                ->orderBy('order', 'asc')
                ->get(['id', 'name', 'url', 'order']);

            return response()->json([
                'status' => 'success',
                'menu_items' => $menuItems
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch menu items',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
