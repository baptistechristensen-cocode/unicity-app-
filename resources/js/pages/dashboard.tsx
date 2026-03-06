import {
    AlertCircle,
    Vote,
    Calendar,
    MessageSquare,
    BarChart3,
    ChevronRight,
    Plus,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import StatusBadge, { SignalementStatus } from '@/components/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Signalement {
    id: number;
    titre: string;
    category: string;
    status: SignalementStatus;
    photo: string | null;
    created_at: string;
}

interface DashboardProps {
    recentSignalements: Signalement[];
    stats: {
        total: number;
        en_cours: number;
        resolu: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: '/dashboard',
    },
];

export default function Dashboard({ recentSignalements, stats }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const userName = auth.user?.name || 'Citoyen';

    const modules = [
        {
            icon: AlertCircle,
            title: 'Signalements',
            description: 'Signaler un probleme',
            color: '#E67E22',
            href: '/signalements',
        },
        {
            icon: Vote,
            title: 'Sondages',
            description: 'Consultations publiques',
            color: '#1A5276',
            href: '/sondages',
            disabled: true,
        },
        {
            icon: Calendar,
            title: 'Agenda',
            description: 'Evenements a venir',
            color: '#27AE60',
            href: '/agenda',
            disabled: true,
        },
        {
            icon: MessageSquare,
            title: 'Discussion',
            description: 'Actualites et echanges',
            color: '#9B59B6',
            href: '/discussion',
            disabled: true,
        },
        {
            icon: BarChart3,
            title: 'Statistiques',
            description: 'Donnees de la ville',
            color: '#3498DB',
            href: '/stats',
            disabled: true,
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Message de bienvenue */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Bonjour {userName} 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Bienvenue sur votre espace citoyen. Que souhaitez-vous faire aujourd'hui ?
                    </p>
                </div>

                {/* Tuiles d'acces rapide */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        const content = (
                            <Card
                                className={`border-none bg-card group h-full ${
                                    module.disabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer hover:shadow-lg transition-shadow'
                                }`}
                            >
                                <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                                    <div
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                                        style={{ backgroundColor: module.color }}
                                    >
                                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-1 text-sm sm:text-base">
                                        {module.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                        {module.description}
                                    </p>
                                    {module.disabled && (
                                        <span className="text-xs text-muted-foreground mt-1">(Bientot)</span>
                                    )}
                                </CardContent>
                            </Card>
                        );

                        return module.disabled ? (
                            <div key={module.title}>{content}</div>
                        ) : (
                            <Link key={module.title} href={module.href}>
                                {content}
                            </Link>
                        );
                    })}
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="border-none bg-card">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-xs text-muted-foreground">Signalements</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-card">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-[#E67E22]">{stats.en_cours}</div>
                            <div className="text-xs text-muted-foreground">En cours</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-card">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-[#27AE60]">{stats.resolu}</div>
                            <div className="text-xs text-muted-foreground">Resolus</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Mes derniers signalements */}
                    <Card className="border-none shadow-md bg-card">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Mes derniers signalements</CardTitle>
                                    <CardDescription>Suivez l'etat de vos demandes</CardDescription>
                                </div>
                                <Link href="/signalements">
                                    <Button variant="ghost" size="sm" className="text-[#1A5276]">
                                        Voir tout
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentSignalements.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">
                                        Vous n'avez pas encore de signalements
                                    </p>
                                    <Link href="/signalements/create">
                                        <Button className="bg-[#E67E22] hover:bg-[#D35400]">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Creer un signalement
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                recentSignalements.map((signalement) => (
                                    <Link
                                        key={signalement.id}
                                        href={`/signalements/${signalement.id}`}
                                        className="flex gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors block"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: '#f3f4f6' }}
                                        >
                                            {signalement.photo ? (
                                                <img
                                                    src={`/storage/${signalement.photo}`}
                                                    alt={signalement.titre}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                getCategoryIcon(signalement.category)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="font-medium text-sm line-clamp-1">
                                                    {signalement.titre}
                                                </h4>
                                                <StatusBadge status={signalement.status} className="flex-shrink-0" />
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-1">
                                                {getCategoryIcon(signalement.category)} {getCategoryLabel(signalement.category)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(signalement.created_at)}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Sondages en cours (placeholder) */}
                    <Card className="border-none shadow-md bg-card">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Sondages en cours</CardTitle>
                                    <CardDescription>Donnez votre avis</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[#1A5276]" disabled>
                                    Voir tout
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Placeholder sondage 1 */}
                                <div className="space-y-3 opacity-60">
                                    <div>
                                        <h4 className="font-medium mb-1">Amenagement du centre-ville</h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Donnez votre avis sur le projet de pietonisation
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Progress value={65} className="h-2" />
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>1,247 participants</span>
                                            <span>Jusqu'au 15/03/2026</span>
                                        </div>
                                    </div>
                                    <Button size="sm" className="w-full bg-[#27AE60] hover:bg-[#229954]" disabled>
                                        Bientot disponible
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bandeau actualite */}
                <Card className="border-none shadow-md bg-gradient-to-r from-[#1A5276] to-[#2874A6] text-white">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <MessageSquare className="w-8 h-8 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">Actualite de la mairie</h3>
                                <p className="text-white/90 text-sm mb-3">
                                    Reunion publique le 15 mars : presentation du projet d'amenagement du parc
                                    central. Venez nombreux pour en discuter avec vos elus !
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-white text-white hover:bg-white/10 bg-transparent"
                                    disabled
                                >
                                    En savoir plus (bientot)
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
