<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\SettingGroup;
use Illuminate\Http\Request;

class SettingGroupController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:setting_groups,name']
        ]);

        $group = SettingGroup::create([
            'name' => $request->name,
            'is_default' => false
        ]);

        return response()->json(['data' => $group], 201);
    }

    public function destroy(SettingGroup $settingGroup)
    {
        if ($settingGroup->is_default) {
            return response()->json(['message' => 'Default groups cannot be deleted.'], 403);
        }

        $hasSettings = $settingGroup->settings()->exists();
        if ($hasSettings) {
            return response()->json(['message' => 'This group has settings associated with it and cannot be deleted.'], 403);
        }

        $settingGroup->delete();
        return response()->json(null, 204);
    }
}
