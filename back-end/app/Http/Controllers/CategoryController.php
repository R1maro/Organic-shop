<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{

    public function index()
    {
        $categories = Category::with('parent')->paginate(10);
        return response()->json($categories);
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

        return response()->json($category);
    }

    public function show(Category $category)
    {
        return response()->json($category->load('parent', 'children'));
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

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json([
            'message' => 'Category deleted successfully!'
        ],200);
    }
}
