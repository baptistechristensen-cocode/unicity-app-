<?php

namespace Tests;

use App\Models\User;
use Spatie\Permission\Models\Role;

trait WithRoles
{
    protected function setUpRoles(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (['Citoyen', 'Agent', 'Elu', 'Admin'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }
    }

    protected function createCitoyen(array $attrs = []): User
    {
        $user = User::factory()->create(array_merge(['role' => 'Citoyen'], $attrs));
        $user->assignRole('Citoyen');
        return $user;
    }

    protected function createAdmin(array $attrs = []): User
    {
        $user = User::factory()->create(array_merge(['role' => 'Admin'], $attrs));
        $user->assignRole('Admin');
        return $user;
    }

    protected function createAgent(array $attrs = []): User
    {
        $user = User::factory()->create(array_merge(['role' => 'Agent'], $attrs));
        $user->assignRole('Agent');
        return $user;
    }

    protected function createElu(array $attrs = []): User
    {
        $user = User::factory()->create(array_merge(['role' => 'Elu'], $attrs));
        $user->assignRole('Elu');
        return $user;
    }
}
