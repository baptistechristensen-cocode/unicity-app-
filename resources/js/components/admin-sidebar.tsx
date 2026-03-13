import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { type SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AlertCircle, BarChart3, Calendar, Home, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AdminSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'Admin';

    const activeItems: NavItem[] = [
        { title: 'Tableau de bord', href: '/admin',              icon: Home        },
        { title: 'Signalements',    href: '/admin/signalements', icon: AlertCircle },
        ...(isAdmin ? [{ title: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users }] : []),
    ];

    const disabledItems = [
        { title: 'Sondages', icon: BarChart3 },
        { title: 'Agenda',   icon: Calendar  },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                                <span className="text-xs text-muted-foreground -mt-1">Back-office</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={activeItems} label="Administration" />

                {/* Items désactivés */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Bientôt disponible</SidebarGroupLabel>
                    <SidebarMenu>
                        {disabledItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    disabled
                                    tooltip={{ children: item.title }}
                                    className="opacity-40 cursor-not-allowed"
                                >
                                    <item.icon />
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Retour au site */}
                <NavMain items={[{ title: 'Retour au site', href: '/dashboard', icon: Home }]} label="Navigation" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
