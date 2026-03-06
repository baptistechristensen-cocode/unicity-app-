<?php

namespace App\Http\Controllers;

use App\Models\Signalement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SignalementController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');

        $query = Signalement::with('user')
            ->orderBy('created_at', 'desc');

        if ($status === 'resolu') {
            $query->where('status', 'resolu');
        } elseif ($status && in_array($status, ['enregistre', 'en_cours'])) {
            $query->where('status', $status);
        } else {
            $query->where('status', '!=', 'resolu');
        }

        $signalements = $query->paginate(12)->withQueryString();

        $counts = [
            'total' => Signalement::where('status', '!=', 'resolu')->count(),
            'enregistre' => Signalement::where('status', 'enregistre')->count(),
            'en_cours' => Signalement::where('status', 'en_cours')->count(),
            'resolu' => Signalement::where('status', 'resolu')->count(),
        ];

        return Inertia::render('signalements/index', [
            'signalements' => $signalements,
            'counts' => $counts,
            'currentStatus' => $status,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('signalements/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'in:voirie,eclairage,proprete,autre'],
            'location' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('signalements', 'public');
        }

        Signalement::create([
            'titre' => $validated['titre'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'location' => $validated['location'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'photo' => $photoPath,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('signalements.index')
            ->with('success', 'Signalement cree avec succes');
    }

    public function show(Signalement $signalement): Response
    {
        $this->authorize('view', $signalement);

        $signalement->load(['user', 'timelines']);

        return Inertia::render('signalements/show', [
            'signalement' => $signalement,
        ]);
    }

    public function update(Request $request, Signalement $signalement): RedirectResponse
    {
        $this->authorize('update', $signalement);

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

        return redirect()->back()
            ->with('success', 'Signalement mis a jour');
    }

    private function getStatusDescription(string $status): string
    {
        return match ($status) {
            'enregistre' => 'Signalement enregistre',
            'en_cours' => 'Signalement pris en charge',
            'resolu' => 'Signalement resolu',
            default => 'Statut mis a jour',
        };
    }
}
