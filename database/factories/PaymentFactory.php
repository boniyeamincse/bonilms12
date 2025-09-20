<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
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
            'amount' => $this->faker->randomFloat(2, 10, 500),
            'currency' => 'USD',
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed', 'refunded']),
            'payment_method' => $this->faker->randomElement(['stripe', 'paypal']),
            'transaction_id' => $this->faker->uuid(),
        ];
    }
}
