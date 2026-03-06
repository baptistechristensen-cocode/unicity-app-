<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Signalement;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        // KPIs
        $signalementsEnAttente = Signalement::where('status', 'enregistre')->count();
        $signalementsEnCours = Signalement::where('status', 'en_cours')->count();
        $signalementsResolus = Signalement::where('status', 'resolu')->count();
        $totalSignalements = Signalement::count();

        // Signalements cette semaine
        $signalementsThisWeek = Signalement::where('created_at', '>=', Carbon::now()->startOfWeek())->count();

        // Citoyens inscrits
        $totalUsers = User::count();
        $usersThisMonth = User::where('created_at', '>=', Carbon::now()->startOfMonth())->count();

        // Donnees pour le graphique
        $chartData = [
            ['name' => 'Enregistre', 'value' => $signalementsEnAttente, 'color' => '#95A5A6'],
            ['name' => 'En cours', 'value' => $signalementsEnCours, 'color' => '#E67E22'],
            ['name' => 'Resolu', 'value' => $signalementsResolus, 'color' => '#27AE60'],
        ];

        // Derniers signalements
        $recentSignalements = Signalement::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('admin/index', [
            'kpis' => [
                'signalementsEnAttente' => $signalementsEnAttente,
                'signalementsThisWeek' => $signalementsThisWeek,
                'totalSignalements' => $totalSignalements,
                'totalUsers' => $totalUsers,
                'usersThisMonth' => $usersThisMonth,
            ],
            'chartData' => $chartData,
            'recentSignalements' => $recentSignalements,
        ]);
    }
}
