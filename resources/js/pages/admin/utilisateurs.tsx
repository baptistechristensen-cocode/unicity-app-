import { useState } from 'react';
import { Search, Filter, Shield } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Head, router } from '@inertiajs/react';

type Role = 'Citoyen' | 'Agent' | 'Admin' | 'Elu';

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at: string;
}

interface AdminUtilisateursProps {
    users: User[];
    counts: {
        total: number;
        Citoyen: number;
        Agent: number;
        Admin: number;
        Elu: number;
    };
    filters: {
        search: string | null;
        role: string | null;
    };
}

const roleColors: Record<Role, string> = {
    Citoyen: 'bg-gray-100 text-gray-700',
    Agent:   'bg-blue-100 text-blue-700',
    Admin:   'bg-red-100 text-red-700',
    Elu:     'bg-purple-100 text-purple-700',
};

export default function AdminUtilisateurs({ users, counts, filters }: AdminUtilisateursProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterRole, setFilterRole] = useState(filters.role || 'tous');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRole, setNewRole] = useState<Role>('Citoyen');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSearch = () => {
        router.get('/admin/utilisateurs', {
            search: searchTerm || undefined,
            role: filterRole !== 'tous' ? filterRole : undefined,
        }, { preserveState: true });
    };

    const handleFilterChange = (value: string) => {
        setFilterRole(value);
        router.get('/admin/utilisateurs', {
            search: searchTerm || undefined,
            role: value !== 'tous' ? value : undefined,
        }, { preserveState: true });
    };

    const handleEditRole = (user: User) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setIsDialogOpen(true);
    };

    const handleSaveRole = () => {
        if (!selectedUser) return;
        setProcessing(true);
        router.patch(`/admin/utilisateurs/${selectedUser.id}`, { role: newRole }, {
            onSuccess: () => { setIsDialogOpen(false); setProcessing(false); },
            onError: () => setProcessing(false),
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    return (
        <AdminLayout currentPage="utilisateurs">
            <Head title="Admin - Utilisateurs" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
                    Gestion des utilisateurs
                </h1>
                <p className="text-gray-600">
                    Consultez et gerez les roles des membres de la plateforme
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{counts.total}</div>
                        <div className="text-sm text-gray-500">Total</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-gray-600">{counts.Citoyen}</div>
                        <div className="text-sm text-gray-500">Citoyens</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">{counts.Agent}</div>
                        <div className="text-sm text-gray-500">Agents</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-purple-600">{counts.Elu}</div>
                        <div className="text-sm text-gray-500">Elus</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">{counts.Admin}</div>
                        <div className="text-sm text-gray-500">Admins</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-md bg-white">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Rechercher un utilisateur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterRole} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filtrer par role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tous">Tous les roles</SelectItem>
                                <SelectItem value="Citoyen">Citoyen</SelectItem>
                                <SelectItem value="Agent">Agent</SelectItem>
                                <SelectItem value="Elu">Elu</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Aucun utilisateur trouve
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px]">ID</TableHead>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Inscription</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium text-gray-400">#{user.id}</TableCell>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell className="text-gray-500">{user.email}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                                                    {user.role === 'Admin' && <Shield className="w-3 h-3" />}
                                                    {user.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-500">{formatDate(user.created_at)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditRole(user)}
                                                >
                                                    Changer le role
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog changement de role */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Changer le role</DialogTitle>
                        <DialogDescription>
                            Modifier le role de cet utilisateur sur la plateforme
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {selectedUser && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="font-medium">{selectedUser.name}</div>
                                <div className="text-sm text-gray-500">{selectedUser.email}</div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nouveau role</label>
                            <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Citoyen">Citoyen — acces standard</SelectItem>
                                    <SelectItem value="Agent">Agent — peut traiter les signalements</SelectItem>
                                    <SelectItem value="Elu">Elu — acces back-office</SelectItem>
                                    <SelectItem value="Admin">Admin — acces complet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSaveRole}
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
