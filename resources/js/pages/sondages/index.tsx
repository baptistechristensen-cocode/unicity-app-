import { BarChart3, Clock, Users, CheckCircle, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Sondage {
    id: number;
    titre: string;
    description: string;
    date_debut: string | null;
    date_fin: string | null;
    status: 'brouillon' | 'actif' | 'termine';
    audience: string;
    reponses_count: number;
    a_repondu: boolean;
}

interface SondageIndexProps {
    sondages: Sondage[];
    counts: {
        actif: number;
        termine: number;
        mes_reponses: number;
    };
    currentFilter: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Sondages citoyens', href: '/sondages' },
];

const audienceLabels: Record<string, string> = {
    tous: 'Tous les citoyens',
    quartier: 'Par quartier',
    categorie: 'Par catégorie',
};

export default function SondageIndex({ sondages, counts, currentFilter }: SondageIndexProps) {
    const handleFilterChange = (value: string) => {
        router.get('/sondages', value === 'actif' ? {} : { filter: value });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getDaysLeft = (dateFin: string | null) => {
        if (!dateFin) return null;
        const diff = new Date(dateFin).getTime() - Date.now();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return null;
        if (days === 0) return "Dernier jour";
        return `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sondages citoyens" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">Sondages citoyens</h1>
                    <p className="text-muted-foreground">
                        Donnez votre avis sur la vie de votre ville. Vos réponses sont anonymisées.
                    </p>
                </div>

                {/* RGPD notice */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-sm">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                        Vos réponses sont <strong>anonymisées</strong> conformément au RGPD. Aucune donnée personnelle n'est transmise avec vos réponses.
                    </span>
                </div>

                {/* Filters */}
                <Tabs value={currentFilter || 'actif'} onValueChange={handleFilterChange}>
                    <TabsList className="bg-card h-auto p-1">
                        <TabsTrigger value="actif" className="px-6">
                            Actifs ({counts.actif})
                        </TabsTrigger>
                        <TabsTrigger value="termine" className="px-6">
                            Terminés ({counts.termine})
                        </TabsTrigger>
                        <TabsTrigger value="mes_reponses" className="px-6">
                            Mes réponses ({counts.mes_reponses})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Survey list */}
                {sondages.length === 0 ? (
                    <Card className="border-none shadow-md p-12 text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                        <p className="text-muted-foreground">Aucun sondage dans cette catégorie</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sondages.map((sondage) => {
                            const daysLeft = getDaysLeft(sondage.date_fin);
                            return (
                                <Card key={sondage.id} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {sondage.status === 'actif' ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                            Actif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                            Terminé
                                                        </span>
                                                    )}
                                                    {sondage.a_repondu && (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[#1A5276]/10 text-[#1A5276] dark:text-blue-400">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Répondu
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-semibold text-lg mb-1">{sondage.titre}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {sondage.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5" />
                                                {sondage.reponses_count} participant{sondage.reponses_count !== 1 ? 's' : ''}
                                            </span>
                                            {sondage.date_fin && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {daysLeft ?? `Terminé le ${formatDate(sondage.date_fin)}`}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <BarChart3 className="w-3.5 h-3.5" />
                                                {audienceLabels[sondage.audience] ?? sondage.audience}
                                            </span>
                                        </div>

                                        <Link href={`/sondages/${sondage.id}`}>
                                            <Button
                                                className="w-full"
                                                variant={sondage.a_repondu || sondage.status === 'termine' ? 'outline' : 'default'}
                                                style={
                                                    !sondage.a_repondu && sondage.status === 'actif'
                                                        ? { backgroundColor: '#1A5276' }
                                                        : {}
                                                }
                                            >
                                                {sondage.a_repondu || sondage.status === 'termine'
                                                    ? 'Voir les résultats'
                                                    : 'Participer'}
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
