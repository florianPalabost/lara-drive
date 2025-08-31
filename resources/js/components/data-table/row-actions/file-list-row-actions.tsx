import { LucideDownload, LucideEye, LucideHistory, LucideShare2, LucideTrash, MoreHorizontal, MoreVertical } from 'lucide-react';
import { DriveFile, DriveFileVersion } from '@/types/folder';
import { Button } from '../../ui/button';
import { DataTableActions } from '../../ui/data-table/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { useFileVersionHistoryDataTableContext } from '../file-versions-table';

export interface DriveFileListActions extends DataTableActions<DriveFileVersion> {
    onDeleteFile?: (file: DriveFile) => void;
    onMoveFiles?: (files: DriveFile[]) => void;
    onPreviewFile?: (fileVersion: DriveFileVersion) => void;
    onShareFile?: (file: DriveFile) => void;
    onViewHistory?: (file: DriveFile) => void;
}

interface FileListRowActionsProps {
    fileVersion: DriveFileVersion;
}

export function FileListRowActions({ fileVersion }: FileListRowActionsProps) {
    const { actions } = useFileVersionHistoryDataTableContext() as {
        actions: DriveFileListActions;
    };

    const isPreviewable = (mime: string) => mime.startsWith('image/') || mime === 'application/pdf';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions?.onPreviewFile && isPreviewable(fileVersion.mime_type) && (
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
                )}
                {actions?.onViewHistory && (
                    <DropdownMenuItem
                        onSelect={() => {
                            console.log('dropdown history', actions);
                            actions?.onViewHistory?.(fileVersion.file);
                        }}
                        className="cursor-pointer"
                    >
                        <LucideHistory /> History
                    </DropdownMenuItem>
                )}

                {/* <DropdownMenuItem onClick={() => onRestore?.(fileVersion)} disabled={fileVersion.is_current}>
                    Restore
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                    <a href={`/files/${fileVersion.file.uuid}/versions/${fileVersion.uuid}/download`} className="cursor-pointer flex items-center">
                        <LucideDownload color="green" className="mr-2" />
                        Download
                    </a>
                </DropdownMenuItem>

                {actions?.onShareFile && (
                    <DropdownMenuItem onClick={() => actions?.onShareFile?.(fileVersion.file)} className="cursor-pointer">
                        <LucideShare2 /> Share
                    </DropdownMenuItem>
                )}

                {actions?.onDeleteFile && (
                    <DropdownMenuItem onClick={() => actions?.onDeleteFile?.(fileVersion.file)} className="cursor-pointer">
                        <LucideTrash color="red" /> Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
