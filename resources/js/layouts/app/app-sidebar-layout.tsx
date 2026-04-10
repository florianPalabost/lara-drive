import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { FolderProvider } from '@/contexts/folder-context';
import { type SharedData } from '@/types';

export default function AppSidebarLayout({ children }: PropsWithChildren) {
    const { rootFolders } = usePage<SharedData>().props;

    return (
        <AppShell variant="sidebar">
            <FolderProvider initialFolders={rootFolders}>
                <AppSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    <AppSidebarHeader />
                    {children}
                </AppContent>
            </FolderProvider>
        </AppShell>
    );
}
