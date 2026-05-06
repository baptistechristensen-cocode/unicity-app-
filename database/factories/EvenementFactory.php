<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Evenement>
 */
class EvenementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre'        => fake()->sentence(4),
            'description'  => fake()->paragraph(),
            'date_debut'   => now()->addDays(fake()->numberBetween(1, 30)),
            'lieu'         => fake()->address(),
            'latitude'     => null,
            'longitude'    => null,
            'theme'        => fake()->randomElement(['sport', 'culture', 'citoyennete', 'environnement', 'autre']),
            'organisateur' => fake()->company(),
            'banniere'     => null,
            'user_id'      => User::factory(),
        ];
    }

    public function passe(): static
    {
        return $this->state([
            'date_debut' => now()->subDays(fake()->numberBetween(1, 30)),
        ]);
    }

    public function theme(string $theme): static
    {
        return $this->state(['theme' => $theme]);
    }
}
