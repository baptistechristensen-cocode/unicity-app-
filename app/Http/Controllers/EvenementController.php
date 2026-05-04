<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use App\Models\EvenementInteret;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EvenementController extends Controller
{
    public function index(Request $request): Response
    {
        $theme = $request->query('theme');

        $query = Evenement::withCount('interets')
            ->orderBy('date_debut', 'asc')
            ->where('date_debut', '>=', now()->startOfDay());

        if ($theme && in_array($theme, ['sport', 'culture', 'citoyennete', 'environnement', 'autre'])) {
            $query->where('theme', $theme);
        }

        $evenements = $query->get()->map(function ($evenement) {
            $evenement->est_interesse = $evenement->interets()
                ->where('user_id', auth()->id())
                ->exists();
            return $evenement;
        });

        return Inertia::render('agenda/index', [
            'evenements'   => $evenements,
            'currentTheme' => $theme,
        ]);
    }

    public function show(Evenement $evenement): Response
    {
        $evenement->loadCount('interets');
        $estInteresse = $evenement->interets()
            ->where('user_id', auth()->id())
            ->exists();

        return Inertia::render('agenda/show', [
            'evenement'    => $evenement,
            'estInteresse' => $estInteresse,
        ]);
    }

    public function toggleInteret(Evenement $evenement): RedirectResponse
    {
        $existing = EvenementInteret::where('evenement_id', $evenement->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            EvenementInteret::create([
                'evenement_id' => $evenement->id,
                'user_id'      => auth()->id(),
            ]);
        }

        return redirect()->back();
    }
}
