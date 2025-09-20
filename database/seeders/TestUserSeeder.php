<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get role IDs
        $adminRole = Role::where('name', 'admin')->first();
        $instructorRole = Role::where('name', 'instructor')->first();
        $studentRole = Role::where('name', 'student')->first();

        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@bonilms.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ]
        );

        // Create instructor user
        User::firstOrCreate(
            ['email' => 'instructor@bonilms.com'],
            [
                'name' => 'Instructor User',
                'password' => Hash::make('password'),
                'role_id' => $instructorRole->id,
                'email_verified_at' => now(),
            ]
        );

        // Create student user
        User::firstOrCreate(
            ['email' => 'student@bonilms.com'],
            [
                'name' => 'Student User',
                'password' => Hash::make('password'),
                'role_id' => $studentRole->id,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Test users created successfully!');
        $this->command->info('Admin: admin@bonilms.com / password');
        $this->command->info('Instructor: instructor@bonilms.com / password');
        $this->command->info('Student: student@bonilms.com / password');
    }
}
