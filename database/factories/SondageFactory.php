<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sondage>
 */
class SondageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre'       => fake()->sentence(5),
            'description' => fake()->paragraph(),
            'date_debut'  => now()->subDay(),
            'date_fin'    => now()->addDays(7),
            'status'      => 'actif',
            'audience'    => 'tous',
            'user_id'     => User::factory(),
        ];
    }

    public function brouillon(): static
    {
        return $this->state(['status' => 'brouillon']);
    }

    public function termine(): static
    {
        return $this->state([
            'status'   => 'termine',
            'date_fin' => now()->subDay(),
        ]);
    }
}
