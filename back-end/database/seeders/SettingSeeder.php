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
                'group' => 'General',
                'label' => 'Site Name',
                'description' => 'The name of your website'
            ],
            [
                'key' => 'site_description',
                'value' => 'Welcome to my website',
                'type' => 'textarea',
                'group' => 'General',
                'label' => 'Site Description',
                'description' => 'A brief description of your website'
            ],
            [
                'key' => 'telegram_address',
                'value' => '',
                'type' => 'text',
                'group' => 'Social',
                'label' => 'Telegram Address',
                'description' => 'Your Telegram channel or contact'
            ],
            [
                'key' => 'slider_autoplay_speed',
                'value' => 6000,
                'type' => 'number',
                'group' => 'Slider',
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
                'group' => 'Slider',
                'label' => 'Slider Indicator Show',
                'description' => 'Slider indicator show'
            ],
            [
                'key' => 'advertisement_image_1',
                'value' => null,
                'type' => 'image',
                'group' => 'Slider',
                'label' => 'Advertisement Image 1',
                'description' => 'Advertisement image (recommended size: 1920x1080px)'
            ],
            [
                'key' => 'advertisement_image_2',
                'value' => null,
                'type' => 'image',
                'group' => 'Slider',
                'label' => 'Advertisement Image 2',
                'description' => 'Advertisement image (recommended size: 1920x1080px)'
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
        $this->addLogoImage();
        $this->addSliderImages();
        $this->addBenefitImages();
    }

    protected function addLogoImage()
    {
        $setting = Setting::firstOrCreate(['key' => 'logo'], [
            'type' => 'image',
            'group' => 'General',
            'label' => 'Site Logo',
            'description' => 'Your website logo (recommended size: 200x50px)'
        ]);

        $imagePath = public_path('images/logo.webp');

        if (file_exists($imagePath)) {
            $setting->clearMediaCollection('setting_image');

            $media = $setting->addMedia($imagePath)
                ->preservingOriginal()
                ->toMediaCollection('setting_image');

            $setting->update([
                'value' => $media->getUrl(),
            ]);

        }

    }

    protected function addSliderImages()
    {
        $sliderImages = [
            'slider_image_A' => public_path('images/slider_1.webp'),
            'slider_image_B' => public_path('images/slider_2.webp'),
            'slider_image_C' => public_path('images/slider_3.webp'),
            'slider_image_D' => public_path('images/slider_1.webp'),
            'slider_image_E' => public_path('images/slider_2.webp'),
        ];

        foreach ($sliderImages as $key => $imagePath) {
            $setting = Setting::firstOrCreate(['key' => $key], [
                'type' => 'image',
                'group' => 'Slider',
                'label' => ucfirst(str_replace('_', ' ', $key)),
                'description' => "Slider image for $key",
            ]);

            if (file_exists($imagePath)) {

                $setting->clearMediaCollection('setting_image');

                $setting->clearMediaCollection('setting_image');

                $media = $setting->addMedia($imagePath)
                    ->preservingOriginal()
                    ->toMediaCollection('setting_image');

                $setting->update([
                    'value' => $media->getUrl(),
                ]);
            }
        }
    }
    protected function addBenefitImages()
    {
        $benefitImages = [
            'Benefit_A' => public_path('images/benefit_1.webp'),
            'Benefit_B' => public_path('images/benefit_2.webp'),
            'Benefit_C' => public_path('images/benefit_3.webp'),
            'Benefit_D' => public_path('images/benefit_1.webp'),
        ];

        foreach ($benefitImages as $key => $imagePath) {
            $setting = Setting::firstOrCreate(['key' => $key], [
                'type' => 'image',
                'group' => 'General',
                'label' => ucfirst(str_replace('_', ' ', $key)),
                'description' => "Benefit image for $key",
            ]);

            if (file_exists($imagePath)) {

                $setting->clearMediaCollection('setting_image');

                $setting->clearMediaCollection('setting_image');

                $media = $setting->addMedia($imagePath)
                    ->preservingOriginal()
                    ->toMediaCollection('setting_image');

                $setting->update([
                    'value' => $media->getUrl(),
                ]);
            }
        }
    }
}
