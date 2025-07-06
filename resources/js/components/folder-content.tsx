import { FolderIcon, LucideDelete, LucideTrash } from 'lucide-react';
import { useFolderContext } from '@/contexts/folder-context';
import { Folder } from '@/types/folder';
import { FileList } from './drive-file/file-list';
import FileUpload from './drive-file/file-upload';
import { Button } from './ui/button';

export function FolderContent() {
    const { selectedFolder: folder, loadFolder } = useFolderContext();

    const handleSelectFolder = (newSelectedFolder: Folder) => () => {
        loadFolder(newSelectedFolder.uuid);
    };

    if (!folder) {
        return <div className="flex-1 p-6 bg-white rounded-xl shadow-sm text-center text-gray-500">No folder selected</div>;
    }

    return (
        <div className="flex-1 p-6 bg-white rounded-xl shadow-sm space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <FileUpload />
                <h1 className="text-2xl font-semibold text-gray-800">{folder.name}</h1>
                <div className="text-sm text-gray-500">
                    <p>Created: {folder.created_at}</p>
                    <p>Last updated: {folder.updated_at}</p>
                </div>
                <Button variant="destructive" className="hover:bg-red-700">
                    <a href={route('folders.destroy', folder.uuid)} className="flex items-center">
                        <LucideTrash className="mr-2" />
                        Delete
                    </a>
                </Button>
            </div>

            {/* Folders */}
            {folder.children && folder.children?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {folder.children.map((child) => (
                        <div
                            onClick={handleSelectFolder(child)}
                            key={child.id}
                            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer border border-gray-200 transition-shadow hover:shadow-sm"
                        >
                            <div className="flex items-center space-x-2 mb-1 text-gray-700">
                                <FolderIcon size={20} />
                                <span className="font-medium truncate">{child.name}</span>
                            </div>
                            <p className="text-xs text-gray-400">Updated: {child.updated_at}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Files */}
            <div>
                <FileList files={folder.files ?? []} />
            </div>
        </div>
    );
}
