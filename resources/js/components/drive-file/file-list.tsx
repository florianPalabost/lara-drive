import { useState } from 'react';
import { DriveFile } from '@/types/folder';
import { FileListRow } from './file-list-row';
import { FilePreviewDialog } from './file-preview-dialog';
import { FileShareDialog } from './file-share-dialog';

interface FileListProps {
    files: Array<DriveFile>;
}

export function FileList({ files }: FileListProps) {
    const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
    const [shareFile, setShareFile] = useState<DriveFile | null>(null);

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
                        <FileListRow key={file.uuid} file={file} onPreview={handlePreviewFile(file)} onShare={() => setShareFile(file)} />
                    ))}
                </div>
            )}

            {previewFile && (
                <FilePreviewDialog
                    open={!!previewFile}
                    onOpenChange={(open) => setPreviewFile(open ? previewFile : null)}
                    fileVersion={previewFile.current_version}
                />
            )}

            {shareFile && <FileShareDialog open={!!shareFile} onOpenChange={(open) => setShareFile(open ? shareFile : null)} file={shareFile} />}
        </div>
    );
}
