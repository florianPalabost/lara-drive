import { Head } from '@inertiajs/react';
import { FileList } from '@/components/drive-file/file-list';
import AppLayout from '@/layouts/app-layout';
import { DriveFile } from '@/types/folder';

interface FilesSearchProps {
    files: DriveFile[];
    query: string;
}

export default function FilesSearch({ files, query }: FilesSearchProps) {
    return (
        <AppLayout>
            <Head title="Search results" />
            <div className="space-y-4 p-4">
                <h2 className="text-lg font-semibold">
                    Search results for: <span className="text-blue-600">{query}</span>
                </h2>

                <div className="border rounded p-2 bg-white shadow-sm">
                    {files.length === 0 ? <p className="text-gray-500">No matching files found.</p> : <FileList files={files} />}
                </div>
            </div>
        </AppLayout>
    );
}
