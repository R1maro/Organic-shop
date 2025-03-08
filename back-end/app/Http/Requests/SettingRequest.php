<?php

namespace App\Http\Requests;

use App\Models\Setting;
use App\Models\SettingGroup;
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
            'group' => 'required|string',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'value' => 'nullable'
        ];

        if ($this->isMethod('post')) {
            if ($this->has('group')) {
                $rules['group'] = [
                    'required',
                    'string',
                    function ($attribute, $value, $fail) {
                        $exists = SettingGroup::where('name', $value)->exists();
                        if (!$exists) {
                            $fail('The selected group is invalid.');
                        }
                    }
                ];
            }
        } else {
            $rules['key'][] = 'unique:settings,key,' . $this->setting->id;
        }

        if ($this->type === 'image') {
            $rules['image'] = 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048';
        }

        return $rules;
    }
}
