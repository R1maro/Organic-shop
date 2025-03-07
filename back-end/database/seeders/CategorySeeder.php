<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Electronics',
            'Fashion',
            'Home & Kitchen',
            'Sports & Outdoors',
            'Health & Beauty',
            'Toys & Games',
            'Automotive',
            'Books',
            'Music',
            'Movies & TV',
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
                'slug' => Str::slug($category),
                'description' => "This is the $category category.",
                'parent_id' => null,
                'status' => true,
            ]);
        }

    }
}
