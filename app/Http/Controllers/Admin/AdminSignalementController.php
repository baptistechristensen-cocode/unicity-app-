<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Signalement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSignalementController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = Signalement::with('user')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($status && in_array($status, ['enregistre', 'en_cours', 'resolu', 'rejete'])) {
            $query->where('status', $status);
        }

        $signalements = $query->get();

        $counts = [
            'total'      => Signalement::count(),
            'enregistre' => Signalement::where('status', 'enregistre')->count(),
            'en_cours'   => Signalement::where('status', 'en_cours')->count(),
            'resolu'     => Signalement::where('status', 'resolu')->count(),
            'rejete'     => Signalement::where('status', 'rejete')->count(),
        ];

        return Inertia::render('admin/signalements', [
            'signalements' => $signalements,
            'counts' => $counts,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function update(Request $request, Signalement $signalement): RedirectResponse
    {
        $validated = $request->validate([
            'status'      => ['sometimes', 'in:enregistre,en_cours,resolu,rejete'],
            'titre'       => ['sometimes', 'string', 'max:255'],
            'commentaire' => ['nullable', 'string'],
        ]);

        $changes = [];

        if (isset($validated['titre'])) {
            $changes['titre'] = $validated['titre'];
        }

        if (array_key_exists('commentaire', $validated)) {
            $changes['commentaire'] = $validated['commentaire'];
        }

        if (isset($validated['status'])) {
            $oldStatus = $signalement->status;
            $changes['status'] = $validated['status'];

            $signalement->update($changes);

            if ($oldStatus !== $validated['status']) {
                $signalement->timelines()->create([
                    'status'      => $validated['status'],
                    'description' => $this->getStatusDescription($validated['status']),
                ]);
            }
        } else {
            $signalement->update($changes);
        }

        return redirect()->back()->with('success', 'Signalement mis à jour');
    }

    private function getStatusDescription(string $status): string
    {
        return match ($status) {
            'enregistre' => 'Signalement enregistré',
            'en_cours'   => 'Signalement pris en charge par les services municipaux',
            'resolu'     => 'Signalement résolu',
            'rejete'     => 'Signalement rejeté',
            default      => 'Statut mis à jour',
        };
    }
}
