import { router } from '@inertiajs/react';
import { LucideDownload, LucideEye, LucideTrash } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { useFileSize } from '@/hooks/use-file-size';
import { DriveFile } from '@/types/folder';
import { Button } from '../ui/button';
import { FilePreviewDialog } from './file-preview-dialog';

interface FileListProps {
    files: Array<DriveFile>;
}

export function FileList({ files }: FileListProps) {
    const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
    const fileSize = useFileSize();
    const isPreviewable = (mime: string) => mime.startsWith('image/') || mime === 'application/pdf';

    if (!files.length) {
        return <p className="text-gray-500 italic">No files in this folder.</p>;
    }

    const handleDeleteFile = (file: DriveFile) => () => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(route('files.destroy', file.uuid));
        }
    };

    return (
        <div className="space-y-6">
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 border rounded bg-white shadow-sm hover:bg-gray-50 transition"
                        >
                            <div>
                                <p className="font-medium">{file.original_name}</p>
                                <p className="text-sm text-gray-500">
                                    {file.mime_type} — {fileSize(file.size)}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost">
                                    <a href={route('files.download', file.uuid)} className="text-sm text-blue-600 hover:underline" download>
                                        <LucideDownload className="mr-2" />
                                    </a>
                                </Button>

                                {isPreviewable(file.mime_type) && (
                                    <Button onClick={() => setPreviewFile(file)} variant="ghost">
                                        <LucideEye className="mr-2" />
                                    </Button>
                                )}

                                <Button variant="ghost" onClick={handleDeleteFile(file)}>
                                    <LucideTrash className="mr-2" color="red" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {previewFile && (
                <FilePreviewDialog open={!!previewFile} onOpenChange={(open) => setPreviewFile(open ? previewFile : null)} file={previewFile} />
            )}
        </div>
    );
}
