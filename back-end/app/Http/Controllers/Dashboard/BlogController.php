<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use App\Http\Resources\BlogResource;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $blogs = Blog::query()
            ->with(['user' , 'media'])
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                return $query->whereHas('categories', function ($q) use ($categoryId) {
                    $q->where('categories.id', $categoryId);
                });
            })
            ->latest('published_at')
            ->paginate($request->per_page ?? 15);

        return BlogResource::collection($blogs);
    }

    public function store(StoreBlogRequest $request)
    {
        try {
            $user = auth('sanctum')->user();

            if (!$user) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
            $validated = $request->validated();

            unset($validated['featured_image']);

            $blog = Blog::create([
                ...$validated,
                'user_id' => $user->id,
            ]);

            if ($request->hasFile('featured_image')) {
                $blog->addMediaFromRequest('featured_image')
                    ->withResponsiveImages()
                    ->toMediaCollection('blog_images');
            }

            if ($request->has('categories')) {
                $blog->categories()->sync($request->categories);
            }

            if ($request->has('tags')) {
                $blog->tags()->sync($request->tags);
            }

            return new BlogResource($blog);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function show(Blog $blog)
    {
        return new BlogResource($blog->load(['categories', 'tags', 'user']));
    }


    public function update(UpdateBlogRequest $request, Blog $blog)
    {

        $validated = $request->validated();

        unset($validated['featured_image']);

        $blog->update($validated);

        if ($request->hasFile('featured_image')) {
            $blog->clearMediaCollection('blog_images');

            $blog->addMediaFromRequest('featured_image')
                ->withResponsiveImages()
                ->toMediaCollection('blog_images');
        }


        if ($request->has('categories')) {
            $blog->categories()->sync($request->categories);
        }

        if ($request->has('tags')) {
            $blog->tags()->sync($request->tags);
        }

        return new BlogResource($blog->fresh(['categories', 'tags', 'user']));
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();
        return response()->noContent();
    }

    public function restore($id)
    {
        $blog = Blog::withTrashed()->findOrFail($id);
        $blog->restore();
        return new BlogResource($blog);
    }

    public function forceDelete($id)
    {
        $blog = Blog::withTrashed()->findOrFail($id);
        $blog->forceDelete();
        return response()->noContent();
    }
}
