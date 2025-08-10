import { Head } from '@inertiajs/react';
import { FolderContent } from '@/components/folder-content';
import { FolderTree } from '@/components/folder-tree';
import { FolderProvider } from '@/contexts/folder-context';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Folder } from '@/types/folder';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface FolderIndexProps {
    folders: Array<Folder>;
}

export default function FolderIndex({ folders }: FolderIndexProps) {
    console.debug('folders', folders);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Folders',
            href: '/folders',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Folders" />
            <div className="mb-4 flex h-full gap-4">
                <FolderProvider initialFolders={folders}>
                    <FolderTree />
                    <ErrorBoundary fallback={<p>There was an issue displaying folder content.</p>}>
                        <FolderContent />
                    </ErrorBoundary>
                </FolderProvider>
            </div>
        </AppLayout>
    );
}
