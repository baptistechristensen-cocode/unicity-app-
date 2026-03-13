import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { MapPin, Bell, MessageSquare, Users } from 'lucide-react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

const features = [
    { icon: MapPin,        text: 'Signalez des problèmes dans votre quartier' },
    { icon: Bell,          text: 'Suivez l\'avancement de vos demandes' },
    { icon: MessageSquare, text: 'Recevez des réponses de la mairie' },
    { icon: Users,         text: 'Participez à la vie de votre ville' },
];

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh">
            {/* Left panel — branded */}
            <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col justify-between bg-[#1A5276] p-12 text-white flex-shrink-0">
                <Link href={home()} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                        <img src="/images/logo.png" className="h-6 w-6 brightness-0 invert" alt="UniCity" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">UniCity</span>
                </Link>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold leading-tight mb-3">
                            Votre ville,<br />votre voix.
                        </h2>
                        <p className="text-white/70 text-base leading-relaxed">
                            La plateforme citoyenne pour signaler, suivre et améliorer votre cadre de vie.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {features.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 flex-shrink-0">
                                    <Icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm text-white/85">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-white/40">
                    © {new Date().getFullYear()} UniCity · Tous droits réservés
                </p>
            </div>

            {/* Right panel — form */}
            <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 md:p-12">
                {/* Mobile logo */}
                <Link href={home()} className="flex items-center gap-2 mb-8 lg:hidden">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A5276]">
                        <img src="/images/logo.png" className="h-5 w-5 brightness-0 invert" alt="UniCity" />
                    </div>
                    <span className="text-lg font-bold">UniCity</span>
                </Link>

                <div className="w-full max-w-sm">
                    <div className="mb-8 space-y-1">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>

                    {children}

                    <div className="mt-8">
                        <Link
                            href={home()}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Retour au site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
