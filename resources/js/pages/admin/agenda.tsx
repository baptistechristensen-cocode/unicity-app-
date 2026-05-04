import { Calendar, Plus, Trash2, MapPin, Users } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Evenement {
    id: number;
    titre: string;
    description: string;
    date_debut: string;
    lieu: string;
    theme: string;
    organisateur: string;
    banniere: string | null;
    interets_count: number;
    created_at: string;
    user: { id: number; name: string };
}

interface AdminAgendaProps {
    evenements: Evenement[];
    counts: {
        total: number;
        a_venir: number;
        passes: number;
    };
}

const themeIcons: Record<string, string> = {
    sport:        '⚽',
    culture:      '🎭',
    citoyennete:  '🏛️',
    environnement: '🌿',
    autre:        '📌',
};

const themeColors: Record<string, string> = {
    sport:        '#27AE60',
    culture:      '#9B59B6',
    citoyennete:  '#1A5276',
    environnement: '#2ECC71',
    autre:        '#95A5A6',
};

export default function AdminAgenda({ evenements, counts }: AdminAgendaProps) {
    const handleDelete = (evenementId: number) => {
        router.delete(`/admin/agenda/${evenementId}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const isUpcoming = (dateString: string) => new Date(dateString) >= new Date();

    const kpiCards = [
        { label: 'Total',     value: counts.total,    color: '#1A5276' },
        { label: 'À venir',   value: counts.a_venir,  color: '#27AE60' },
        { label: 'Passés',    value: counts.passes,   color: '#95A5A6' },
    ];

    return (
        <AdminLayout currentPage="agenda">
            <Head title="Admin — Agenda" />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-neutral-100">Agenda participatif</h1>
                    <p className="text-gray-500 dark:text-neutral-400">Gérez les événements de la ville</p>
                </div>
                <Link href="/admin/agenda/create">
                    <Button style={{ backgroundColor: '#27AE60' }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Publier un événement
                    </Button>
                </Link>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {kpiCards.map((kpi) => (
                    <Card key={kpi.label} className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                        <CardContent className="p-5">
                            <div className="text-3xl font-bold mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
                            <div className="text-sm text-gray-600 dark:text-neutral-400">{kpi.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Events list */}
            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-neutral-100">Tous les événements</CardTitle>
                </CardHeader>
                <CardContent>
                    {evenements.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 dark:text-neutral-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Aucun événement créé</p>
                            <Link href="/admin/agenda/create">
                                <Button variant="outline" size="sm" className="mt-4">
                                    Publier le premier événement
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {evenements.map((evt) => {
                                const themeColor = themeColors[evt.theme] ?? '#95A5A6';
                                const upcoming = isUpcoming(evt.date_debut);
                                return (
                                    <div
                                        key={evt.id}
                                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                            style={{ backgroundColor: themeColor + '20' }}
                                        >
                                            {themeIcons[evt.theme] ?? '📌'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-medium text-gray-900 dark:text-neutral-100">{evt.titre}</span>
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                    style={{ backgroundColor: themeColor + '20', color: themeColor }}
                                                >
                                                    {evt.theme}
                                                </span>
                                                {!upcoming && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400">
                                                        Passé
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-neutral-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(evt.date_debut)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {evt.lieu}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {evt.interets_count} intéressé{evt.interets_count !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Supprimer cet événement ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action est irréversible. L'événement sera retiré de l'agenda.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(evt.id)}
                                                        className="bg-red-500 hover:bg-red-600"
                                                    >
                                                        Supprimer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
