<?php

namespace App\Policies;

use App\Models\Signalement;
use App\Models\User;

class SignalementPolicy
{
    public function view(User $user, Signalement $signalement): bool
    {
        return true;
    }

    public function update(User $user, Signalement $signalement): bool
    {
        return in_array($user->role, ['Admin', 'Elu', 'Agent']);
    }

    public function delete(User $user, Signalement $signalement): bool
    {
        return $user->id === $signalement->user_id || in_array($user->role, ['Admin', 'Elu']);
    }
}
