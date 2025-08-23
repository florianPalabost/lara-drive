import { LucideDownload, LucideEye, MoreHorizontal } from 'lucide-react';
import { DriveFileVersion } from '@/types/folder';
import { useFileVersionHistoryDataTableContext } from '../data-table/file-versions-table';
import { Button } from '../ui/button';
import { DataTableActions } from '../ui/data-table/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export interface DriveFileHistoryActions extends DataTableActions<DriveFileVersion> {
    onPreviewFile?: (fileVersion: DriveFileVersion) => void;
}

interface FileVersionRowActionsProps {
    fileVersion: DriveFileVersion;
}

export function FileVersionRowActions({ fileVersion }: FileVersionRowActionsProps) {
    const { actions } = useFileVersionHistoryDataTableContext() as { actions: DriveFileHistoryActions };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onSelect={() => {
                        console.log('dropdown', actions);

                        if (actions?.onPreviewFile) {
                            console.debug('previewing', fileVersion);
                            return actions.onPreviewFile(fileVersion);
                        } else {
                            console.warn('No preview action registered');
                        }
                    }}
                    className="cursor-pointer flex items-center"
                >
                    <LucideEye color="blue" /> Preview
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => onRestore?.(fileVersion)} disabled={fileVersion.is_current}>
                    Restore
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                    <a href={`/files/${fileVersion.file.uuid}/versions/${fileVersion.uuid}/download`} className="cursor-pointer flex items-center">
                        <LucideDownload color="green" className="mr-2" />
                        Download
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
