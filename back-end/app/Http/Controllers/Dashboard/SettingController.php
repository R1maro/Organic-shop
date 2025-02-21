<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\UserActivityLogger;
use App\Http\Controllers\Controller;
use App\Http\Requests\SettingRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $query = Setting::query();

        if ($request->filled('group')) {
            $query->where('group', $request->group);
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('key', 'LIKE', "%{$search}%")
                    ->orWhere('label', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $settings = $query->orderBy('id')->paginate($request->per_page ?? 10);

        return SettingResource::collection($settings);
    }

    public function store(SettingRequest $request)
    {
        $setting = Setting::create($request->validated());

        if ($request->hasFile('image') && $setting->type === 'image') {
            $media = $setting->addMediaFromRequest('image')
                ->toMediaCollection('setting_image');

            $setting->update(['value' => $media->getUrl()]);
        }
        UserActivityLogger::created($setting);

        return response()->json([
            'message' => 'Setting created successfully',
            'data' => new SettingResource($setting)
        ], 201);
    }

    public function show(Setting $setting)
    {
        return response()->json([
            'data' => new SettingResource($setting)
        ]);
    }

    public function update(SettingRequest $request, Setting $setting)
    {
        UserActivityLogger::prepareForUpdate($setting);
        $setting->update($request->validated());

        if ($request->hasFile('image') && $setting->type === 'image') {
            $setting->clearMediaCollection('setting_image');
            $media = $setting->addMediaFromRequest('image')
                ->toMediaCollection('setting_image');

            $setting->update(['value' => $media->getUrl()]);

        }
        UserActivityLogger::updated($setting);

        return response()->json([
            'message' => 'Setting updated successfully',
            'data' => new SettingResource($setting)
        ],201);
    }

    public function destroy(Setting $setting)
    {
        $setting->delete();
        return response()->json([
            'message' => 'Setting deleted successfully'
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $settings = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:settings,key',
            'settings.*.value' => 'nullable'
        ]);

        foreach ($settings['settings'] as $settingData) {
            $setting = Setting::where('key', $settingData['key'])->first();

            if ($setting) {
                if ($setting->type === 'image' && isset($settingData['image'])) {
                    $setting->clearMediaCollection('setting_image');
                    $setting->addMediaFromRequest("settings.{$setting->key}.image")
                        ->toMediaCollection('setting_image');
                } else {
                    $setting->update(['value' => $settingData['value']]);
                }
            }
        }

        return response()->json([
            'message' => 'Settings updated successfully'
        ]);
    }

    public function getGroups()
    {
        return response()->json([
            'data' => Setting::getGroups()
        ]);
    }

    public function getTypes()
    {
        return response()->json([
            'data' => Setting::getTypes()
        ]);
    }
}
