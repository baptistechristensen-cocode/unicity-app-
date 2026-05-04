import { useState, FormEvent } from 'react';
import { Plus, Trash2, GripVertical, ChevronLeft } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Head, Link, router } from '@inertiajs/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface QuestionForm {
    tempId: number;
    texte: string;
    type: 'radio' | 'checkbox' | 'texte';
    options: { tempId: number; texte: string }[];
}

export default function AdminSondageCreate() {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [status, setStatus] = useState<'brouillon' | 'actif'>('brouillon');
    const [audience, setAudience] = useState('tous');
    const [questions, setQuestions] = useState<QuestionForm[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [nextId, setNextId] = useState(1);

    const addQuestion = () => {
        setQuestions(prev => [...prev, {
            tempId: nextId,
            texte: '',
            type: 'radio',
            options: [{ tempId: nextId * 100 + 1, texte: '' }, { tempId: nextId * 100 + 2, texte: '' }],
        }]);
        setNextId(n => n + 1);
    };

    const removeQuestion = (tempId: number) => {
        setQuestions(prev => prev.filter(q => q.tempId !== tempId));
    };

    const updateQuestion = (tempId: number, field: keyof QuestionForm, value: string) => {
        setQuestions(prev => prev.map(q => {
            if (q.tempId !== tempId) return q;
            const updated = { ...q, [field]: value };
            if (field === 'type' && value === 'texte') {
                updated.options = [];
            } else if (field === 'type' && q.type === 'texte') {
                updated.options = [{ tempId: Date.now(), texte: '' }, { tempId: Date.now() + 1, texte: '' }];
            }
            return updated;
        }));
    };

    const addOption = (questionTempId: number) => {
        setQuestions(prev => prev.map(q => {
            if (q.tempId !== questionTempId) return q;
            return { ...q, options: [...q.options, { tempId: Date.now(), texte: '' }] };
        }));
    };

    const removeOption = (questionTempId: number, optionTempId: number) => {
        setQuestions(prev => prev.map(q => {
            if (q.tempId !== questionTempId) return q;
            return { ...q, options: q.options.filter(o => o.tempId !== optionTempId) };
        }));
    };

    const updateOption = (questionTempId: number, optionTempId: number, value: string) => {
        setQuestions(prev => prev.map(q => {
            if (q.tempId !== questionTempId) return q;
            return {
                ...q,
                options: q.options.map(o => o.tempId === optionTempId ? { ...o, texte: value } : o),
            };
        }));
    };

    const handleSubmit = (e: FormEvent, submitStatus: 'brouillon' | 'actif') => {
        e.preventDefault();
        setProcessing(true);

        const payload = {
            titre,
            description,
            date_debut: dateDebut || null,
            date_fin: dateFin || null,
            status: submitStatus,
            audience,
            questions: questions.map(q => ({
                texte: q.texte,
                type: q.type,
                options: q.options.map(o => ({ texte: o.texte })),
            })),
        };

        router.post('/admin/sondages', payload, {
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout currentPage="sondages">
            <Head title="Admin — Créer un sondage" />

            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/sondages">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Retour
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">Créer un sondage</h1>
                    <p className="text-gray-500 dark:text-neutral-400">Rédigez les questions et publiez</p>
                </div>
            </div>

            <div className="max-w-3xl space-y-6">
                {/* General info */}
                <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-neutral-100">Informations générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="titre">Titre du sondage *</Label>
                            <Input
                                id="titre"
                                value={titre}
                                onChange={e => setTitre(e.target.value)}
                                placeholder="Ex: Satisfaction des espaces verts"
                                className="mt-1"
                            />
                            <InputError message={errors['titre']} />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Contexte et objectif du sondage..."
                                rows={3}
                                className="mt-1"
                            />
                            <InputError message={errors['description']} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date_debut">Date de début</Label>
                                <Input
                                    id="date_debut"
                                    type="datetime-local"
                                    value={dateDebut}
                                    onChange={e => setDateDebut(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="date_fin">Date de fin</Label>
                                <Input
                                    id="date_fin"
                                    type="datetime-local"
                                    value={dateFin}
                                    onChange={e => setDateFin(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="audience">Public cible</Label>
                            <Select value={audience} onValueChange={setAudience}>
                                <SelectTrigger id="audience" className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tous">Tous les citoyens</SelectItem>
                                    <SelectItem value="quartier">Par quartier</SelectItem>
                                    <SelectItem value="categorie">Par catégorie</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
                            Questions ({questions.length})
                        </h2>
                        <Button variant="outline" size="sm" onClick={addQuestion}>
                            <Plus className="w-4 h-4 mr-1" />
                            Ajouter une question
                        </Button>
                    </div>
                    <InputError message={errors['questions']} />

                    {questions.length === 0 && (
                        <Card className="border-none shadow-sm border-dashed bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                            <CardContent className="py-10 text-center text-gray-400 dark:text-neutral-500">
                                <p className="mb-3">Aucune question pour l'instant</p>
                                <Button variant="outline" size="sm" onClick={addQuestion}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Ajouter la première question
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {questions.map((question, qIndex) => (
                        <Card key={question.tempId} className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-sm font-medium text-gray-500 dark:text-neutral-400 flex-shrink-0">
                                        Q{qIndex + 1}
                                    </span>
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Texte de la question *"
                                            value={question.texte}
                                            onChange={e => updateQuestion(question.tempId, 'texte', e.target.value)}
                                        />
                                        <InputError message={errors[`questions.${qIndex}.texte`]} />
                                    </div>
                                    <Select
                                        value={question.type}
                                        onValueChange={v => updateQuestion(question.tempId, 'type', v)}
                                    >
                                        <SelectTrigger className="w-36 flex-shrink-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="radio">Choix unique</SelectItem>
                                            <SelectItem value="checkbox">Choix multiple</SelectItem>
                                            <SelectItem value="texte">Texte libre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeQuestion(question.tempId)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {question.type !== 'texte' && (
                                <CardContent className="pt-0 pl-12 space-y-2">
                                    {question.options.map((option, oIndex) => (
                                        <div key={option.tempId} className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                                            <Input
                                                placeholder={`Option ${oIndex + 1}`}
                                                value={option.texte}
                                                onChange={e => updateOption(question.tempId, option.tempId, e.target.value)}
                                                className="flex-1"
                                            />
                                            {question.options.length > 2 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeOption(question.tempId, option.tempId)}
                                                    className="text-gray-400 hover:text-red-500 flex-shrink-0"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => addOption(question.tempId)}
                                        className="text-gray-500 pl-6"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1" />
                                        Ajouter une option
                                    </Button>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pb-8">
                    <Button
                        variant="outline"
                        onClick={(e) => handleSubmit(e, 'brouillon')}
                        disabled={processing}
                    >
                        Sauvegarder en brouillon
                    </Button>
                    <Button
                        onClick={(e) => handleSubmit(e, 'actif')}
                        disabled={processing}
                        style={{ backgroundColor: '#27AE60' }}
                    >
                        {processing ? 'Publication...' : 'Publier le sondage'}
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
}
