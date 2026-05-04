<?php

namespace App\Http\Controllers;

use App\Models\Sondage;
use App\Models\ReponseSondage;
use App\Models\ReponseQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SondageController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->query('filter', 'actif');

        $query = Sondage::withCount('reponses')
            ->orderBy('created_at', 'desc');

        if ($filter === 'actif') {
            $query->where('status', 'actif');
        } elseif ($filter === 'termine') {
            $query->where('status', 'termine');
        } elseif ($filter === 'mes_reponses') {
            $query->whereHas('reponses', fn($q) => $q->where('user_id', auth()->id()));
        } else {
            $query->where('status', 'actif');
        }

        $sondages = $query->get()->map(function ($sondage) {
            $sondage->a_repondu = $sondage->reponses()
                ->where('user_id', auth()->id())
                ->exists();
            return $sondage;
        });

        $counts = [
            'actif'       => Sondage::where('status', 'actif')->count(),
            'termine'     => Sondage::where('status', 'termine')->count(),
            'mes_reponses' => ReponseSondage::where('user_id', auth()->id())->count(),
        ];

        return Inertia::render('sondages/index', [
            'sondages'     => $sondages,
            'counts'       => $counts,
            'currentFilter' => $filter,
        ]);
    }

    public function show(Sondage $sondage): Response
    {
        if (!in_array($sondage->status, ['actif', 'termine'])) {
            abort(404);
        }

        $aRepondu = $sondage->reponses()
            ->where('user_id', auth()->id())
            ->exists();

        if ($aRepondu || $sondage->status === 'termine') {
            return $this->resultats($sondage);
        }

        $sondage->load(['questions.options']);

        return Inertia::render('sondages/show', [
            'sondage'  => $sondage,
            'aRepondu' => $aRepondu,
        ]);
    }

    public function store(Request $request, Sondage $sondage): RedirectResponse
    {
        if ($sondage->status !== 'actif') {
            return redirect()->back()->withErrors(['sondage' => 'Ce sondage n\'est plus actif.']);
        }

        $alreadyAnswered = $sondage->reponses()
            ->where('user_id', auth()->id())
            ->exists();

        if ($alreadyAnswered) {
            return redirect()->back()->withErrors(['sondage' => 'Vous avez déjà répondu à ce sondage.']);
        }

        $request->validate([
            'reponses'   => ['required', 'array'],
            'reponses.*' => ['nullable'],
        ]);

        $reponseSondage = ReponseSondage::create([
            'sondage_id' => $sondage->id,
            'user_id'    => auth()->id(),
        ]);

        foreach ($request->reponses as $questionId => $valeur) {
            if ($valeur === null || $valeur === '') {
                continue;
            }

            $question = $sondage->questions()->find($questionId);
            if (!$question) {
                continue;
            }

            if ($question->type === 'texte') {
                ReponseQuestion::create([
                    'reponse_sondage_id' => $reponseSondage->id,
                    'question_id'        => $questionId,
                    'texte'              => $valeur,
                ]);
            } elseif ($question->type === 'checkbox' && is_array($valeur)) {
                foreach ($valeur as $optionId) {
                    ReponseQuestion::create([
                        'reponse_sondage_id' => $reponseSondage->id,
                        'question_id'        => $questionId,
                        'option_id'          => $optionId,
                    ]);
                }
            } else {
                ReponseQuestion::create([
                    'reponse_sondage_id' => $reponseSondage->id,
                    'question_id'        => $questionId,
                    'option_id'          => $valeur,
                ]);
            }
        }

        return redirect()->route('sondages.resultats', $sondage)
            ->with('success', 'Merci pour votre participation !');
    }

    public function resultats(Sondage $sondage): Response
    {
        $sondage->load(['questions.options']);

        $totalReponses = $sondage->reponses()->count();

        $questions = $sondage->questions->map(function ($question) use ($totalReponses) {
            $resultat = [];

            if ($question->type !== 'texte') {
                foreach ($question->options as $option) {
                    $votes = ReponseQuestion::where('question_id', $question->id)
                        ->where('option_id', $option->id)
                        ->count();

                    $resultat[] = [
                        'id'         => $option->id,
                        'texte'      => $option->texte,
                        'votes'      => $votes,
                        'pourcentage' => $totalReponses > 0 ? round(($votes / $totalReponses) * 100) : 0,
                    ];
                }
            } else {
                $textes = ReponseQuestion::where('question_id', $question->id)
                    ->whereNotNull('texte')
                    ->pluck('texte')
                    ->take(5)
                    ->toArray();

                $resultat = ['textes' => $textes];
            }

            return [
                'id'       => $question->id,
                'texte'    => $question->texte,
                'type'     => $question->type,
                'resultat' => $resultat,
            ];
        });

        $aRepondu = $sondage->reponses()
            ->where('user_id', auth()->id())
            ->exists();

        return Inertia::render('sondages/resultats', [
            'sondage'       => $sondage,
            'questions'     => $questions,
            'totalReponses' => $totalReponses,
            'aRepondu'      => $aRepondu,
        ]);
    }
}
