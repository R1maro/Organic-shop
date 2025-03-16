<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the menu items.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $menuItems = MenuItem::orderBy('order', 'asc')->get();

            return response()->json([
                'status' => 'success',
                'data' => $menuItems
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch menu items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created menu item in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'url' => 'nullable|string|max:255',
                'icon' => 'nullable|string|max:255',
                'order' => 'nullable|integer',
                'parent_id' => 'nullable|exists:menu_items,id',
                'is_active' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            if (!$request->has('order')) {
                $maxOrder = MenuItem::max('order') ?? 0;
                $request->merge(['order' => $maxOrder + 1]);
            }

            $menuItem = MenuItem::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Menu item created successfully',
                'data' => $menuItem
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create menu item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified menu item.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $menuItem = MenuItem::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $menuItem
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Menu item not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified menu item in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $menuItem = MenuItem::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'nullable|string|max:255',
                'url' => 'nullable|string|max:255',
                'icon' => 'nullable|string|max:255',
                'order' => 'nullable|integer',
                'parent_id' => [
                    'nullable',
                    'exists:menu_items,id',
                    Rule::notIn([$id])
                ],
                'is_active' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            if ($request->has('parent_id') && $request->parent_id) {
                $parentId = $request->parent_id;
                $visited = [$id];

                while ($parentId) {
                    if (in_array($parentId, $visited)) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Operation would create a cyclical menu hierarchy'
                        ], 422);
                    }

                    $visited[] = $parentId;
                    $parent = MenuItem::find($parentId);
                    $parentId = $parent ? $parent->parent_id : null;
                }
            }

            $menuItem->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Menu item updated successfully',
                'data' => $menuItem
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update menu item',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }

    /**
     * Remove the specified menu item from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $menuItem = MenuItem::findOrFail($id);

            $childrenStrategy = request('children_strategy', 'delete');

            if ($childrenStrategy === 'orphan') {
                MenuItem::where('parent_id', $id)->update(['parent_id' => null]);
            } elseif ($childrenStrategy === 'promote') {
                MenuItem::where('parent_id', $id)->update(['parent_id' => $menuItem->parent_id]);
            }

            $menuItem->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Menu item deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete menu item',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }

    /**
     * Reorder menu items.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function reorder(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'items' => 'required|array',
                'items.*.id' => 'required|exists:menu_items,id',
                'items.*.order' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            foreach ($request->items as $item) {
                MenuItem::where('id', $item['id'])->update(['order' => $item['order']]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Menu items reordered successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to reorder menu items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore a soft-deleted menu item.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $menuItem = MenuItem::withTrashed()->findOrFail($id);

            if (!$menuItem->trashed()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Menu item is not deleted'
                ], 422);
            }

            $menuItem->restore();

            return response()->json([
                'status' => 'success',
                'message' => 'Menu item restored successfully',
                'data' => $menuItem
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to restore menu item',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }

    /**
     * Get a list of trashed menu items.
     *
     * @return JsonResponse
     */
    public function trashed(): JsonResponse
    {
        try {
            $trashedItems = MenuItem::onlyTrashed()->get();

            return response()->json([
                'status' => 'success',
                'data' => $trashedItems
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch trashed menu items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Permanently delete a soft-deleted menu item.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function forceDelete(int $id): JsonResponse
    {
        try {
            $menuItem = MenuItem::withTrashed()->findOrFail($id);

            if (!$menuItem->trashed()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Please soft delete the menu item first'
                ], 422);
            }

            $menuItem->forceDelete();

            return response()->json([
                'status' => 'success',
                'message' => 'Menu item permanently deleted'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to permanently delete menu item',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }

    /**
     * Toggle the active status of a menu item.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function toggleActive(int $id): JsonResponse
    {
        try {
            $menuItem = MenuItem::findOrFail($id);
            $menuItem->is_active = !$menuItem->is_active;
            $menuItem->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Menu item status toggled successfully',
                'data' => [
                    'id' => $menuItem->id,
                    'is_active' => $menuItem->is_active
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to toggle menu item status',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }
}
