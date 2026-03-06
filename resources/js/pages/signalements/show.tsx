import { ArrowLeft, MapPin, Calendar, Tag, MessageSquare } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import StatusBadge, { SignalementStatus } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Timeline {
    id: number;
    status: string;
    description: string | null;
    created_at: string;
}

interface Signalement {
    id: number;
    titre: string;
    description: string;
    category: string;
    status: SignalementStatus;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    photo: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    timelines: Timeline[];
}

interface SignalementShowProps {
    signalement: Signalement;
}

export default function SignalementShow({ signalement }: SignalementShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Signalements', href: '/signalements' },
        { title: signalement.titre, href: `/signalements/${signalement.id}` },
    ];

    const getCategoryLabel = (category: string) => {
        const labels: { [key: string]: string } = {
            voirie: 'Voirie',
            eclairage: 'Eclairage',
            proprete: 'Proprete',
            autre: 'Autre',
        };
        return labels[category] || category;
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            enregistre: '#95A5A6',
            en_cours: '#E67E22',
            resolu: '#27AE60',
        };
        return colors[status] || '#95A5A6';
    };

    const getStatusLabel = (status: string) => {
        const labels: { [key: string]: string } = {
            enregistre: 'Enregistre',
            en_cours: 'Pris en charge',
            resolu: 'Resolu',
        };
        return labels[status] || status;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={signalement.titre} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Bouton retour */}
                <Link href="/signalements">
                    <Button variant="ghost" className="mb-2">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour aux signalements
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <Card className="border-none shadow-md overflow-hidden">
                            {signalement.photo ? (
                                <img
                                    src={`/storage/${signalement.photo}`}
                                    alt={signalement.titre}
                                    className="w-full h-96 object-cover"
                                />
                            ) : (
                                <div className="w-full h-96 bg-muted flex items-center justify-center text-9xl">
                                    {getCategoryIcon(signalement.category)}
                                </div>
                            )}
                        </Card>

                        {/* Informations principales */}
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h1 className="text-2xl font-bold flex-1">
                                        {signalement.titre}
                                    </h1>
                                    <StatusBadge status={signalement.status} className="flex-shrink-0 ml-4" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Tag className="w-4 h-4" />
                                        <span>{getCategoryIcon(signalement.category)} {getCategoryLabel(signalement.category)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(signalement.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>#{signalement.id}</span>
                                    </div>
                                </div>

                                <Separator className="mb-6" />

                                <div>
                                    <h3 className="font-semibold mb-3">Description</h3>
                                    <p className="text-muted-foreground leading-relaxed">{signalement.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Historique du suivi */}
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-6">Historique du suivi</h3>
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                                    <div className="space-y-6">
                                        {signalement.timelines.map((item) => (
                                            <div key={item.id} className="relative pl-12">
                                                <div
                                                    className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: getStatusColor(item.status) }}
                                                >
                                                    <div className="w-3 h-3 rounded-full bg-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{getStatusLabel(item.status)}</div>
                                                    <div className="text-sm text-muted-foreground mb-1">
                                                        {formatDateTime(item.created_at)}
                                                    </div>
                                                    {item.description && (
                                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Colonne laterale */}
                    <div className="space-y-6">
                        {/* Localisation */}
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Localisation</h3>
                                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border mb-3 bg-muted">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-[#E74C3C]" />
                                    </div>
                                </div>
                                {signalement.location && (
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{signalement.location}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Informations */}
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Informations</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Signale par</span>
                                        <span className="font-medium">{signalement.user.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date</span>
                                        <span className="font-medium">{formatDate(signalement.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Reference</span>
                                        <span className="font-medium">#{signalement.id}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Partage */}
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Partager</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Partagez ce signalement avec vos voisins
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        Email
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        Lien
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
