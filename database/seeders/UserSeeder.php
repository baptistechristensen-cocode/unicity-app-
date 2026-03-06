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

        // Citoyen test user
        $citoyen = User::firstOrCreate(
            ['email' => 'citoyen@test.com'],
            [
                'name' => 'Citoyen Test',
                'password' => Hash::make('password'),
                'role' => 'Citoyen',
            ]
        );
        $citoyen->assignRole($citoyenRole);

        // Agent test user
        $agent = User::firstOrCreate(
            ['email' => 'agent@test.com'],
            [
                'name' => 'Agent Test',
                'password' => Hash::make('password'),
                'role' => 'Agent',
            ]
        );
        $agent->assignRole($agentRole);

        // Admin test user
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin Test',
                'password' => Hash::make('password'),
                'role' => 'Admin',
            ]
        );
        $admin->assignRole($adminRole);

        // Elu test user
        $elu = User::firstOrCreate(
            ['email' => 'elu@test.com'],
            [
                'name' => 'Jean Dupont (Elu)',
                'password' => Hash::make('password'),
                'role' => 'Elu',
            ]
        );
        $elu->assignRole($eluRole);
    }
}
