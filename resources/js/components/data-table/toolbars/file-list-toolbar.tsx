import { router } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';
import { LucideFolderInput, LucideTrash } from 'lucide-react';
import { toast } from 'sonner';
import { DriveFile, DriveFileVersion } from '@/types/folder';
import { Button } from '../../ui/button';
import { useFileVersionHistoryDataTableContext } from '../file-versions-table';
import { useFolderContext } from '@/contexts/folder-context';

interface FileListToolbarProps {
    onMove: (files: DriveFile[]) => void;
}

export function FileListToolbar({ onMove }: FileListToolbarProps) {
    const { selectedRows } = useFileVersionHistoryDataTableContext();
    const { selectedFolder } = useFolderContext();

    const handleMoveClick = () => {
        // should not be possible since the button is disabled if no rows are selected
        if (selectedRows.length === 0) {
            toast.error('Please select at least one file to move');
            return;
        }

        // only open the move dialog
        onMove(selectedRows.map((row: Row<DriveFileVersion>) => row.original.file));
    };

    const handleDeleteFiles = () => {
        // should not be possible since the button is disabled if no rows are selected
        if (selectedRows.length === 0) {
            toast.error('Please select at least one file to archive');
            return;
        }

        const data = {
            current_folder_id: selectedFolder?.uuid,
            file_ids: selectedRows.map((row: Row<DriveFileVersion>) => row.original.file.uuid),
        };

        console.debug('handle delete', data);

        if (confirm('Are you sure you want to archive this/these file(s) ?')) {
            router.post(route('files.archive.bulk'), data, {
                onSuccess: () => {
                    toast.success('File(s) archived successfully!');
                },
                onError: (errors) => {
                    toast.error('File archive failed!');
                    console.error(errors);
                },
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleMoveClick} disabled={selectedRows.length === 0}>
                <LucideFolderInput className="mr-2 h-4 w-4" />
                Move
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteFiles} disabled={selectedRows.length === 0}>
                <LucideTrash className="mr-2 h-4 w-4" />
                Archive
            </Button>
        </div>
    );
}
