<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SignalementController extends Controller
{
    public function store(Request $request)
    {
        // Sécurité métier : uniquement Citoyen
        if (auth()->user()->role !== 'Citoyen') {
            abort(403);
        }

        $validated = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ]);

        Signalement::create([
            'titre' => $validated['titre'],
            'description' => $validated['description'],
            'user_id' => auth()->id(),
        ]);

        return redirect()->back();
    }
}
