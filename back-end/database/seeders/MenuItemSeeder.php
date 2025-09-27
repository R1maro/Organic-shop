<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MenuItem::insert([
            [
                'name' => 'Home',
                'url' => '/',
                'icon' => 'Home',
                'order' => 1,
                'parent_id' => null,
                'is_active' => DB::raw('TRUE'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'About Us',
                'url' => '/about',
                'icon' => 'User',
                'order' => 2,
                'parent_id' => null,
                'is_active' => DB::raw('TRUE'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        MenuItem::insert([
            [
                'name' => 'Services',
                'url' => '/services',
                'order' => 3,
                'parent_id' => null,
                'is_active' => DB::raw('TRUE'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Contact',
                'url' => '/contact',
                'order' => 4,
                'parent_id' => null,
                'is_active' => DB::raw('TRUE'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
