<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Define permissions
        $permissions = [
            ['name' => 'View Dashboard', 'slug' => 'view-dashboard'],
            ['name' => 'Manage Users', 'slug' => 'manage-users'],
            ['name' => 'Edit Content', 'slug' => 'edit-content'],
        ];

        foreach ($permissions as $permissionData) {
            Permission::updateOrCreate([
                'name' => $permissionData['name'],
                'slug' => $permissionData['slug']
            ], $permissionData);
        }

        // Define roles
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Has access to all features.',
                'permissions' => ['view-dashboard', 'manage-users', 'edit-content'],
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Regular user with limited access.',
                'permissions' => ['view-dashboard'],
            ],
        ];

        foreach ($roles as $roleData) {
            $role = Role::updateOrCreate(['slug' => $roleData['slug']], [
                'name' => $roleData['name'],
                'description' => $roleData['description'],
            ]);

            // Attach permissions to role
            $permissions = Permission::whereIn('slug', $roleData['permissions'])->get();
            $role->permissions()->sync($permissions->pluck('id'));
        }

        // Assign admin role to a user
        $adminRole = Role::where('slug', 'admin')->first();

        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'is_admin' => true,
            ]);
        }

        $user->roles()->syncWithoutDetaching([$adminRole->id]);

        $this->command->info('Roles and permissions seeded, and admin user assigned!');
    }
}
