import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { fileTrashedListColumns } from '@/components/data-table/columns/file-trashed-list-columns';
import FileTable from '@/components/data-table/file-table';
import { DriveFileTrashedListActions } from '@/components/data-table/row-actions/file-trashed-list-row-actions';
import { FileTrashedListToolbar } from '@/components/data-table/toolbars/file-trashed-list-toolbar';
import AppLayout from '@/layouts/app-layout';
import { DriveFile } from '@/types/folder';

interface FilesTrashedProps {
    trashedFiles: DriveFile[];
}

export default function FilesTrashed({ trashedFiles }: FilesTrashedProps) {
    console.debug('trash page', trashedFiles);
    const columns: ColumnDef<DriveFile>[] = useMemo(() => fileTrashedListColumns(), []);
    const actions: DriveFileTrashedListActions = {};

    return (
        <AppLayout>
            <Head title="Trashed Files" />
            <div className="space-y-4 p-4">
                <h2 className="text-lg font-semibold">Trashed files</h2>
                {trashedFiles.length === 0 ? (
                    <p className="text-gray-500 italic">You haven’t trashed any files yet.</p>
                ) : (
                    <FileTable columns={columns} data={trashedFiles} actions={actions}>
                        <FileTable.Toolbar>
                            <FileTrashedListToolbar />
                        </FileTable.Toolbar>

                        <FileTable.View />

                        <FileTable.Pagination />
                    </FileTable>
                )}
            </div>
        </AppLayout>
    );
}
