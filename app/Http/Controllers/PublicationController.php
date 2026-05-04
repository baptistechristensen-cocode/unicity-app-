<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\PublicationLike;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublicationController extends Controller
{
    public function index(): Response
    {
        $publications = Publication::with('user')
            ->withCount('likes')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($publication) {
                $publication->a_like = $publication->likes()
                    ->where('user_id', auth()->id())
                    ->exists();
                return $publication;
            });

        return Inertia::render('discussion/index', [
            'publications' => $publications,
        ]);
    }

    public function toggleLike(Publication $publication): RedirectResponse
    {
        $existing = PublicationLike::where('publication_id', $publication->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            PublicationLike::create([
                'publication_id' => $publication->id,
                'user_id'        => auth()->id(),
            ]);
        }

        return redirect()->back();
    }
}
