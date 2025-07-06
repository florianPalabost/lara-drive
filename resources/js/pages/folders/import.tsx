import { FolderImport } from '@/components/folder/folder-import';
import { FolderProvider } from '@/contexts/folder-context';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Folder } from '@/types/folder';
import { Head } from '@inertiajs/react';

interface ImportFolderProps {
    selectedFolder: Folder | null;
}

export default function ImportFolder({ selectedFolder }: ImportFolderProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Folders',
            href: '/folders',
        },
        {
            title: 'Import',
            href: '/folders/import',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import folder" />
            <FolderProvider initialFolders={[]} initialSelected={selectedFolder}>
                <FolderImport />
            </FolderProvider>
        </AppLayout>
    );
}
