import { useState, FormEvent } from 'react';
import { Upload, X, MapPin, Construction, Lightbulb, Trash2, MoreHorizontal } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Signalements', href: '/signalements' },
    { title: 'Nouveau', href: '/signalements/create' },
];

const categories = [
    { id: 'voirie', label: 'Voirie', icon: Construction, color: '#E67E22' },
    { id: 'eclairage', label: 'Eclairage', icon: Lightbulb, color: '#F39C12' },
    { id: 'proprete', label: 'Proprete', icon: Trash2, color: '#27AE60' },
    { id: 'autre', label: 'Autre', icon: MoreHorizontal, color: '#95A5A6' },
];

export default function SignalementCreate() {
    const [titre, setTitre] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('location', location);
        if (photo) {
            formData.append('photo', photo);
        }

        router.post('/signalements', formData, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouveau signalement" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="border-none shadow-lg max-w-4xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Signaler un probleme</CardTitle>
                        <CardDescription>
                            Remplissez ce formulaire pour signaler un probleme dans votre quartier
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Titre */}
                            <div className="space-y-2">
                                <Label htmlFor="titre">
                                    Titre du signalement <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="titre"
                                    placeholder="Ex: Nid de poule avenue Victor Hugo"
                                    value={titre}
                                    onChange={(e) => setTitre(e.target.value)}
                                    required
                                    className="h-11"
                                />
                                <InputError message={errors.titre} />
                            </div>

                            {/* Categorie */}
                            <div className="space-y-3">
                                <Label>
                                    Categorie <span className="text-red-500">*</span>
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {categories.map((cat) => {
                                        const Icon = cat.icon;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setCategory(cat.id)}
                                                className={`p-4 border-2 rounded-lg transition-all ${
                                                    category === cat.id
                                                        ? 'border-[#1A5276] bg-[#1A5276]/5'
                                                        : 'border-border hover:border-muted-foreground'
                                                }`}
                                            >
                                                <Icon
                                                    className={`w-8 h-8 mx-auto mb-2 ${
                                                        category === cat.id ? 'text-[#1A5276]' : 'text-muted-foreground'
                                                    }`}
                                                />
                                                <div className="text-sm font-medium">{cat.label}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <InputError message={errors.category} />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description detaillee <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Decrivez le probleme en detail..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={5}
                                    className="resize-none"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Soyez le plus precis possible pour faciliter la prise en charge
                                </p>
                                <InputError message={errors.description} />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">
                                    Adresse / Localisation
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        placeholder="Ex: 12 avenue Victor Hugo"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="h-11 pl-10"
                                    />
                                </div>
                                <InputError message={errors.location} />
                            </div>

                            {/* Upload photo */}
                            <div className="space-y-2">
                                <Label>Photo (optionnel)</Label>
                                {photoPreview ? (
                                    <div className="relative">
                                        <img
                                            src={photoPreview}
                                            alt="Apercu"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-muted-foreground transition-colors bg-muted/50">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                <span className="font-semibold">Cliquez pour telecharger</span> ou glissez-deposez
                                            </p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG ou JPEG (max. 5MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                        />
                                    </label>
                                )}
                                <InputError message={errors.photo} />
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Link href="/signalements" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full" size="lg">
                                        Annuler
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-[#E67E22] hover:bg-[#D35400]"
                                    size="lg"
                                    disabled={!titre || !category || !description || processing}
                                >
                                    {processing ? 'Envoi...' : 'Envoyer le signalement'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
