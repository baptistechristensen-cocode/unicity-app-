import { BarChart3, Plus, Trash2, ToggleLeft, ToggleRight, Users } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Sondage {
    id: number;
    titre: string;
    description: string;
    status: 'brouillon' | 'actif' | 'termine';
    audience: string;
    date_debut: string | null;
    date_fin: string | null;
    reponses_count: number;
    created_at: string;
    user: { id: number; name: string };
}

interface AdminSondagesProps {
    sondages: Sondage[];
    counts: {
        total: number;
        brouillon: number;
        actif: number;
        termine: number;
    };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    brouillon: { label: 'Brouillon', color: '#95A5A6', bg: '#95A5A620' },
    actif:     { label: 'Actif',     color: '#27AE60', bg: '#27AE6020' },
    termine:   { label: 'Terminé',   color: '#E67E22', bg: '#E67E2220' },
};

export default function AdminSondages({ sondages, counts }: AdminSondagesProps) {
    const handleStatusChange = (sondageId: number, status: string) => {
        router.patch(`/admin/sondages/${sondageId}`, { status }, { preserveScroll: true });
    };

    const handleDelete = (sondageId: number) => {
        router.delete(`/admin/sondages/${sondageId}`);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    const kpiCards = [
        { label: 'Total',     value: counts.total,    color: '#1A5276' },
        { label: 'Brouillon', value: counts.brouillon, color: '#95A5A6' },
        { label: 'Actifs',    value: counts.actif,    color: '#27AE60' },
        { label: 'Terminés',  value: counts.termine,  color: '#E67E22' },
    ];

    return (
        <AdminLayout currentPage="sondages">
            <Head title="Admin — Sondages" />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-neutral-100">Sondages citoyens</h1>
                    <p className="text-gray-500 dark:text-neutral-400">Gérez les sondages et consultations</p>
                </div>
                <Link href="/admin/sondages/create">
                    <Button style={{ backgroundColor: '#1A5276' }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer un sondage
                    </Button>
                </Link>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {kpiCards.map((kpi) => (
                    <Card key={kpi.label} className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                        <CardContent className="p-5">
                            <div className="text-3xl font-bold mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
                            <div className="text-sm text-gray-600 dark:text-neutral-400">{kpi.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table */}
            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-neutral-100">Tous les sondages</CardTitle>
                </CardHeader>
                <CardContent>
                    {sondages.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 dark:text-neutral-500">
                            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Aucun sondage créé</p>
                            <Link href="/admin/sondages/create">
                                <Button variant="outline" size="sm" className="mt-4">
                                    Créer le premier sondage
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-neutral-800">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-neutral-400">Titre</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-neutral-400">Statut</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-neutral-400">Participants</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-neutral-400">Date fin</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-neutral-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sondages.map((sondage) => {
                                        const cfg = statusConfig[sondage.status];
                                        return (
                                            <tr key={sondage.id} className="border-b border-gray-50 dark:border-neutral-800/50 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-900 dark:text-neutral-100">{sondage.titre}</div>
                                                    <div className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-1">{sondage.description}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Select
                                                        value={sondage.status}
                                                        onValueChange={(v) => handleStatusChange(sondage.id, v)}
                                                    >
                                                        <SelectTrigger className="w-36 h-8 text-xs" style={{ borderColor: cfg.color, color: cfg.color }}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="brouillon">Brouillon</SelectItem>
                                                            <SelectItem value="actif">Actif</SelectItem>
                                                            <SelectItem value="termine">Terminé</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-neutral-300">
                                                        <Users className="w-3.5 h-3.5" />
                                                        {sondage.reponses_count}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-neutral-400">
                                                    {formatDate(sondage.date_fin)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Supprimer ce sondage ?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Cette action est irréversible. Toutes les réponses seront également supprimées.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(sondage.id)}
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                >
                                                                    Supprimer
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
