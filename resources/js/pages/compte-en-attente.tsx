import { Head, Link } from '@inertiajs/react';
import { Clock, ShieldCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CompteEnAttente() {
    return (
        <>
            <Head title="Compte en cours de vérification" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-amber-100 dark:bg-amber-950 p-5">
                            <Clock className="h-12 w-12 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Compte en cours de vérification
                        </h1>
                        <p className="text-muted-foreground">
                            Votre compte a bien été créé. Pour garantir que seuls les habitants
                            de Novaville accèdent à la plateforme, il doit être validé par
                            un membre de l'équipe municipale.
                        </p>
                    </div>

                    <div className="rounded-lg border bg-card p-4 text-sm text-left space-y-3">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-muted-foreground">
                                Un agent ou un administrateur validera votre compte dans les
                                plus brefs délais. Vous recevrez un accès complet à l'application
                                dès la validation.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        En cas de problème, contactez la mairie de Novaville.
                    </p>

                    <Button variant="outline" asChild className="w-full">
                        <Link href="/logout" method="post" as="button">
                            <LogOut className="h-4 w-4 mr-2" />
                            Se déconnecter
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
