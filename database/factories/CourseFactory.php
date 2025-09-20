<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(6),
            'slug' => $this->faker->slug(),
            'description' => $this->faker->paragraphs(3, true),
            'instructor_id' => \App\Models\User::factory(),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'image' => $this->faker->imageUrl(),
            'status' => $this->faker->randomElement(['draft', 'pending', 'published', 'rejected']),
            'is_featured' => $this->faker->boolean(20),
            'category_id' => \App\Models\Category::factory(),
        ];
    }
}
