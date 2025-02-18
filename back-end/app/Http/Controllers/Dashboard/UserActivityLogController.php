<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserActivityLogResource;
use App\Models\UserActivityLog;
use Illuminate\Http\Request;

class UserActivityLogController extends Controller
{

    public function index(Request $request)
    {
        $logs = UserActivityLog::query()
            ->when($request->user_id, function ($query, $userId) {
                return $query->where('user_id', $userId);
            })
            ->when($request->action, function ($query, $action) {
                return $query->where('action', 'like', "%{$action}%");
            })
            ->latest('created_at')
            ->paginate($request->per_page ?? 10);

        return UserActivityLogResource::collection($logs);
    }

    public function show(UserActivityLog $log)
    {
        return new UserActivityLogResource($log);
    }


}
