import { useState } from 'react';
import { Search, Filter, Shield } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

type Role = 'Citoyen' | 'Association' | 'Agent' | 'Admin' | 'Elu';

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
        Association: number;
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
    Citoyen:     'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300',
    Association: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    Agent:       'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    Admin:       'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    Elu:         'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
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
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-neutral-100">
                    Utilisateurs
                </h1>
                <p className="text-gray-500 dark:text-neutral-400">
                    Gérez les comptes et les rôles des utilisateurs
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-6">
                {[
                    { label: 'Total',        value: counts.total,       color: 'text-gray-900 dark:text-neutral-100' },
                    { label: 'Citoyens',     value: counts.Citoyen,     color: 'text-gray-600 dark:text-neutral-300' },
                    { label: 'Associations', value: counts.Association, color: 'text-green-600 dark:text-green-400' },
                    { label: 'Agents',       value: counts.Agent,       color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Élus',         value: counts.Elu,         color: 'text-purple-600 dark:text-purple-400' },
                    { label: 'Admins',       value: counts.Admin,       color: 'text-red-600 dark:text-red-400' },
                ].map(stat => (
                    <Card key={stat.label} className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                        <CardContent className="p-4">
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-neutral-500">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 w-5 h-5" />
                            <Input
                                placeholder="Rechercher un utilisateur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10 dark:bg-neutral-800 dark:border-neutral-700"
                            />
                        </div>
                        <Select value={filterRole} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-full sm:w-[200px] dark:bg-neutral-800 dark:border-neutral-700">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filtrer par rôle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tous">Tous les rôles</SelectItem>
                                <SelectItem value="Citoyen">Citoyen</SelectItem>
                                <SelectItem value="Association">Association</SelectItem>
                                <SelectItem value="Agent">Agent</SelectItem>
                                <SelectItem value="Elu">Élu</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 dark:text-neutral-500">
                            Aucun utilisateur trouvé
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="dark:border-neutral-800">
                                        <TableHead className="w-[60px] dark:text-neutral-400">ID</TableHead>
                                        <TableHead className="dark:text-neutral-400">Nom</TableHead>
                                        <TableHead className="dark:text-neutral-400">Email</TableHead>
                                        <TableHead className="dark:text-neutral-400">Rôle</TableHead>
                                        <TableHead className="dark:text-neutral-400">Inscription</TableHead>
                                        <TableHead className="text-right dark:text-neutral-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} className="dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                                            <TableCell className="font-medium text-gray-400 dark:text-neutral-500">#{user.id}</TableCell>
                                            <TableCell className="font-medium text-gray-900 dark:text-neutral-100">{user.name}</TableCell>
                                            <TableCell className="text-gray-500 dark:text-neutral-400">{user.email}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                                                    {user.role === 'Admin' && <Shield className="w-3 h-3" />}
                                                    {user.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-500 dark:text-neutral-400">{formatDate(user.created_at)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" className="dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800" onClick={() => handleEditRole(user)}>
                                                    Changer le rôle
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

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="dark:bg-neutral-900 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="dark:text-neutral-100">Changer le rôle</DialogTitle>
                        <DialogDescription className="dark:text-neutral-400">
                            Modifier le rôle de cet utilisateur sur la plateforme
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {selectedUser && (
                            <div className="bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg">
                                <div className="font-medium text-gray-900 dark:text-neutral-100">{selectedUser.name}</div>
                                <div className="text-sm text-gray-500 dark:text-neutral-400">{selectedUser.email}</div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-neutral-300">Nouveau rôle</label>
                            <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                                <SelectTrigger className="dark:bg-neutral-800 dark:border-neutral-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Citoyen">Citoyen — accès standard</SelectItem>
                                    <SelectItem value="Association">Association — accès standard</SelectItem>
                                    <SelectItem value="Agent">Agent — peut traiter les signalements</SelectItem>
                                    <SelectItem value="Elu">Élu — accès back-office</SelectItem>
                                    <SelectItem value="Admin">Admin — accès complet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                            Annuler
                        </Button>
                        <Button onClick={handleSaveRole} className="bg-[#1A5276] hover:bg-[#154360] text-white" disabled={processing}>
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
