<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UpdateTestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update admin user
        $adminUser = User::where('email', 'admin@bonilms.com')->first();
        if ($adminUser) {
            $adminUser->update([
                'email_verified_at' => now(),
            ]);
        } else {
            // Create if doesn't exist
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@bonilms.com',
                'password' => Hash::make('password'),
                'role_id' => \App\Models\Role::where('name', 'admin')->first()->id,
                'email_verified_at' => now(),
            ]);
        }

        // Update instructor user
        $instructorUser = User::where('email', 'instructor@bonilms.com')->first();
        if ($instructorUser) {
            $instructorUser->update([
                'email_verified_at' => now(),
            ]);
        } else {
            User::create([
                'name' => 'Instructor User',
                'email' => 'instructor@bonilms.com',
                'password' => Hash::make('password'),
                'role_id' => \App\Models\Role::where('name', 'instructor')->first()->id,
                'email_verified_at' => now(),
            ]);
        }

        // Update student user
        $studentUser = User::where('email', 'student@bonilms.com')->first();
        if ($studentUser) {
            $studentUser->update([
                'email_verified_at' => now(),
            ]);
        } else {
            User::create([
                'name' => 'Student User',
                'email' => 'student@bonilms.com',
                'password' => Hash::make('password'),
                'role_id' => \App\Models\Role::where('name', 'student')->first()->id,
                'email_verified_at' => now(),
            ]);
        }

        $this->command->info('Test users updated with verified emails!');
        $this->command->info('You can now login to the dashboard.');
    }
}
