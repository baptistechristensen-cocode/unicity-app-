import { useState } from 'react';
import { Plus, MapPin, ChevronLeft, ChevronRight, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import StatusBadge, { SignalementStatus } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Signalement {
    id: number;
    titre: string;
    description: string;
    category: string;
    status: SignalementStatus;
    location: string | null;
    photo: string | null;
    created_at: string;
    user: { id: number; name: string };
}

interface Paginator {
    data: Signalement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    signalements: Paginator;
    counts: { total: number; enregistre: number; en_cours: number; resolu: number };
    currentStatus: string | null;
    mine: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Signalements', href: '/signalements' },
];

const categoryIcons: Record<string, string> = {
    voirie: '🚧', eclairage: '💡', proprete: '🗑️', autre: '📌',
};
const categoryLabels: Record<string, string> = {
    voirie: 'Voirie', eclairage: 'Éclairage', proprete: 'Propreté', autre: 'Autre',
};

export default function SignalementIndex({ signalements, counts, currentStatus, mine }: Props) {
    const [filter, setFilter] = useState<string>(currentStatus || 'tous');

    const navigate = (newStatus: string, newMine: boolean) => {
        const params: Record<string, string | boolean> = {};
        if (newStatus !== 'tous') params.status = newStatus;
        if (newMine) params.mine = true;
        router.get('/signalements', params);
    };

    const handleStatusChange = (value: string) => {
        setFilter(value);
        navigate(value, mine);
    };

    const toggleMine = () => navigate(filter, !mine);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Signalements" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Signalements</h1>
                        <p className="text-muted-foreground text-sm">
                            {mine ? 'Vos signalements' : 'Tous les signalements de la ville'}
                        </p>
                    </div>
                    <Link href="/signalements/create">
                        <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white flex-shrink-0" size="lg">
                            <Plus className="w-5 h-5 mr-2" />
                            Signaler un problème
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Tabs value={filter} onValueChange={handleStatusChange} className="mb-0">
                        <TabsList className="h-auto p-1">
                            <TabsTrigger value="tous" className="px-4">Tous ({counts.total})</TabsTrigger>
                            <TabsTrigger value="enregistre" className="px-4">Reçus ({counts.enregistre})</TabsTrigger>
                            <TabsTrigger value="en_cours" className="px-4">En cours ({counts.en_cours})</TabsTrigger>
                            <TabsTrigger value="resolu" className="px-4">Résolus ({counts.resolu})</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Button
                        variant={mine ? 'default' : 'outline'}
                        size="sm"
                        onClick={toggleMine}
                        className={mine ? 'bg-[#1A5276] hover:bg-[#154360] text-white' : ''}
                    >
                        <User className="w-4 h-4 mr-1" />
                        Mes signalements
                    </Button>
                </div>

                {/* List */}
                {signalements.data.length === 0 ? (
                    <Card className="border-none shadow-md p-12 text-center">
                        <p className="text-muted-foreground">Aucun signalement dans cette catégorie</p>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {signalements.data.map((s) => (
                                <Link key={s.id} href={`/signalements/${s.id}`}>
                                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group h-full">
                                        <div className="relative h-48 overflow-hidden bg-muted">
                                            {s.photo ? (
                                                <img
                                                    src={`/storage/${s.photo}`}
                                                    alt={s.titre}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-6xl">
                                                    {categoryIcons[s.category] ?? '📌'}
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <StatusBadge status={s.status} />
                                            </div>
                                            <div className="absolute top-3 left-3">
                                                <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground">
                                                    {categoryIcons[s.category]} {categoryLabels[s.category] ?? s.category}
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-5">
                                            <h3 className="font-semibold mb-2 line-clamp-2">{s.titre}</h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                <User className="w-3 h-3" />
                                                <span>{s.user.name}</span>
                                            </div>
                                            {s.location && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="line-clamp-1">{s.location}</span>
                                                </div>
                                            )}
                                            <p className="text-xs text-muted-foreground">{formatDate(s.created_at)}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {signalements.last_page > 1 && (
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-sm text-muted-foreground">
                                    Page {signalements.current_page} sur {signalements.last_page} — {signalements.total} signalement{signalements.total > 1 ? 's' : ''}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!signalements.prev_page_url}
                                        onClick={() => signalements.prev_page_url && router.get(signalements.prev_page_url)}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Précédent
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!signalements.next_page_url}
                                        onClick={() => signalements.next_page_url && router.get(signalements.next_page_url)}
                                    >
                                        Suivant
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
