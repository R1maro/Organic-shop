<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getOrderStats()
    {
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $ordersCount = $user->orders()->count();
        $pendingOrdersCount = $user->orders()->where('status', 'pending')->count();
        $completedOrdersCount = $user->orders()->where('status', 'completed')->count();
        $totalSpent = $user->orders()->where('payment_status', 'paid')->sum('total_price');

        return response()->json([
            'orders_count' => $ordersCount,
            'pending_orders' => $pendingOrdersCount,
            'completed_orders' => $completedOrdersCount,
            'total_spent' => $totalSpent,
            'formatted_total_spent' => '$' . number_format($totalSpent, 0, '.', ','),
        ]);
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::guard('sanctum')->user();

            if (!$user) {
                return response()->json([
                    'error' => 'Unauthorized'
                ], 401);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
                'phone' => 'sometimes|string|max:20|nullable',
                'address' => 'sometimes|string|max:500|nullable',
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update profile',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
