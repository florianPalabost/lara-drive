import { Head } from '@inertiajs/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FolderContent } from '@/components/folder-content';
import AppLayout from '@/layouts/app-layout';
import { Folder } from '@/types/folder';

interface FolderIndexProps {
    selectedFolder: Folder | null;
}

export default function FolderIndex({ selectedFolder }: FolderIndexProps) {
    return (
        <AppLayout>
            <Head title="Folders" />
            <ErrorBoundary fallback={<p>There was an issue displaying folder content.</p>}>
                <FolderContent initialFolder={selectedFolder} />
            </ErrorBoundary>
        </AppLayout>
    );
}
