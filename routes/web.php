<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminEvenementController;
use App\Http\Controllers\Admin\AdminPublicationController;
use App\Http\Controllers\Admin\AdminSignalementController;
use App\Http\Controllers\Admin\AdminSondageController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\SignalementController;
use App\Http\Controllers\SondageController;
use App\Models\Signalement;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Page accessible après connexion mais avant validation du compte
Route::middleware(['auth'])->get('/compte-en-attente', function () {
    return Inertia::render('compte-en-attente');
})->name('compte.en-attente');

// Routes citoyennes — compte doit être actif
Route::middleware(['auth', 'verified', 'active.user'])->group(function () {
    Route::get('dashboard', function () {
        $recentSignalements = Signalement::with('user')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $stats = [
            'total'    => Signalement::where('user_id', auth()->id())->count(),
            'en_cours' => Signalement::where('user_id', auth()->id())->where('status', 'en_cours')->count(),
            'resolu'   => Signalement::where('user_id', auth()->id())->where('status', 'resolu')->count(),
        ];

        return Inertia::render('dashboard', [
            'recentSignalements' => $recentSignalements,
            'stats' => $stats,
        ]);
    })->name('dashboard');

    // Signalements
    Route::get('signalements', [SignalementController::class, 'index'])->name('signalements.index');
    Route::get('signalements/create', [SignalementController::class, 'create'])->name('signalements.create');
    Route::post('signalements', [SignalementController::class, 'store'])->name('signalements.store');
    Route::get('signalements/{signalement}', [SignalementController::class, 'show'])->name('signalements.show');
    Route::patch('signalements/{signalement}', [SignalementController::class, 'update'])->name('signalements.update');

    // Sondages
    Route::get('sondages', [SondageController::class, 'index'])->name('sondages.index');
    Route::get('sondages/{sondage}/resultats', [SondageController::class, 'resultats'])->name('sondages.resultats');
    Route::get('sondages/{sondage}', [SondageController::class, 'show'])->name('sondages.show');
    Route::post('sondages/{sondage}/repondre', [SondageController::class, 'store'])->name('sondages.store');

    // Agenda
    Route::get('agenda', [EvenementController::class, 'index'])->name('agenda.index');
    Route::get('agenda/{evenement}', [EvenementController::class, 'show'])->name('agenda.show');
    Route::post('agenda/{evenement}/interet', [EvenementController::class, 'toggleInteret'])->name('agenda.interet');

    // Discussion
    Route::get('discussion', [PublicationController::class, 'index'])->name('discussion.index');
    Route::post('publications/{publication}/like', [PublicationController::class, 'toggleLike'])->name('publications.like');
});

// Admin routes — tableau de bord, signalements, sondages, agenda, publications (Admin, Elu, Agent)
Route::middleware(['auth', 'verified', 'role:Admin,Elu,Agent'])->prefix('admin')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('admin.index');

    Route::get('signalements', [AdminSignalementController::class, 'index'])->name('admin.signalements.index');
    Route::patch('signalements/{signalement}', [AdminSignalementController::class, 'update'])->name('admin.signalements.update');

    Route::get('sondages', [AdminSondageController::class, 'index'])->name('admin.sondages.index');
    Route::get('sondages/create', [AdminSondageController::class, 'create'])->name('admin.sondages.create');
    Route::post('sondages', [AdminSondageController::class, 'store'])->name('admin.sondages.store');
    Route::patch('sondages/{sondage}', [AdminSondageController::class, 'update'])->name('admin.sondages.update');
    Route::delete('sondages/{sondage}', [AdminSondageController::class, 'destroy'])->name('admin.sondages.destroy');

    Route::get('agenda', [AdminEvenementController::class, 'index'])->name('admin.agenda.index');
    Route::get('agenda/create', [AdminEvenementController::class, 'create'])->name('admin.agenda.create');
    Route::post('agenda', [AdminEvenementController::class, 'store'])->name('admin.agenda.store');
    Route::patch('agenda/{evenement}', [AdminEvenementController::class, 'update'])->name('admin.agenda.update');
    Route::delete('agenda/{evenement}', [AdminEvenementController::class, 'destroy'])->name('admin.agenda.destroy');

    Route::get('publications', [AdminPublicationController::class, 'index'])->name('admin.publications.index');
    Route::post('publications', [AdminPublicationController::class, 'store'])->name('admin.publications.store');
    Route::delete('publications/{publication}', [AdminPublicationController::class, 'destroy'])->name('admin.publications.destroy');

    // Validation des comptes — accessible à Admin, Elu et Agent
    Route::patch('utilisateurs/{user}/toggle-active', [AdminUserController::class, 'toggleActive'])->name('admin.utilisateurs.toggle-active');
});

// Admin routes — gestion utilisateurs complète (Admin uniquement)
Route::middleware(['auth', 'verified', 'role:Admin'])->prefix('admin')->group(function () {
    Route::get('utilisateurs', [AdminUserController::class, 'index'])->name('admin.utilisateurs.index');
    Route::patch('utilisateurs/{user}', [AdminUserController::class, 'updateRole'])->name('admin.utilisateurs.update');
});

require __DIR__.'/settings.php';
