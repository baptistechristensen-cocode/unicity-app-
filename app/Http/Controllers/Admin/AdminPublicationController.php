<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminPublicationController extends Controller
{
    public function index(): Response
    {
        $publications = Publication::with('user')
            ->withCount('likes')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/publications', [
            'publications' => $publications,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'titre'   => ['required', 'string', 'max:255'],
            'contenu' => ['required', 'string'],
            'source'  => ['required', 'in:mairie,facebook,instagram,twitter'],
            'image'   => ['nullable', 'image', 'max:5120'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('publications', 'public');
        }

        Publication::create([
            'titre'   => $validated['titre'],
            'contenu' => $validated['contenu'],
            'source'  => $validated['source'],
            'image'   => $imagePath,
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Publication créée avec succès');
    }

    public function destroy(Publication $publication): RedirectResponse
    {
        if ($publication->image) {
            Storage::disk('public')->delete($publication->image);
        }

        $publication->delete();

        return redirect()->back()->with('success', 'Publication supprimée');
    }
}
