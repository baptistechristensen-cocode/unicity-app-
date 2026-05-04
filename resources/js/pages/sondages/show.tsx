import { useState, FormEvent } from 'react';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Option {
    id: number;
    texte: string;
}

interface Question {
    id: number;
    texte: string;
    type: 'radio' | 'checkbox' | 'texte';
    options: Option[];
}

interface Sondage {
    id: number;
    titre: string;
    description: string;
    date_debut: string | null;
    date_fin: string | null;
    status: string;
    reponses_count: number;
    questions: Question[];
}

interface SondageShowProps {
    sondage: Sondage;
    aRepondu: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Sondages', href: '/sondages' },
    { title: 'Répondre', href: '#' },
];

export default function SondageShow({ sondage, aRepondu }: SondageShowProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [reponses, setReponses] = useState<Record<number, string | string[]>>({});
    const [processing, setProcessing] = useState(false);

    const questions = sondage.questions;
    const total = questions.length;
    const question = questions[currentQuestion];
    const progress = total > 0 ? ((currentQuestion + 1) / total) * 100 : 0;

    const handleRadioChange = (questionId: number, optionId: string) => {
        setReponses(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleCheckboxChange = (questionId: number, optionId: string, checked: boolean) => {
        setReponses(prev => {
            const current = (prev[questionId] as string[]) || [];
            if (checked) {
                return { ...prev, [questionId]: [...current, optionId] };
            }
            return { ...prev, [questionId]: current.filter(id => id !== optionId) };
        });
    };

    const handleTexteChange = (questionId: number, value: string) => {
        setReponses(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(`/sondages/${sondage.id}/repondre`, { reponses }, {
            onError: () => setProcessing(false),
            onFinish: () => setProcessing(false),
        });
    };

    if (aRepondu) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={sondage.titre} />
                <div className="flex h-full flex-1 items-center justify-center p-4">
                    <Card className="border-none shadow-md max-w-md w-full text-center p-8">
                        <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
                        <h2 className="text-xl font-bold mb-2">Vous avez déjà répondu</h2>
                        <p className="text-muted-foreground mb-6">
                            Vous pouvez consulter les résultats de ce sondage.
                        </p>
                        <Link href={`/sondages/${sondage.id}/resultats`}>
                            <Button className="w-full" style={{ backgroundColor: '#1A5276' }}>
                                Voir les résultats
                            </Button>
                        </Link>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={sondage.titre} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold mb-1">{sondage.titre}</h1>
                    <p className="text-muted-foreground text-sm">{sondage.description}</p>
                </div>

                {/* Progress */}
                <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Question {currentQuestion + 1} sur {total}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${progress}%`, backgroundColor: '#1A5276' }}
                        />
                    </div>
                </div>

                {/* Question */}
                {question && (
                    <Card className="border-none shadow-md flex-1">
                        <CardHeader>
                            <CardTitle className="text-lg">{question.texte}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {question.type === 'radio' && question.options.map((option) => (
                                <label
                                    key={option.id}
                                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                        reponses[question.id] === String(option.id)
                                            ? 'border-[#1A5276] bg-[#1A5276]/5 dark:bg-[#1A5276]/10'
                                            : 'border-border hover:border-[#1A5276]/50 hover:bg-muted/50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option.id}
                                        checked={reponses[question.id] === String(option.id)}
                                        onChange={() => handleRadioChange(question.id, String(option.id))}
                                        className="accent-[#1A5276]"
                                    />
                                    <span>{option.texte}</span>
                                </label>
                            ))}

                            {question.type === 'checkbox' && question.options.map((option) => {
                                const checked = ((reponses[question.id] as string[]) || []).includes(String(option.id));
                                return (
                                    <label
                                        key={option.id}
                                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                            checked
                                                ? 'border-[#1A5276] bg-[#1A5276]/5 dark:bg-[#1A5276]/10'
                                                : 'border-border hover:border-[#1A5276]/50 hover:bg-muted/50'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            value={option.id}
                                            checked={checked}
                                            onChange={(e) => handleCheckboxChange(question.id, String(option.id), e.target.checked)}
                                            className="accent-[#1A5276]"
                                        />
                                        <span>{option.texte}</span>
                                    </label>
                                );
                            })}

                            {question.type === 'texte' && (
                                <Textarea
                                    placeholder="Votre réponse..."
                                    rows={4}
                                    value={(reponses[question.id] as string) || ''}
                                    onChange={(e) => handleTexteChange(question.id, e.target.value)}
                                />
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(q => q - 1)}
                        disabled={currentQuestion === 0}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Précédent
                    </Button>

                    {currentQuestion < total - 1 ? (
                        <Button
                            onClick={() => setCurrentQuestion(q => q + 1)}
                            style={{ backgroundColor: '#1A5276' }}
                        >
                            Suivant
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={processing}
                            style={{ backgroundColor: '#27AE60' }}
                        >
                            {processing ? 'Envoi...' : 'Soumettre mes réponses'}
                        </Button>
                    )}
                </div>

                {/* RGPD footer */}
                <p className="text-xs text-muted-foreground text-center">
                    🔒 Vos réponses sont anonymisées. Aucune donnée personnelle n'est associée à vos réponses (RGPD).
                </p>
            </div>
        </AppLayout>
    );
}
