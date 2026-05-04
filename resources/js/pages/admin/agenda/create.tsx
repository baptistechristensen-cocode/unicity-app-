import { useState, FormEvent } from 'react';
import { ChevronLeft, Upload, X } from 'lucide-react';
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

export default function AdminAgendaCreate() {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [lieu, setLieu] = useState('');
    const [theme, setTheme] = useState('autre');
    const [organisateur, setOrganisateur] = useState('');
    const [banniere, setBanniere] = useState<File | null>(null);
    const [bannierePreview, setBannierePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleBanniereUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBanniere(file);
            const reader = new FileReader();
            reader.onloadend = () => setBannierePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('date_debut', dateDebut);
        formData.append('lieu', lieu);
        formData.append('theme', theme);
        formData.append('organisateur', organisateur);
        if (banniere) formData.append('banniere', banniere);

        router.post('/admin/agenda', formData, {
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const themeOptions = [
        { id: 'sport',        label: '⚽ Sport' },
        { id: 'culture',      label: '🎭 Culture' },
        { id: 'citoyennete',  label: '🏛️ Citoyenneté' },
        { id: 'environnement', label: '🌿 Environnement' },
        { id: 'autre',        label: '📌 Autre' },
    ];

    return (
        <AdminLayout currentPage="agenda">
            <Head title="Admin — Publier un événement" />

            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/agenda">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Retour
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">Publier un événement</h1>
                    <p className="text-gray-500 dark:text-neutral-400">Ajoutez un événement à l'agenda de la ville</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-neutral-100">Informations de l'événement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="titre">Titre *</Label>
                            <Input
                                id="titre"
                                value={titre}
                                onChange={e => setTitre(e.target.value)}
                                placeholder="Ex: Fête de la musique 2026"
                                className="mt-1"
                            />
                            <InputError message={errors['titre']} />
                        </div>

                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Décrivez l'événement..."
                                rows={4}
                                className="mt-1"
                            />
                            <InputError message={errors['description']} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date_debut">Date et heure *</Label>
                                <Input
                                    id="date_debut"
                                    type="datetime-local"
                                    value={dateDebut}
                                    onChange={e => setDateDebut(e.target.value)}
                                    className="mt-1"
                                />
                                <InputError message={errors['date_debut']} />
                            </div>
                            <div>
                                <Label htmlFor="lieu">Lieu *</Label>
                                <Input
                                    id="lieu"
                                    value={lieu}
                                    onChange={e => setLieu(e.target.value)}
                                    placeholder="Ex: Place de la Mairie"
                                    className="mt-1"
                                />
                                <InputError message={errors['lieu']} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="theme">Thème *</Label>
                                <Select value={theme} onValueChange={setTheme}>
                                    <SelectTrigger id="theme" className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {themeOptions.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors['theme']} />
                            </div>
                            <div>
                                <Label htmlFor="organisateur">Organisateur *</Label>
                                <Input
                                    id="organisateur"
                                    value={organisateur}
                                    onChange={e => setOrganisateur(e.target.value)}
                                    placeholder="Ex: Mairie de Novaville"
                                    className="mt-1"
                                />
                                <InputError message={errors['organisateur']} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Banner image */}
                <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-neutral-100">Image de bannière</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bannierePreview ? (
                            <div className="relative rounded-xl overflow-hidden h-48 mb-3">
                                <img src={bannierePreview} alt="Bannière" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setBanniere(null); setBannierePreview(null); }}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500 dark:text-neutral-400">Cliquez pour uploader une image</span>
                                <span className="text-xs text-gray-400 dark:text-neutral-500 mt-1">PNG, JPG jusqu'à 5 Mo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleBanniereUpload}
                                />
                            </label>
                        )}
                        <InputError message={errors['banniere']} />
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center gap-3 pb-8">
                    <Link href="/admin/agenda">
                        <Button variant="outline" type="button">Annuler</Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        style={{ backgroundColor: '#27AE60' }}
                    >
                        {processing ? 'Publication...' : 'Publier l\'événement'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
