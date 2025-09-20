<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Withdrawal>
 */
class WithdrawalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'instructor_id' => \App\Models\User::factory(),
            'amount' => $this->faker->randomFloat(2, 50, 1000),
            'currency' => 'USD',
            'status' => $this->faker->randomElement(['pending', 'approved', 'declined', 'processed']),
            'payment_method' => $this->faker->randomElement(['bank_transfer', 'paypal', 'stripe']),
            'account_details' => $this->faker->json(),
        ];
    }
}
