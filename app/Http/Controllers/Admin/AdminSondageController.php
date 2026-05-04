<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sondage;
use App\Models\QuestionSondage;
use App\Models\OptionQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSondageController extends Controller
{
    public function index(): Response
    {
        $sondages = Sondage::with('user')
            ->withCount('reponses')
            ->orderBy('created_at', 'desc')
            ->get();

        $counts = [
            'total'    => Sondage::count(),
            'brouillon' => Sondage::where('status', 'brouillon')->count(),
            'actif'    => Sondage::where('status', 'actif')->count(),
            'termine'  => Sondage::where('status', 'termine')->count(),
        ];

        return Inertia::render('admin/sondages', [
            'sondages' => $sondages,
            'counts'   => $counts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/sondages/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'titre'       => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'date_debut'  => ['nullable', 'date'],
            'date_fin'    => ['nullable', 'date', 'after_or_equal:date_debut'],
            'status'      => ['required', 'in:brouillon,actif,termine'],
            'audience'    => ['required', 'in:tous,quartier,categorie'],
            'questions'   => ['required', 'array', 'min:1'],
            'questions.*.texte' => ['required', 'string'],
            'questions.*.type'  => ['required', 'in:radio,checkbox,texte'],
            'questions.*.options' => ['nullable', 'array'],
            'questions.*.options.*.texte' => ['required_unless:questions.*.type,texte', 'string'],
        ]);

        $sondage = Sondage::create([
            'titre'       => $validated['titre'],
            'description' => $validated['description'],
            'date_debut'  => $validated['date_debut'] ?? null,
            'date_fin'    => $validated['date_fin'] ?? null,
            'status'      => $validated['status'],
            'audience'    => $validated['audience'],
            'user_id'     => auth()->id(),
        ]);

        foreach ($validated['questions'] as $ordre => $questionData) {
            $question = QuestionSondage::create([
                'sondage_id' => $sondage->id,
                'texte'      => $questionData['texte'],
                'type'       => $questionData['type'],
                'ordre'      => $ordre,
            ]);

            if ($questionData['type'] !== 'texte' && !empty($questionData['options'])) {
                foreach ($questionData['options'] as $optOrdre => $optionData) {
                    OptionQuestion::create([
                        'question_id' => $question->id,
                        'texte'       => $optionData['texte'],
                        'ordre'       => $optOrdre,
                    ]);
                }
            }
        }

        return redirect()->route('admin.sondages.index')
            ->with('success', 'Sondage créé avec succès');
    }

    public function update(Request $request, Sondage $sondage): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:brouillon,actif,termine'],
        ]);

        $sondage->update($validated);

        return redirect()->back()->with('success', 'Sondage mis à jour');
    }

    public function destroy(Sondage $sondage): RedirectResponse
    {
        $sondage->delete();

        return redirect()->route('admin.sondages.index')
            ->with('success', 'Sondage supprimé');
    }
}
