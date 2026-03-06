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
        $role = $request->query('role');

        $query = User::orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role && in_array($role, ['Citoyen', 'Agent', 'Admin', 'Elu'])) {
            $query->where('role', $role);
        }

        $users = $query->get(['id', 'name', 'email', 'role', 'created_at']);

        $counts = [
            'total'   => User::count(),
            'Citoyen' => User::where('role', 'Citoyen')->count(),
            'Agent'   => User::where('role', 'Agent')->count(),
            'Admin'   => User::where('role', 'Admin')->count(),
            'Elu'     => User::where('role', 'Elu')->count(),
        ];

        return Inertia::render('admin/utilisateurs', [
            'users'   => $users,
            'counts'  => $counts,
            'filters' => ['search' => $search, 'role' => $role],
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'in:Citoyen,Agent,Admin,Elu'],
        ]);

        $user->update(['role' => $validated['role']]);

        return redirect()->back()->with('success', 'Role mis a jour');
    }
}
