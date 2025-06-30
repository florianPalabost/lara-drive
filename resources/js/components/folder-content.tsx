import { FileIcon, FolderIcon } from 'lucide-react';
import { useFolderContext } from '@/contexts/folder-context';

export function FolderContent() {
    const { selectedFolder: folder } = useFolderContext();

    if (!folder) {
        return <div className="flex-1 p-6 bg-white rounded-xl shadow-sm text-center text-gray-500">No folder selected</div>;
    }

    return (
        <div className="flex-1 p-6 bg-white rounded-xl shadow-sm space-y-6">
            {/* Folder Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">{folder.name}</h1>
                <p className="text-sm text-gray-500">Created: {folder.created_at}</p>
                <p className="text-sm text-gray-500">Last updated: {folder.updated_at}</p>
            </div>

            {/* Children (Files & Folders) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {folder.children?.map((child) => (
                    <div
                        key={child.id}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer border border-gray-200 transition-shadow hover:shadow-sm"
                    >
                        <div className="flex items-center space-x-2 mb-2 text-gray-700">
                            {child.type === 'folder' ? <FolderIcon size={20} /> : <FileIcon size={20} />}
                            <span className="font-medium truncate">{child.name}</span>
                        </div>
                        <p className="text-xs text-gray-400">Updated: {child.updated_at}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
