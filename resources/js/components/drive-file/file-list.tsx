import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import FileVersionTable from '@/components/data-table/file-versions-table';
import { DriveFile, DriveFileVersion } from '@/types/folder';
import { fileListColumns } from '../data-table/columns/file-list-columns';
import { DriveFileListActions } from '../data-table/row-actions/file-list-row-actions';
import { FileListToolbar } from './file-list-toolbar';
import { FileMoveDialog } from './file-move-dialog';
import { FilePreviewDialog } from './file-preview-dialog';
import { FileShareDialog } from './file-share-dialog';

interface FileListProps {
    files: Array<DriveFile>;
}

export function FileList({ files }: FileListProps) {
    const [previewFile, setPreviewFile] = useState<DriveFileVersion | null>(null);
    const [shareFile, setShareFile] = useState<DriveFile | null>(null);
    const [moveOpen, setMoveOpen] = useState(false);

    const handleMoveFiles = () => {
        setMoveOpen(true);
    };

    const handlePreviewFile = (file: DriveFileVersion) => {
        setPreviewFile(file);
    };

    const handleDeleteFile = (file: DriveFile) => () => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(route('files.destroy', file.uuid), {
                onSuccess: () => {
                    toast.success('File deleted successfully!');
                },
                onError: (errors) => {
                    toast.error('File delete failed!');
                    console.error(errors);
                },
            });
        }
    };

    const columns: ColumnDef<DriveFileVersion>[] = useMemo(() => fileListColumns(), []);
    const actions: DriveFileListActions = {
        onMoveFiles: (file) => setMoveOpen(true),
        onDeleteFile: handleDeleteFile,
        onPreviewFile: handlePreviewFile,
        onShareFile: (file) => setShareFile(file),
        onViewHistory: (file) => router.get(route('files.versions.index', file.uuid)),
    };

    if (!files.length) {
        return <p className="text-gray-500 italic">No files in this folder.</p>;
    }

    return (
        <div className="space-y-6">
            <FileVersionTable columns={columns} data={files.map((f) => f.current_version)} actions={actions}>
                <FileVersionTable.Toolbar>
                    <FileListToolbar onMove={handleMoveFiles} />
                </FileVersionTable.Toolbar>

                <FileVersionTable.View />

                <FileVersionTable.Pagination />

                {/* bulk modal actions */}
                {moveOpen && <FileMoveDialog open={moveOpen} onOpenChange={setMoveOpen} />}
            </FileVersionTable>

            {previewFile && (
                <FilePreviewDialog
                    open={!!previewFile}
                    onOpenChange={(open) => setPreviewFile(open ? previewFile : null)}
                    fileVersion={previewFile}
                />
            )}

            {shareFile && <FileShareDialog open={!!shareFile} onOpenChange={(open) => setShareFile(open ? shareFile : null)} file={shareFile} />}
        </div>
    );
}
