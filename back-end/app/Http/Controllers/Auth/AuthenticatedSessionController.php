<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $user = Auth::user();
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    public function checkAuth(Request $request)
    {
        return response()->json([
            'authenticated' => auth('sanctum')->check(),
            'user' => auth('sanctum')->check() ? auth('sanctum')->user()->load('roles') : null,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ], 200);
    }
}
