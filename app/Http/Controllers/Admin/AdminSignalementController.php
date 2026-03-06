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

        if ($status && in_array($status, ['enregistre', 'en_cours', 'resolu'])) {
            $query->where('status', $status);
        }

        $signalements = $query->get();

        $counts = [
            'total' => Signalement::count(),
            'enregistre' => Signalement::where('status', 'enregistre')->count(),
            'en_cours' => Signalement::where('status', 'en_cours')->count(),
            'resolu' => Signalement::where('status', 'resolu')->count(),
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
            'status' => ['required', 'in:enregistre,en_cours,resolu'],
            'comment' => ['nullable', 'string'],
        ]);

        $oldStatus = $signalement->status;
        $signalement->update(['status' => $validated['status']]);

        if ($oldStatus !== $validated['status']) {
            $signalement->timelines()->create([
                'status' => $validated['status'],
                'description' => $validated['comment'] ?? $this->getStatusDescription($validated['status']),
            ]);
        }

        return redirect()->back()->with('success', 'Signalement mis a jour');
    }

    private function getStatusDescription(string $status): string
    {
        return match ($status) {
            'enregistre' => 'Signalement enregistre',
            'en_cours' => 'Signalement pris en charge par les services municipaux',
            'resolu' => 'Signalement resolu',
            default => 'Statut mis a jour',
        };
    }
}
