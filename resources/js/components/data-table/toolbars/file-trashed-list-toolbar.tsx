import { router } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';
import { LucideRotateCcw, LucideTrash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DriveFile, DriveFileVersion } from '@/types/folder';
import { Button } from '../../ui/button';
import { useFileDataTableContext } from '../file-table';

interface FileListToolbarProps {
    // TODO: useless
    onRestore?: (files: DriveFile[]) => void;
}

export function FileTrashedListToolbar({ onRestore }: FileListToolbarProps) {
    const { selectedRows } = useFileDataTableContext();

    const handleRestoreClick = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one file to restore');
            return;
        }

        const data = {
            file_ids: selectedRows.map((row: Row<DriveFile>) => row.original.uuid),
        };

        console.debug(
            'handle restore click rows',
            selectedRows.map((row: Row<DriveFile>) => row.original),
        );
        console.debug('handle restore click data', data);

        if (confirm('Are you sure you want to restore this/these file(s) ?')) {
            router.post(route('files.restore.bulk'), data, {
                onSuccess: () => {
                    toast.success('File(s) restored successfully!');
                },
                onError: (errors) => {
                    toast.error('File restore failed!');
                    console.error(errors);
                },
            });
        }
    };

    const handleDeleteClick = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one file to delete');
            return;
        }

        const data = {
            file_ids: selectedRows.map((row: Row<DriveFile>) => row.original.uuid),
        };
        console.debug('handle delete click data', data);

        if (confirm('Are you sure you want to permanently delete this/these file(s) ?')) {
            router.post(route('files.destroy.bulk'), data, {
                onSuccess: () => {
                    toast.success('File(s) deleted successfully!');
                },
                onError: (errors) => {
                    toast.error('File delete failed!');
                    console.error(errors);
                },
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRestoreClick} disabled={selectedRows.length === 0}>
                <LucideRotateCcw className="mr-2 h-4 w-4" />
                Restore
            </Button>
            <Button variant="destructive" color="danger" size="sm" onClick={handleDeleteClick} disabled={selectedRows.length === 0}>
                <LucideTrash2 className="mr-2 h-4 w-4" />
                Delete
            </Button>
        </div>
    );
}
