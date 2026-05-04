import { useState, FormEvent } from 'react';
import { MessageCircle, Plus, Trash2, Heart, Upload, X } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Head, router } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Publication {
    id: number;
    titre: string;
    contenu: string;
    image: string | null;
    source: string;
    likes_count: number;
    created_at: string;
    user: { id: number; name: string };
}

interface AdminPublicationsProps {
    publications: Publication[];
}

const sourceConfig: Record<string, { label: string; color: string; icon: string }> = {
    mairie:    { label: 'Mairie',     color: '#1A5276', icon: '🏛️' },
    facebook:  { label: 'Facebook',   color: '#1877F2', icon: '📘' },
    instagram: { label: 'Instagram',  color: '#E1306C', icon: '📸' },
    twitter:   { label: 'X (Twitter)', color: '#000000', icon: '🐦' },
};

export default function AdminPublications({ publications }: AdminPublicationsProps) {
    const [showForm, setShowForm] = useState(false);
    const [titre, setTitre] = useState('');
    const [contenu, setContenu] = useState('');
    const [source, setSource] = useState('mairie');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const resetForm = () => {
        setTitre('');
        setContenu('');
        setSource('mairie');
        setImage(null);
        setImagePreview(null);
        setErrors({});
        setShowForm(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('contenu', contenu);
        formData.append('source', source);
        if (image) formData.append('image', image);

        router.post('/admin/publications', formData, {
            onSuccess: () => resetForm(),
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleDelete = (publicationId: number) => {
        router.delete(`/admin/publications/${publicationId}`, { preserveScroll: true });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <AdminLayout currentPage="publications">
            <Head title="Admin — Publications" />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-neutral-100">Actualités & Publications</h1>
                    <p className="text-gray-500 dark:text-neutral-400">Publiez des actualités visibles par les citoyens</p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} style={{ backgroundColor: '#9B59B6' }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle publication
                    </Button>
                )}
            </div>

            {/* Create form */}
            {showForm && (
                <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800 mb-8">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-neutral-100">Nouvelle publication</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="titre">Titre *</Label>
                                <Input
                                    id="titre"
                                    value={titre}
                                    onChange={e => setTitre(e.target.value)}
                                    placeholder="Titre de la publication"
                                    className="mt-1"
                                />
                                <InputError message={errors['titre']} />
                            </div>

                            <div>
                                <Label htmlFor="source">Source *</Label>
                                <Select value={source} onValueChange={setSource}>
                                    <SelectTrigger id="source" className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(sourceConfig).map(([key, cfg]) => (
                                            <SelectItem key={key} value={key}>
                                                {cfg.icon} {cfg.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors['source']} />
                            </div>

                            <div>
                                <Label htmlFor="contenu">Contenu *</Label>
                                <Textarea
                                    id="contenu"
                                    value={contenu}
                                    onChange={e => setContenu(e.target.value)}
                                    placeholder="Texte de la publication..."
                                    rows={4}
                                    className="mt-1"
                                />
                                <InputError message={errors['contenu']} />
                            </div>

                            {/* Image upload */}
                            <div>
                                <Label>Image (optionnel)</Label>
                                {imagePreview ? (
                                    <div className="relative mt-1 rounded-xl overflow-hidden h-36">
                                        <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setImage(null); setImagePreview(null); }}
                                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="mt-1 flex items-center justify-center h-24 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                                        <div className="text-center">
                                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                            <span className="text-xs text-gray-500 dark:text-neutral-400">Ajouter une image</span>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={processing} style={{ backgroundColor: '#9B59B6' }}>
                                    {processing ? 'Publication...' : 'Publier'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Publications list */}
            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-neutral-100">
                        Publications ({publications.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {publications.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 dark:text-neutral-500">
                            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Aucune publication</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {publications.map((pub) => {
                                const src = sourceConfig[pub.source] ?? sourceConfig.mairie;
                                return (
                                    <div
                                        key={pub.id}
                                        className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                                            style={{ backgroundColor: src.color + '15' }}
                                        >
                                            {src.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-medium text-gray-900 dark:text-neutral-100">{pub.titre}</span>
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                    style={{ backgroundColor: src.color + '15', color: src.color }}
                                                >
                                                    {pub.source}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2">{pub.contenu}</p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-neutral-500">
                                                <span>{formatDate(pub.created_at)}</span>
                                                <span className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3" />
                                                    {pub.likes_count}
                                                </span>
                                            </div>
                                        </div>
                                        {pub.image && (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={`/storage/${pub.image}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Supprimer cette publication ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action est irréversible.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(pub.id)}
                                                        className="bg-red-500 hover:bg-red-600"
                                                    >
                                                        Supprimer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
