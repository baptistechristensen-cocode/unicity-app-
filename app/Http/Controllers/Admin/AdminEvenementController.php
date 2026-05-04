<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminEvenementController extends Controller
{
    public function index(): Response
    {
        $evenements = Evenement::with('user')
            ->withCount('interets')
            ->orderBy('date_debut', 'asc')
            ->get();

        $counts = [
            'total'       => Evenement::count(),
            'a_venir'     => Evenement::where('date_debut', '>=', now())->count(),
            'passes'      => Evenement::where('date_debut', '<', now())->count(),
        ];

        return Inertia::render('admin/agenda', [
            'evenements' => $evenements,
            'counts'     => $counts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/agenda/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'titre'       => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'date_debut'  => ['required', 'date'],
            'lieu'        => ['required', 'string', 'max:255'],
            'theme'       => ['required', 'in:sport,culture,citoyennete,environnement,autre'],
            'organisateur' => ['required', 'string', 'max:255'],
            'banniere'    => ['nullable', 'image', 'max:5120'],
        ]);

        $bannierePath = null;
        if ($request->hasFile('banniere')) {
            $bannierePath = $request->file('banniere')->store('evenements', 'public');
        }

        Evenement::create([
            'titre'       => $validated['titre'],
            'description' => $validated['description'],
            'date_debut'  => $validated['date_debut'],
            'lieu'        => $validated['lieu'],
            'theme'       => $validated['theme'],
            'organisateur' => $validated['organisateur'],
            'banniere'    => $bannierePath,
            'user_id'     => auth()->id(),
        ]);

        return redirect()->route('admin.agenda.index')
            ->with('success', 'Événement publié avec succès');
    }

    public function update(Request $request, Evenement $evenement): RedirectResponse
    {
        $validated = $request->validate([
            'titre'       => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'date_debut'  => ['sometimes', 'date'],
            'lieu'        => ['sometimes', 'string', 'max:255'],
            'theme'       => ['sometimes', 'in:sport,culture,citoyennete,environnement,autre'],
            'organisateur' => ['sometimes', 'string', 'max:255'],
        ]);

        $evenement->update($validated);

        return redirect()->back()->with('success', 'Événement mis à jour');
    }

    public function destroy(Evenement $evenement): RedirectResponse
    {
        if ($evenement->banniere) {
            Storage::disk('public')->delete($evenement->banniere);
        }

        $evenement->delete();

        return redirect()->route('admin.agenda.index')
            ->with('success', 'Événement supprimé');
    }
}
