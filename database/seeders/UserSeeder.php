<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $adminRole = Role::where('name', 'admin')->first();
        $instructorRole = Role::where('name', 'instructor')->first();
        $studentRole = Role::where('name', 'student')->first();

        // Create Admin User
        User::firstOrCreate(
            ['email' => 'admin@bonilms.com'],
            [
                'name' => 'BoniLMS Admin',
                'password' => bcrypt('password'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ]
        );

        // Create Instructor User
        User::firstOrCreate(
            ['email' => 'instructor@bonilms.com'],
            [
                'name' => 'John Instructor',
                'password' => bcrypt('password'),
                'role_id' => $instructorRole->id,
                'email_verified_at' => now(),
            ]
        );

        // Create Student User
        User::firstOrCreate(
            ['email' => 'student@bonilms.com'],
            [
                'name' => 'Sarah Student',
                'password' => bcrypt('password'),
                'role_id' => $studentRole->id,
                'email_verified_at' => now(),
            ]
        );

        // Create additional sample users for testing
        $sampleInstructors = [
            [
                'name' => 'Dr. Maria Rodriguez',
                'email' => 'maria@instructor.com',
            ],
            [
                'name' => 'Prof. Ahmed Hassan',
                'email' => 'ahmed@instructor.com',
            ],
            [
                'name' => 'Lisa Chen',
                'email' => 'lisa@instructor.com',
            ],
        ];

        foreach ($sampleInstructors as $instructor) {
            User::firstOrCreate(
                ['email' => $instructor['email']],
                [
                    'name' => $instructor['name'],
                    'password' => bcrypt('password'),
                    'role_id' => $instructorRole->id,
                    'email_verified_at' => now(),
                ]
            );
        }

        // Create additional sample students
        $sampleStudents = [
            [
                'name' => 'Alex Johnson',
                'email' => 'alex@student.com',
            ],
            [
                'name' => 'Emma Wilson',
                'email' => 'emma@student.com',
            ],
            [
                'name' => 'Carlos Martinez',
                'email' => 'carlos@student.com',
            ],
            [
                'name' => 'Priya Sharma',
                'email' => 'priya@student.com',
            ],
            [
                'name' => 'David Lee',
                'email' => 'david@student.com',
            ],
        ];

        foreach ($sampleStudents as $student) {
            User::firstOrCreate(
                ['email' => $student['email']],
                [
                    'name' => $student['name'],
                    'password' => bcrypt('password'),
                    'role_id' => $studentRole->id,
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}