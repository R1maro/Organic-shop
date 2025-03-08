<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $productImages = [
            'product_image_1' => public_path('images/benefit_1.webp'),
            'product_image_2' => public_path('images/benefit_2.webp'),
            'product_image_3' => public_path('images/benefit_3.webp'),
            'product_image_4' => public_path('images/benefit_1.webp'),
            'product_image_5' => public_path('images/benefit_2.webp'),
            'product_image_6' => public_path('images/benefit_3.webp'),
        ];



        foreach ($productImages as $key => $imagePath) {
            $product = Product::firstOrCreate([
                'name' => $key,
                'price' => rand(10000, 1000000),
                'description' => 'Best quality product',
                'discount' => 9000,
                'quantity' => rand(1, 100),
                'shipping_time' =>  "7 Day",
                'status' => 1,
                'category_id' => 1,
            ]);
            $product->clearMediaCollection('product_image');

            $product->addMedia($imagePath)
                ->preservingOriginal()
                ->toMediaCollection('product_image');


        }


    }
}
