<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Publication>
 */
class PublicationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre'   => fake()->sentence(5),
            'contenu' => fake()->paragraphs(2, true),
            'image'   => null,
            'source'  => fake()->randomElement(['mairie', 'facebook', 'instagram', 'twitter']),
            'user_id' => User::factory(),
        ];
    }

    public function mairie(): static
    {
        return $this->state(['source' => 'mairie']);
    }
}
