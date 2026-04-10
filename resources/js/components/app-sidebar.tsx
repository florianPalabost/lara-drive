import { Link } from '@inertiajs/react';
import { Clock, Folder, Trash2 } from 'lucide-react';
import { FolderTree } from '@/components/folder-tree';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { FolderActions } from '@/components/sidebar/folder-actions';
import { StorageWidget } from '@/components/storage-widget';
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
import { type NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'My Drive',
        href: '/folders',
        icon: Folder,
    },
    {
        title: 'Recent',
        href: '/files/recent',
        icon: Clock,
    },
    {
        title: 'Trash',
        href: '/files/trashed',
        icon: Trash2,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/folders" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="flex flex-col overflow-hidden">
                <NavMain items={mainNavItems} />
                <FolderActions />

                <SidebarGroup className="flex-1 min-h-0 overflow-hidden group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel>Folders</SidebarGroupLabel>
                    <FolderTree />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <StorageWidget />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
