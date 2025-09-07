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
            <div className="mb-4 flex flex-col md:flex-row h-full gap-4">
                <FolderProvider initialFolders={folders} initialSelected={selectedFolder}>
                    {/* Sidebar */}
                    <div className="md:w-1/3 lg:w-1/4">
                        <FolderTree />
                    </div>

                    {/* Main Content */}
                    <div className="md:w-2/3 lg:w-3/4">
                        <ErrorBoundary fallback={<p>There was an issue displaying folder content.</p>}>
                            <FolderContent />
                        </ErrorBoundary>
                    </div>
                </FolderProvider>
            </div>
        </AppLayout>
    );
}
