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
    user: {
        id: number;
        name: string;
    };
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

interface SignalementIndexProps {
    signalements: Paginator;
    counts: {
        total: number;
        enregistre: number;
        en_cours: number;
        resolu: number;
    };
    currentStatus: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Signalements', href: '/signalements' },
];

export default function SignalementIndex({ signalements, counts, currentStatus }: SignalementIndexProps) {
    const [filter, setFilter] = useState<string>(currentStatus || 'tous');

    const handleFilterChange = (value: string) => {
        setFilter(value);
        if (value === 'tous') {
            router.get('/signalements');
        } else {
            router.get('/signalements', { status: value });
        }
    };

    const getCategoryIcon = (category: string) => {
        const icons: { [key: string]: string } = {
            voirie: '🚧',
            eclairage: '💡',
            proprete: '🗑️',
            autre: '📌',
        };
        return icons[category] || '📌';
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Signalements" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Signalements</h1>
                        <p className="text-muted-foreground">
                            Signalez les problemes de votre quartier et suivez leur resolution
                        </p>
                    </div>
                    <Link href="/signalements/create">
                        <Button className="bg-[#E67E22] hover:bg-[#D35400] flex-shrink-0" size="lg">
                            <Plus className="w-5 h-5 mr-2" />
                            Nouveau signalement
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Tabs value={filter} onValueChange={handleFilterChange} className="mb-2">
                    <TabsList className="bg-card h-auto p-1">
                        <TabsTrigger value="tous" className="px-6">
                            Actifs ({counts.total})
                        </TabsTrigger>
                        <TabsTrigger value="enregistre" className="px-6">
                            Enregistre ({counts.enregistre})
                        </TabsTrigger>
                        <TabsTrigger value="en_cours" className="px-6">
                            En cours ({counts.en_cours})
                        </TabsTrigger>
                        <TabsTrigger value="resolu" className="px-6">
                            Resolu ({counts.resolu})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* List */}
                {signalements.data.length === 0 ? (
                    <Card className="border-none shadow-md p-12 text-center">
                        <p className="text-muted-foreground">Aucun signalement dans cette categorie</p>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {signalements.data.map((signalement) => (
                                <Link key={signalement.id} href={`/signalements/${signalement.id}`}>
                                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group h-full">
                                        <div className="relative h-48 overflow-hidden bg-muted">
                                            {signalement.photo ? (
                                                <img
                                                    src={`/storage/${signalement.photo}`}
                                                    alt={signalement.titre}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-6xl">
                                                    {getCategoryIcon(signalement.category)}
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <StatusBadge status={signalement.status} />
                                            </div>
                                            <div className="absolute top-3 left-3">
                                                <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                                    {getCategoryIcon(signalement.category)} {getCategoryLabel(signalement.category)}
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-5">
                                            <h3 className="font-semibold mb-2 line-clamp-2">
                                                {signalement.titre}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                <User className="w-3 h-3" />
                                                <span>{signalement.user.name}</span>
                                            </div>
                                            {signalement.location && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="line-clamp-1">{signalement.location}</span>
                                                </div>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(signalement.created_at)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {signalements.last_page > 1 && (
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-sm text-muted-foreground">
                                    Page {signalements.current_page} sur {signalements.last_page} — {signalements.total} signalements
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!signalements.prev_page_url}
                                        onClick={() => signalements.prev_page_url && router.get(signalements.prev_page_url)}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Precedent
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
