import { Head } from '@inertiajs/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FolderContent } from '@/components/folder-content';
import { FolderTree } from '@/components/folder-tree';
import { FolderProvider } from '@/contexts/folder-context';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Folder } from '@/types/folder';

interface FolderIndexProps {
    folders: Array<Folder>;
    selectedFolder: Folder | null;
}

export default function FolderIndex({ folders, selectedFolder }: FolderIndexProps) {
    console.debug('page folders', folders);

    return (
        <AppLayout>
            <Head title="Folders" />
            <div className="mb-4 flex h-full gap-4">
                <FolderProvider initialFolders={folders} initialSelected={selectedFolder}>
                    <FolderTree />
                    <ErrorBoundary fallback={<p>There was an issue displaying folder content.</p>}>
                        <FolderContent />
                    </ErrorBoundary>
                </FolderProvider>
            </div>
        </AppLayout>
    );
}
