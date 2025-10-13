<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $allImages = [
            public_path('images/benefit_1.webp'),
            public_path('images/benefit_2.webp'),
            public_path('images/benefit_3.webp'),
            public_path('images/benefit_1.webp'),
            public_path('images/benefit_2.webp'),
            public_path('images/benefit_3.webp'),
        ];

        $productNames = [
            'Product A',
            'Product B',
            'Product C',
            'Product D',
            'Product E',
            'Product F',
        ];

        $photosPerProduct = 3;

        foreach ($productNames as $name) {
            $product = Product::firstOrCreate(
                ['name' => $name],
                [
                    'price'         => rand(10000, 1000000),
                    'description'   => 'Best quality product',
                    'discount'      => 9000,
                    'quantity'      => rand(1, 100),
                    'shipping_time' => '7 Day',
                    'status'        => DB::raw('true'),
                    'category_id'   => 1,
                ]
            );

            $product->clearMediaCollection('product_image');

            $selected = Arr::random($allImages, min($photosPerProduct, count($allImages)));

            foreach ((array) $selected as $path) {
                $product->addMedia($path)
                    ->preservingOriginal()
                    ->toMediaCollection('product_image');
            }
        }
    }
}
