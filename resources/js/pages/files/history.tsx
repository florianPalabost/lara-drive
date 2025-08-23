import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { fileVersionsColumns } from '@/components/data-table/file-versions-columns';
import FileVersionTable from '@/components/data-table/file-versions-table';
import { FilePreviewDialog } from '@/components/drive-file/file-preview-dialog';
import { DriveFileHistoryActions } from '@/components/row-actions/file-version-row-actions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DriveFile, DriveFileVersion } from '@/types/folder';

interface FilesHistoryProps {
    file: DriveFile;
    versions: DriveFileVersion[];
}

export default function FilesHistory({ file, versions }: FilesHistoryProps) {
    console.debug('FilesHistory', file, versions);
    const [previewFile, setPreviewFile] = useState<DriveFileVersion | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Files',
            href: '/files',
        },
        {
            title: file.original_name,
            href: `/files/${file.uuid}`,
        },
        {
            title: 'History',
            href: `/files/${file.uuid}/history`,
        },
    ];

    const handlePreviewFile = (fileVersion: DriveFileVersion) => {
        console.debug('(handlePreviewFile', fileVersion);
        setPreviewFile(fileVersion);
    };

    const columns: ColumnDef<DriveFileVersion>[] = useMemo(() => fileVersionsColumns(), []);
    const actions: DriveFileHistoryActions = {
        onPreviewFile: handlePreviewFile,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Versions - ${file.original_name}`} />
            <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold">Version History: {file.original_name}</h1>
            </div>
            <div className="w[calc(100%+16px)] overflow-x-auto p-4">
                <FileVersionTable columns={columns} data={versions} actions={actions}>
                    <FileVersionTable.Toolbar>
                        <div className="flex items-center gap-2">TODO Toolbar</div>
                    </FileVersionTable.Toolbar>

                    <FileVersionTable.View />

                    <FileVersionTable.Pagination />
                </FileVersionTable>
            </div>
            {previewFile && (
                <FilePreviewDialog
                    open={!!previewFile}
                    onOpenChange={(open) => setPreviewFile(open ? previewFile : null)}
                    fileVersion={previewFile}
                />
            )}
        </AppLayout>
    );
}
