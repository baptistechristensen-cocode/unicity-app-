import { useState } from 'react';
import { Calendar, MapPin, Heart, ChevronRight, ChevronLeft, LayoutList } from 'lucide-react';
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

interface Props {
    evenements: Evenement[];
    currentTheme: string | null;
    vue: 'liste' | 'calendrier';
    mois: number;
    annee: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Agenda', href: '/agenda' },
];

const themes = [
    { id: null,             label: 'Tous',          color: '#1A5276' },
    { id: 'sport',          label: 'Sport',         color: '#27AE60' },
    { id: 'culture',        label: 'Culture',       color: '#9B59B6' },
    { id: 'citoyennete',    label: 'Citoyenneté',   color: '#1A5276' },
    { id: 'environnement',  label: 'Environnement', color: '#16A085' },
    { id: 'autre',          label: 'Autre',         color: '#95A5A6' },
];

const themeColors: Record<string, string> = {
    sport: '#27AE60', culture: '#9B59B6', citoyennete: '#1A5276',
    environnement: '#16A085', autre: '#95A5A6',
};

const themeIcons: Record<string, string> = {
    sport: '⚽', culture: '🎭', citoyennete: '🏛️', environnement: '🌿', autre: '📌',
};

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function navigate(vue: string, theme: string | null, mois: number, annee: number) {
    const params: Record<string, string | number> = { vue, mois, annee };
    if (theme) params.theme = theme;
    router.get('/agenda', params);
}

