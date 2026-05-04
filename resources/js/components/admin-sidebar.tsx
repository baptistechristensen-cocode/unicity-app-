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
} from '@/components/ui/sidebar';
import { type SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AlertCircle, BarChart3, Calendar, Home, MessageCircle, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AdminSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'Admin';

    const mainItems: NavItem[] = [
        { title: 'Tableau de bord', href: '/admin',              icon: Home          },
        { title: 'Signalements',    href: '/admin/signalements', icon: AlertCircle   },
        { title: 'Sondages',        href: '/admin/sondages',     icon: BarChart3     },
        { title: 'Agenda',          href: '/admin/agenda',       icon: Calendar      },
        { title: 'Publications',    href: '/admin/publications', icon: MessageCircle },
        ...(isAdmin ? [{ title: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users }] : []),
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
                <NavMain items={mainItems} label="Administration" />
                <NavMain items={[{ title: 'Retour au site', href: '/dashboard', icon: Home }]} label="Navigation" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
