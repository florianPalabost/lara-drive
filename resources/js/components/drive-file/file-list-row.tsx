import { router } from '@inertiajs/react';
import { LucideDownload, LucideEye, LucideTrash } from 'lucide-react';
import { toast } from 'sonner';
import { useFileSize } from '@/hooks/use-file-size';
import { DriveFile } from '@/types/folder';
import { getFileIcon } from '@/utils/mime-icons';
import { Button } from '../ui/button';

interface FileListRowProps {
    file: DriveFile;
    onPreview: () => void;
}

export function FileListRow({ file, onPreview }: FileListRowProps) {
    const Icon = getFileIcon(file.mime_type);
    const fileSize = useFileSize();
    const isPreviewable = (mime: string) => mime.startsWith('image/') || mime === 'application/pdf';

    const handleDeleteFile = (file: DriveFile) => () => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(route('files.destroy', file.uuid), {
                onSuccess: () => {
                    toast.success('File deleted successfully!');
                },
            });
        }
    };
    return (
        <div key={file.id} className="flex items-center justify-between p-3 border rounded bg-white shadow-sm hover:bg-gray-50 transition">
            <div>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="font-medium">{file.original_name}</p>
                <p className="text-sm text-gray-500">
                    {file.mime_type} — {fileSize(file.size)}
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="ghost">
                    <a href={route('files.download', file.uuid)} className="text-sm text-blue-600 hover:underline" download>
                        <LucideDownload />
                    </a>
                </Button>

                {isPreviewable(file.mime_type) && (
                    <Button onClick={onPreview} variant="ghost">
                        <LucideEye />
                    </Button>
                )}

                <Button variant="ghost" onClick={handleDeleteFile(file)}>
                    <LucideTrash color="red" />
                </Button>
            </div>
        </div>
    );
}
