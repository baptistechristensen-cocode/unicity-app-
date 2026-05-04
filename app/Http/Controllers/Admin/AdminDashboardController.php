<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use App\Models\Signalement;
use App\Models\Sondage;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $signalementsEnAttente = Signalement::where('status', 'enregistre')->count();
        $signalementsEnCours   = Signalement::where('status', 'en_cours')->count();
        $signalementsResolus   = Signalement::where('status', 'resolu')->count();
        $totalSignalements     = Signalement::count();

        $signalementsThisWeek = Signalement::where('created_at', '>=', Carbon::now()->startOfWeek())->count();

        $totalUsers      = User::count();
        $usersThisMonth  = User::where('created_at', '>=', Carbon::now()->startOfMonth())->count();

        $sondagesActifs   = Sondage::where('status', 'actif')->count();
        $evenementsAVenir = Evenement::where('date_debut', '>=', now())->count();

        $chartData = [
            ['name' => 'Enregistré', 'value' => $signalementsEnAttente, 'color' => '#95A5A6'],
            ['name' => 'En cours',   'value' => $signalementsEnCours,   'color' => '#E67E22'],
            ['name' => 'Résolu',     'value' => $signalementsResolus,   'color' => '#27AE60'],
        ];

        $recentSignalements = Signalement::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('admin/index', [
            'kpis' => [
                'signalementsEnAttente' => $signalementsEnAttente,
                'signalementsThisWeek'  => $signalementsThisWeek,
                'totalSignalements'     => $totalSignalements,
                'totalUsers'            => $totalUsers,
                'usersThisMonth'        => $usersThisMonth,
                'sondagesActifs'        => $sondagesActifs,
                'evenementsAVenir'      => $evenementsAVenir,
            ],
            'chartData'          => $chartData,
            'recentSignalements' => $recentSignalements,
        ]);
    }
}
