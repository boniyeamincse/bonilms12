<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Category;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Withdrawal;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MockDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Skip if data already exists
        if (User::where('role_id', '>', 1)->count() > 5) {
            $this->command->info('Mock data already exists. Skipping...');
            return;
        }

        // Create additional users with different roles
        $admin = User::firstOrCreate([
            'email' => 'admin@bonilms.com'
        ], [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
            'role_id' => 1,
            'email_verified_at' => now(),
        ]);

        $instructors = User::factory()->count(5)->create([
            'role_id' => 2, // instructor
        ]);

        $students = User::factory()->count(20)->create([
            'role_id' => 3, // student
        ]);

        // Create categories
        $categories = Category::factory()->count(8)->create();

        // Create courses
        $courses = [];
        foreach ($instructors as $instructor) {
            $courseCount = rand(1, 4);
            for ($i = 0; $i < $courseCount; $i++) {
                $courses[] = Course::factory()->create([
                    'instructor_id' => $instructor->id,
                    'category_id' => $categories->random()->id,
                    'status' => ['draft', 'pending', 'published'][rand(0, 2)],
                    'is_featured' => rand(0, 10) > 8, // 20% chance of being featured
                ]);
            }
        }

        // Create enrollments and payments
        foreach ($students as $student) {
            $enrolledCourses = collect($courses)->random(rand(1, 5));
            foreach ($enrolledCourses as $course) {
                if ($course->status === 'published') {
                    Enrollment::factory()->create([
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                    ]);

                    Payment::factory()->create([
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                        'amount' => $course->price,
                        'status' => 'completed',
                    ]);
                }
            }
        }

        // Create reviews for some enrollments
        $enrollments = Enrollment::all();
        foreach ($enrollments->random(min(30, $enrollments->count())) as $enrollment) {
            Review::factory()->create([
                'user_id' => $enrollment->user_id,
                'course_id' => $enrollment->course_id,
                'rating' => rand(3, 5),
            ]);
        }

        // Create some withdrawals for instructors
        foreach ($instructors->random(3) as $instructor) {
            Withdrawal::factory()->create([
                'instructor_id' => $instructor->id,
                'amount' => rand(100, 1000),
                'status' => ['pending', 'approved', 'processed'][rand(0, 2)],
            ]);
        }

        // Create some pending enrollments and payments
        for ($i = 0; $i < 5; $i++) {
            $student = $students->random();
            $course = collect($courses)->where('status', 'published')->random();

            Enrollment::factory()->create([
                'user_id' => $student->id,
                'course_id' => $course->id,
            ]);

            Payment::factory()->create([
                'user_id' => $student->id,
                'course_id' => $course->id,
                'amount' => $course->price,
                'status' => 'pending',
            ]);
        }

        $this->command->info('Mock data seeded successfully!');
        $this->command->info('Created:');
        $this->command->info('- 1 Admin user');
        $this->command->info('- 5 Instructor users');
        $this->command->info('- 20 Student users');
        $this->command->info('- 8 Categories');
        $this->command->info('- ' . count($courses) . ' Courses');
        $this->command->info('- Multiple enrollments, payments, reviews, and withdrawals');
    }
}
