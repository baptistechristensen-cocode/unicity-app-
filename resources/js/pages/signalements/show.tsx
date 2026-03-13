import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react';
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
        { title: 'Accueil', href: '/dashboard' },
        { title: 'Mes signalements', href: '/signalements' },
        { title: signalement.titre, href: `/signalements/${signalement.id}` },
    ];

    const getCategoryLabel = (category: string) => {
        const labels: { [key: string]: string } = {
            voirie: 'Voirie',
            eclairage: 'Éclairage',
            proprete: 'Propreté',
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
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
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
            enregistre: 'Demande reçue',
            en_cours: 'Pris en charge',
            resolu: 'Problème résolu',
        };
        return labels[status] || status;
    };

    const getStatusDescription = (status: string) => {
        const descriptions: { [key: string]: string } = {
            enregistre: 'Votre signalement a bien été enregistré. Les services municipaux vont l\'examiner.',
            en_cours: 'Les équipes municipales travaillent actuellement sur ce problème.',
            resolu: 'Ce problème a été résolu. Merci pour votre signalement !',
        };
        return descriptions[status] || '';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={signalement.titre} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Bouton retour */}
                <Link href="/signalements">
                    <Button variant="ghost" className="mb-2">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à mes signalements
                    </Button>
                </Link>

                {/* Bannière de statut */}
                <div
                    className="rounded-2xl p-4 flex items-start gap-3"
                    style={{ backgroundColor: getStatusColor(signalement.status) + '15' }}
                >
                    <div
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: getStatusColor(signalement.status) }}
                    />
                    <div>
                        <p className="font-semibold" style={{ color: getStatusColor(signalement.status) }}>
                            {getStatusLabel(signalement.status)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {getStatusDescription(signalement.status)}
                        </p>
                    </div>
                </div>

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
                                <div className="w-full h-64 bg-muted flex items-center justify-center text-9xl">
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

                                <div className="flex flex-wrap gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Tag className="w-4 h-4" />
                                        <span>{getCategoryIcon(signalement.category)} {getCategoryLabel(signalement.category)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>Signalé le {formatDate(signalement.created_at)}</span>
                                    </div>
                                    {signalement.location && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span>{signalement.location}</span>
                                        </div>
                                    )}
                                </div>

                                <Separator className="mb-6" />

                                <div>
                                    <h3 className="font-semibold mb-3">Description du problème</h3>
                                    <p className="text-muted-foreground leading-relaxed">{signalement.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Suivi */}
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-6">Suivi de votre demande</h3>
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
                        {signalement.location && (
                            <Card className="border-none shadow-md">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-4">Lieu du problème</h3>
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E74C3C]" />
                                        <span>{signalement.location}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Récapitulatif */}
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Récapitulatif</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Signalé par</span>
                                        <span className="font-medium">{signalement.user.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date</span>
                                        <span className="font-medium">{formatDate(signalement.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Catégorie</span>
                                        <span className="font-medium">{getCategoryLabel(signalement.category)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Statut</span>
                                        <StatusBadge status={signalement.status} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Message rassurant */}
                        <div className="rounded-2xl p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                                💬 <strong>Besoin d'aide ?</strong> Pour toute question sur ce signalement, contactez la mairie en indiquant votre nom.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
