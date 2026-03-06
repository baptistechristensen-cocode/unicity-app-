import { Home, AlertCircle, BarChart3, Calendar, Users, Building2, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { type ReactNode, useMemo } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    currentPage?: string;
}

export default function AdminLayout({ children, currentPage = '' }: AdminLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const userName = auth.user?.name || 'Admin';
    const isAdmin = auth.user?.role === 'Admin';

    const menuItems = useMemo(() => [
        { icon: Home, label: 'Tableau de bord', href: '/admin', page: 'dashboard', disabled: false },
        { icon: AlertCircle, label: 'Signalements', href: '/admin/signalements', page: 'signalements', disabled: false },
        { icon: BarChart3, label: 'Sondages', href: '#', page: 'sondages', disabled: true },
        { icon: Calendar, label: 'Evenements', href: '#', page: 'agenda', disabled: true },
        ...(isAdmin ? [{ icon: Users, label: 'Utilisateurs', href: '/admin/utilisateurs', page: 'utilisateurs', disabled: false }] : []),
    ], [isAdmin]);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="flex h-screen" style={{ backgroundColor: '#F9F9F9' }}>
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#1A5276' }}
                        >
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-lg" style={{ color: '#1A5276' }}>
                                UniCity
                            </div>
                            <div className="text-xs text-gray-500">Back-office</div>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.page;
                        if (item.disabled) {
                            return (
                                <div
                                    key={item.page}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-50"
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                    <span className="ml-auto text-xs">(bientot)</span>
                                </div>
                            );
                        }
                        return (
                            <Link
                                key={item.page}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-[#1A5276] text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Lien retour site */}
                <div className="p-4 border-t border-gray-200">
                    <Link
                        href="/dashboard"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-2"
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Retour au site</span>
                    </Link>
                </div>

                {/* Profil utilisateur */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-[#1A5276] text-white">
                                {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{userName}</div>
                            <div className="text-xs text-gray-500">{auth.user?.role || 'Administrateur'}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Deconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
