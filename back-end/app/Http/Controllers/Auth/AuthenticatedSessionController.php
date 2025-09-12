<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        try {
            $request->authenticate();

            $user = Auth::user()->load('roles');

            $user->tokens()->delete();

            $token = $user->createToken('token', ['*'], now()->addDay());

            Log::info('New token created', [
                'user_id' => $user->id,
                'token_prefix' => substr($token->plainTextToken, 0, 10) . '...',
                'expiration' => now()->addDay()->toIso8601String()
            ]);

            return response()->json([
                'message' => 'Login successful.',
                'access_token' => $token->plainTextToken,
                'user' => $user,
                'expires_at' => now()->addDay()->toIso8601String(),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Authentication failed. Please check your credentials.',
            ], 401);
        }
    }

    /**
     * Check authentication status.
     */
    /**
     * Check authentication status.
     */
    public function checkAuth(Request $request): JsonResponse
    {
        try {
            $token = $request->bearerToken();
            $tokenModel = null;
            $user = null;

            if ($token) {
                $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($token);

                if ($tokenModel) {
                    if ($tokenModel->expires_at && $tokenModel->expires_at->isPast()) {
                        $tokenModel->delete();
                        return response()->json([
                            'authenticated' => false,
                            'user' => null,
                            'message' => 'Token expired'
                        ], 401);
                    }

                    $user = $tokenModel->tokenable;
                    if ($user && !$request->user()) {
                        Auth::login($user);
                    }
                }
            }

            $requestUser = $request->user();

            $authenticatedUser = $requestUser ?: $user;

            if (!$authenticatedUser) {
                Log::warning('Auth check: No user found', [
                    'token_exists' => $tokenModel ? 'yes' : 'no',
                    'token_prefix' => $token ? substr($token, 0, 10) . '...' : 'null',
                    'request_user' => $requestUser ? 'yes' : 'no',
                    'manual_user' => $user ? 'yes' : 'no'
                ]);

                return response()->json([
                    'authenticated' => false,
                    'user' => null,
                    'message' => 'No authenticated user found',
                    'debug' => [
                        'token_prefix' => $token ? substr($token, 0, 10) . '...' : 'null',
                        'token_exists' => $tokenModel ? true : false,
                        'headers' => $request->headers->all()
                    ]
                ], 401);
            }

            $authenticatedUser->load('roles');

            return response()->json([
                'authenticated' => true,
                'user' => $authenticatedUser
            ]);
        } catch (\Exception $e) {
            Log::error('Auth check error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'authenticated' => false,
                'user' => null,
                'error' => 'Authentication check failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logged out successfully.',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Logout failed. Please try again.',
            ], 500);
        }
    }
}
