import { Calendar, MapPin, Users, Heart, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

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
    est_interesse: boolean;
}

interface AgendaIndexProps {
    evenements: Evenement[];
    currentTheme: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Agenda de la ville', href: '/agenda' },
];

const themes = [
    { id: null,          label: 'Tous',           color: '#1A5276' },
    { id: 'sport',       label: 'Sport',          color: '#27AE60' },
    { id: 'culture',     label: 'Culture',        color: '#9B59B6' },
    { id: 'citoyennete', label: 'Citoyenneté',    color: '#1A5276' },
    { id: 'environnement', label: 'Environnement', color: '#27AE60' },
    { id: 'autre',       label: 'Autre',          color: '#95A5A6' },
];

const themeIcons: Record<string, string> = {
    sport:        '⚽',
    culture:      '🎭',
    citoyennete:  '🏛️',
    environnement: '🌿',
    autre:        '📌',
};

export default function AgendaIndex({ evenements, currentTheme }: AgendaIndexProps) {
    const handleThemeChange = (theme: string | null) => {
        if (theme) {
            router.get('/agenda', { theme });
        } else {
            router.get('/agenda');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            jour: date.toLocaleDateString('fr-FR', { day: 'numeric' }),
            mois: date.toLocaleDateString('fr-FR', { month: 'short' }),
            heure: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        };
    };

    const getThemeColor = (theme: string) => {
        const t = themes.find(t => t.id === theme);
        return t?.color ?? '#95A5A6';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agenda de la ville" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">Agenda de la ville</h1>
                    <p className="text-muted-foreground">
                        Retrouvez tous les événements organisés par la mairie et les associations
                    </p>
                </div>

                {/* Theme filters */}
                <div className="flex flex-wrap gap-2">
                    {themes.map((theme) => {
                        const isActive = theme.id === null ? !currentTheme : currentTheme === theme.id;
                        return (
                            <button
                                key={theme.id ?? 'tous'}
                                onClick={() => handleThemeChange(theme.id)}
                                className="px-4 py-2 rounded-full text-sm font-medium transition-colors border"
                                style={isActive
                                    ? { backgroundColor: theme.color, color: 'white', borderColor: theme.color }
                                    : { backgroundColor: 'transparent', borderColor: theme.color, color: theme.color }
                                }
                            >
                                {theme.id && <span className="mr-1">{themeIcons[theme.id]}</span>}
                                {theme.label}
                            </button>
                        );
                    })}
                </div>

                {/* Events list */}
                {evenements.length === 0 ? (
                    <Card className="border-none shadow-md p-12 text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                        <p className="text-muted-foreground">Aucun événement à venir dans cette catégorie</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {evenements.map((evenement) => {
                            const date = formatDate(evenement.date_debut);
                            const themeColor = getThemeColor(evenement.theme);
                            return (
                                <Card key={evenement.id} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                                    {/* Banner */}
                                    <div className="relative h-40 overflow-hidden" style={{ backgroundColor: themeColor + '20' }}>
                                        {evenement.banniere ? (
                                            <img
                                                src={`/storage/${evenement.banniere}`}
                                                alt={evenement.titre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl">
                                                {themeIcons[evenement.theme] ?? '📌'}
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span
                                                className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                                                style={{ backgroundColor: themeColor }}
                                            >
                                                {themeIcons[evenement.theme]} {evenement.theme.charAt(0).toUpperCase() + evenement.theme.slice(1)}
                                            </span>
                                        </div>
                                        {/* Date badge */}
                                        <div className="absolute top-3 right-3 bg-white dark:bg-neutral-800 rounded-lg shadow px-2.5 py-1.5 text-center">
                                            <div className="text-lg font-bold leading-none" style={{ color: themeColor }}>{date.jour}</div>
                                            <div className="text-xs uppercase text-muted-foreground">{date.mois}</div>
                                        </div>
                                    </div>

                                    <CardContent className="p-5">
                                        <h3 className="font-semibold mb-2 line-clamp-2">{evenement.titre}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{evenement.description}</p>

                                        <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span>{date.full} à {date.heure}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span className="line-clamp-1">{evenement.lieu}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Heart className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span>{evenement.interets_count} intéressé{evenement.interets_count !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>

                                        <Link href={`/agenda/${evenement.id}`}>
                                            <Button variant="outline" size="sm" className="w-full">
                                                Voir l'événement
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
