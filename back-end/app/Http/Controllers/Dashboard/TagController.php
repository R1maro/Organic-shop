<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\UserActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Http\Resources\TagResource;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::withCount('blogs')->latest()->paginate();
        return TagResource::collection($tags);
    }

    public function store(StoreTagRequest $request)
    {
        try {
            $tag = Tag::create($request->validated());
            UserActivityLogger::created($tag);
            return new TagResource($tag);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function show(Tag $tag)
    {
        return new TagResource($tag->loadCount('blogs'));
    }

    public function update(UpdateTagRequest $request, Tag $tag)
    {
        try {
            UserActivityLogger::prepareForUpdate($tag);
            $tag->update($request->validated());
            UserActivityLogger::updated($tag);
            return new TagResource($tag->fresh());
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function destroy(Tag $tag)
    {
        try {
            $tag->delete();
            return response()->json(['message' => 'Tag deleted successfully']);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
