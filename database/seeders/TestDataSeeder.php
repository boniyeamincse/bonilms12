<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get instructors
        $instructors = User::whereHas('role', function ($query) {
            $query->where('name', 'instructor');
        })->get();

        // Get students
        $students = User::whereHas('role', function ($query) {
            $query->where('name', 'student');
        })->get();

        // Create sample courses
        $courses = [
            [
                'title' => 'Complete Web Development Bootcamp',
                'slug' => 'complete-web-development-bootcamp',
                'description' => 'Learn modern web development from scratch with HTML, CSS, JavaScript, React, and Node.js',
                'price' => 99.99,
                'instructor_id' => $instructors->first()->id,
                'status' => 'published',
                'is_featured' => true,
                'image' => 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Web+Dev',
            ],
            [
                'title' => 'Advanced Laravel Development',
                'slug' => 'advanced-laravel-development',
                'description' => 'Master Laravel framework with advanced concepts, APIs, and real-world projects',
                'price' => 79.99,
                'instructor_id' => $instructors->skip(1)->first()->id ?? $instructors->first()->id,
                'status' => 'published',
                'is_featured' => true,
                'image' => 'https://via.placeholder.com/400x250/DC2626/FFFFFF?text=Laravel',
            ],
            [
                'title' => 'Data Science with Python',
                'slug' => 'data-science-with-python',
                'description' => 'Learn data analysis, machine learning, and visualization with Python',
                'price' => 89.99,
                'instructor_id' => $instructors->skip(2)->first()->id ?? $instructors->first()->id,
                'status' => 'published',
                'is_featured' => false,
                'image' => 'https://via.placeholder.com/400x250/059669/FFFFFF?text=Data+Science',
            ],
            [
                'title' => 'Mobile App Development with React Native',
                'slug' => 'mobile-app-development-react-native',
                'description' => 'Build cross-platform mobile apps with React Native',
                'price' => 69.99,
                'instructor_id' => $instructors->first()->id,
                'status' => 'published',
                'is_featured' => false,
                'image' => 'https://via.placeholder.com/400x250/7C3AED/FFFFFF?text=React+Native',
            ],
            [
                'title' => 'Digital Marketing Mastery',
                'slug' => 'digital-marketing-mastery',
                'description' => 'Complete guide to SEO, social media marketing, and online advertising',
                'price' => 59.99,
                'instructor_id' => $instructors->skip(1)->first()->id ?? $instructors->first()->id,
                'status' => 'published',
                'is_featured' => false,
                'image' => 'https://via.placeholder.com/400x250/EA580C/FFFFFF?text=Digital+Marketing',
            ],
        ];

        foreach ($courses as $courseData) {
            Course::firstOrCreate(
                ['slug' => $courseData['slug']],
                $courseData
            );
        }

        // Create enrollments
        $courses = Course::all();
        foreach ($students as $student) {
            // Each student enrolls in 2-4 random courses
            $randomCourses = $courses->random(rand(2, 4));

            foreach ($randomCourses as $course) {
                $isCompleted = rand(0, 1); // 50% chance of completion
                Enrollment::firstOrCreate(
                    [
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                    ],
                    [
                        'enrolled_at' => now()->subDays(rand(1, 30)),
                        'completed_at' => $isCompleted ? now()->subDays(rand(1, 15)) : null,
                        'progress' => $isCompleted ? 100.00 : rand(10, 90) * 1.0,
                    ]
                );
            }
        }

        // Create payments for completed enrollments
        $completedEnrollments = Enrollment::whereNotNull('completed_at')->get();

        foreach ($completedEnrollments as $enrollment) {
            Payment::create([
                'user_id' => $enrollment->user_id,
                'course_id' => $enrollment->course_id,
                'amount' => $enrollment->course->price,
                'gateway' => collect(['stripe', 'paypal', 'bank_transfer', 'offline'])->random(),
                'status' => 'completed',
                'transaction_id' => 'txn_' . rand(100000, 999999),
                'metadata' => ['source' => 'seeder'],
            ]);
        }

        // Create some pending payments
        $pendingEnrollments = Enrollment::whereNull('completed_at')->take(5)->get();

        foreach ($pendingEnrollments as $enrollment) {
            Payment::create([
                'user_id' => $enrollment->user_id,
                'course_id' => $enrollment->course_id,
                'amount' => $enrollment->course->price,
                'gateway' => collect(['stripe', 'paypal', 'bank_transfer'])->random(),
                'status' => 'pending',
                'transaction_id' => null,
                'metadata' => ['source' => 'seeder'],
            ]);
        }

        // Create reviews for completed courses
        foreach ($completedEnrollments->take(20) as $enrollment) {
            Review::firstOrCreate(
                [
                    'user_id' => $enrollment->user_id,
                    'course_id' => $enrollment->course_id,
                ],
                [
                    'rating' => rand(3, 5), // 3-5 star ratings
                    'review' => collect([
                        'Great course! Very comprehensive and well explained.',
                        'Excellent content and practical examples.',
                        'Highly recommended for beginners and intermediates.',
                        'The instructor is very knowledgeable and engaging.',
                        'Good course structure and clear explanations.',
                    ])->random(),
                ]
            );
        }

        $this->command->info('Test data seeded successfully!');
        $this->command->info('Created ' . $courses->count() . ' courses');
        $this->command->info('Created ' . $completedEnrollments->count() . ' enrollments');
        $this->command->info('Created ' . Payment::count() . ' payments');
        $this->command->info('Created ' . Review::count() . ' reviews');
    }
}
