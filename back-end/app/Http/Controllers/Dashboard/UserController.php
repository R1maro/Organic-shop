<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{

    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->paginate($request->per_page ?? 15);

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

        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully',
            'data' => new UserResource($user)
        ], 201);
    }


    public function show(User $user)
    {
        return response()->json([
            'data' => new UserResource($user)
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

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => new UserResource($user)
        ]);
    }


    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }


    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => ['required', 'string', 'min:2']
        ]);

        $users = User::where('name', 'like', "%{$validated['query']}%")
            ->orWhere('email', 'like', "%{$validated['query']}%")
            ->paginate(15);

        return new UserResource($users);
    }


    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        return new UserResource($user);

    }

    public function trashed()
    {
        $users = User::onlyTrashed()->paginate(15);

        return UserResource::collection($users);
    }
}
