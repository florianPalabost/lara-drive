import { LucideEye } from 'lucide-react';
import { DriveFile } from '@/types/folder';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';

interface FilePreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    file: DriveFile;
}
export function FilePreviewDialog({ open, onOpenChange, file }: FilePreviewDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <button className="text-gray-500 hover:text-gray-700">
                    <LucideEye size={4} />
                </button>
            </DialogTrigger>
            <DialogContent className="!max-w-1/2 h-auto !p-2 rounded-lg shadow-lg bg-white dark:bg-gray-800">
                <DialogTitle>Preview {file.original_name}</DialogTitle>
                <div className="w-full h-[80vh]">
                    {file.mime_type.startsWith('image/') ? (
                        <img src={route('files.preview', file.uuid)} alt={file.original_name} className="max-h-[75vh] mx-auto rounded" />
                    ) : file.mime_type === 'application/pdf' ? (
                        <iframe src={route('files.preview', file.uuid)} className="w-full h-full border rounded" title="PDF Preview" />
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
