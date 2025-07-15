import { FileList } from '@/components/drive-file/file-list';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DriveFile } from '@/types/folder';
import { Head } from '@inertiajs/react';

interface FilesHistoryProps {
    file: DriveFile;
    versions: DriveFile[];
}

export default function FilesHistory({ file, versions }: FilesHistoryProps) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Versions - ${file.original_name}`} />
            <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold">Version History: {file.original_name}</h1>

                <FileList files={versions} />
            </div>
        </AppLayout>
    );
}
