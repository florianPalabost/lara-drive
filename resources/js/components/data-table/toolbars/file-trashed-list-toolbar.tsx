import { router } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';
import { LucideRotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { DriveFile, DriveFileVersion } from '@/types/folder';
import { Button } from '../../ui/button';
import { useFileDataTableContext } from '../file-table';

interface FileListToolbarProps {
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

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRestoreClick} disabled={selectedRows.length === 0}>
                <LucideRotateCcw className="mr-2 h-4 w-4" />
                Restore
            </Button>
        </div>
    );
}
