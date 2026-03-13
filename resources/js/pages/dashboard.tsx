import { AlertCircle, Vote, Calendar, MessageSquare, BarChart3, Plus, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import StatusBadge, { SignalementStatus } from '@/components/status-badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    stats: { total: number; en_cours: number; resolu: number };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Accueil', href: '/dashboard' }];

export default function Dashboard({ recentSignalements, stats }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const firstName = (auth.user?.name || 'Citoyen').split(' ')[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

    const getCategoryIcon = (category: string) =>
        ({ voirie: '🚧', eclairage: '💡', proprete: '🗑️', autre: '📌' }[category] ?? '📌');

    const getCategoryLabel = (category: string) =>
        ({ voirie: 'Voirie', eclairage: 'Éclairage', proprete: 'Propreté', autre: 'Autre' }[category] ?? category);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

    const modules = [
        { icon: AlertCircle,  title: 'Signaler',     description: 'Signaler un problème',    color: '#E67E22', href: '/signalements', disabled: false },
        { icon: Vote,         title: 'Sondages',     description: 'Consultations publiques', color: '#1A5276', href: '#',             disabled: true  },
        { icon: Calendar,     title: 'Agenda',        description: 'Événements à venir',      color: '#27AE60', href: '#',             disabled: true  },
        { icon: MessageSquare,title: 'Actualités',   description: 'Infos de la mairie',      color: '#9B59B6', href: '#',             disabled: true  },
        { icon: BarChart3,    title: 'Statistiques', description: 'Données de la ville',     color: '#3498DB', href: '#',             disabled: true  },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accueil" />

            <div className="flex h-full flex-1 flex-col gap-8 p-4 sm:p-6">

                {/* Greeting + stats inline */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {greeting}, {firstName} 👋
                    </h1>
                    {stats.total > 0 ? (
                        <p className="text-muted-foreground">
                            Vous avez{' '}
                            <span className="font-medium text-foreground">{stats.total} signalement{stats.total > 1 ? 's' : ''}</span>
                            {stats.en_cours > 0 && <> dont <span className="font-medium text-[#E67E22]">{stats.en_cours} en cours</span></>}
                            {stats.resolu > 0 && <> et <span className="font-medium text-[#27AE60]">{stats.resolu} résolu{stats.resolu > 1 ? 's' : ''}</span></>}.
                        </p>
                    ) : (
                        <p className="text-muted-foreground">Bienvenue sur votre espace citoyen. Que souhaitez-vous faire ?</p>
                    )}
                </div>

                {/* Modules */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        const tile = (
                            <div className={`group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-card border border-border/50 h-full transition-all ${
                                module.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:shadow-md hover:border-border'
                            }`}>
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
                                    style={{ backgroundColor: module.color + '18' }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: module.color }} />
                                </div>
                                <p className="font-semibold text-sm">{module.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{module.description}</p>
                                {module.disabled && <p className="text-xs text-muted-foreground mt-1">(Bientôt)</p>}
                            </div>
                        );
                        return module.disabled
                            ? <div key={module.title}>{tile}</div>
                            : <Link key={module.title} href={module.href} className="h-full">{tile}</Link>;
                    })}
                </div>

                {/* Contenu principal */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Mes signalements — 3/5 */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-lg">Mes signalements</h2>
                                <p className="text-sm text-muted-foreground">Suivez l'état de vos demandes</p>
                            </div>
                            <Link href="/signalements">
                                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                                    Tout voir <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        {recentSignalements.length === 0 ? (
                            <Card className="border border-dashed border-border shadow-none bg-transparent">
                                <CardContent className="p-8 flex flex-col items-center text-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl bg-[#E67E22]/10 flex items-center justify-center">
                                        <AlertCircle className="w-7 h-7 text-[#E67E22]" />
                                    </div>
                                    <p className="text-muted-foreground text-sm">Vous n'avez pas encore signalé de problème</p>
                                    <Link href="/signalements/create">
                                        <Button className="bg-[#E67E22] hover:bg-[#D35400] mt-1">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Signaler un problème
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {recentSignalements.map((s) => (
                                    <Link key={s.id} href={`/signalements/${s.id}`}>
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:shadow-sm hover:border-border transition-all">
                                            <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden bg-muted flex items-center justify-center text-2xl">
                                                {s.photo
                                                    ? <img src={`/storage/${s.photo}`} alt={s.titre} className="w-full h-full object-cover" />
                                                    : getCategoryIcon(s.category)
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm line-clamp-1 mb-0.5">{s.titre}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {getCategoryLabel(s.category)} · {formatDate(s.created_at)}
                                                </p>
                                            </div>
                                            <StatusBadge status={s.status} />
                                        </div>
                                    </Link>
                                ))}
                                <Link href="/signalements/create">
                                    <div className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer">
                                        <Plus className="w-4 h-4" />
                                        Signaler un nouveau problème
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Colonne droite — 2/5 */}
                    <div className="lg:col-span-2 flex flex-col gap-4">

                        {/* Sondage placeholder */}
                        <Card className="border border-border/50 shadow-none bg-card">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Sondage en cours</CardTitle>
                                <CardDescription>Donnez votre avis</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 opacity-60">
                                <p className="font-medium text-sm">Aménagement du centre-ville</p>
                                <p className="text-xs text-muted-foreground">
                                    Donnez votre avis sur le projet de piétonisation du centre
                                </p>
                                <Progress value={65} className="h-1.5" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>1 247 participants</span>
                                    <span>15/03/2026</span>
                                </div>
                                <Button size="sm" className="w-full bg-[#27AE60] hover:bg-[#229954]" disabled>
                                    Bientôt disponible
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Actualite mairie */}
                        <div className="rounded-2xl p-5 flex gap-3 items-start" style={{ backgroundColor: '#1A5276' + '12' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1A5276' }}>
                                <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-1">Actualité de la mairie</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Réunion publique le 15 mars : présentation du projet d'aménagement du parc central.
                                    Venez nombreux pour en discuter avec vos élus !
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
