import { LucideFolderInput } from 'lucide-react';
import { useState } from 'react';
import { DriveFile } from '@/types/folder';
import { Button } from '../ui/button';
import { FileListRow } from './file-list-row';
import { FileMoveDialog } from './file-move-dialog';
import { FilePreviewDialog } from './file-preview-dialog';
import { FileShareDialog } from './file-share-dialog';

interface FileListProps {
    files: Array<DriveFile>;
}

export function FileList({ files }: FileListProps) {
    const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
    const [shareFile, setShareFile] = useState<DriveFile | null>(null);
    const [moveOpen, setMoveOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const allSelected = selectedFiles.length === files.length;

    const toggleSelect = (fileUuid: string) => {
        setSelectedFiles((prev) => (prev.includes(fileUuid) ? prev.filter((id) => id !== fileUuid) : [...prev, fileUuid]));
    };
    const toggleSelectAll = () => {
        setSelectedFiles(allSelected ? [] : files.map((f) => f.uuid));
    };

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
                    {selectedFiles.length > 0 && (
                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md border">
                            <span>{selectedFiles.length} file(s) selected</span>
                            <Button variant="secondary" onClick={() => setMoveOpen(true)} className="cursor-pointer">
                                <LucideFolderInput className="mr-2" /> Move
                            </Button>
                        </div>
                    )}

                    {/* File list header with select all */}
                    <div className="flex items-center space-x-2 p-2 border-b">
                        <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                        <span className="font-medium text-sm text-gray-600">Select All</span>
                    </div>

                    <div className="space-y-2">
                        {files.map((file) => (
                            <FileListRow
                                key={file.uuid}
                                file={file}
                                onPreview={handlePreviewFile(file)}
                                onShare={() => setShareFile(file)}
                                onSelect={() => toggleSelect(file.uuid)}
                            />
                        ))}
                    </div>
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

            {moveOpen && <FileMoveDialog open={moveOpen} onOpenChange={setMoveOpen} files={files.filter((f) => selectedFiles.includes(f.uuid))} />}
        </div>
    );
}
