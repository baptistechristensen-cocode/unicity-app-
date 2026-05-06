<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $role   = $request->query('role');
        $status = $request->query('status');

        $query = User::orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role && in_array($role, ['Citoyen', 'Association', 'Agent', 'Admin', 'Elu'])) {
            $query->where('role', $role);
        }

        if ($status === 'en_attente') {
            $query->where('is_active', false);
        }

        $users = $query->get(['id', 'name', 'email', 'role', 'is_active', 'created_at']);

        $counts = [
            'total'       => User::count(),
            'en_attente'  => User::where('is_active', false)->count(),
            'Citoyen'     => User::where('role', 'Citoyen')->count(),
            'Association' => User::where('role', 'Association')->count(),
            'Agent'       => User::where('role', 'Agent')->count(),
            'Admin'       => User::where('role', 'Admin')->count(),
            'Elu'         => User::where('role', 'Elu')->count(),
        ];

        return Inertia::render('admin/utilisateurs', [
            'users'   => $users,
            'counts'  => $counts,
            'filters' => ['search' => $search, 'role' => $role, 'status' => $status],
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'in:Citoyen,Association,Agent,Admin,Elu'],
        ]);

        $user->update(['role' => $validated['role']]);

        return redirect()->back()->with('success', 'Rôle mis à jour');
    }

    public function toggleActive(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Vous ne pouvez pas désactiver votre propre compte.');
        }

        $user->update(['is_active' => ! $user->is_active]);

        $message = $user->is_active ? 'Compte activé.' : 'Compte désactivé.';

        return redirect()->back()->with('success', $message);
    }
}
