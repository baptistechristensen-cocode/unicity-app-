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
        $mois  = (int) $request->query('mois',  now()->month);
        $annee = (int) $request->query('annee', now()->year);
        $vue   = $request->query('vue', 'liste');

        $validThemes = ['sport', 'culture', 'citoyennete', 'environnement', 'autre'];

        $query = Evenement::withCount('interets')->orderBy('date_debut', 'asc');

        if ($theme && in_array($theme, $validThemes)) {
            $query->where('theme', $theme);
        }

        if ($vue === 'calendrier') {
            $query->whereYear('date_debut', $annee)
                  ->whereMonth('date_debut', $mois);
        } else {
            $query->where('date_debut', '>=', now()->startOfDay());
        }

        $evenements = $query->get()->map(function ($e) {
            $e->est_interesse = $e->interets()->where('user_id', auth()->id())->exists();
            return $e;
        });

        return Inertia::render('agenda/index', [
            'evenements'   => $evenements,
            'currentTheme' => $theme,
            'vue'          => $vue,
            'mois'         => $mois,
            'annee'        => $annee,
        ]);
    }

    public function show(Evenement $evenement): Response
    {
        $evenement->loadCount('interets');
        $estInteresse = $evenement->interets()->where('user_id', auth()->id())->exists();

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
