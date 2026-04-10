import { router } from '@inertiajs/react';
import { LayoutGrid, List, LucidePen, LucideShare2, LucideTrash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DropZone } from '@/components/drop-zone';
import { useFolderContext } from '@/contexts/folder-context';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useSyncSelectedFolder } from '@/hooks/use-sync-selected-folder';
import { Folder } from '@/types/folder';
import { FolderContentItems } from './folder/folder-content-items';
import { FileUpload } from './drive-file/file-upload';
import { Button } from './ui/button';

interface FolderContentProps {
    initialFolder?: Folder | null;
}

export function FolderContent({ initialFolder }: FolderContentProps) {
    useSyncSelectedFolder(initialFolder);

    const { selectedFolder: folder, loadFolder } = useFolderContext();
    const { upload } = useFileUpload();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleSelectFolder = async (newSelectedFolder: Folder) => {
        await loadFolder(newSelectedFolder.uuid);
    };

    const handleShare = () => {
        router.get(route('folders.share.edit', folder?.uuid));
    };

    const handleEdit = () => {
        router.get(route('folders.edit', folder?.uuid));
    };

    const handleDeleteFolder = () => {
        if (confirm('Are you sure you want to delete this folder?')) {
            router.delete(route('folders.destroy', folder?.uuid), {
                onSuccess: () => {
                    loadFolder(folder?.parent?.uuid || '');
                    toast.success('Folder deleted successfully!');
                },
            });
        }
    };

    if (!folder) {
        return (
            <DropZone onFilesDropped={upload}>
                <div className="flex h-full items-center justify-center rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">
                    Select a folder from the sidebar to view its contents
                </div>
            </DropZone>
        );
    }

    return (
        <DropZone onFilesDropped={upload}>
            <div className="flex-1 p-6 bg-white rounded-xl shadow-sm space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <FileUpload />
                        <h1 className="text-2xl font-semibold text-gray-800">{folder.name}</h1>
                        <div className="text-sm text-gray-500">
                            <p>Created: {new Date(folder.created_at).toLocaleString()}</p>
                            <p>Last updated: {new Date(folder.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 border border-neutral-200 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50'}`}
                                title="Grid view"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50'}`}
                                title="List view"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                        <Button onClick={handleShare} className="bg-blue-500 hover:bg-blue-600">
                            <LucideShare2 />
                        </Button>
                        <Button onClick={handleEdit} className="bg-orange-500 hover:bg-orange-600">
                            <LucidePen />
                        </Button>
                        <Button variant="destructive" className="hover:bg-red-700" onClick={handleDeleteFolder}>
                            <LucideTrash />
                        </Button>
                    </div>
                </div>

                {/* Content: folders + files unified */}
                <FolderContentItems
                    key={folder.uuid}
                    folders={folder.children ?? []}
                    files={folder.files ?? []}
                    viewMode={viewMode}
                    onSelectFolder={handleSelectFolder}
                />
            </div>
        </DropZone>
    );
}
