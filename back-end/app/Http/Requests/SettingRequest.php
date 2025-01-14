<?php

namespace App\Http\Requests;

use App\Models\Setting;
use Illuminate\Foundation\Http\FormRequest;

class SettingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'key' => ['required', 'string', 'max:255'],
            'label' => 'required|string|max:255',
            'type' => 'required|string|in:' . implode(',', Setting::getTypes()),
            'group' => 'required|string|in:' . implode(',', Setting::getGroups()),
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'value' => 'nullable'
        ];

        // Make key unique only on creation
        if ($this->isMethod('post')) {
            $rules['key'][] = 'unique:settings,key';
        } else {
            $rules['key'][] = 'unique:settings,key,' . $this->setting->id;
        }

        if ($this->type === 'image') {
            $rules['image'] = 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048';
        }

        return $rules;
    }
}
