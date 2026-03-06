import { AlertCircle, Calendar, MessageSquare, Vote, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
    stats,
}: {
    canRegister?: boolean;
    stats: { totalUsers: number; totalSignalements: number; tauxResolution: number };
}) {
    const { auth } = usePage<SharedData>().props;

    const modules = [
        {
            icon: AlertCircle,
            title: 'Signalements',
            description: 'Signaler un probleme',
            color: '#E67E22',
        },
        {
            icon: Vote,
            title: 'Sondages',
            description: 'Consultations publiques',
            color: '#1A5276',
        },
        {
            icon: Calendar,
            title: 'Agenda',
            description: 'Evenements a venir',
            color: '#27AE60',
        },
        {
            icon: MessageSquare,
            title: 'Discussion',
            description: 'Actualites et echanges',
            color: '#9B59B6',
        },
        {
            icon: BarChart3,
            title: 'Statistiques',
            description: 'Donnees de la ville',
            color: '#3498DB',
        },
    ];

    const loginHref = auth.user ? dashboard() : login();

    return (
        <>
            <Head title="Accueil" />

            <div className="min-h-screen bg-background flex flex-col">
                {/* Top navbar */}
                <header className="border-b bg-sidebar text-sidebar-foreground px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                            <img src="/images/logo.png" className="size-5" />
                        </div>
                        <span className="font-semibold text-sm">UniCity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link href={dashboard()}>
                                <Button size="sm" className="bg-[#1A5276] hover:bg-[#154360] text-white">
                                    Tableau de bord
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={login()}>
                                    <Button variant="ghost" size="sm" className="text-sidebar-foreground hover:bg-sidebar-accent">
                                        Se connecter
                                    </Button>
                                </Link>
                                {canRegister && (
                                    <Link href={register()}>
                                        <Button size="sm" className="bg-[#1A5276] hover:bg-[#154360] text-white">
                                            Creer un compte
                                        </Button>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full">
                    {/* Greeting */}
                    <div className="pt-2">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Bienvenue sur UniCity 👋
                        </h1>
                        <p className="text-muted-foreground">
                            La plateforme citoyenne de Novaville. Connectez-vous pour participer.
                        </p>
                    </div>

                    {/* Module tiles */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {modules.map((module) => {
                            const Icon = module.icon;
                            return (
                                <Link key={module.title} href={loginHref}>
                                    <Card className="border-none bg-card group h-full cursor-pointer hover:shadow-lg transition-shadow">
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
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Stats réelles */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="border-none bg-card">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString('fr-FR')}</div>
                                <div className="text-xs text-muted-foreground">Citoyens inscrits</div>
                            </CardContent>
                        </Card>
                        <Card className="border-none bg-card">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-[#E67E22]">{stats.totalSignalements.toLocaleString('fr-FR')}</div>
                                <div className="text-xs text-muted-foreground">Signalements</div>
                            </CardContent>
                        </Card>
                        <Card className="border-none bg-card">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-[#27AE60]">{stats.tauxResolution}%</div>
                                <div className="text-xs text-muted-foreground">Taux de resolution</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* CTA connexion */}
                        <Card className="border-none shadow-md bg-card">
                            <CardHeader>
                                <CardTitle>Rejoignez la communaute</CardTitle>
                                <CardDescription>
                                    Creez un compte pour signaler, voter et suivre vos demandes en temps reel.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {auth.user ? (
                                    <Link href={dashboard()}>
                                        <Button className="w-full bg-[#27AE60] hover:bg-[#229954] text-white">
                                            Acceder au tableau de bord
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <Link href={register()}>
                                                <Button className="w-full bg-[#27AE60] hover:bg-[#229954] text-white">
                                                    Creer un compte
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href={login()}>
                                            <Button variant="outline" className="w-full">
                                                Se connecter
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sondage placeholder */}
                        <Card className="border-none shadow-md bg-card">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Sondages en cours</CardTitle>
                                        <CardDescription>Donnez votre avis</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 opacity-60">
                                    <div>
                                        <h4 className="font-medium mb-1">Amenagement du centre-ville</h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Donnez votre avis sur le projet de pietonisation
                                        </p>
                                    </div>
                                    <Progress value={65} className="h-2" />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>1 247 participants</span>
                                        <span>Jusqu'au 15/03/2026</span>
                                    </div>
                                    <Button size="sm" className="w-full bg-[#27AE60] hover:bg-[#229954]" disabled>
                                        Bientot disponible
                                    </Button>
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
                </main>
            </div>
        </>
    );
}
