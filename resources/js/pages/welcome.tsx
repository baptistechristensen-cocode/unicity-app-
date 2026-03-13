import { AlertCircle, Calendar, MessageSquare, Vote, MapPin, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;

    const steps = [
        { step: '1', color: '#E67E22', title: 'Créez un compte',      text: 'Inscription rapide en quelques secondes.' },
        { step: '2', color: '#1A5276', title: 'Signalez un problème', text: 'Photo, localisation, catégorie — c\'est tout.' },
        { step: '3', color: '#27AE60', title: 'Suivez en temps réel', text: 'La mairie traite votre demande et vous tient informé.' },
    ];

    return (
        <>
            <Head title="Bienvenue" />

            <div className="min-h-screen bg-background flex flex-col">

                {/* Navbar */}
                <header className="border-b bg-sidebar text-sidebar-foreground px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#1A5276]">
                            <img src="/images/logo.png" className="size-5 brightness-0 invert" />
                        </div>
                        <span className="font-semibold text-sm">UniCity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link href={dashboard()}>
                                <Button size="sm" className="bg-[#1A5276] hover:bg-[#154360] text-white">
                                    Mon espace <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
                                            Créer un compte
                                        </Button>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </header>

                <main className="flex-1 flex flex-col gap-10 p-4 sm:p-8 max-w-4xl mx-auto w-full">

                    {/* Hero */}
                    <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2E86C1 100%)' }}>
                        <div className="px-8 py-12 sm:px-12 text-white">
                            <div className="flex items-center gap-2 mb-4 text-blue-200 text-sm font-medium">
                                <MapPin className="w-4 h-4" />
                                Plateforme citoyenne
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
                                Participez à la vie<br />de votre ville
                            </h1>
                            <p className="text-blue-100 text-base max-w-lg leading-relaxed mb-8">
                                UniCity vous connecte à votre mairie. Signalez un problème,
                                participez aux sondages et restez informé des actualités locales.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {auth.user ? (
                                    <Link href={dashboard()}>
                                        <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold px-6 py-5 text-base rounded-xl">
                                            Accéder à mon espace
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <Link href={register()}>
                                                <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold px-6 py-5 text-base rounded-xl">
                                                    Créer un compte
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href={login()}>
                                            <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent px-6 py-5 text-base rounded-xl">
                                                Se connecter
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h2 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-4">Ce que vous pouvez faire</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {/* Signalements — actif */}
                            <Link href={auth.user ? '/signalements' : login()} className="flex flex-col gap-3 p-5 rounded-2xl bg-card border border-border/50 hover:shadow-md hover:border-border transition-all">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E67E22' + '18' }}>
                                    <AlertCircle className="w-5 h-5" style={{ color: '#E67E22' }} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Signalements</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Signalez un problème près de chez vous</p>
                                </div>
                            </Link>

                            {/* Sondages — bientôt */}
                            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-card border border-border/50 relative overflow-hidden opacity-60">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1A5276' + '18' }}>
                                    <Vote className="w-5 h-5" style={{ color: '#1A5276' }} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Sondages</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Participez aux consultations publiques</p>
                                </div>
                                <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    <Clock className="w-3 h-3" /> Bientôt
                                </span>
                            </div>

                            {/* Agenda — bientôt */}
                            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-card border border-border/50 relative overflow-hidden opacity-60">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#27AE60' + '18' }}>
                                    <Calendar className="w-5 h-5" style={{ color: '#27AE60' }} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Agenda</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Consultez les événements de la ville</p>
                                </div>
                                <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    <Clock className="w-3 h-3" /> Bientôt
                                </span>
                            </div>

                            {/* Actualités */}
                            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-card border border-border/50 relative overflow-hidden opacity-60">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9B59B6' + '18' }}>
                                    <MessageSquare className="w-5 h-5" style={{ color: '#9B59B6' }} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Actualités</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Restez informé des actualités locales</p>
                                </div>
                                <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    <Clock className="w-3 h-3" /> Bientôt
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Comment ça marche */}
                    <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
                        <h2 className="font-semibold text-lg mb-6">Comment ça marche ?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {steps.map(({ step, color, title, text }) => (
                                <div key={step} className="flex flex-col gap-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: color }}>
                                        {step}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm mb-1">{title}</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!auth.user && canRegister && (
                            <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
                                <Link href={register()}>
                                    <Button className="bg-[#1A5276] hover:bg-[#154360] text-white">
                                        Commencer maintenant
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Actualité mairie */}
                    <div className="rounded-2xl p-6 flex gap-4 items-start" style={{ background: 'linear-gradient(135deg, #1A5276, #2874A6)' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-white">
                            <p className="font-semibold text-sm mb-1">Actualité de la mairie</p>
                            <p className="text-white/80 text-sm leading-relaxed">
                                Réunion publique le 15 mars : présentation du projet d'aménagement du parc central.
                                Venez nombreux pour en discuter avec vos élus !
                            </p>
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}
