import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DriveFile, DriveFileVersion } from '@/types/folder';
import { useState } from 'react';
import { FilePreviewDialog } from '@/components/drive-file/file-preview-dialog';

interface FilesHistoryProps {
    file: DriveFile;
    versions: DriveFileVersion[];
}

export default function FilesHistory({ file, versions }: FilesHistoryProps) {
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

    const handlePreviewFile = (fileVersion: DriveFileVersion) => () => {
        setPreviewFile(fileVersion);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Versions - ${file.original_name}`} />
            <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold">Version History: {file.original_name}</h1>
                <table className="w-full text-left border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Version</th>
                            <th className="p-2">Size</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Uploaded At</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {versions.map((fileVersion) => (
                            <tr key={fileVersion.id} className="border-t">
                                <td className="p-2">
                                    {fileVersion.version} {fileVersion.is_current && <span className="text-sm text-green-600 ml-2">(current)</span>}
                                </td>
                                <td className="p-2">{(fileVersion.size / 1024).toFixed(2)} KB</td>
                                <td className="p-2">{fileVersion.mime_type}</td>
                                <td className="p-2">{new Date(fileVersion.created_at).toLocaleString()}</td>
                                <td className="p-2">
                                    <button onClick={handlePreviewFile(fileVersion)} className="ml-2 text-blue-600 hover:underline">
                                        Preview
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
