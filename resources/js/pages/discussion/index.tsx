import { Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Publication {
    id: number;
    titre: string;
    contenu: string;
    image: string | null;
    source: 'mairie' | 'facebook' | 'instagram' | 'twitter';
    created_at: string;
    likes_count: number;
    a_like: boolean;
    user: {
        id: number;
        name: string;
    };
}

interface DiscussionIndexProps {
    publications: Publication[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Actualités', href: '/discussion' },
];

const sourceConfig: Record<string, { label: string; color: string; icon: string }> = {
    mairie:    { label: 'Mairie de Novaville', color: '#1A5276', icon: '🏛️' },
    facebook:  { label: 'Facebook',            color: '#1877F2', icon: '📘' },
    instagram: { label: 'Instagram',           color: '#E1306C', icon: '📸' },
    twitter:   { label: 'X (Twitter)',         color: '#000000', icon: '🐦' },
};

export default function DiscussionIndex({ publications }: DiscussionIndexProps) {
    const [likesState, setLikesState] = useState<Record<number, { count: number; liked: boolean }>>(
        Object.fromEntries(publications.map(p => [p.id, { count: p.likes_count, liked: p.a_like }]))
    );

    const handleLike = (publication: Publication) => {
        const current = likesState[publication.id];
        setLikesState(prev => ({
            ...prev,
            [publication.id]: {
                count: current.liked ? current.count - 1 : current.count + 1,
                liked: !current.liked,
            },
        }));

        router.post(`/publications/${publication.id}/like`, {}, {
            preserveScroll: true,
            onError: () => {
                setLikesState(prev => ({
                    ...prev,
                    [publication.id]: current,
                }));
            },
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const sourcesLinks: Record<string, string> = {
        facebook:  'https://www.facebook.com',
        instagram: 'https://www.instagram.com',
        twitter:   'https://www.twitter.com',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Actualités de la ville" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Actualités</h1>
                            <p className="text-muted-foreground">
                                Les dernières nouvelles de la mairie de Novaville
                            </p>
                        </div>

                        {publications.length === 0 ? (
                            <Card className="border-none shadow-md p-12 text-center">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                                <p className="text-muted-foreground">Aucune actualité pour le moment</p>
                            </Card>
                        ) : (
                            publications.map((pub) => {
                                const src = sourceConfig[pub.source] ?? sourceConfig.mairie;
                                const likeState = likesState[pub.id];
                                return (
                                    <Card key={pub.id} className="border-none shadow-md overflow-hidden">
                                        {/* Source header */}
                                        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                                                style={{ backgroundColor: src.color + '15', border: `2px solid ${src.color}30` }}
                                            >
                                                {src.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm">{src.label}</p>
                                                <p className="text-xs text-muted-foreground">{formatDate(pub.created_at)}</p>
                                            </div>
                                            <span
                                                className="text-xs px-2 py-1 rounded-full font-medium"
                                                style={{ backgroundColor: src.color + '15', color: src.color }}
                                            >
                                                {pub.source}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <CardContent className="px-5 pb-4">
                                            <h3 className="font-semibold mb-2">{pub.titre}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-4">
                                                {pub.contenu}
                                            </p>

                                            {pub.image && (
                                                <div className="rounded-xl overflow-hidden mb-4 h-52">
                                                    <img
                                                        src={`/storage/${pub.image}`}
                                                        alt={pub.titre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 border-t pt-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleLike(pub)}
                                                    className={likeState?.liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}
                                                >
                                                    <Heart className={`w-4 h-4 mr-1.5 ${likeState?.liked ? 'fill-current' : ''}`} />
                                                    {likeState?.count ?? 0}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                                    <Share2 className="w-4 h-4 mr-1.5" />
                                                    Partager
                                                </Button>
                                                {pub.source !== 'mairie' && sourcesLinks[pub.source] && (
                                                    <a
                                                        href={sourcesLinks[pub.source]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-auto"
                                                    >
                                                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                                                            <ExternalLink className="w-4 h-4 mr-1.5" />
                                                            Voir sur {pub.source}
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Suivre la mairie</h3>
                                <div className="space-y-3">
                                    {Object.entries(sourceConfig).filter(([k]) => k !== 'mairie').map(([key, cfg]) => (
                                        <div key={key} className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                                                style={{ backgroundColor: cfg.color + '15' }}
                                            >
                                                {cfg.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{cfg.label}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md" style={{ background: 'linear-gradient(135deg, #1A5276, #154360)' }}>
                            <CardContent className="p-6 text-white">
                                <h3 className="font-semibold mb-2">Notifications</h3>
                                <p className="text-sm text-white/80 mb-4">
                                    Activez les notifications pour ne rien manquer des actualités de Novaville.
                                </p>
                                <Button variant="outline" size="sm" className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                                    Activer les notifications
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
