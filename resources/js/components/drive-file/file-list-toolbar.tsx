import { Row } from '@tanstack/react-table';
import { LucideFolderInput } from 'lucide-react';
import { toast } from 'sonner';
import { DriveFile, DriveFileVersion } from '@/types/folder';
import { useFileVersionHistoryDataTableContext } from '../data-table/file-versions-table';
import { Button } from '../ui/button';

interface FileListToolbarProps {
    onMove: (files: DriveFile[]) => void;
}

export function FileListToolbar({ onMove }: FileListToolbarProps) {
    const { selectedRows } = useFileVersionHistoryDataTableContext();

    const handleMoveClick = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one file to move');
            return;
        }

        onMove(selectedRows.map((row: Row<DriveFileVersion>) => row.original.file));
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleMoveClick} disabled={selectedRows.length === 0}>
                <LucideFolderInput className="mr-2 h-4 w-4" />
                Move
            </Button>
        </div>
    );
}
