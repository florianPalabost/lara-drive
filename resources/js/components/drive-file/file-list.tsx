import { router } from '@inertiajs/react';
import { LucideDownload, LucideEye, LucideTrash } from 'lucide-react';
import { route } from 'ziggy-js';
import { DriveFile } from '@/types/folder';
import { Button } from '../ui/button';

interface FileListProps {
    files: Array<DriveFile>;
}

export function FileList({ files }: FileListProps) {
    const folders = files.filter((f) => f.mime_type === 'folder');
    const actualFiles = files.filter((f) => f.mime_type !== 'folder');

    const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

    if (!files.length) {
        return <p className="text-gray-500 italic">No files in this folder.</p>;
    }

    const handlePreviewFile = (file: DriveFile) => () => {
        window.open(route('files.preview', file.uuid), '_blank');
    };

    const handleDeleteFile = (file: DriveFile) => () => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(route('files.destroy', file.uuid));
        }
    };

    return (
        <div className="space-y-6">
            {/* Folders */}
            {folders.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {folders.map((folder) => (
                        <div
                            key={folder.id}
                            onClick={() => (window.location.href = route('folders.show', folder.uuid))}
                            className="cursor-pointer p-4 border rounded-lg shadow hover:bg-gray-50 transition flex flex-col items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-yellow-500 mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h4l2 2h11v11H3V7z" />
                            </svg>
                            <span className="text-sm text-gray-700 truncate">{folder.original_name}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Files */}
            {actualFiles.length > 0 && (
                <div className="space-y-2">
                    {actualFiles.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 border rounded bg-white shadow-sm hover:bg-gray-50 transition"
                        >
                            <div>
                                <p className="font-medium">{file.original_name}</p>
                                <p className="text-sm text-gray-500">
                                    {file.mime_type} — {formatSize(file.size)}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost">
                                    <a href={route('files.download', file.uuid)} className="text-sm text-blue-600 hover:underline" download>
                                        <LucideDownload className="mr-2" />
                                    </a>
                                </Button>

                                <Button onClick={handlePreviewFile(file)} variant="ghost">
                                    <LucideEye className="mr-2" />
                                </Button>
                                <Button variant="ghost" onClick={handleDeleteFile(file)}>
                                    <LucideTrash className="mr-2" color="red" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
