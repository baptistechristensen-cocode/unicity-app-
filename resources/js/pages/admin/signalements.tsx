import { useState } from 'react';
import { Search, Filter, Eye, ChevronDown, Loader2 } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import StatusBadge, { SignalementStatus } from '@/components/status-badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Head, Link, router } from '@inertiajs/react';

interface Signalement {
    id: number;
    titre: string;
    description: string;
    category: string;
    status: SignalementStatus;
    location: string | null;
    photo: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface AdminSignalementsProps {
    signalements: Signalement[];
    counts: {
        total: number;
        enregistre: number;
        en_cours: number;
        resolu: number;
    };
    filters: {
        search: string | null;
        status: string | null;
    };
}

export default function AdminSignalements({ signalements, counts, filters }: AdminSignalementsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || 'tous');
    const [selectedSignalement, setSelectedSignalement] = useState<Signalement | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<SignalementStatus>('en_cours');
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleSearch = () => {
        router.get('/admin/signalements', {
            search: searchTerm || undefined,
            status: filterStatus !== 'tous' ? filterStatus : undefined,
        }, { preserveState: true });
    };

    const handleFilterChange = (value: string) => {
        setFilterStatus(value);
        router.get('/admin/signalements', {
            search: searchTerm || undefined,
            status: value !== 'tous' ? value : undefined,
        }, { preserveState: true });
    };

    const handleQuickStatusChange = (signalement: Signalement, status: SignalementStatus) => {
        if (status === signalement.status) return;
        setUpdatingId(signalement.id);
        router.patch(`/admin/signalements/${signalement.id}`, { status }, {
            onFinish: () => setUpdatingId(null),
        });
    };

    const handleUpdateStatus = (signalement: Signalement) => {
        setSelectedSignalement(signalement);
        setNewStatus(signalement.status);
        setComment('');
        setIsDialogOpen(true);
    };

    const handleSaveUpdate = () => {
        if (!selectedSignalement) return;

        setProcessing(true);
        router.patch(`/admin/signalements/${selectedSignalement.id}`, {
            status: newStatus,
            comment: comment || undefined,
        }, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getCategoryLabel = (category: string) => {
        const labels: { [key: string]: string } = {
            voirie: 'Voirie',
            eclairage: 'Eclairage',
            proprete: 'Proprete',
            autre: 'Autre',
        };
        return labels[category] || category;
    };

    const getCategoryIcon = (category: string) => {
        const icons: { [key: string]: string } = {
            voirie: '🚧',
            eclairage: '💡',
            proprete: '🗑️',
            autre: '📌',
        };
        return icons[category] || '📌';
    };

    return (
        <AdminLayout currentPage="signalements">
            <Head title="Admin - Signalements" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-[#2C2C2C] dark:text-neutral-100">
                    Signalements
                </h1>
                <p className="text-gray-600 dark:text-neutral-400">
                    Gérez et traitez les signalements des citoyens
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <Card className="border-none shadow-sm bg-white dark:bg-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{counts.total}</div>
                        <div className="text-sm text-gray-500 dark:text-neutral-400">Total</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white dark:bg-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-gray-500 dark:text-neutral-300">{counts.enregistre}</div>
                        <div className="text-sm text-gray-500 dark:text-neutral-400">Enregistrés</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white dark:bg-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-[#E67E22]">{counts.en_cours}</div>
                        <div className="text-sm text-gray-500 dark:text-neutral-400">En cours</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white dark:bg-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-[#27AE60]">{counts.resolu}</div>
                        <div className="text-sm text-gray-500 dark:text-neutral-400">Résolus</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-md bg-white dark:bg-neutral-800">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Rechercher un signalement..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tous">Tous les statuts</SelectItem>
                                <SelectItem value="enregistre">Enregistré</SelectItem>
                                <SelectItem value="en_cours">En cours</SelectItem>
                                <SelectItem value="resolu">Résolu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {signalements.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
                            Aucun signalement trouvé
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead>Titre</TableHead>
                                        <TableHead>Catégorie</TableHead>
                                        <TableHead>Citoyen</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {signalements.map((sig) => (
                                        <TableRow key={sig.id}>
                                            <TableCell className="font-medium">#{sig.id}</TableCell>
                                            <TableCell className="font-medium max-w-[250px] truncate">
                                                {sig.titre}
                                            </TableCell>
                                            <TableCell>
                                                {getCategoryIcon(sig.category)} {getCategoryLabel(sig.category)}
                                            </TableCell>
                                            <TableCell className="text-gray-500 dark:text-neutral-400">{sig.user.name}</TableCell>
                                            <TableCell className="text-gray-500 dark:text-neutral-400">{formatDate(sig.created_at)}</TableCell>
                                            <TableCell>
                                                {updatingId === sig.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                                        <StatusBadge status={sig.status} />
                                                    </div>
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="flex items-center gap-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#1A5276]">
                                                                <StatusBadge status={sig.status} />
                                                                <ChevronDown className="w-3 h-3 text-gray-400" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start">
                                                            <DropdownMenuItem
                                                                className={sig.status === 'enregistre' ? 'font-semibold' : ''}
                                                                onClick={() => handleQuickStatusChange(sig, 'enregistre')}
                                                            >
                                                                Enregistré
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className={sig.status === 'en_cours' ? 'font-semibold' : ''}
                                                                onClick={() => handleQuickStatusChange(sig, 'en_cours')}
                                                            >
                                                                En cours
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className={sig.status === 'resolu' ? 'font-semibold' : ''}
                                                                onClick={() => handleQuickStatusChange(sig, 'resolu')}
                                                            >
                                                                Résolu
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/signalements/${sig.id}`}>
                                                        <Button size="sm" variant="ghost">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleUpdateStatus(sig)}
                                                    >
                                                        Modifier
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog de mise a jour */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mettre à jour le statut</DialogTitle>
                        <DialogDescription>Modifier le statut et ajouter un commentaire</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {selectedSignalement && (
                            <div className="bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg">
                                <div className="font-medium">{selectedSignalement.titre}</div>
                                <div className="text-sm text-gray-500 dark:text-neutral-400">
                                    #{selectedSignalement.id} - {selectedSignalement.user.name}
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Nouveau statut</Label>
                            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as SignalementStatus)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="enregistre">Enregistré</SelectItem>
                                    <SelectItem value="en_cours">En cours</SelectItem>
                                    <SelectItem value="resolu">Résolu</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Commentaire</Label>
                            <Textarea
                                placeholder="Ajoutez un commentaire optionnel..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSaveUpdate}
                            className="bg-[#1A5276] hover:bg-[#154360]"
                            disabled={processing}
                        >
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
