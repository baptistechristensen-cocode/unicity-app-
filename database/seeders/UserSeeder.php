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
        $adminRole   = Role::firstOrCreate(['name' => 'Admin']);
        $eluRole     = Role::firstOrCreate(['name' => 'Elu']);

        // Citoyen test user (actif pour les tests)
        $citoyen = User::firstOrCreate(
            ['email' => 'citoyen@test.com'],
            [
                'name'      => 'Citoyen Test',
                'password'  => Hash::make('password'),
                'role'      => 'Citoyen',
                'is_active' => true,
            ]
        );
        $citoyen->assignRole($citoyenRole);

        // Agent test user
        $agent = User::firstOrCreate(
            ['email' => 'agent@test.com'],
            [
                'name'      => 'Agent Test',
                'password'  => Hash::make('password'),
                'role'      => 'Agent',
                'is_active' => true,
            ]
        );
        $agent->assignRole($agentRole);

        // Admin test user
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name'      => 'Admin Test',
                'password'  => Hash::make('password'),
                'role'      => 'Admin',
                'is_active' => true,
            ]
        );
        $admin->assignRole($adminRole);

        // Elu test user
        $elu = User::firstOrCreate(
            ['email' => 'elu@test.com'],
            [
                'name'      => 'Jean Dupont (Elu)',
                'password'  => Hash::make('password'),
                'role'      => 'Elu',
                'is_active' => true,
            ]
        );
        $elu->assignRole($eluRole);
    }
}
