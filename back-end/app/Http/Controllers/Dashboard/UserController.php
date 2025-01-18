<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    private const CACHE_TTL = 3600; // 1 hour in seconds
    private const CACHE_KEY_PREFIX = 'users:';

    private function getCacheKey(string $key): string
    {
        return self::CACHE_KEY_PREFIX . $key;
    }

    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search', '');
        $cacheKey = $this->getCacheKey("list_page_{$page}_perPage_{$perPage}_search_{$search}");

        $users = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($request) {
            return User::query()
                ->when($request->search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->paginate($request->per_page ?? 10);
        });

        return UserResource::collection($users);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'is_admin' => ['nullable', 'boolean'],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        DB::beginTransaction();
        try {
            $user = User::create($validated);
            DB::commit();

            // Clear relevant caches
            $this->clearUsersCache();

            return response()->json([
                'message' => 'User created successfully',
                'data' => new UserResource($user)
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    public function show(User $user)
    {
        $cacheKey = $this->getCacheKey("user_{$user->id}");

        $cachedUser = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($user) {
            return $user;
        });
        return response()->json([
            'data' => new UserResource($cachedUser)
        ]);
    }


    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', 'required', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'is_admin' => ['nullable', 'boolean'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        DB::beginTransaction();
        try {
            $user->update($validated);
            DB::commit();


            $this->clearUsersCache();
            Cache::forget($this->getCacheKey("user_{$user->id}"));

            return response()->json([
                'message' => 'User updated successfully',
                'data' => new UserResource($user)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    public function destroy(User $user)
    {
        DB::beginTransaction();
        try {
            $user->delete();
            DB::commit();


            $this->clearUsersCache();
            Cache::forget($this->getCacheKey("user_{$user->id}"));

            return response()->json([
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => ['required', 'string', 'min:2']
        ]);

        $page = $request->get('page', 1);
        $cacheKey = $this->getCacheKey("search_" . md5($validated['query']) . "_page_{$page}");

        $users = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($validated) {
            return User::where('name', 'like', "%{$validated['query']}%")
                ->orWhere('email', 'like', "%{$validated['query']}%")
                ->paginate(10);
        });

        return new UserResource($users);
    }


    public function restore(int $id)
    {
        DB::beginTransaction();
        try {
            $user = User::withTrashed()->findOrFail($id);
            $user->restore();
            DB::commit();

            // Clear relevant caches
            $this->clearUsersCache();

            return new UserResource($user);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

    }

    public function trashed(Request $request)
    {
        $page = $request->get('page', 1);
        $cacheKey = $this->getCacheKey("trashed_page_{$page}");

        $users = Cache::remember($cacheKey, self::CACHE_TTL, function () {
            return User::onlyTrashed()->paginate(15);
        });

        return UserResource::collection($users);
    }
    private function clearUsersCache(): void
    {
        Cache::forget($this->getCacheKey("list_page_1_perPage_10_search_"));

        for ($i = 1; $i <= 5; $i++) {
            Cache::forget($this->getCacheKey("list_page_{$i}_perPage_15_search_"));
            Cache::forget($this->getCacheKey("list_page_{$i}_perPage_10_search_"));
            Cache::forget($this->getCacheKey("list_page_{$i}_perPage_25_search_"));

            Cache::forget($this->getCacheKey("search_page_{$i}"));

            Cache::forget($this->getCacheKey("trashed_page_{$i}"));
        }
    }
}
