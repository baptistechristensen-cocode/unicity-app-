<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminSignalementController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\SignalementController;
use App\Models\Signalement;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    $totalSignalements = Signalement::count();
    $resolus = Signalement::where('status', 'resolu')->count();
    $tauxResolution = $totalSignalements > 0 ? round(($resolus / $totalSignalements) * 100) : 0;

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'stats' => [
            'totalUsers' => User::count(),
            'totalSignalements' => $totalSignalements,
            'tauxResolution' => $tauxResolution,
        ],
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $recentSignalements = Signalement::with('user')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $stats = [
            'total' => Signalement::where('user_id', auth()->id())->count(),
            'en_cours' => Signalement::where('user_id', auth()->id())->where('status', 'en_cours')->count(),
            'resolu' => Signalement::where('user_id', auth()->id())->where('status', 'resolu')->count(),
        ];

        return Inertia::render('dashboard', [
            'recentSignalements' => $recentSignalements,
            'stats' => $stats,
        ]);
    })->name('dashboard');

    // Signalements routes
    Route::get('signalements', [SignalementController::class, 'index'])->name('signalements.index');
    Route::get('signalements/create', [SignalementController::class, 'create'])->name('signalements.create');
    Route::post('signalements', [SignalementController::class, 'store'])->name('signalements.store');
    Route::get('signalements/{signalement}', [SignalementController::class, 'show'])->name('signalements.show');
    Route::patch('signalements/{signalement}', [SignalementController::class, 'update'])->name('signalements.update');
});

// Admin routes — tableau de bord signalements (Admin, Elu, Agent)
Route::middleware(['auth', 'verified', 'role:Admin,Elu,Agent'])->prefix('admin')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('admin.index');
    Route::get('signalements', [AdminSignalementController::class, 'index'])->name('admin.signalements.index');
    Route::patch('signalements/{signalement}', [AdminSignalementController::class, 'update'])->name('admin.signalements.update');
});

// Admin routes — gestion utilisateurs (Admin uniquement)
Route::middleware(['auth', 'verified', 'role:Admin'])->prefix('admin')->group(function () {
    Route::get('utilisateurs', [AdminUserController::class, 'index'])->name('admin.utilisateurs.index');
    Route::patch('utilisateurs/{user}', [AdminUserController::class, 'updateRole'])->name('admin.utilisateurs.update');
});

require __DIR__.'/settings.php';
