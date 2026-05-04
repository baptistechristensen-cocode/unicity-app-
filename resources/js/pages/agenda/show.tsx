import { Calendar, MapPin, Users, Heart, HeartOff, ChevronLeft, Building } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

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
}

interface AgendaShowProps {
    evenement: Evenement;
    estInteresse: boolean;
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

export default function AgendaShow({ evenement, estInteresse: initialInteresse }: AgendaShowProps) {
    const [estInteresse, setEstInteresse] = useState(initialInteresse);
    const [interetsCount, setInteretsCount] = useState(evenement.interets_count);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Accueil', href: '/dashboard' },
        { title: 'Agenda', href: '/agenda' },
        { title: evenement.titre, href: `/agenda/${evenement.id}` },
    ];

    const date = new Date(evenement.date_debut);
    const formatFull = date.toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    const formatHeure = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const themeColor = themeColors[evenement.theme] ?? '#95A5A6';

    const handleToggleInteret = () => {
        router.post(`/agenda/${evenement.id}/interet`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setEstInteresse(prev => {
                    const next = !prev;
                    setInteretsCount(c => next ? c + 1 : c - 1);
                    return next;
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={evenement.titre} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Back */}
                <Link href="/agenda">
                    <Button variant="ghost" size="sm" className="-ml-2">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Retour à l'agenda
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Banner */}
                        <div
                            className="rounded-2xl overflow-hidden h-64 flex items-center justify-center relative"
                            style={{ backgroundColor: themeColor + '20' }}
                        >
                            {evenement.banniere ? (
                                <img
                                    src={`/storage/${evenement.banniere}`}
                                    alt={evenement.titre}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-8xl">{themeIcons[evenement.theme] ?? '📌'}</span>
                            )}
                            <div className="absolute top-4 left-4">
                                <span
                                    className="px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    {themeIcons[evenement.theme]} {evenement.theme.charAt(0).toUpperCase() + evenement.theme.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-bold mb-3">{evenement.titre}</h1>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {evenement.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: themeColor }} />
                                    <div>
                                        <p className="font-medium">{formatFull}</p>
                                        <p className="text-sm text-muted-foreground">à {formatHeure}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: themeColor }} />
                                    <div>
                                        <p className="font-medium">{evenement.lieu}</p>
                                        <p className="text-sm text-muted-foreground">Lieu de l'événement</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Building className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: themeColor }} />
                                    <div>
                                        <p className="font-medium">{evenement.organisateur}</p>
                                        <p className="text-sm text-muted-foreground">Organisateur</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 flex-shrink-0" style={{ color: themeColor }} />
                                    <p className="font-medium">
                                        {interetsCount} personne{interetsCount !== 1 ? 's' : ''} intéressée{interetsCount !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <Button
                                    onClick={handleToggleInteret}
                                    className="w-full"
                                    variant={estInteresse ? 'outline' : 'default'}
                                    style={!estInteresse ? { backgroundColor: themeColor } : {}}
                                >
                                    {estInteresse ? (
                                        <>
                                            <HeartOff className="w-4 h-4 mr-2" />
                                            Ne plus suivre
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="w-4 h-4 mr-2" />
                                            Je suis intéressé(e)
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
