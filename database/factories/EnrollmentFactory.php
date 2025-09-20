<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enrollment>
 */
class EnrollmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'course_id' => \App\Models\Course::factory(),
            'enrolled_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'completed_at' => $this->faker->optional(0.3)->dateTimeBetween('-6 months', 'now'),
            'progress_percentage' => $this->faker->numberBetween(0, 100),
        ];
    }
}
