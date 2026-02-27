<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $citoyenRole = Role::firstOrCreate(['name' => 'Citoyen']);
        $agentRole   = Role::firstOrCreate(['name' => 'Agent']);

        $citoyen = User::firstOrCreate(
            ['email' => 'citoyen@test.com'],
            [
                'name' => 'Citoyen Test',
                'password' => Hash::make('password'),
            ]
        );
        $citoyen->assignRole($citoyenRole);

        $agent = User::firstOrCreate(
            ['email' => 'agent@test.com'],
            [
                'name' => 'Agent Test',
                'password' => Hash::make('password'),
            ]
        );
        $agent->assignRole($agentRole);
    }
}
