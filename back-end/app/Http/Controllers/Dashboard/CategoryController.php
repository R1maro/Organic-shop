<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{

    private $cacheTimeout = 3600; // Cache timeout in seconds (1 hour)

    public function index()
    {
        $page = request()->get('page', 1);
        $cacheKey = 'categories_page_' . $page;

        return Cache::remember($cacheKey, $this->cacheTimeout, function () {
            return response()->json(
                Category::with('parent', 'children')
                    ->whereNull('parent_id')
                    ->paginate(10)
            );
        });
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', 'exists:categories,id'],
            'is_active' => ['boolean']
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category = Category::create($validated);

        $this->clearCategoryCache();

        return response()->json($category);
    }

    public function show(Category $category)
    {
        $cacheKey = 'category_' . $category->id;

        return Cache::remember($cacheKey, $this->cacheTimeout, function () use ($category) {
            return response()->json($category->load('parent', 'children'));
        });
    }


    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                Rule::notIn([$category->id])
            ],
            'is_active' => ['boolean']
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        $category->update($validated);

        $this->clearCategoryCache();
        Cache::forget('category_' . $category->id);

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        $this->clearCategoryCache();
        Cache::forget('category_' . $category->id);

        return response()->json([
            'message' => 'Category deleted successfully!'
        ],200);
    }

    private function clearCategoryCache()
    {
        // Clear the first few pages of pagination cache
        for ($i = 1; $i <= 5; $i++) {
            Cache::forget('categories_page_' . $i);
        }

    }
}
