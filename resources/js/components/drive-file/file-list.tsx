import { useState } from 'react';
import { DriveFile } from '@/types/folder';
import { FileListRow } from './file-list-row';
import { FilePreviewDialog } from './file-preview-dialog';

interface FileListProps {
    files: Array<DriveFile>;
}

export function FileList({ files }: FileListProps) {
    const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);

    const handlePreviewFile = (file: DriveFile) => () => {
        setPreviewFile(file);
    };
    if (!files.length) {
        return <p className="text-gray-500 italic">No files in this folder.</p>;
    }

    return (
        <div className="space-y-6">
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file) => (
                        <FileListRow key={file.uuid} file={file} onPreview={handlePreviewFile(file)} />
                    ))}
                </div>
            )}
            {previewFile && (
                <FilePreviewDialog open={!!previewFile} onOpenChange={(open) => setPreviewFile(open ? previewFile : null)} file={previewFile} />
            )}
        </div>
    );
}