export default function AgendaIndex({ evenements, currentTheme, vue, mois, annee }: Props) {

    const handleTheme = (theme: string | null) => navigate(vue, theme, mois, annee);

    const handleVue = (v: 'liste' | 'calendrier') => navigate(v, currentTheme, mois, annee);

    const handleMoisPrev = () => {
        const d = new Date(annee, mois - 2, 1);
        navigate('calendrier', currentTheme, d.getMonth() + 1, d.getFullYear());
    };

    const handleMoisNext = () => {
        const d = new Date(annee, mois, 1);
        navigate('calendrier', currentTheme, d.getMonth() + 1, d.getFullYear());
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return {
            jour:  d.toLocaleDateString('fr-FR', { day: 'numeric' }),
            mois:  d.toLocaleDateString('fr-FR', { month: 'short' }),
            heure: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            full:  d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
            dayNum: d.getDate(),
        };
    };

    // ── Calendrier ─────────────────────────────────────────────────────────────
    const buildCalendar = () => {
        const firstDow = new Date(annee, mois - 1, 1).getDay(); // 0=Sun
        const offset   = (firstDow + 6) % 7;                   // Monday-first
        const daysInMonth = new Date(annee, mois, 0).getDate();
        const cells: (number | null)[] = [
            ...Array(offset).fill(null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
        ];
        // Pad to complete last row
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    };

    const eventsByDay: Record<number, Evenement[]> = {};
    evenements.forEach(e => {
        const day = new Date(e.date_debut).getDate();
        if (!eventsByDay[day]) eventsByDay[day] = [];
        eventsByDay[day].push(e);
    });

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === annee && today.getMonth() + 1 === mois;
    const todayDay = today.getDate();

    const cells = vue === 'calendrier' ? buildCalendar() : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agenda de la ville" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Agenda de la ville</h1>
                        <p className="text-muted-foreground text-sm">
                            Événements organisés par la mairie et les associations
                        </p>
                    </div>
                    {/* Vue toggle */}
                    <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted">
                        <button
                            onClick={() => handleVue('liste')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                vue === 'liste'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <LayoutList className="w-4 h-4" /> Liste
                        </button>
                        <button
                            onClick={() => handleVue('calendrier')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                vue === 'calendrier'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Calendar className="w-4 h-4" /> Calendrier
                        </button>
                    </div>
                </div>

                {/* Theme filters */}
                <div className="flex flex-wrap gap-2">
                    {themes.map((theme) => {
                        const isActive = theme.id === null ? !currentTheme : currentTheme === theme.id;
                        return (
                            <button
                                key={theme.id ?? 'tous'}
                                onClick={() => handleTheme(theme.id)}
                                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
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

                {/* ── Vue Calendrier ────────────────────────────────────────────── */}
                {vue === 'calendrier' && (
                    <Card className="border-none shadow-md overflow-hidden">
                        {/* Navigation mois */}
                        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-neutral-800">
                            <button
                                onClick={handleMoisPrev}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h2 className="font-semibold text-lg">
                                {MOIS_FR[mois - 1]} {annee}
                            </h2>
                            <button
                                onClick={handleMoisNext}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* En-tête jours */}
                        <div className="grid grid-cols-7 border-b dark:border-neutral-800">
                            {JOURS.map(j => (
                                <div key={j} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {j}
                                </div>
                            ))}
                        </div>

                        {/* Grille */}
                        <div className="grid grid-cols-7">
                            {cells.map((day, i) => {
                                const evts = day ? (eventsByDay[day] ?? []) : [];
                                const isToday = isCurrentMonth && day === todayDay;
                                return (
                                    <div
                                        key={i}
                                        className={`min-h-[90px] p-1.5 border-b border-r dark:border-neutral-800 ${
                                            !day ? 'bg-muted/30' : ''
                                        } ${i % 7 === 6 ? 'border-r-0' : ''}`}
                                    >
                                        {day && (
                                            <>
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mb-1 ${
                                                    isToday
                                                        ? 'bg-[#1A5276] text-white'
                                                        : 'text-foreground'
                                                }`}>
                                                    {day}
                                                </span>
                                                <div className="space-y-0.5">
                                                    {evts.slice(0, 3).map(e => (
                                                        <Link key={e.id} href={`/agenda/${e.id}`}>
                                                            <div
                                                                className="truncate text-[11px] font-medium px-1.5 py-0.5 rounded text-white leading-tight"
                                                                style={{ backgroundColor: themeColors[e.theme] ?? '#95A5A6' }}
                                                                title={e.titre}
                                                            >
                                                                {e.titre}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                    {evts.length > 3 && (
                                                        <div className="text-[10px] text-muted-foreground pl-1">
                                                            +{evts.length - 3} autre{evts.length - 3 > 1 ? 's' : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Légende */}
                        {evenements.length > 0 && (
                            <div className="px-6 py-3 border-t dark:border-neutral-800 flex flex-wrap gap-3">
                                {Object.entries(themeColors).map(([theme, color]) => (
                                    evenements.some(e => e.theme === theme) && (
                                        <span key={theme} className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                                            {themes.find(t => t.id === theme)?.label}
                                        </span>
                                    )
                                ))}
                            </div>
                        )}

                        {evenements.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground">
                                Aucun événement ce mois-ci
                            </div>
                        )}
                    </Card>
                )}

                {/* ── Vue Liste ─────────────────────────────────────────────────── */}
                {vue === 'liste' && (
                    evenements.length === 0 ? (
                        <Card className="border-none shadow-md p-12 text-center">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                            <p className="text-muted-foreground">Aucun événement à venir dans cette catégorie</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {evenements.map((evenement) => {
                                const date = formatDate(evenement.date_debut);
                                const color = themeColors[evenement.theme] ?? '#95A5A6';
                                return (
                                    <Card key={evenement.id} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                                        <div className="relative h-40 overflow-hidden" style={{ backgroundColor: color + '20' }}>
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
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: color }}>
                                                    {themeIcons[evenement.theme]} {evenement.theme.charAt(0).toUpperCase() + evenement.theme.slice(1)}
                                                </span>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-white dark:bg-neutral-800 rounded-lg shadow px-2.5 py-1.5 text-center">
                                                <div className="text-lg font-bold leading-none" style={{ color }}>{date.jour}</div>
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
                    )
                )}
            </div>
        </AppLayout>
    );
}
