<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserActivityLogResource;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserActivityLogController extends Controller
{


    public function index(Request $request)
    {
        $logs = UserActivityLog::query()
            ->with('user')
            // Filter by user_id
            ->when($request->user_id, function ($query, $userId) {
                return $query->where('user_id', $userId);
            })
            // Filter by action
            ->when($request->action, function ($query, $action) {
                return $query->where('action', $action);
            })
            // Search in description
            ->when($request->search, function ($query, $search) {
                return $query->where('description', 'like', "%{$search}%");
            })
            // Sorting
            ->when($request->sort && $request->order, function ($query) use ($request) {
                if (str_contains($request->sort, '.')) {
                    [$relation, $column] = explode('.', $request->sort);
                    return $query->join("users", "user_activity_logs.user_id", "=", "users.id")
                        ->orderBy("users.{$column}", $request->order)
                        ->select('user_activity_logs.*');
                }
                return $query->orderBy($request->sort, $request->order);
            }, function ($query) {
                return $query->latest('created_at');
            })
            ->paginate($request->per_page ?? 10);

        return UserActivityLogResource::collection($logs);
    }


    public function getFilterOptions(): \Illuminate\Http\JsonResponse
    {
        $users = User::select('id', 'name')->orderBy('name')->get();

        $actions = UserActivityLog::distinct('action')->pluck('action')->filter()->values();

        return response()->json([
            'users' => $users,
            'actions' => $actions,
        ]);
    }

    public function show(UserActivityLog $log)
    {
        return new UserActivityLogResource($log);
    }


}
