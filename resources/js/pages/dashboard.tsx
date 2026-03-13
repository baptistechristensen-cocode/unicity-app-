import { AlertCircle, Vote, Calendar, MessageSquare, Plus, ChevronRight, MapPin, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import StatusBadge, { SignalementStatus } from '@/components/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

    const quickActions = [
        { icon: AlertCircle,   title: 'Signaler un problème',     description: 'Voirie, éclairage, propreté…', color: '#E67E22', href: '/signalements/create', disabled: false },
        { icon: Vote,          title: 'Sondages citoyens',        description: 'Donnez votre avis',           color: '#1A5276', href: '#',                    disabled: true  },
        { icon: Calendar,      title: 'Agenda de la ville',       description: 'Événements à venir',          color: '#27AE60', href: '#',                    disabled: true  },
        { icon: MessageSquare, title: 'Actualités',               description: 'Infos de la mairie',          color: '#9B59B6', href: '#',                    disabled: true  },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accueil" />

            <div className="flex h-full flex-1 flex-col gap-8 p-4 sm:p-6">

                {/* Hero */}
                <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2E86C1 100%)' }}>
                    <div className="px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="text-white">
                            <div className="flex items-center gap-2 mb-2 text-blue-200 text-sm font-medium">
                                <MapPin className="w-4 h-4" />
                                Espace citoyen
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                                {greeting}, {firstName} 👋
                            </h1>
                            <p className="text-blue-100 text-sm sm:text-base max-w-md leading-relaxed">
                                Bienvenue sur votre espace citoyen. Signalez un problème,
                                participez aux sondages ou consultez l'agenda de votre ville.
                            </p>
                        </div>
                        <Link href="/signalements/create" className="flex-shrink-0">
                            <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold px-6 py-5 text-base rounded-xl shadow-lg">
                                <Plus className="w-5 h-5 mr-2" />
                                Faire un signalement
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Actions rapides */}
                <div>
                    <h2 className="font-semibold text-base mb-3 text-muted-foreground uppercase tracking-wide text-xs">Services disponibles</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            const tile = (
                                <div className={`group flex flex-col gap-3 p-5 rounded-2xl bg-card border border-border/50 h-full transition-all ${
                                    action.disabled
                                        ? 'opacity-40 cursor-not-allowed'
                                        : 'cursor-pointer hover:shadow-md hover:border-border'
                                }`}>
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                                        style={{ backgroundColor: action.color + '18' }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: action.color }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm leading-tight">{action.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                                        {action.disabled && <p className="text-xs text-muted-foreground mt-1 italic">Bientôt disponible</p>}
                                    </div>
                                </div>
                            );
                            return action.disabled
                                ? <div key={action.title}>{tile}</div>
                                : <Link key={action.title} href={action.href} className="h-full">{tile}</Link>;
                        })}
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Mes signalements — 3/5 */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-lg">Mes signalements</h2>
                                <p className="text-sm text-muted-foreground">Suivez l'avancement de vos demandes</p>
                            </div>
                            {recentSignalements.length > 0 && (
                                <Link href="/signalements">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                                        Tout voir <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {recentSignalements.length === 0 ? (
                            <Card className="border border-dashed border-border shadow-none bg-transparent">
                                <CardContent className="p-10 flex flex-col items-center text-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl bg-[#E67E22]/10 flex items-center justify-center">
                                        <AlertCircle className="w-7 h-7 text-[#E67E22]" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Aucun signalement pour l'instant</p>
                                        <p className="text-muted-foreground text-xs mt-1">Vous pouvez signaler un problème en quelques secondes</p>
                                    </div>
                                    <Link href="/signalements/create">
                                        <Button className="bg-[#E67E22] hover:bg-[#D35400] mt-1">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Faire mon premier signalement
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
                                        Nouveau signalement
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Colonne droite — 2/5 */}
                    <div className="lg:col-span-2 flex flex-col gap-4">

                        {/* Comment ça marche */}
                        <div className="rounded-2xl border border-border/50 bg-card p-5">
                            <p className="font-semibold text-sm mb-4">Comment ça marche ?</p>
                            <div className="flex flex-col gap-4">
                                {[
                                    { step: '1', color: '#E67E22', text: 'Signalez un problème près de chez vous en quelques secondes' },
                                    { step: '2', color: '#1A5276', text: 'La mairie reçoit votre demande et la traite en priorité' },
                                    { step: '3', color: '#27AE60', text: 'Suivez l\'avancement et soyez notifié quand c\'est résolu' },
                                ].map(({ step, color, text }) => (
                                    <div key={step} className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ backgroundColor: color }}>
                                            {step}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actualité mairie */}
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

                        {/* Stats discrètes */}
                        {stats.resolu > 0 && (
                            <div className="rounded-2xl p-5 flex gap-3 items-center" style={{ backgroundColor: '#27AE60' + '10' }}>
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#27AE60' }} />
                                <p className="text-sm text-muted-foreground leading-snug">
                                    <span className="font-semibold text-foreground">{stats.resolu} problème{stats.resolu > 1 ? 's' : ''} résolu{stats.resolu > 1 ? 's' : ''}</span> grâce à vos signalements
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
