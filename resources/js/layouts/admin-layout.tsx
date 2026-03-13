import { Home, AlertCircle, BarChart3, Calendar, Users, Building2, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { type ReactNode, useMemo } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

interface AdminLayoutProps {
    children: ReactNode;
    currentPage?: string;
}

const MLP_COLORS = {
    bg:        '#FDF0FF',
    sidebar:   '#F8E8FF',
    border:    '#E8C8F8',
    active:    '#C77DFF',
    hover:     '#F0D8FF',
    text:      '#7B2D8B',
    subtext:   '#B07DC8',
    avatarBg:  '#C77DFF',
};

const MLP_LABELS: Record<string, string> = {
    'Tableau de bord': '✨ Château Poney',
    'Signalements':    '🦄 Incidents Magiques',
    'Sondages':        '🌈 Sondages',
    'Agenda':          '🌸 Agenda Fleuri',
    'Utilisateurs':    '🐴 Poneys',
    'Retour au site':  '🏠 Retour au Haras',
};

function FloatingSparkle({ style }: { style: React.CSSProperties }) {
    return (
        <span className="absolute pointer-events-none select-none animate-ping" style={{ animationDuration: '2.5s', ...style }}>
            ✦
        </span>
    );
}

export default function AdminLayout({ children, currentPage = '' }: AdminLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const userName = auth.user?.name || 'Admin';
    const isAdmin = auth.user?.role === 'Admin';
    const { resolvedAppearance } = useAppearance();
    const mlp = resolvedAppearance === 'pony';

    const menuItems = useMemo(() => [
        { icon: Home,        label: 'Tableau de bord', href: '/admin',              page: 'dashboard',    disabled: false },
        { icon: AlertCircle, label: 'Signalements',    href: '/admin/signalements', page: 'signalements', disabled: false },
        { icon: BarChart3,   label: 'Sondages',        href: '#',                   page: 'sondages',     disabled: true  },
        { icon: Calendar,    label: 'Agenda',          href: '#',                   page: 'agenda',       disabled: true  },
        ...(isAdmin ? [{ icon: Users, label: 'Utilisateurs', href: '/admin/utilisateurs', page: 'utilisateurs', disabled: false }] : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [isAdmin]);

    const handleLogout = () => { router.post('/logout'); };
    const lbl = (l: string) => mlp ? (MLP_LABELS[l] ?? l) : l;
    const c = MLP_COLORS;

    if (mlp) {
        return (
            <div className="flex h-screen transition-colors duration-500" style={{ background: c.bg }}>
                <aside className="w-64 flex flex-col h-screen sticky top-0 border-r transition-colors duration-500" style={{ background: c.sidebar, borderColor: c.border }}>
                    {/* Logo */}
                    <div className="p-6 border-b relative overflow-hidden" style={{ borderColor: c.border }}>
                        <FloatingSparkle style={{ top: 6,  left: 130, fontSize: 10, color: '#FF85C2', animationDelay: '0s'   }} />
                        <FloatingSparkle style={{ top: 22, left: 210, fontSize: 8,  color: '#C77DFF', animationDelay: '0.8s' }} />
                        <FloatingSparkle style={{ top: 38, left: 55,  fontSize: 10, color: '#85D4FF', animationDelay: '1.4s' }} />
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #FF85C2, #C77DFF, #85D4FF)' }}>
                                🦄
                            </div>
                            <div>
                                <div className="font-bold text-lg" style={{ background: 'linear-gradient(90deg, #FF85C2, #C77DFF, #85D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    PonyCity ✨
                                </div>
                                <div className="text-xs" style={{ color: c.subtext }}>Back-office Magique</div>
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
                                    <div key={item.page} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-not-allowed opacity-50" style={{ color: c.subtext }}>
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{lbl(item.label)}</span>
                                        <span className="ml-auto text-xs">(Bientôt)</span>
                                    </div>
                                );
                            }
                            return (
                                <Link key={item.page} href={item.href}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
                                    style={isActive ? { background: c.active, color: 'white' } : { color: c.text }}
                                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = c.hover; }}
                                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{lbl(item.label)}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Retour au site */}
                    <div className="p-4 border-t" style={{ borderColor: c.border }}>
                        <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200" style={{ color: c.text }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = c.hover; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                            <Home className="w-5 h-5" />
                            <span className="font-medium">{lbl('Retour au site')}</span>
                        </Link>
                    </div>

                    {/* Profil */}
                    <div className="p-4 border-t space-y-2" style={{ borderColor: c.border }}>
                        <div className="flex items-center gap-3 px-2 py-1">
                            <Avatar className="w-10 h-10">
                                <AvatarFallback style={{ background: c.avatarBg, color: 'white' }}>
                                    {userName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm truncate" style={{ color: c.text }}>{userName} 🌟</div>
                                <div className="text-xs" style={{ color: c.subtext }}>Poney Admin ✨</div>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200" style={{ color: c.subtext }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = c.hover; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Se déconnecter</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto relative">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                        {[
                            { top: '4%',  left: '12%', size: 16, color: '#FF85C2', delay: '0s'   },
                            { top: '10%', left: '82%', size: 12, color: '#C77DFF', delay: '0.6s' },
                            { top: '28%', left: '90%', size: 18, color: '#85D4FF', delay: '1.2s' },
                            { top: '48%', left: '6%',  size: 14, color: '#FFD700', delay: '1.8s' },
                            { top: '65%', left: '85%', size: 10, color: '#FF85C2', delay: '0.4s' },
                            { top: '80%', left: '20%', size: 16, color: '#C77DFF', delay: '1.0s' },
                            { top: '92%', left: '60%', size: 12, color: '#85D4FF', delay: '0.2s' },
                        ].map((s, i) => (
                            <span key={i} className="absolute animate-ping"
                                style={{ top: s.top, left: s.left, fontSize: s.size, color: s.color, animationDelay: s.delay, animationDuration: '3s', opacity: 0.35 }}>
                                ✦
                            </span>
                        ))}
                    </div>
                    <div className="p-8 text-foreground relative z-10">
                        <div className="mb-6 px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-3"
                            style={{ background: 'linear-gradient(90deg, #FFE8F5, #F0D8FF, #E8F0FF)', color: '#9B59B6', border: '1px solid #E8C8F8' }}>
                            <span className="text-lg">🌈</span>
                            <span>Mode My Little Pony activé — Que la magie opère sur vos signalements !</span>
                            <span className="text-lg ml-auto">🦄</span>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        );
    }

    // Mode normal (light / dark via Tailwind)
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
            {/* Sidebar */}
            <aside className="w-64 flex flex-col h-screen sticky top-0 border-r bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#1A5276]">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-lg text-[#1A5276] dark:text-blue-400">UniCity</div>
                            <div className="text-xs text-gray-500 dark:text-neutral-500">Back-office</div>
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
                                <div key={item.page} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 dark:text-neutral-600 cursor-not-allowed opacity-50">
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                    <span className="ml-auto text-xs">(Bientôt)</span>
                                </div>
                            );
                        }
                        return (
                            <Link key={item.page} href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-[#1A5276] text-white'
                                        : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Retour au site */}
                <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
                    <Link href="/dashboard"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Retour au site</span>
                    </Link>
                </div>

                {/* Profil */}
                <div className="p-4 border-t border-gray-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center gap-3 px-2 py-1">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-[#1A5276] text-white">
                                {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <div className="font-medium text-sm truncate text-gray-900 dark:text-neutral-100">{userName}</div>
                            <div className="text-xs text-gray-500 dark:text-neutral-500">{auth.user?.role || 'Administrateur'}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Se déconnecter</span>
                    </button>
                </div>
            </aside>

            {/* Contenu */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
