<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
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
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->optional(0.7)->paragraph(),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
