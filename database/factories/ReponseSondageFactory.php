<?php

namespace Database\Factories;

use App\Models\Sondage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReponseSondage>
 */
class ReponseSondageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sondage_id' => Sondage::factory(),
            'user_id'    => User::factory(),
        ];
    }
}
