import { router } from '@inertiajs/react';
import { LucideRotateCcw, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { DriveFile } from '@/types/folder';
import { Button } from '../../ui/button';
import { DataTableActions } from '../../ui/data-table/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { useFileDataTableContext } from '../file-table';

export interface DriveFileTrashedListActions extends DataTableActions<DriveFile> {
    onRestoreFile?: (file: DriveFile) => void;
}

interface FileTrashedListRowActionsProps {
    file: DriveFile;
}

export function FileTrashedListRowActions({ file }: FileTrashedListRowActionsProps) {
    const { actions } = useFileDataTableContext() as {
        actions: DriveFileTrashedListActions;
    };

    const handleRestoreFile = () => {
        console.debug('single onRestoreFile', file);
        // actions?.onRestoreFile?.(file);

        router.post(route('files.restore', file.uuid), undefined, {
            onSuccess: () => {
                toast.success('File restored successfully!');
            },
            onError: (errors) => {
                toast.error('File restore failed!');
                console.error(errors);
            },
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleRestoreFile} className="cursor-pointer flex items-center">
                    <LucideRotateCcw /> Restore
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
