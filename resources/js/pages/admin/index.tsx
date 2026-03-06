import { AlertCircle, BarChart3, Calendar, Users, Edit } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge, { SignalementStatus } from '@/components/status-badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Head, Link } from '@inertiajs/react';

interface Signalement {
    id: number;
    titre: string;
    category: string;
    status: SignalementStatus;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface ChartDataItem {
    name: string;
    value: number;
    color: string;
}

interface AdminDashboardProps {
    kpis: {
        signalementsEnAttente: number;
        signalementsThisWeek: number;
        totalSignalements: number;
        totalUsers: number;
        usersThisMonth: number;
    };
    chartData: ChartDataItem[];
    recentSignalements: Signalement[];
}

export default function AdminDashboard({ kpis, chartData, recentSignalements }: AdminDashboardProps) {
    const kpiCards = [
        {
            label: 'Signalements en attente',
            value: kpis.signalementsEnAttente.toString(),
            icon: AlertCircle,
            color: '#E67E22',
            trend: `+${kpis.signalementsThisWeek} cette semaine`,
        },
        {
            label: 'Total signalements',
            value: kpis.totalSignalements.toString(),
            icon: BarChart3,
            color: '#1A5276',
            trend: 'Tous les signalements',
        },
        {
            label: 'Evenements a venir',
            value: '0',
            icon: Calendar,
            color: '#27AE60',
            trend: 'Bientot disponible',
        },
        {
            label: 'Citoyens inscrits',
            value: kpis.totalUsers.toString(),
            icon: Users,
            color: '#9B59B6',
            trend: `+${kpis.usersThisMonth} ce mois`,
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getCategoryLabel = (category: string) => {
        const labels: { [key: string]: string } = {
            voirie: 'Voirie',
            eclairage: 'Eclairage',
            proprete: 'Proprete',
            autre: 'Autre',
        };
        return labels[category] || category;
    };

    return (
        <AdminLayout currentPage="dashboard">
            <Head title="Admin - Tableau de bord" />

            {/* En-tete */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-[#2C2C2C] dark:text-neutral-100">
                    Tableau de bord
                </h1>
                <p className="text-gray-600 dark:text-neutral-400">
                    Vue d'ensemble de la plateforme UniCity
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpiCards.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={kpi.label} className="border-none shadow-md bg-white dark:bg-neutral-800">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: kpi.color + '20' }}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: kpi.color }} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold mb-1" style={{ color: kpi.color }}>
                                    {kpi.value}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-neutral-400 mb-2">{kpi.label}</div>
                                <div className="text-xs text-gray-500 dark:text-neutral-400">{kpi.trend}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Graphique */}
                <Card className="border-none shadow-md bg-white lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Répartition des statuts</CardTitle>
                        <CardDescription>Distribution des signalements par statut</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {chartData.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[250px] flex items-center justify-center text-gray-500 dark:text-neutral-400">
                                Aucune donnée disponible
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Derniers signalements */}
                <Card className="border-none shadow-md bg-white lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Derniers signalements</CardTitle>
                                <CardDescription>Les signalements les plus récents</CardDescription>
                            </div>
                            <Link href="/admin/signalements">
                                <Button variant="outline" size="sm">
                                    Voir tout
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentSignalements.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-neutral-400">
                                Aucun signalement récent
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentSignalements.map((sig) => (
                                    <div
                                        key={sig.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium mb-1">{sig.titre}</div>
                                            <div className="text-sm text-gray-500 dark:text-neutral-400">
                                                {getCategoryLabel(sig.category)} • {formatDate(sig.created_at)} • {sig.user.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <StatusBadge status={sig.status} />
                                            <Link href={`/signalements/${sig.id}`}>
                                                <Button size="sm" variant="ghost">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Link href="/admin/signalements">
                    <Card className="border-none shadow-md bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white cursor-pointer hover:shadow-lg transition-shadow h-full">
                        <CardContent className="p-6">
                            <AlertCircle className="w-8 h-8 mb-3" />
                            <h3 className="font-semibold text-lg mb-2">Gerer les signalements</h3>
                            <p className="text-white/90 text-sm">
                                Traiter et mettre a jour les signalements citoyens
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Card className="border-none shadow-md bg-gradient-to-br from-[#1A5276] to-[#154360] text-white cursor-not-allowed opacity-75 h-full">
                    <CardContent className="p-6">
                        <BarChart3 className="w-8 h-8 mb-3" />
                        <h3 className="font-semibold text-lg mb-2">Creer un sondage</h3>
                        <p className="text-white/90 text-sm">
                            Bientot disponible
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-gradient-to-br from-[#27AE60] to-[#229954] text-white cursor-not-allowed opacity-75 h-full">
                    <CardContent className="p-6">
                        <Calendar className="w-8 h-8 mb-3" />
                        <h3 className="font-semibold text-lg mb-2">Publier un evenement</h3>
                        <p className="text-white/90 text-sm">
                            Bientot disponible
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
