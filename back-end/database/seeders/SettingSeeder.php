<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run()
    {
        $settings = [
            [
                'key' => 'site_name',
                'value' => 'My Website',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Site Name',
                'description' => 'The name of your website'
            ],
            [
                'key' => 'site_description',
                'value' => 'Welcome to my website',
                'type' => 'textarea',
                'group' => 'general',
                'label' => 'Site Description',
                'description' => 'A brief description of your website'
            ],
            [
                'key' => 'logo',
                'value' => null,
                'type' => 'image',
                'group' => 'general',
                'label' => 'Site Logo',
                'description' => 'Your website logo (recommended size: 200x50px)'
            ],
            [
                'key' => 'telegram_address',
                'value' => '',
                'type' => 'text',
                'group' => 'social',
                'label' => 'Telegram Address',
                'description' => 'Your Telegram channel or contact'
            ],
            [
                'key' => 'slider_image_1',
                'value' => null,
                'type' => 'image',
                'group' => 'slider',
                'label' => 'Slider Image 1',
                'description' => 'First slider image (recommended size: 1920x1080px)'
            ],
            [
                'key' => 'slider_image_2',
                'value' => null,
                'type' => 'image',
                'group' => 'slider',
                'label' => 'Slider Image 2',
                'description' => 'Second slider image (recommended size: 1920x1080px)'
            ],
            [
                'key' => 'slider_image_3',
                'value' => null,
                'type' => 'image',
                'group' => 'slider',
                'label' => 'Slider Image 3',
                'description' => 'Third slider image (recommended size: 1920x1080px)'
            ],
            [
                'key' => 'slider_autoplay_speed',
                'value' => null,
                'type' => 'number',
                'group' => 'slider',
                'label' => 'Slider Autoplay Speed',
                'description' => 'Slider autoplay speed (in milliseconds,recommended 666)'
            ],
            [
                'key' => 'slider_show_navigation',
                'value' => true,
                'type' => 'boolean',
                'group' => 'slider',
                'label' => 'Slider Navigation Show',
                'description' => 'Slider navigation show'
            ],
            [
                'key' => 'slider_show_indicators',
                'value' => true,
                'type' => 'boolean',
                'group' => 'slider',
                'label' => 'Slider Indicator Show',
                'description' => 'Slider indicator show'
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
