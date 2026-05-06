<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Signalement>
 */
class SignalementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre'       => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'category'    => fake()->randomElement(['voirie', 'eclairage', 'proprete', 'autre']),
            'status'      => 'enregistre',
            'location'    => fake()->address(),
            'latitude'    => fake()->latitude(48.8, 48.9),
            'longitude'   => fake()->longitude(2.3, 2.4),
            'photo'       => null,
            'commentaire' => null,
            'user_id'     => User::factory(),
        ];
    }

    public function enCours(): static
    {
        return $this->state(['status' => 'en_cours']);
    }

    public function resolu(): static
    {
        return $this->state(['status' => 'resolu']);
    }

    public function rejete(): static
    {
        return $this->state(['status' => 'rejete']);
    }
}
