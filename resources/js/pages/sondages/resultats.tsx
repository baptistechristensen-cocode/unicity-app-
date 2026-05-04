import { Users, CheckCircle, ChevronLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface ResultatOption {
    id: number;
    texte: string;
    votes: number;
    pourcentage: number;
}

interface ResultatTexte {
    textes: string[];
}

interface QuestionResultat {
    id: number;
    texte: string;
    type: 'radio' | 'checkbox' | 'texte';
    resultat: ResultatOption[] | ResultatTexte;
}

interface Sondage {
    id: number;
    titre: string;
    description: string;
    status: string;
}

interface SondageResultatsProps {
    sondage: Sondage;
    questions: QuestionResultat[];
    totalReponses: number;
    aRepondu: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Sondages', href: '/sondages' },
    { title: 'Résultats', href: '#' },
];

export default function SondageResultats({ sondage, questions, totalReponses, aRepondu }: SondageResultatsProps) {
    const isArrayResultat = (r: ResultatOption[] | ResultatTexte): r is ResultatOption[] => Array.isArray(r);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Résultats — ${sondage.titre}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
                {/* Header */}
                <div>
                    <Link href="/sondages">
                        <Button variant="ghost" size="sm" className="mb-2 -ml-2">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Retour aux sondages
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold mb-1">{sondage.titre}</h1>
                    <p className="text-muted-foreground text-sm mb-3">{sondage.description}</p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span><strong>{totalReponses}</strong> participant{totalReponses !== 1 ? 's' : ''}</span>
                        </div>
                        {aRepondu && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                <CheckCircle className="w-3 h-3" />
                                Votre réponse est enregistrée
                            </span>
                        )}
                        {sondage.status === 'termine' && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                Sondage terminé
                            </span>
                        )}
                    </div>
                </div>

                {/* Results per question */}
                {totalReponses === 0 ? (
                    <Card className="border-none shadow-md p-8 text-center">
                        <p className="text-muted-foreground">Aucune réponse pour le moment.</p>
                    </Card>
                ) : (
                    questions.map((question, index) => (
                        <Card key={question.id} className="border-none shadow-md">
                            <CardHeader className="pb-3">
                                <div className="flex items-start gap-2">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#1A5276' }}>
                                        {index + 1}
                                    </span>
                                    <CardTitle className="text-base">{question.texte}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {question.type === 'texte' && !isArrayResultat(question.resultat) ? (
                                    <div className="space-y-2">
                                        {(question.resultat as ResultatTexte).textes.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">Aucune réponse libre.</p>
                                        ) : (
                                            (question.resultat as ResultatTexte).textes.map((texte, i) => (
                                                <div key={i} className="p-3 rounded-lg bg-muted text-sm italic">
                                                    "{texte}"
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : isArrayResultat(question.resultat) ? (
                                    question.resultat.map((option) => (
                                        <div key={option.id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{option.texte}</span>
                                                <span className="font-medium">{option.pourcentage}% ({option.votes})</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${option.pourcentage}%`,
                                                        backgroundColor: option.pourcentage >= 50 ? '#1A5276' : '#95A5A6',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : null}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </AppLayout>
    );
}
